

import { useCallback, useEffect, useMemo, useRef, useState } from "react"


interface MediaConfig {
  audio?: boolean
  video?: boolean
  constraints?: MediaTrackConstraints
}

type MediaStreamConstraints = {
  audio: boolean | MediaTrackConstraints;
  video: boolean | MediaTrackConstraints;
};
const useMedia = (config: MediaConfig = { audio: true, video: false }) => {
  const [flag, setFlag] = useState(0)
  const mediaStream = useRef<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(config.audio ?? false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(config.video ?? false)


  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);


  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("default")
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("default")

  const getDevices = useCallback(async () => {
    try {
      const res = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = res.filter((device) => device.kind === "audioinput")
      const videoInputs = res.filter((device) => device.kind === "videoinput")
      setAudioDevices(audioInputs)
      setVideoDevices(videoInputs)
  
    } catch (error) {
      console.error("Error enumerating devices:", error);
    }
  },[])
  useEffect(() => {
    setFlag((v)=>v+1)
    getDevices()
    createBaseStream()
    .then((stream) => {
      if (!stream) return
      setSelectedAudioDevice(stream.getAudioTracks()[0].getSettings().deviceId!)
      setSelectedVideoDevice(stream.getVideoTracks()[0].getSettings().deviceId!)
      console.log(flag);
      
      console.log(stream.getAudioTracks()[0]);
      
      console.log(stream.getVideoTracks()[0].getSettings().deviceId);
    
    })
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [])



  const replaceAudioTrack = async () => {
    setIsAudioEnabled(true)
    if (!mediaStream.current) return
    try {
      const audioStream = await
        navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: selectedAudioDevice }
          }
        })

      const newAudioTrack = audioStream.getAudioTracks()[0];
      const currentAudioTrack = mediaStream.current.getAudioTracks();

      currentAudioTrack.forEach((track) => {
        mediaStream.current?.removeTrack(track);
        track.stop()
      });
      mediaStream.current.addTrack(newAudioTrack);



    } catch (error) {
      console.error("Error replacing audio track:", error);

    }
  }

  const replaceVideoTrack = async () => {
    setIsVideoEnabled(true)
    if (!mediaStream) return
    try {


      const videoStream = await
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedVideoDevice }
          }
        })

      const newVideoTrack = videoStream.getVideoTracks()[0];
      const currentVideoTrack = mediaStream.current?.getVideoTracks();

      currentVideoTrack?.forEach((track) => {
        mediaStream.current?.removeTrack(track);
        track.stop()
      });
      mediaStream.current?.addTrack(newVideoTrack);



    } catch (error) {
      console.error("Error replacing video track:", error);

    }
  }

  const createBaseStream = async (config?: MediaStreamConstraints) => {
    try {
      const constraints: MediaStreamConstraints = config || {
        audio: isAudioEnabled ? true : false,
        video: isVideoEnabled ? true : false
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
  
      // setMediaStream(newStream);
      mediaStream.current = newStream
      return newStream;


    } catch (error) {
      console.error('媒体流初始化失败:', error);
      // 状态回滚
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
    }
  };

  const switchAudioDevice = async (deviceId: string) => {
    setSelectedAudioDevice(deviceId);
    if (isAudioEnabled) {
      await replaceAudioTrack();
    }
  };

  const switchVideoDevice = async (deviceId: string) => {
    setSelectedVideoDevice(deviceId);
    if (isVideoEnabled) {
      await replaceVideoTrack();
    }
  };

  const toggleAudio = async () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);

    if (newState) {
      // 首次启用需要创建流
      if (!mediaStream) {
        await createBaseStream();
      } else {
        await replaceAudioTrack();
      }
    } else {
      // 关闭音频
      mediaStream.current!.getAudioTracks().forEach(track => {
        mediaStream.current!.removeTrack(track);
        track.stop();
      });
    }
  };

  const toggleVideo = async () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);

    if (newState) {
      // 首次启用需要创建流
      if (!mediaStream) {
        await createBaseStream();
      } else {
        await replaceVideoTrack();
      }
    } else {
      // 关闭视频
      mediaStream.current!.getVideoTracks().forEach(track => {
        mediaStream.current!.removeTrack(track);
        track.stop();
      });
    }
  };



  return {
    mediaStream: mediaStream.current,
    audioDevices,
    videoDevices,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    selectedAudioDevice,
    selectedVideoDevice,
    switchAudioDevice,
    switchVideoDevice
  }
}

export default useMedia
