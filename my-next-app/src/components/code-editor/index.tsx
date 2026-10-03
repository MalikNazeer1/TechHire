"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Split from "react-split";
import { useParams } from "next/navigation";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { MonacoBinding } from "y-monaco";
import { languages } from "@/lib/languages";
import { useSocket } from "@/contexts/SocketProvider";

// Components
import "./";
import LanguageSelector from "@/components/language-selector";
import ConsoleOutput from "@/components/console-output";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Play, Code, Moon, Sun, X } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  ),
});

// Collaborative Editor component
function CollaborativeEditorInner({
  language,
  onLanguageChange,
  isDarkMode,
  editorTheme,
  onCodeRun,
  setOutput,
  user,
  socket,
  onEditorReady,
}) {
  const [code, setCode] = useState(language.defaultCode || "");
  const [isCollaborating, setIsCollaborating] = useState(false);
  const editorRef = useRef(null);
  const bindingRef = useRef(null);

  const room = useRoom();
  const self = useSelf();

  // Initialize Liveblocks collaboration for Monaco editor
  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      if (onEditorReady) {
        onEditorReady(editor);
      }

      if (!room) return;

      // Get Yjs provider from Liveblocks
      const yProvider = getYjsProviderForRoom(room);

      // Get the Yjs document and text
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText("monaco");

      // If we're the first to join and the editor is empty, set initial content
      if (yText.toString() === "" && language.defaultCode) {
        yText.insert(0, language.defaultCode);
      }

      // Bind Monaco editor to Yjs
      const binding = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor])
      );
      bindingRef.current = binding;
      setIsCollaborating(true);

      // Notify other users that we joined
      if (socket) {
        socket.emit("chat:post", {
          type: "code-collab-started",
          sender: user?.name || "Anonymous",
          message: `joined the code collaboration session`,
        });
      }
    },
    [room, language.defaultCode, socket, user, onEditorReady]
  );

  // Update presence when user or room changes
  useEffect(() => {
    if (room && self) {
      room.updatePresence({
        name: user?.name || "Anonymous",
      });
    }
  }, [room, self, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language.monacoId}
        value={code}
        onChange={(value) => !isCollaborating && setCode(value || "")}
        theme={editorTheme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 16 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          roundedSelection: true,
        }}
        loading={
          <div className="h-full w-full flex items-center justify-center bg-zinc-800">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        }
      />
    </div>
  );
}

export default function CodeEditor({ onClose, user }) {
  const [language, setLanguage] = useState(languages[0]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null);

  const socket = useSocket();
  const params = useParams();
  const roomId = params.qoraId; // dynamic param

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setEditorTheme(isDarkMode ? "vs-light" : "vs-dark");
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    // Get code from Monaco editor
    const currentCode = editorInstance ? editorInstance.getValue() : "";

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language.pistonId,
          code: currentCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error || "Failed to execute code"}`);
      }
    } catch (error) {
      setOutput(
        `Error: ${
          error instanceof Error ? error.message : "Failed to execute code"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const resetConsole = () => {
    setOutput("");
  };

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col h-screen ${
        isDarkMode ? "bg-zinc-900" : "bg-gray-100"
      } text-${
        isDarkMode ? "white" : "zinc-900"
      } transition-colors duration-300`}
    >
      <header
        className={`flex items-center justify-between p-4 ${
          isDarkMode
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-gray-200"
        } border-b backdrop-blur-md sticky top-0 z-10`}
      >
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6 text-sky-500" />
          <span className="font-medium">Collaborative Code Editor</span>
          {roomId && (
            <Badge
              variant="outline"
              className={`ml-2 ${
                isDarkMode
                  ? "border-sky-500 text-sky-400"
                  : "border-sky-600 text-sky-600"
              }`}
            >
              Room: {roomId}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-zinc-700 hover:bg-zinc-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-sky-600" />
            )}
          </button>

          {/* Language Selector */}
          <LanguageSelector
            languages={languages}
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
            isDarkMode={isDarkMode}
          />

          {/* Run Code Button */}
          <Button
            onClick={runCode}
            disabled={isRunning}
            className={`border ${
              isDarkMode
                ? "bg-sky-600 hover:bg-sky-700 border-sky-500"
                : "bg-sky-500 hover:bg-sky-600 border-sky-400"
            } text-white transition-all duration-300 shadow-lg`}
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Running...</span>
              </div>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </>
            )}
          </Button>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-red-100 text-red-500"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Split
        className="flex flex-1 overflow-hidden"
        sizes={[60, 40]}
        minSize={200}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        gutterStyle={() => ({
          backgroundColor: isDarkMode ? "#3f3f46" : "#e5e7eb",
          width: "8px",
        })}
      >
        <div className="h-full overflow-hidden rounded-md shadow-lg">
          <div
            className={`h-full ${
              isDarkMode ? "border border-zinc-700" : "border border-gray-300"
            } rounded-md overflow-hidden`}
          >
            <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
              <RoomProvider id={roomId}>
                <ClientSideSuspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  }
                >
                  <CollaborativeEditorInner
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    isDarkMode={isDarkMode}
                    editorTheme={editorTheme}
                    onCodeRun={runCode}
                    setOutput={setOutput}
                    user={user}
                    socket={socket}
                    onEditorReady={handleEditorReady}
                  />
                </ClientSideSuspense>
              </RoomProvider>
            </LiveblocksProvider>
          </div>
        </div>
        <div className="h-full">
          <ConsoleOutput
            output={output}
            isRunning={isRunning}
            isDarkMode={isDarkMode}
            resetConsole={resetConsole}
          />
        </div>
      </Split>
    </div>
  );
}