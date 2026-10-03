"use client";

import { useCallback, useEffect, useState } from "react";

import { ControlPanel, Chat, Status } from "@/components/index";
import { Streams, SharedScreenStream } from "@/components/streams";
import { usePeer, useScreen } from "@/hooks/index";
import useMediaStream from "@/hooks/use-media-stream";
import { useSocket } from "@/contexts/SocketProvider";
import { UsersSettingsProvider, UsersConnectionProvider } from "@/contexts";
import { useRouter } from "next/navigation";
import { MediaConnection } from "peerjs";
// import { toast, ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";
import { LoaderError, Modal } from "@/common/components";
import { FAILURE_MSG, LOADER_PEER_MSG } from "@/common/constants";
import { Kind, PeerId } from "@/common/types";
// Import the CodeEditor component at the top
import { CodeEditor } from "@/components";
import { CodeIcon } from "@heroicons/react/outline"; // Add this import
import { useSession } from "next-auth/react";
import { Rubric } from "@/components";

export default function App({ stream }: { stream: MediaStream }) {
  const router = useRouter();
  const socket = useSocket();
  const { muted, visible, toggle, toggleVideo } = useMediaStream(stream);
  const { peer, myId, isPeerReady } = usePeer(stream);
  const { startShare, stopShare, screenTrack } = useScreen(stream);
  // In your App component, add a new state for code editor
  const [modal, setModal] = useState<
    "hidden" | "chat" | "status" | "codeEditor" | "close" | "rubric"
  >("hidden");

  const params = useParams();
  const roomId = params.qoraId as string; // dynamic param
  console.log(roomId);
  const [fullscreen, setFullscreen] = useState(false);
  const role = localStorage.getItem("role");
  const { data: session } = useSession();

  const user = session?.user;

  function replaceTrack(track: MediaStreamTrack) {
    return (peer: MediaConnection) => {
      const sender = peer.peerConnection
        ?.getSenders()
        .find((s) => s.track?.kind === track.kind);

      sender?.replaceTrack(track);
    };
  }
  const toggleKind = useCallback(
    async (kind: Kind, users?: MediaConnection[]) => {
      switch (kind) {
        case "audio":
          toggle("audio")(stream);
          socket.emit("user:toggle-audio", myId);
          break;
        case "video":
          toggleVideo((newVideoTrack: MediaStreamTrack) =>
            users?.forEach(replaceTrack(newVideoTrack))
          );
          socket.emit("user:toggle-video", myId);
          break;
        case "screen":
          if (screenTrack) {
            stopShare(screenTrack);
            socket.emit("user:stop-share-screen");
            setFullscreen(false);
            // toast("Stopped presenting screen");
          } else {
            await startShare(
              () => {
                socket.emit("user:share-screen");
                // toast("Starting screen share");
              },
              () => socket.emit("user:stop-share-screen")
            );
          }
          break;
        case "fullscreen":
          setFullscreen((prev) => !prev);
          break;
        case "chat":
          setModal((prev) => (prev === "chat" ? "close" : "chat"));
          break;
        case "users":
          setModal((prev) => (prev === "status" ? "close" : "status"));
          break;
        case "codeEditor":
          setModal((prev) => (prev === "codeEditor" ? "close" : "codeEditor"));
          break;
        case "rubric":
          setModal((prev) => (prev === "rubric" ? "close" : "rubric"));
          break;
      }
    },
    [
      stream,
      socket,
      myId,
      screenTrack,
      startShare,
      stopShare,
      setFullscreen,
      toggle,
      toggleVideo,
      setModal,
    ]
  );

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const handleMuteUser = (peerId: PeerId) => {
      if (myId === peerId) {
        toggleKind("audio");
        // toast("You were muted by the host");
      } else {
        // toast("User muted by host");
      }
    };

    socket.on("host:muted-user", handleMuteUser);

    return () => {
      socket.off("host:muted-user", handleMuteUser);
    };
  }, [myId, socket, toggleKind]);

  useEffect(() => {
    const handleMeetingEnded = () => {
      if (role === "interviewee") {
        router.push("/");
      }
    };

    socket.on("meeting:ended", handleMeetingEnded);

    return () => {
      socket.off("meeting:ended", handleMeetingEnded);
    };
  }, [socket, role, router]);

  if (!isPeerReady) return <LoaderError msg={LOADER_PEER_MSG} />;
  if (!peer) return <LoaderError msg={FAILURE_MSG} />;

  return (
    <div className="flex w-full h-screen bg-slate-950">
      <UsersSettingsProvider>
        <div className="flex flex-col w-full h-full">
          <UsersConnectionProvider stream={stream} myId={myId} peer={peer}>
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-4 md:p-6 overflow-hidden min-h-0">
              <SharedScreenStream
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />
              <Streams
                stream={stream}
                muted={muted}
                visible={visible}
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />
            </div>

            {/* Control Panel */}
            <div className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-950 border-t border-slate-800/50">
              <ControlPanel
                visible={visible}
                muted={muted}
                screenTrack={Boolean(screenTrack)}
                chat={modal === "chat"}
                codeEditor={modal === "codeEditor"}
                rubric={modal === "rubric"}
                onToggle={toggleKind}
                onLeave={() =>
                  router.push(
                    `${
                      role === "interviewer" ? `/feedbackform/${roomId}` : "/"
                    }`
                  )
                }
              />
            </div>
          </UsersConnectionProvider>
        </div>

        <Modal
          title={
            modal === "chat"
              ? "Meeting Chat"
              : modal === "status"
              ? "Participants"
              : modal === "rubric"
              ? "Interview Evaluation"
              : ""
          }
          modal={modal}
          onClose={() => setModal("close")}
        >
          {modal === "chat" && <Chat />}
          {modal === "status" && <Status muted={muted} visible={visible} />}

          {modal === "codeEditor" && (
            <CodeEditor
              onClose={() => setModal("close")}
              user={{
                name: session?.user?.name,
                picture: session?.user?.image,
              }}
            />
          )}

          {modal === "rubric" && <Rubric roomId={roomId} />}
        </Modal>
      </UsersSettingsProvider>
      {/* <ToastContainer {...TOAST_PROPS} /> */}
    </div>
  );
}
