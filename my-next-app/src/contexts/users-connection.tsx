﻿"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { useUser } from '@auth0/nextjs-auth0';
// import { toast } from "react-toastify";
// import { useUser } from "./UserContext";
import { append } from "@/common/utils";
import { useMediaStream } from "@/hooks/index";

import { useSocket } from "./SocketProvider";
import { PeerVideo } from "@/components/index";
import { UsersStateContext, UsersUpdaterContext } from "./users-settings";
import { PeerId } from "@/common/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export const UsersConnectionContext = createContext<any>({});

export default function UsersConnectionProvider({
  stream,
  peer,
  myId,
  children,
}: any) {
  const router = useRouter();
  // const user = useUser().user!;
  const { data: session } = useSession();
  const user = session?.user;

  const streamRef = useRef(stream);
  streamRef.current = stream;
  const userRef = useRef(user);
  userRef.current = user;

  const socket = useSocket();
  const { streams } = useContext(UsersStateContext);
  const {
    setIsMuted,
    setIsHidden,
    setAvatars,
    setStreams,
    setNames,
    setSharedScreenTrack,
  } = useContext(UsersUpdaterContext);

  const { muted, visible } = useMediaStream(stream);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const [users, setUsers] = useState<any>({});

  // if (!socket) return;
  function leaveRoom(id: PeerId) {
    socket.emit("user:leave", id);
    users[id]?.close();
    setStreams((s: any) => {
      const obj: any = {};
      for (const key in s) {
        if (key !== id) obj[key] = s[key];
      }
      return obj;
    });
  }

  const createCallForPeer = (
    id: PeerId,
    name: string,
    picture?: string,
    initMuted?: boolean,
    initVisible?: boolean,
  ) => {
    if (!peer) return;

    const incomingCall = peer.call(
      id,
      stream, // my stream
      {
        metadata: {
          user: {
            name: user?.name,
            picture: user?.image,
          },
          muted,
          visible,
        },
      },
    );

    incomingCall.on("stream", (peerStream: MediaStream) => {
      setStreams(
        append({
          [id]: <PeerVideo stream={peerStream} isMe={false} name={name} />,
        }),
      );
      const screenTrack = peerStream.getVideoTracks()[1];
      if (screenTrack) setSharedScreenTrack(screenTrack);
    });

    setUsers(append({ [id]: incomingCall }));
    setIsMuted(append({ [id]: initMuted ?? false }));
    setIsHidden(append({ [id]: !(initVisible ?? true) }));
    if (picture) setAvatars(append({ [id]: picture }));
    setNames(append({ [id]: name }));
  };

  // * user a accepts user b and make a call
  useEffect(() => {
    if (!peer) return;

    socket.on(
      "user:joined",
      ({ id, name, picture, muted: initMuted, visible: initVisible }: any) => {
        console.table({
          "call-friend": "call friend",
          "user-id": id,
          "user-name": name,
          visible: initVisible,
          muted: initMuted,
        });

        createCallForPeer(id, name, picture, initMuted, initVisible);
      },
    );

    socket.on("room:participants", (participants: any[]) => {
      participants.forEach((participant) => {
        const { id, name, picture, muted: initMuted, visible: initVisible } = participant;
        if (id !== myId) {
          createCallForPeer(id, name, picture, initMuted, initVisible);
        }
      });
    });

    return () => {
      socket.off("user:joined");
      socket.off("room:participants");
    };
  }, [peer, myId, socket, stream, user, muted, visible]);

  // * user b answers to user a's call
  useEffect(() => {
    if (!peer) return;

    const onCall = (call: any) => {
      const remotePeerId = call.peer as string;
      const metadata = call.metadata ?? {};
      const remoteUser = metadata.user ?? {};
      const m = metadata.muted;
      const v = metadata.visible;

      setUsers(append({ [remotePeerId]: call }));
      setIsMuted(append({ [remotePeerId]: m }));
      setIsHidden(append({ [remotePeerId]: !v }));
      setAvatars(append({ [remotePeerId]: remoteUser.image }));
      setNames(append({ [remotePeerId]: remoteUser.name ?? "Guest" }));

      call.answer(streamRef.current);

      console.table({
        "answer-friend": "answer friend",
        "user-id": remotePeerId,
        "user-name": remoteUser.name,
      });

      call.on("stream", (remoteStream: MediaStream) => {
        setStreams(
          append({
            [remotePeerId]: <PeerVideo stream={remoteStream} isMe={false} name={remoteUser.name ?? "Guest"} />,
          }),
        );
        const screenTrack = remoteStream.getVideoTracks()[1];
        if (screenTrack) setSharedScreenTrack(screenTrack);
      });
    };

    peer.on("call", onCall);
    return () => {
      peer.off("call", onCall);
    };
  }, [peer]);

  useEffect(() => {
    const onLeft = (peerId: PeerId) => {
      if (myId === peerId) router.push("/");
      else {
        setStreams((prev: any) => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
        setUsers((prev: Record<string, any>) => {
          prev[peerId]?.close();
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
      }
    };
    socket.on("user:left", onLeft);

    return () => {
      socket.off("user:left", onLeft);
    };
  }, [myId, router, setStreams]);

  useEffect(() => {
    socket.on("user:shared-screen", (username: string) => {
      if (peer) {
        peer.disconnect();
        peer.reconnect();
        // toast(`${username} is sharing his screen`);
      }
    });

    return () => {
      socket.off("user:shared-screen");
    };
  }, [peer]);

  useEffect(() => {
    socket.on("user:stopped-screen-share", () => {
      setSharedScreenTrack(null);
      // toast("Stopped sharing screen");
    });

    return () => {
      socket.off("user:stopped-screen-share");
    };
  }, []);

  return (
    <UsersConnectionContext.Provider value={{ peer, myId, users, leaveRoom }}>
      {children}
    </UsersConnectionContext.Provider>
  );
}
