"use client";
import { memo } from "react";

const PeerVideo = ({
  stream,
  name,
  isMe,
}: {
  stream: MediaStream;
  name: string;
  isMe?: boolean;
}) => (
  <div className="relative w-full">
    <video
      ref={(node) => {
        if (node) node.srcObject = stream;
      }}
      autoPlay
      muted={isMe}
      playsInline
      className="w-full h-full aspect-video object-cover rounded-2xl"
    />

    <p className="font-semibold absolute bottom-4 left-4 text-sm px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur text-white">
      {isMe && "🎥 "}{name}
    </p>
  </div>
);

export default memo(PeerVideo);
