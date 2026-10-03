"use client";
import { useContext } from "react";

import { MutedIcon } from "@/assets/icons";
import { UsersConnectionContext } from "@/contexts/users-connection";
import { UsersStateContext } from "@/contexts/users-settings";

import { ActiveSpeaker, HostControlPanel, VideoPlug } from "..";

const VideoContainer = ({
  id,
  muted,
  visible,
  children,
  stream,
  userPicture,
  onMutePeer,
  onRemovePeer,
}: SingleVideoProps) => {
  const { myId } = useContext(UsersConnectionContext);
  const { isHost } = useContext(UsersStateContext);

  return (
    <div
      key={id}
      className="relative group h-fit w-full max-w-[780px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/50 bg-slate-800"
    >
      {!visible && <VideoPlug userPicture={userPicture} />}
      <div className={`${!visible ? "hidden" : ""}`}>{children}</div>

      {muted ? (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-lg p-2">
          <MutedIcon />
        </div>
      ) : (
        <ActiveSpeaker stream={stream} />
      )}

      {isHost && myId !== id && (
        <HostControlPanel
          onMutePeer={() => onMutePeer && onMutePeer(id)}
          onRemovePeer={() => onRemovePeer && onRemovePeer(id)}
          isMuted={muted}
        />
      )}
    </div>
  );
};

export default VideoContainer;

type SingleVideoProps = {
  id: string;
  muted: boolean;
  visible: boolean;
  children: React.ReactNode;
  stream: MediaStream;
  userPicture: string;
  onMutePeer?: (id: string) => void;
  onRemovePeer?: (id: string) => void;
};
