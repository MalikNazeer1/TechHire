"use client";

import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
import { useMediaStream } from "@/hooks/index";
import { useSocket } from "@/contexts/SocketProvider";
import Peer from "peerjs";

import { Nullable, PeerId, RoomId } from "@/common/types";
import { error } from "@/common/utils";
// import { useUser } from "@/contexts/UserContext";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
/**
 * Creates a peer and joins them into the room
 * @returns peer object, its id, and meta-state whether the peer is fully created
 */
const usePeer = (stream: MediaStream) => {
  const socket = useSocket();
  const params = useParams();
  const { data: session } = useSession();

  const room = params.qoraId as string; // dynamic param
  console.log(room);
  // const user = useUser().user!;
  const user = session?.user;

  const { muted, visible } = useMediaStream(stream);

  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState<Nullable<Peer>>(null);
  const [myId, setMyId] = useState<PeerId>("");

  useEffect(() => {
    (async function createPeerAndJoinRoom() {
      try {
        const PeerModule = await import("peerjs");
        const peerInstance = new PeerModule.default();
        setPeer(peerInstance);
        setIsLoading(false);

        peerInstance.on("open", (id) => {
          console.log("Your device ID: ", id);
          setMyId(id);
          socket.emit("room:join", {
            room,
            user: {
              id,
              muted,
              visible,
              name: user?.name,
              picture: user?.image,
            },
          });
        });

        peerInstance.on("error", error("Failed to set up peer connection"));
      } catch (e) {
        error("Unable to create peer")(e);
      }
    })();
  }, [socket, room, muted, visible, user?.name, user?.image]);

  return {
    peer,
    myId,
    isPeerReady: !isLoading,
  };
};

export default usePeer;
