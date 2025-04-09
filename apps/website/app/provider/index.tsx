"use client";
import SocketProvider from "./SocketProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
    return <><SocketProvider>{children}</SocketProvider></>
}