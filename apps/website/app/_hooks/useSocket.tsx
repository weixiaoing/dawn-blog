"use client";

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

const useSocket = (
  url = process.env.NEXT_PUBLIC_SOCKET_URL!,
  room = "Home"
) => {
  // const [socket, setSocket] = useState<Socket>();
  const socket = useRef<Socket>()

  useEffect(() => {
    const newSocket = io(url)
    socket.current = newSocket
    newSocket.on("connect", () => {
      console.log(newSocket.id, "连接成功")
    })
    // newSocket.emit("joinRoom", { room })
    newSocket.on("disconnect", (reason: string) => {
      console.log("连接已断开")
      if (
        reason !== "io server disconnect" &&
        reason !== "io client disconnect"
      ) {
        console.log("重新连接中...")
      }
    })

    // return () => {
    //   newSocket.disconnect();
    // };
  }, [url, room])
  return socket.current
}

export default useSocket;
