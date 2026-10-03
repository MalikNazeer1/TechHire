"use client";
// import { useUser } from '@auth0/nextjs-auth0';
import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/solid";
import Tooltip from "react-tooltip";

import { useMediaStream } from "@/hooks/index";
import { MYSELF } from "@/common/constants";
import { CrossLineDiv } from "@/common/components";
import { useSession } from "next-auth/react";
import { PeerVideo, VideoContainer } from "..";

export default function Lobby({
  stream,
  onJoinRoom,
}: {
  stream: MediaStream | null;
  onJoinRoom: () => void;
}) {
  const { data: session } = useSession();
  // const user = useUser().user;
  const user = session?.user;
  const { muted, visible, toggle, toggleVideo, isError, errorType, retry, isLoading } = useMediaStream(stream);

  const errorMessages: Record<string, string> = {
    "permission-denied": "📹 Camera/Microphone Permission Denied. Please check browser settings and allow access to this site.",
    "not-found": "❌ No camera/microphone devices found. Please check your device connections.",
    "not-secure": "🔒 HTTPS or secure context required for camera access.",
    "unknown": "⚠️ Unable to access camera/microphone. Please check permissions or try another browser.",
  };

  if (isError) {
    return (
      <div className="h-screen w-full flex flex-col gap-4 place-content-center place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-4">Media Access Required</h2>
          <p className="text-red-400 mb-6 text-sm">
            {errorType && errorMessages[errorType]}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={retry}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Requesting Access..." : "Try Again"}
            </button>
            <p className="text-xs text-gray-400 mt-4">
              <strong>How to fix:</strong>
              <br />
              1. Click your browser's address bar (lock icon)
              <br />
              2. Find Camera/Microphone settings
              <br />
              3. Select "Allow"
              <br />
              4. Click "Try Again" button
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col gap-4 place-content-center place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-white">Requesting camera and microphone access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Video Preview Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ready to Interview?</h1>
            <p className="text-gray-400 text-lg">Check your camera and microphone before joining</p>
          </div>
          
          <div className="rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur border border-slate-700 shadow-2xl">
            <VideoContainer
              id="me"
              muted={muted}
              visible={visible}
              stream={stream}
              userPicture={user?.image || ""}
            >
              <PeerVideo stream={stream} name={MYSELF} isMe={true} />
            </VideoContainer>
          </div>

          {/* Media Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleVideo}
              data-for="visibility"
              data-tip={`${!visible ? "switch on" : "switch off"}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 bg-slate-700 hover:bg-slate-600 active:scale-95 relative"
            >
              <VideoCameraIcon className="h-5 w-5" />
              <span>Camera</span>
              {!visible && <CrossLineDiv />}
            </button>
            <Tooltip id="visibility" effect="solid" />

            <button
              onClick={() => toggle("audio")(stream)}
              data-for="audio"
              data-tip={`${muted ? "unmute" : "mute"}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 bg-slate-700 hover:bg-slate-600 active:scale-95 relative"
            >
              <MicrophoneIcon className="h-5 w-5" />
              <span>Microphone</span>
              {muted && <CrossLineDiv />}
            </button>
            <Tooltip id="audio" effect="solid" />
          </div>
        </div>

        {/* Join Button Section */}
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur">
            <h2 className="text-2xl font-bold text-white mb-4">Interview Session</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Make sure your camera and microphone are working properly before entering the interview room. You'll be able to adjust your media settings once inside.
            </p>
            
            <button
              onClick={onJoinRoom}
              type="button"
              className="w-full py-4 px-6 text-lg font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Join Interview
            </button>
          </div>

          {/* Tips Section */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              💡 Quick Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Ensure good lighting before joining</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Use a stable internet connection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Find a quiet environment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
