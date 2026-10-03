"use client";
import { useEffect, useState } from "react";
// import { useUser } from '@auth0/nextjs-auth0';
// import { useUser } from "@/contexts/UserContext";
import { UserMessage } from "@/common/types";
import { MYSELF } from "@/common/constants";
import { append, formatTimeHHMM } from "@/common/utils";
import { useSession } from "next-auth/react";
import { Message } from "..";
import { useSocket } from "@/contexts/SocketProvider";

const Chat = () => {
  const { data: session } = useSession();
  const user = session?.user;
  // const username = useUser().user!.name;
  const username = user?.name;
  const socket = useSocket();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    socket.on("chat:get", (message: UserMessage) =>
      setMessages(append(message))
    );

    return () => {
      socket.off("chat:get");
    };
  }, [socket]);

  if (!socket) return;

  function sendMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    const messageText = (e.target as HTMLInputElement).value;
    const lastMessage = messages.at(-1);

    if (e.key === "Enter" && messageText) {
      const timeHHMM = formatTimeHHMM(Date.now());
      const message = {
        user: username,
        text: messageText,
        time: timeHHMM,
        shouldAggregate:
          lastMessage?.user === MYSELF && lastMessage?.time === timeHHMM,
      };

      socket.emit("chat:post", message);
      setMessages(append({ ...message, user: MYSELF }));
      setText("");
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl backdrop-blur border border-slate-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={`${message.time}-${index}`}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}
      </div>
      <div className="border-t border-slate-700 p-4">
        <input
          autoComplete="off"
          type="text"
          name="name"
          id="name"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={sendMessage}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Send a message..."
        />
      </div>
    </div>
  );
};

export default Chat;

