"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
let count = 0;
export default function useSocket({
  url = process.env.NEXT_PUBLIC_SOCKET_URL!,
  room = "Home",
}) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);
    console.log(++count);

    newSocket.on("connect", () => {
      console.log(newSocket.id, "连接成功");
    });
    newSocket.emit("joinRoom", { room });
    newSocket.on("disconnect", (reason: string) => {
      console.log("连接已断开");
      if (
        reason !== "io server disconnect" &&
        reason !== "io client disconnect"
      ) {
        console.log("重新连接中...");
      }
    });
    return () => {
      newSocket.disconnect();
    };
  }, [url, room]);
  // useEffect(() => {}, [room, socket]);
  return {
    socket,
  };
}
