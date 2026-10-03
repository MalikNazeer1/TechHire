"use client";
import { XIcon } from "@heroicons/react/outline";

export default function Modal({ title, modal, onClose, children }: ModalProps) {
  return (
    <div
      className={`${
        modal === "hidden"
          ? "hidden"
          : modal === "close"
          ? "animate-on-close-chat"
          : "animate-on-open-chat"
      } h-screen w-screen max-w-full sm:max-w-md`}
      onAnimationEnd={() => modal === "close" && onClose()}
    >
      <div className="h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 shadow-2xl rounded-l-2xl border-l border-slate-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 active:scale-95"
            onClick={onClose}
            title="Close panel"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

type ModalProps = {
  title: string;
  modal: "hidden" | "close" | "chat" | "status" | "codeEditor" | "rubric";
  onClose: () => void;
  children: React.ReactNode;
};
