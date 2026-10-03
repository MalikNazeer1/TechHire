"use client";
import { MYSELF } from "@/common/constants";
import { UserMessage } from "@/common/types";

const Message = ({
  message,
  isLast,
}: {
  message: UserMessage;
  isLast: boolean;
}) => {
  const isMe = message.user === MYSELF;

  return (
    <div className="group">
      {!message.shouldAggregate && (
        <div className={`text-xs font-semibold mt-4 mb-1 flex items-baseline gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
          <span className="text-white">{message.user}</span>
          <span className="text-slate-500 text-xs">{message.time}</span>
        </div>
      )}
      <div
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-0.5`}
      >
        <div
          className={`max-w-xs px-4 py-2.5 rounded-lg text-sm leading-relaxed break-words ${
            isMe 
              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm" 
              : "bg-slate-700 text-slate-100 rounded-bl-sm"
          } ${isLast ? "" : ""} shadow-sm`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default Message;
