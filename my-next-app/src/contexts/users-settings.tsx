"use client";
import { createContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { KeyValue, Nullable, PeerId } from "@/common/types";
import { append, isHost } from "@/common/utils";

import { useSocket } from "./SocketProvider";

export const UsersUpdaterContext = createContext<any>({});
export const UsersStateContext = createContext<any>({});

export default function UsersSettingsProvider({ children }: any) {
  // const searchParams = useSearchParams();
  const socket = useSocket();

  const [streams, setStreams] = useState<Record<PeerId, JSX.Element>>({});

  const [isMuted, setIsMuted] = useState<KeyValue<boolean>>({});
  const [isHidden, setIsHidden] = useState<KeyValue<boolean>>({});
  const [avatars, setAvatars] = useState<KeyValue<string>>({});
  const [names, setNames] = useState<KeyValue<string>>({});

  const [sharedScreenTrack, setSharedScreenTrack] =
    useState<Nullable<MediaStreamTrack>>(null);

  const params = useParams();
  const roomId = params.qoraId as string; // dynamic param
  // const roomId = searchParams.get("qoraId") as RoomId; // Get query parameter `qoraId`

  useEffect(() => {
    socket.on("user:toggled-video", (peerId: PeerId) =>
      setIsHidden(append({ [peerId]: !isHidden[peerId] }))
    );
  }, [isHidden]);

  useEffect(() => {
    socket.on("user:toggled-audio", (peerId: PeerId) =>
      setIsMuted(append({ [peerId]: !isMuted[peerId] }))
    );
  }, [isMuted]);

  return (
    <UsersStateContext.Provider
      value={{
        streams,
        isMuted,
        isHidden,
        isHost: isHost(roomId),
        avatars,
        names,
        sharedScreenTrack,
      }}
    >
      <UsersUpdaterContext.Provider
        value={{
          setIsMuted,
          setIsHidden,
          setAvatars,
          setStreams,
          setNames,
          setSharedScreenTrack,
          muteUser: (id: PeerId) => socket.emit("host:mute-user", id),
        }}
      >
        {children}
      </UsersUpdaterContext.Provider>
    </UsersStateContext.Provider>
  );
}
