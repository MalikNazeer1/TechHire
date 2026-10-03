"use client";

import { useState } from "react";
import { Nullable } from "@/common/types";
import { error } from "@/common/utils";

const useScreen = (stream: MediaStream) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "rejected"
  >("idle");
  const [screenTrack, setScreenTrack] =
    useState<Nullable<MediaStreamTrack>>(null);

  async function startShare(onstarted: () => void, onended: () => void) {
    setStatus("loading");

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices) {
        throw new Error("Screen sharing is not supported in this environment.");
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const [track] = screenStream.getTracks();
      setScreenTrack(track);
      stream.addTrack(track);
      setStatus("success");

      onstarted();

      track.onended = () => {
        stopShare(track);
        onended();
      };
    } catch (e) {
      error("Failed to share screen")(e);
      setStatus("rejected");
    }
  }

  function stopShare(track: MediaStreamTrack) {
    track.stop();
    stream.removeTrack(track);
    setScreenTrack(null);
    setStatus("idle");
  }

  return {
    screenTrack,
    startShare,
    stopShare,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "rejected",
  };
};

export default useScreen;
