"use client"
import MotionToUp from "../motion/MotionToUp"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function DefaultLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <MotionToUp>
        <DotLottieReact
          src="https://lottie.host/0e59ee99-1ec1-4036-941c-cb55fc7c8a50/5WEDMWDAVl.lottie"
          loop
          autoplay
        />
      </MotionToUp>
    </div>
  )
}
