"use client"
import { useAtom } from "jotai"
import { atomWithImmer } from "jotai-immer"
import { enableMapSet } from "immer"
import clsx from "clsx"
import {
  createContext,
  HtmlHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react"
import useMedia from "../../_hooks/useMedia"
import { Input, Select, Space } from "antd"
import Button from "../UI/button"
import useSocket from "../../_hooks/useSocket"
import { useRouter, useSearchParams } from "next/navigation"
import { useRoom } from "../providers/VideoProvider"

import useMediaStream from "use-media-stream"
import VideoPlayer from "./VideoPlayer"
import { Socket } from "socket.io-client"
import { useSession } from "@/utils/auth-client"
import { AiOutlineSend } from "react-icons/ai"
import Avatar from "../UI/avatar"
import dayjs from "dayjs"

// 房间人数超过5人 延迟显著变高
const MAX_USER = 5
enableMapSet()
const usersAtom = atomWithImmer<
  Map<
    string,
    {
      sender: string
      stream: MediaStream | null
      id: string
      name: string
      avatar: string
      video: boolean
      audio: boolean
    }
  >
>(new Map())

const VideoDemo = () => {
  const session = useSession()
  const room = useRoom()
  const socket = useSocket()
  const [content, setContent] = useState("")
  const [CommentList, setCommentList] = useState<
    {
      sender: string
      content: string
      name: string
      avatar: string
      time: string
    }[]
  >([])
  const [CommentShow, setCommentShow] = useState(false)
  // users管理用户信息以及流
  const [users, setUsers] = useAtom(usersAtom)
  //管理连接
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
  const {
    stream: localStream,
    selectedAudioTrackDeviceId,
    isStreaming,
    getMediaDevices,
    updateMediaDeviceConstraints,
    selectedVideoTrackDeviceId,
    start: startStream,
    stop: stopStream,
    stop,
    isSupported,
    audioInputDevices: audioDevices,
    error,
    videoInputDevices: videoDevices,
    isAudioMuted,
    isVideoMuted,
    muteAudio,
    muteVideo,
    unmuteAudio,
    unmuteVideo,
  } = useMediaStream({
    // 此处如果某个流设为false,会无法获取到相应设备即使开启视频也没用,因此最好是全开,然后根据参数,关闭相应的视频流
    mediaDeviceConstraints: {
      audio: true,
      video: true,
    },
  })

  useEffect(() => {
    if (!isSupported) {
      console.error("浏览器不支持媒体流"), error
    }
    startStream()
    return () => stopStream()
  }, [isSupported])
  // 控制设备列表获取
  useEffect(() => {
    const handleDevicesChange = () => {
      getMediaDevices()
    }
    handleDevicesChange()
    window.addEventListener("devicechange", handleDevicesChange)
    return () => {
      window.removeEventListener("devicechange", handleDevicesChange)
    }
  }, [])

  const createUsers = (
    sender: string,
    name?: string,
    avatar?: string,
    id?: string
  ) => {
    const newUser = {
      sender: sender || "",
      stream: null,
      id: id || "",
      name: name || "",
      avatar: avatar || "",
      video: true,
      audio: true,
    }
    setUsers((prev) => {
      const newMap = new Map(prev)
      newMap.set(sender, newUser)
      return newMap
    })
    return newUser
  }
  const createPeerConnection = useCallback(
    (socket: Socket, sender: string) => {
      if (!socket) {
        console.warn("socket not ready")
        return
      }
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: ["stun:stun1.l.google.com:19302"],
          },
        ],
      })
      peerConnections.current.set(sender, pc)
      localStream?.getTracks().forEach((track) => {
        console.log("add track localStream")
        pc.addTrack(track, localStream)
      })

      pc.ontrack = ({ streams: [stream] }) => {
        console.log("on track")

        setUsers((prev) => {
          const newMap = new Map(prev)
          newMap.set(sender, {
            ...prev.get(sender)!,
            stream,
          })
          return newMap
        })
      }
      pc.onicecandidate = (event) => {
        console.log("joined icecandidate")
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            target: sender,
          })
        }
      }
      return pc
    },
    [localStream]
  )
  const handleJoin = async ({
    sender,
    name,
    avatar,
    id,
  }: {
    sender: string
    name: string
    avatar: string
    id: string
  }) => {
    console.log("handleJoin")
    createUsers(sender, name, avatar, id)
    const pc = createPeerConnection(socket, sender)
    if (!pc) return
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket.emit("offer", {
      sdp: offer,
      target: sender,
      name: session.data?.user?.name,
      avatar: session.data?.user?.image,
      id: session.data?.user?.id,
    })
  }

  const handleOffer = async (data: {
    sdp: RTCSessionDescription
    sender: string
    name: string
    avatar: string
    id: string
  }) => {
    createUsers(data.sender, data.name, data.avatar, data.id)
    const pc = createPeerConnection(socket, data.sender)
    if (!pc) return
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    socket.emit("answer", { sdp: answer, target: data.sender })
  }
  const handleAnswer = (data: {
    sdp: RTCSessionDescription
    sender: string
  }) => {
    const pc = peerConnections.current.get(data.sender)
    if (pc) {
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
    }
  }

  const handleIceCandidate = (data: {
    candidate: RTCIceCandidate
    sender: string
  }) => {
    const pc = peerConnections.current.get(data.sender)
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }
  const handleChange = (data: {
    type: "video" | "audio"
    state: boolean
    sender: string
  }) => {
    setUsers((prev) => {
      const newMap = new Map(prev)
      newMap.set(data.sender, {
        ...prev.get(data.sender)!,
        [data.type]: data.state,
      })
      return newMap
    })
  }
  const handleLeft = (data: { sender: string }) => {
    console.log(data.sender, "left the room")
    const pc = peerConnections.current.get(data.sender)
    if (pc) {
      pc.close()
    }

    setUsers((prev) => {
      const newMap = new Map(prev)
      newMap.delete(data.sender)
      return newMap
    })
  }

  const handleMessage = (data: {
    content: string
    name: string
    avatar: string
    time: string
    sender: string
  }) => {
    setCommentList((prev) => [...prev, data])
  }

  // 房间媒体流交换
  useEffect(() => {
    if (!socket || !localStream) return
    socket.open()
    socket.on("offer", handleOffer)
    socket.on("answer", handleAnswer)
    socket.on("ice-candidate", handleIceCandidate)
    socket.on("join", handleJoin)
    socket.on("left", handleLeft)
    socket.on("change", handleChange)
    socket.on("message", handleMessage)
    socket.emit("join", {
      target: room,
      name: session.data?.user?.name,
      avatar: session.data?.user?.image,
      id: session.data?.user?.id,
    })

    return () => {
      socket.off("offer", handleOffer)
      socket.off("answer", handleAnswer)
      socket.off("ice-candidate", handleIceCandidate)
      socket.off("join", handleJoin)
      socket.off("left", handleLeft)
      socket.off("change", handleChange)
      socket.off("message", handleMessage)
      peerConnections.current.forEach((pc) => pc.close())
      socket.close()
    }
  }, [socket, localStream])

  return (
    <>
      <div className="flex gap-2">
        <div className="flex gap-2 h-[600px] w-full mx-auto">
          {/* 主屏幕视频流 */}
          <main className="flex-1 bg-black  overflow-hidden  flex items-center justify-center object-fill">
            <VideoPlayer
              type="main"
              video={!isVideoMuted}
              audio={!isAudioMuted}
              autoPlay
              muted
              name={session.data?.user?.name}
              avatar={session.data?.user?.image}
              playsInline
              stream={localStream}
            ></VideoPlayer>
          </main>
          {/* 侧边栏视频流 */}
          <section
            onClick={() => {
              console.log(users)
            }}
            className="w-[20vw] max-w-[200px] max-h-full bg-gray-400/5 space-y-4  overflow-scroll"
          >
            <VideoPlayer
              key="local"
              type="local"
              video={!isVideoMuted}
              audio={!isAudioMuted}
              muted
              name={session.data?.user?.name}
              avatar={session.data?.user?.image}
              stream={localStream}
            />
            {Array.from(users).map(([sender, v]) => {
              return (
                <VideoPlayer
                  key={sender}
                  video={v.video}
                  audio={v.audio}
                  type="other"
                  stream={v.stream}
                  name={v.name}
                  avatar={v.avatar}
                />
              )
            })}
          </section>
        </div>
        {/* 评论区 */}
        {CommentShow && (
          <div
            className={clsx(
              "flex flex-none flex-col gap-2 border p-2  w-[400px]  pt-1 overflow-hidden"
            )}
          >
            <h2>评论区</h2>
            <ul className="flex-1">
              {CommentList?.map((item) => (
                <div key={item.time} className="flex space-y-4 gap-2">
                  <div className="self-end">
                    <Avatar
                      src={item.avatar}
                      alt={item.name}
                      className="size-2"
                    />
                  </div>
                  <div className="flex-1 ">
                    <header className=" flex gap-4 items-center ">
                      <span className=" font-semibold">{item.name}</span>
                    </header>
                    <main className=" bg-zinc-200/50 relative  dark:bg-zinc-600/80 inline-block  rounded-lg rounded-tl-sm p-2 px-3 py-[1px] text-zinc-800 dark:text-zinc-200">
                      <div>{item.content}</div>
                    </main>
                  </div>
                </div>
              ))}
            </ul>
            <div className="w-full flex gap-2">
              <Input
                value={content}
                onChange={(v) => {
                  setContent(v.target.value)
                }}
                className="border"
                type="text"
              />
              <Button
                onClick={() => {
                  socket?.emit("message", {
                    sender: session.data?.user?.id,
                    target: room,
                    content,
                    name: session.data?.user?.name,
                    avatar: session.data?.user?.image,
                    time: new Date().toLocaleString(),
                  })
                  setContent("")
                }}
              >
                <AiOutlineSend />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* 工具栏 */}

      <div>
        <Button
          border
          onClick={() => {
            socket?.emit("change", {
              target: room,
              type: "video",
              state: isVideoMuted,
            })
            isVideoMuted ? unmuteVideo() : muteVideo()
          }}
        >
          {isVideoMuted ? "开启视频" : "关闭视频"}
        </Button>
        <Button
          border
          onClick={() => {
            isAudioMuted ? unmuteAudio() : muteAudio()
            socket?.emit("change", {
              target: room,
              type: "audio",
              state: isAudioMuted,
            })
          }}
        >
          {isAudioMuted ? "开启麦克风" : "关闭麦克风"}
        </Button>
        {/* 切换麦克风 */}
        <Select
          value={selectedAudioTrackDeviceId}
          options={audioDevices.map((v) => ({
            label: v.label,
            value: v.deviceId,
          }))}
          onChange={(v) => {
            // 切换设备时,如果不重启,当前选择设备不会变化
            updateMediaDeviceConstraints({
              constraints: {
                audio: {
                  deviceId: v,
                },
              },
              resetStream: true,
            })
          }}
        ></Select>
        <Select
          value={selectedVideoTrackDeviceId}
          options={videoDevices.map((v) => ({
            label: v.label,
            value: v.deviceId,
          }))}
          onChange={(v) => {
            updateMediaDeviceConstraints({
              constraints: {
                video: {
                  deviceId: v,
                },
              },
              resetStream: true,
            })
          }}
        ></Select>
        <Button
          border
          onClick={() => {
            setCommentShow((v) => !v)
          }}
        >
          评论
        </Button>
      </div>
    </>
  )
}

export default VideoDemo
