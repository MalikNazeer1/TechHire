"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Room from "@/room";
import { Lobby } from "@/components";
import { LoaderError } from "@/common/components";
import { FAILURE_MSG, LOADER_STREAM_MSG } from "@/common/constants";
import { useMediaStream } from "@/hooks/index";

const Qora = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const qoraId = params?.qoraId;

  const [isLobby, setIsLobby] = useState(true);
  const [interview, setInterview] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const { stream, isLoading, isError } = useMediaStream();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!qoraId || !session?.user?.email) return;

      const role = localStorage.getItem("role");

      if (role !== "interviewer" && role !== "interviewee") {
        setUnauthorized(true);
        return;
      }

      try {
        const res = await fetch(`/api/interview/${qoraId}`);
        const data = await res.json();

        const isAuthorized =
          (role === "interviewer" &&
            data?.interviewerEmail === session.user.email) ||
          (role === "interviewee" &&
            data?.intervieweeEmail === session.user.email);

        if (isAuthorized) {
          setInterview(data);
        } else {
          setUnauthorized(true);
        }
      } catch (error) {
        console.error(error);
        setUnauthorized(true);
      }
    };

    if (session?.user?.email && qoraId) {
      fetchInterview();
    }
  }, [qoraId, session]);

  if (unauthorized)
    return <LoaderError msg="Unauthorized to view this interview." />;
  if (status === "loading") return <LoaderError msg="Loading" />;
  if (isLoading) return <LoaderError msg={LOADER_STREAM_MSG} />;
  if (isError || !stream) return <Lobby stream={stream} onJoinRoom={() => setIsLobby(false)} />;

  if (!interview) return <LoaderError msg="Loading interview..." />;

  return isLobby ? (
    <Lobby stream={stream} onJoinRoom={() => setIsLobby(false)} />
  ) : (
    <Room stream={stream} />
  );
};

export default Qora;
