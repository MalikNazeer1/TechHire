"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaStream } from "@/hooks/index";
import { useSocket } from "@/contexts/SocketProvider";
import Peer from "peerjs";

import { Nullable, PeerId } from "@/common/types";
import { error } from "@/common/utils";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const usePeer = (stream: MediaStream) => {
  const socket = useSocket();
  const params = useParams();
  const { data: session } = useSession();

  const room = params.qoraId as string;
  const { muted, visible } = useMediaStream(stream);

  // Use refs to capture initial values without causing re-renders
  const userRef = useRef(session?.user);
  const roleRef = useRef(localStorage.getItem("role"));
  const mutedRef = useRef(muted);
  const visibleRef = useRef(visible);
  const socketRef = useRef(socket);
  const roomRef = useRef(room);

  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState<Nullable<Peer>>(null);
  const [myId, setMyId] = useState<PeerId>("");

  const mediaRef = useRef({ muted, visible });
  mediaRef.current = { muted, visible };

  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    let peerInstance: Peer | null = null;
    let cancelled = false;

    (async function createPeerAndJoinRoom() {
      try {
        const PeerModule = await import("peerjs");

        const peerInstance = new PeerModule.default( {
          host: process.env.NEXT_PUBLIC_PEER_HOST || "localhost",
          port: Number(process.env.NEXT_PUBLIC_PEER_PORT) || 3001,
          path: "/peerjs",
          secure: process.env.NEXT_PUBLIC_PEER_SECURE === "true",
        });

        setPeer(peerInstance);
        setIsLoading(false);

        peerInstance.on("open", (id) => {
          console.log("Your device ID: ", id);
          setMyId(id);
          socketRef.current.emit("room:join", {
            room: roomRef.current,
            user: {
              id,
              muted: mutedRef.current,
              visible: visibleRef.current,
              name: userRef.current?.name,
              picture: userRef.current?.image,
              role: roleRef.current,
            },
          });
        });

        peerInstance.on("error", error("Failed to set up peer connection"));
      } catch (e) {
        error("Unable to create peer")(e);
      }
    })();

    // Cleanup peer on unmount
    return () => {
      setPeer((currentPeer) => {
        currentPeer?.destroy();
        return null;
      });
    };
  }, []); // Empty dependency array — runs once on mount only

  return {
    peer,
    myId,
    isPeerReady: !isLoading,
  };
};

export default usePeer;