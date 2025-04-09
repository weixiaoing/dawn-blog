"use client";

export const socketAtom = atom<Socket | null>(null);
const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";
import { atom, Provider } from "jotai";
import { FC, PropsWithChildren } from "react";
import { Socket } from "socket.io-client";
export const JotaiProvider: FC<PropsWithChildren> = ({ children }) => {
  // const [socket, setSocket] = useAtom(socketAtom);
  // useEffect(() => {
  //   const newSocket = io(url, {
  //     reconnection: true,
  //     reconnectionAttempts: 5,
  //   });
  //   newSocket.on("updateUserCount", (count) => {
  //     console.log(count);
  //   });
  //   setSocket(newSocket);
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [setSocket]);

  return <Provider>{children}</Provider>;
};
