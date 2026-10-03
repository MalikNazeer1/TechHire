"use client";

import { useContext, useEffect } from "react";
import { useRecordingService } from "@/hooks/use-recording-service";
// import { useUsersState } from './useUsersContext';
import { UsersStateContext } from "@/contexts/users-settings.tsx";

/**
 * This component watches for changes in streams and mute status
 * and updates the recording accordingly
 */
export default function RecordingManager() {
  const { streams, isMuted } = useContext(UsersStateContext);
  const {
    isRecording,
    addStreamToRecording,
    removeStreamFromRecording,
    updateStreamMuteStatus,
  } = useRecordingService();

  // Monitor streams and add/remove them from recording
  useEffect(() => {
    if (!isRecording) return;

    // Process each stream
    Object.entries(streams).forEach(([peerId, streamElement]) => {
      if (streamElement?.props?.srcObject) {
        addStreamToRecording(peerId, streamElement.props.srcObject);
      }
    });

    // Clean up function to handle stream removal
    return () => {
      Object.keys(streams).forEach((peerId) => {
        if (!streams[peerId]) {
          removeStreamFromRecording(peerId);
        }
      });
    };
  }, [streams, isRecording]);

  // Monitor mute status changes
  useEffect(() => {
    if (!isRecording) return;

    Object.entries(isMuted).forEach(([peerId, muted]) => {
      updateStreamMuteStatus(peerId, muted);
    });
  }, [isMuted, isRecording]);

  // This is a utility component with no UI
  return null;
}
