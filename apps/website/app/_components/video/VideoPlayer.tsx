import { useEffect, useRef, VideoHTMLAttributes } from "react"
import Avatar from "../UI/avatar"
import clsx from "clsx"

const VideoPlayer = ({
  stream,
  type = "local",
  name,
  avatar,
  video,
  audio,
  ...props
}: {
  stream: MediaStream | null
  type: string
  name?: string
  avatar?: string
  video?: boolean
  audio?: boolean
} & VideoHTMLAttributes<HTMLVideoElement>) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!videoRef.current) {
      return
    } else {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef.current])
  if (!stream)
    return (
      <div className="w-[200px]">
        <h2>no stream</h2>
      </div>
    )

  return (
    <div
      className={clsx(
        "relative bg-black w-full   flex justify-center",
        type != "main" && "h-[150px]",
        type == "main" && "h-full"
      )}
    >
      {type !== "main" && (
        <footer className="bg-black text-white bg-opacity-20 opacity-80 absolute bottom-0 left-0">
          {type === "local" && <span>{"我:"}</span>}
          <span>{name}</span>
        </footer>
      )}

      {video == true ? (
        <video
          key={stream?.id}
          autoPlay
          className="w-full h-full"
          playsInline
          ref={videoRef}
          {...props}
        />
      ) : (
        <div className="flex h-full w-full justify-center items-center">
          <Avatar src={avatar!} width={50} height={50} />
        </div>
      )}
    </div>
  )
}
export default VideoPlayer
