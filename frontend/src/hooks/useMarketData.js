import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useMarketData(pairs) {
  const [data, setData] = useState({});
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_WS_URL || "ws://localhost:8000");
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("tick", (tick) => setData(prev => ({ ...prev, [tick.symbol]: tick })));
    socket.emit("subscribe", { pairs });
    return () => socket.disconnect();
  }, []);
  return { data, connected };
}
