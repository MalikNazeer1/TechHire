"use client";

// import { useState } from "react";
import { useRecordingService } from "@/hooks/use-recording-service";
import {
  UsersStateContext,
  UsersUpdaterContext,
} from "@/contexts/users-settings.tsx"; // Assuming you have these custom hooks

const RecordingControls = () => {
  const {
    isRecording,
    formattedTime,
    startRecording,
    stopRecording,
    downloadRecording,
  } = useRecordingService();

  return (
    <div className="recording-controls p-4 bg-gray-100 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span className="mr-2">⏹</span> Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span className="mr-2">⏺</span> Start Recording
            </button>
          )}

          {!isRecording && (
            <button
              onClick={downloadRecording}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md ml-3"
              disabled={isRecording}
            >
              Download Recording
            </button>
          )}
        </div>

        {isRecording && (
          <div className="recording-indicator flex items-center">
            <span className="animate-pulse mr-2 h-3 w-3 bg-red-500 rounded-full"></span>
            <span className="font-mono">{formattedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingControls;
