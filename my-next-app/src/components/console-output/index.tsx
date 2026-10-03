"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Copy, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsoleEvent {
  id: string;
  timestamp: Date;
  content: string;
  type: "output" | "error" | "info";
}

interface ConsoleOutputProps {
  output: string;
  isRunning: boolean;
  isDarkMode: boolean;
}

export default function ConsoleOutput({
  output,
  isRunning,
  isDarkMode,
  resetConsole,
}: ConsoleOutputProps) {
  const consoleRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState<ConsoleEvent[]>([]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [events]);

  // Add new output as an event
  useEffect(() => {
    if (output && output !== "Running code...") {
      const newEvent: ConsoleEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        content: output,
        type: output.toLowerCase().includes("error") ? "error" : "output",
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  }, [output]);

  const copyToClipboard = () => {
    if (events.length > 0) {
      const allOutput = events.map((event) => event.content).join("\n\n");
      navigator.clipboard.writeText(allOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearConsole = () => {
    setEvents([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className={`flex flex-col h-full ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-700"
          : "bg-gray-50 border-gray-300"
      } border-l rounded-md shadow-lg transition-colors duration-300`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isDarkMode
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-gray-300"
        } border-b transition-colors duration-300`}
      >
        <div className="flex items-center gap-2">
          <Terminal
            className={`h-4 w-4 ${
              isDarkMode ? "text-sky-400" : "text-sky-600"
            }`}
          />
          <h2 className="text-sm font-medium">Console Output</h2>
          {isRunning && (
            <div className="ml-2 flex items-center">
              <div className="typing-animation text-xs text-sky-500 font-mono">
                Processing
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={events.length === 0}
                  className={`h-8 w-8 rounded-full ${
                    isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
                  } transition-colors`}
                >
                  {copied ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    >
                      <Check
                        className={`h-4 w-4 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </motion.div>
                  ) : (
                    <Copy
                      className={`h-4 w-4 ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy all output</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearConsole}
                  disabled={events.length === 0}
                  className={`h-8 w-8 rounded-full ${
                    isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
                  } transition-colors`}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset console</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div
        ref={consoleRef}
        className={`flex-1 p-4 font-mono text-sm overflow-auto ${
          isDarkMode ? "bg-zinc-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        {events.length > 0 ? (
          <AnimatePresence>
            <ul className="space-y-4">
              {events.map((event) => (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-md border ${
                    event.type === "error"
                      ? isDarkMode
                        ? "bg-red-950/30 border-red-800/30"
                        : "bg-red-50 border-red-200"
                      : isDarkMode
                      ? "bg-zinc-800/50 border-zinc-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs ${
                        event.type === "error"
                          ? isDarkMode
                            ? "text-red-400"
                            : "text-red-600"
                          : isDarkMode
                          ? "text-sky-400"
                          : "text-sky-600"
                      }`}
                    >
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`whitespace-pre-wrap ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {event.content}
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center h-full ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            <Terminal className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-center">Run your code to see output here</p>
            <p className="text-xs mt-2 text-center max-w-xs">
              The console will display the results of your code execution
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
