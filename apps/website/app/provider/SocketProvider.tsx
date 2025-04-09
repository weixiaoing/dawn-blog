import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);
const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";

  useEffect(() => {
    // 仅在客户端创建 Socket 连接
      const newSocket = io(url, {
        reconnection: true,
        reconnectionAttempts: 5,
      });
      newSocket.emit("init");
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    
  }, [url]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
