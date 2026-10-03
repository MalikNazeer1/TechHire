"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Create the WebSocket context
const SocketContext = createContext<Socket | null>(null);

// WebSocket Provider component
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket server
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL?.trim() || "http://localhost:3001";

    console.log("SocketProvider connecting to:", socketUrl);

    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    //  // Change URL for production
    // const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    //   transports: ["websocket"],
    // });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server", socketInstance.id);
      // setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      // setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

// Custom hook for easy access to the WebSocket context
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
