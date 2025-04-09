import { createContext, useContext } from "react";

export const RoomContext = createContext<string | null>(null);
export const useRoom = () => {
    const context = useContext(RoomContext)
    if (!context) {
        throw new Error("useRoom must be used within a RoomProvider")
    }
    return context  
}