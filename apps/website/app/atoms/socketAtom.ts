// app/atoms/socketAtom.ts
import { atom } from "jotai";
import { io } from "socket.io-client";
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
const socket = io(socketUrl); // 替换为你的服务器地址

export const socketAtom = atom(socket);
