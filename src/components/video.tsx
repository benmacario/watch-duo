'use client'

import { useEffect, useState, useRef } from 'react';
import { useSocket } from "@/src/app/context/socket-provider";

export default function Video() {
    const videoRef = useRef(null);
    const { socket } = useSocket();

    const [stream, setStream] = useState<any>(null);

    useEffect(() => {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          socket.emit('stream', stream);
        });
  
      return () => {
        socket.disconnect();
      };
    }, [socket]);
    
    return <video src={stream} controls autoPlay />
}