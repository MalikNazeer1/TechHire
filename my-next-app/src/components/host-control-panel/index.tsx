"use client";
import {
  MicrophoneIcon,
  PhoneMissedCallIcon as HangUpIcon,
} from "@heroicons/react/solid";
import CrossLineDiv from "@/common/components/cross-line-div";

const HostControlPanel = ({
  isMuted,
  onMutePeer,
  onRemovePeer,
}: {
  isMuted: boolean;
  onMutePeer: () => void;
  onRemovePeer: () => void;
}) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
    <button
      onClick={onMutePeer}
      disabled={isMuted}
      title={isMuted ? "Already muted" : "Mute participant"}
      className="p-2.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 backdrop-blur"
    >
      <MicrophoneIcon className="h-4 w-4" />
      {isMuted && <CrossLineDiv pos={{ top: "4", left: "4" }} />}
    </button>

    <button
      onClick={onRemovePeer}
      title="Remove participant from call"
      className="p-2.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200 flex items-center gap-1 backdrop-blur"
    >
      <HangUpIcon className="h-4 w-4" />
    </button>
  </div>
);

export default HostControlPanel;
