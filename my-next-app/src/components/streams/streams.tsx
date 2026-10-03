"use client";

import { useContext } from "react";
import { UsersStateContext } from "@/contexts/users-settings";
import MyStream from "./my-stream";
import OtherStreams from "./other-streams";
import { Nullable } from "@/common/types";

export default function Streams({
  fullscreen,
  sharedScreen,
  stream,
  muted,
  visible,
}: StreamsProps) {
  const { sharedScreenTrack } = useContext(UsersStateContext);
  const shared = sharedScreen ?? sharedScreenTrack;

  return (
    <div
      className={`${
        fullscreen && shared ? "hidden" : ""
      } flex flex-wrap gap-4 justify-center items-start p-2 md:p-4 min-h-0 ${shared ? "basis-1/6" : "flex-1"} overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}
    >
      <MyStream stream={stream} muted={muted} visible={visible} />
      <OtherStreams />
    </div>
  );
}

type StreamsProps = {
  fullscreen: boolean;
  sharedScreen: Nullable<MediaStreamTrack>;
  stream: MediaStream;
  muted: boolean;
  visible: boolean;
};
