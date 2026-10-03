"use client";
import React from "react";
import { Status, Nullable } from "@/common/types";

type ErrorType = "permission-denied" | "not-found" | "not-secure" | "unknown" | null;

export default function useStream(stream: Nullable<MediaStream> = null) {
  const [state, setState] = React.useState<Nullable<MediaStream>>(stream);
  const [status, setStatus] = React.useState<Status>("loading");
  const [errorType, setErrorType] = React.useState<ErrorType>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const [m, setM] = React.useState(false);
  const [v, setV] = React.useState(true);

  const requestMediaAccess = React.useCallback(async () => {
    try {
      setStatus("loading");
      setErrorType(null);
      
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true, // Turn off to allow low sounds through
          autoGainControl: false, // Turn off to avoid squashing low volume
          sampleRate: 44100, // Optional: ensure full range
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setState(mediaStream);
      setStatus("success");
      setErrorType(null);
    } catch (error: any) {
      setStatus("rejected");
      console.error("Media access error:", error);

      // Categorize error for better UI feedback
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setErrorType("permission-denied");
        console.warn(
          "📹 Browser Permission Denied: Please go to browser settings and allow camera/microphone access for this site"
        );
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setErrorType("not-found");
        console.error("❌ No camera/microphone devices found");
      } else if (error.name === "NotSecureError") {
        setErrorType("not-secure");
        console.error("🔒 HTTPS or secure context required");
      } else {
        setErrorType("unknown");
      }
    }
  }, []);

  React.useEffect(() => {
    if (stream) {
      setStatus("idle");
      const tracks = stream.getTracks();
      const audio = tracks.find((t) => t.kind === "audio");
      const video = tracks.find((t) => t.kind === "video");
      setM(!audio?.enabled);
      setV(!!video?.enabled);
    } else {
      requestMediaAccess();
    }
  }, [stream, retryCount, requestMediaAccess]);

  const retry = React.useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  function toggle(kind: "audio" | "video") {
    return (s = state) => {
      if (!s) throw new Error("Failed. Could not find stream");

      const track = s.getTracks().find((track) => track.kind == kind);

      if (!track)
        throw new Error(`Failed. Could not find ${kind} track in given stream`);

      if (track.enabled) {
        track.enabled = false;
        track.kind == "audio" ? setM(true) : setV(false);
      } else {
        track.enabled = true;
        track.kind == "audio" ? setM(false) : setV(true);
      }
    };
  }

  async function toggleVideo(cb?: unknown) {
    if (!state) throw new Error("There is no a video stream to toggle");

    const videoTrack = state.getVideoTracks()[0];

    if (videoTrack.readyState === "live") {
      videoTrack.enabled = false;
      videoTrack.stop(); // * turns off web cam light indicator
      setV(false);
    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Turn off to allow low sounds through
          autoGainControl: false, // Turn off to avoid squashing low volume
          sampleRate: 44100, // Optional: ensure full range
        },
      });
      const newVideoTrack = newStream.getVideoTracks()[0];

      if (typeof cb === "function") {
        cb(newVideoTrack);
      }

      state.removeTrack(videoTrack);

      const [screenTrack] = state.getVideoTracks();

      if (screenTrack) {
        state.removeTrack(screenTrack);
        state.addTrack(newVideoTrack);
        state.addTrack(screenTrack);
      } else state.addTrack(newVideoTrack);

      setState(state);
      setV(true);
    }
  }

  return {
    stream: state,
    muted: m,
    visible: v,
    toggle,
    toggleAudio: toggle("audio"),
    toggleVideo,
    isLoading: status == "loading",
    isError: status == "rejected",
    isSuccess: status == "success" || status == "idle",
    errorType,
    retry, // Allow UI to retry permission request
  };
}
