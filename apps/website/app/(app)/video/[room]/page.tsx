"use client"
import { FcGoogle } from "react-icons/fc"

import Button from "@/_components/UI/button"
import Card from "@/_components/UI/card"
import VideoBase from "@/_components/video"
import { signIn, useSession } from "next-auth/react"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { RoomContext } from "@/_components/providers/VideoProvider"

const VideoRoom = function ({ params }: { params: { room: string } }) {


  return (
    <RoomContext.Provider value={params.room}>
      <div className="w-full">
        <main className=" w-full ">
          <VideoBase />
        </main>
      </div>
    </RoomContext.Provider>
  )
}
export default VideoRoom
