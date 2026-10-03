"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Split from "react-split";
import { useParams } from "next/navigation";
import { nanoid } from "nanoid";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { languages } from "@/lib/languages";
import { useSocket } from "@/contexts/SocketProvider";

// Components
import "./";
import LanguageSelector from "@/components/language-selector";
import ConsoleOutput from "@/components/console-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Play, Code, Moon, Sun, Users, X, Copy, RefreshCw } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  ),
});

export default function CodeEditor({ onClose, user }) {
  const [language, setLanguage] = useState(languages[0]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [userColor, setUserColor] = useState("");

  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const monacoRef = useRef(null);

  const socket = useSocket();
  const params = useParams();
  const roomId = params.qoraId; // dynamic param

  // Set default code based on selected language
  useEffect(() => {
    if (!isCollaborating) {
      setCode(language.defaultCode || "");
    }
  }, [language, isCollaborating]);

  // Cleanup function for collaboration
  const cleanupCollaboration = () => {
    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current = null;
    }
    if (ydocRef.current) {
      ydocRef.current = null;
    }
    if (bindingRef.current) {
      bindingRef.current = null;
    }
    setConnectedUsers([]);
    setIsCollaborating(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCollaboration();
    };
  }, []);

  // Initialize Yjs collaboration
  const initCollaboration = (editor, monaco, userId) => {
    if (!roomId || !editor || !monaco) return;

    // Generate a random color for this user
    const getRandomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 50%)`;
    };

    const color = userColor || getRandomColor();
    setUserColor(color);

    // Create a new Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Connect to WebSocket provider using the same socket server as the video call
    const wsProvider = new WebsocketProvider(
      "ws://localhost:3001", // Your WebSocket server URL
      `code-${roomId}`, // Room name with prefix
      ydoc,
      { connect: true }
    );
    providerRef.current = wsProvider;

    // Set awareness information (user data)
    wsProvider.awareness.setLocalStateField("user", {
      id: userId,
      name: user?.name || "Anonymous",
      picture: user?.picture,
      color: color,
    });

    // Track awareness changes to update connected users list
    wsProvider.awareness.on("change", () => {
      const states = Array.from(wsProvider.awareness.getStates().values());
      const users = states
        .filter((state) => state.user)
        .map((state) => state.user);

      setConnectedUsers(users);
    });

    // Create a shared text for the editor
    const yText = ydoc.getText("monaco");

    // If we're the first to join and the editor is empty, set initial content
    if (yText.toString() === "" && code) {
      yText.insert(0, code);
    }

    // Bind Monaco editor to Yjs
    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      wsProvider.awareness
    );
    bindingRef.current = binding;

    // Emit to the room that we're starting code collaboration
    socket.emit("chat:post", {
      type: "code-collab-started",
      sender: user?.name || "Anonymous",
      message: `started a code collaboration session`,
    });

    setIsCollaborating(true);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    // If collaborating, inform other users about the language change
    if (socket && isCollaborating) {
      socket.emit("chat:post", {
        type: "language-change",
        language: newLanguage,
        sender: user?.name || "Anonymous",
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setEditorTheme(isDarkMode ? "vs-light" : "vs-dark");
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    // Get code from Monaco editor when collaborating
    const currentCode =
      isCollaborating && editorRef.current
        ? editorRef.current.getValue()
        : code;

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

        // If collaborating, share output with other users
        if (socket && isCollaborating) {
          socket.emit("chat:post", {
            type: "code-run",
            output: data.output,
            sender: user?.name || "Anonymous",
          });
        }
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

  const startCollaboration = () => {
    const userId = nanoid(8);

    // Wait for editor to be ready, then initialize collaboration
    if (editorRef.current && monacoRef.current) {
      initCollaboration(editorRef.current, monacoRef.current, userId);
    }
  };

  const copyShareLink = () => {
    // For sharing the collaboration link
    navigator.clipboard.writeText(
      `Join my code collaboration in room: ${roomId}`
    );
    setOutput((prev) => `${prev}\nShare link copied to clipboard!\n`);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Auto-start collaboration when editor is ready
    const userId = nanoid(8);
    initCollaboration(editor, monaco, userId);
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
          {isCollaborating && (
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
          {/* Connected Users Count */}
          {isCollaborating && connectedUsers.length > 0 && (
            <div className="flex items-center">
              <Users
                className={`w-5 h-5 mr-2 ${
                  isCollaborating ? "text-green-400" : "text-gray-400"
                }`}
              />
              <span className="text-sm">
                {connectedUsers.length}{" "}
                {connectedUsers.length === 1 ? "user" : "users"}
              </span>
            </div>
          )}

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

      {/* User list when collaborating */}
      {isCollaborating && connectedUsers.length > 0 && (
        <div
          className={`px-4 py-2 flex gap-2 flex-wrap ${
            isDarkMode ? "bg-zinc-800" : "bg-white"
          }`}
        >
          {connectedUsers.map((user) => (
            <Badge
              key={user.id}
              className="text-white"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
            className={`text-xs ml-auto ${
              isDarkMode
                ? "border-zinc-600 text-zinc-300"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Copy Share Link
          </Button>
        </div>
      )}

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
                fontFamily:
                  "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
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
