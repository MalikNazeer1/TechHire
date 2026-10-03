"use client";
import { useContext } from "react";
// import { useUser } from '@auth0/nextjs-auth0';
// import { useUser } from "@/contexts/UserContext";
import { MYSELF } from "@/common/constants";
import { UsersConnectionContext } from "@/contexts/users-connection";
import { useSession } from "next-auth/react";
import VideoContainer from "@/components/video-container";
import { PeerVideo } from "..";

export default function MyStream({
  stream,
  muted,
  visible,
}: {
  stream: MediaStream;
  muted: boolean;
  visible: boolean;
}) {
  const { data: session } = useSession();
  // const avatar = useUser().user!.picture || "";
  const avatar = session?.user!.image || "";
  const { myId } = useContext(UsersConnectionContext);

  return (
    <VideoContainer
      id={myId}
      muted={muted}
      visible={visible}
      stream={stream}
      userPicture={avatar}
    >
      <PeerVideo stream={stream} name={MYSELF} isMe={true} />
    </VideoContainer>
  );
}
