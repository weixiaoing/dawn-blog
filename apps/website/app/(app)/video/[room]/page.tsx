"use client"

import VideoBase from "@/_components/video"

import { RoomContext } from "@/_components/providers/VideoProvider"
import { useEffect, useState } from "react"
import { getMeeting } from "@/utils"

const VideoRoom = function ({ params }: { params: { room: string } }) {
  const [meeting, setMeeting] = useState<{
    startTime: string
    title: string
    hostId: string
    duration: number
    status: "approved"
  }>()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const fetchMeeting = async () => {
      const result = await getMeeting(params.room)
      setMeeting(result)
    }
    fetchMeeting()
  }, [params.room])
  if (!meeting) return <div>会议链接错误</div>
  if (now > new Date(meeting!.startTime).getTime() + meeting.duration)
    return (
      <div className="text-center">
        <h1>会议已结束</h1>
      </div>
    )
  if (now < new Date(meeting!.startTime).getTime())
    return <div className="text-center">会议还未开始</div>
  if (meeting.status == "approved")
    return (
      <RoomContext.Provider value={params.room}>
        <VideoBase />
      </RoomContext.Provider>
    )
  return (
    <div className="text-center">
      <h1>会议未通过审核</h1>
    </div>
  )
}
export default VideoRoom
