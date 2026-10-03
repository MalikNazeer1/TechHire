"use client";
import { useContext } from "react";

import {
  ChatAltIcon as ChatIcon,
  ArrowsExpandIcon,
} from "@heroicons/react/outline";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneMissedCallIcon as HangUpIcon,
  UploadIcon as ShareScreenIcon,
} from "@heroicons/react/solid";
import { UsersConnectionContext } from "@/contexts/users-connection";
import { UsersStateContext } from "@/contexts/users-settings";
import Tooltip from "react-tooltip";
import { CodeIcon } from "@heroicons/react/outline";
import CrossLineDiv from "@/common/components/cross-line-div";
import { ClipboardListIcon } from "@heroicons/react/outline";

const ControlPanel = ({
  muted,
  visible,
  chat,
  status,
  screenTrack,
  screen,
  codeEditor,
  onToggle,
  onLeave,
  rubric,
}: any) => {
  const { sharedScreenTrack: shared, streams } = useContext(UsersStateContext);
  const { users } = useContext(UsersConnectionContext);
  const role = localStorage.getItem("role");

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Fullscreen Button */}
      {(screenTrack || shared) && (
        <button
          onClick={() => onToggle("fullscreen")}
          data-for="fullscreen"
          data-tip="Fullscreen"
          className={`${commonButton} bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200`}
        >
          <ArrowsExpandIcon className="w-5 h-5" />
        </button>
      )}
      {(screenTrack || shared) && <Tooltip id="fullscreen" effect="solid" />}

      {/* Media Controls Group */}
      <div className="flex gap-2 px-3 py-2 rounded-xl bg-slate-800/60 backdrop-blur border border-slate-700">
        <button
          onClick={() => onToggle("video", Object.values(users))}
          data-for="visibility"
          data-tip={`${!visible ? "Turn on" : "Turn off"} camera`}
          className={`${mediaButton} ${!visible ? "bg-red-600/80 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-600"} relative`}
        >
          <VideoCameraIcon className="h-5 w-5" />
          {!visible && <CrossLineDiv />}
        </button>
        <Tooltip id="visibility" effect="solid" />

        <button
          onClick={() => onToggle("audio")}
          data-for="audio"
          data-tip={`${muted ? "Unmute" : "Mute"} microphone`}
          className={`${mediaButton} ${muted ? "bg-red-600/80 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-600"} relative`}
        >
          <MicrophoneIcon className="h-5 w-5" />
          {muted && <CrossLineDiv />}
        </button>
        <Tooltip id="audio" effect="solid" />
      </div>

      {/* Collaboration Tools Group */}
      <div className="flex gap-2 px-3 py-2 rounded-xl bg-slate-800/60 backdrop-blur border border-slate-700">
        <button
          onClick={() => onToggle("screen")}
          disabled={shared}
          data-for="shareScreen"
          data-tip="Share screen"
          className={`${mediaButton} ${
            screen
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-slate-700 hover:bg-slate-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ShareScreenIcon className="h-5 w-5" />
        </button>
        <Tooltip id="shareScreen" effect="solid" />

        <button
          onClick={() => onToggle("codeEditor")}
          data-for="codeEditor"
          data-tip="Code Editor"
          className={`${mediaButton} ${
            codeEditor
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          <CodeIcon className="w-5 h-5" />
        </button>
        <Tooltip id="codeEditor" effect="solid" />

        <button
          data-for="chat"
          data-tip="Chat"
          onClick={() => onToggle("chat")}
          className={`${mediaButton} ${
            chat
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          <ChatIcon className="w-5 h-5" />
        </button>
        <Tooltip id="chat" effect="solid" />

        {role === "interviewer" && (
          <>
            <button
              onClick={() => onToggle("rubric")}
              data-for="rubric"
              data-tip="Evaluation Rubric"
              className={`${mediaButton} ${
                rubric
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              <ClipboardListIcon className="w-5 h-5" />
            </button>
            <Tooltip id="rubric" effect="solid" />
          </>
        )}
      </div>

      {/* Participants and End Call */}
      <div className="flex gap-2 ml-auto">
        <ParticipantsCount
          onClick={() => onToggle("users")}
          count={Object.keys(streams).length + 1}
        />

        <button
          onClick={onLeave}
          data-for="hangUp"
          data-tip="End call"
          className={`${commonButton} bg-red-600 hover:bg-red-500 text-white transition-all duration-200 font-semibold`}
        >
          <HangUpIcon className="h-5 w-5" />
        </button>
        <Tooltip id="hangUp" effect="solid" />
      </div>
    </div>
  );
};

export default ControlPanel;

const commonButton = "p-2.5 rounded-lg text-white flex items-center justify-center active:scale-95";
const mediaButton = "p-2 rounded-lg text-white flex items-center justify-center transition-all duration-200 active:scale-95";

const ParticipantsCount = ({ count, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      data-for="participants"
      data-tip={`${count} participant${count > 1 ? "s" : ""}`}
      className="p-2.5 rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-all duration-200 flex items-center gap-2 font-semibold text-sm active:scale-95"
    >
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      <span>{count}</span>
    </button>
  );
};


