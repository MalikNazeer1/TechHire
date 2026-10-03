"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { UsersStateContext } from "@/contexts/users-settings";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useParams } from "next/navigation";
/**
 * A service to handle recording of WebRTC streams with enhanced audio quality
 * Can handle long recordings (up to several hours)
 * Records audio only with improved quality settings
 * Uploads recordings to S3 when stopped
 */
export const useRecordingService = () => {
  const { streams } = useContext(UsersStateContext);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [audioQuality, setAudioQuality] = useState("high"); // Options: "standard", "high", "studio"
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const params = useParams();
  const roomId = params.qoraId;
  console.log("roomId In use-recording-service: ", roomId);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const destinationRef = useRef(null);
  const audioSourcesRef = useRef({});
  const audioProcessorRef = useRef(null);
  const gainNodesRef = useRef({});
  const filterNodesRef = useRef({});

  // S3 client configuration
  const s3ConfigRef = useRef({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
    bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
  });

  console.log("ref: ", s3ConfigRef.current);

  // Create a timer to track recording duration
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Format the recording time as hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
      stopTimer();
    };
  }, []);

  // Helper function to extract MediaStream from stream objects
  const extractMediaStream = (streamObj) => {
    if (streamObj?.props?.srcObject instanceof MediaStream) {
      return streamObj.props.srcObject;
    }

    if (streamObj?.props?.stream instanceof MediaStream) {
      return streamObj.props.stream;
    }

    if (streamObj instanceof MediaStream) {
      return streamObj;
    }

    if (streamObj?.stream instanceof MediaStream) {
      return streamObj.stream;
    }

    return null;
  };

  // Get bitrate settings based on quality
  const getBitrateSettings = () => {
    switch (audioQuality) {
      case "studio":
        return 256000; // 256 kbps for studio quality
      case "high":
        return 128000; // 128 kbps for high quality
      case "standard":
      default:
        return 64000; // 64 kbps for standard quality
    }
  };

  // Apply audio processing to stream
  const applyAudioProcessing = (audioSource, peerId) => {
    const audioContext = audioContextRef.current;

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0; // Default value, can be adjusted
    gainNodesRef.current[peerId] = gainNode;

    // Create filter for noise reduction (high-pass filter to remove low frequency noise)
    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = 80; // Cut off frequencies below 80Hz

    // Create low-pass filter to smooth high frequency noise
    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.value = 15000; // Cut off frequencies above 15kHz

    // Store reference to filters
    filterNodesRef.current[peerId] = {
      highPass: highPassFilter,
      lowPass: lowPassFilter,
    };

    // Connect the audio processing chain
    audioSource.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(gainNode);
    gainNode.connect(destinationRef.current);

    return gainNode;
  };

  // Set up recording of all audio streams with enhanced quality
  const startRecording = () => {
    try {
      console.log("Starting enhanced quality recording setup");

      // Create audio context with higher sample rate for better quality
      const sampleRate = audioQuality === "studio" ? 48000 : 44100;
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)({ sampleRate });

      // Create stereo destination (2 channels) for better spatial audio
      destinationRef.current =
        audioContextRef.current.createMediaStreamDestination();

      // Process each stream
      let hasConnectedStreams = false;
      Object.entries(streams).forEach(([peerId, streamElement]) => {
        const mediaStream = extractMediaStream(streamElement);
        if (!mediaStream) {
          console.log(`No valid media stream found for peer ${peerId}`);
          return;
        }

        const audioTracks = mediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
          try {
            // Apply constraints to audio track for better quality if possible
            try {
              // Use more flexible constraints that browsers are more likely to support
              const audioConstraints = {
                echoCancellation: { ideal: true },
                noiseSuppression: { ideal: true },
                autoGainControl: { ideal: true },
                // Remove sampleRate, channelCount and sampleSize constraints
                // as they're likely causing "Cannot satisfy constraints" errors
              };

              audioTracks[0].applyConstraints(audioConstraints).catch((err) => {
                console.log(`Using default audio settings: ${err.message}`);
              });
            } catch (err) {
              console.log(
                `Browser doesn't support constraint application: ${err.message}`
              );
            }

            const audioSource =
              audioContextRef.current.createMediaStreamSource(mediaStream);

            // Apply audio processing for quality enhancement
            applyAudioProcessing(audioSource, peerId);
            audioSourcesRef.current[peerId] = audioSource;

            hasConnectedStreams = true;
            console.log(`Connected enhanced audio for peer ${peerId}`);
          } catch (err) {
            console.error(`Error connecting audio for peer ${peerId}:`, err);
          }
        }
      });

      if (!hasConnectedStreams) {
        console.warn("No audio streams were connected for recording");
      }

      // Create and configure MediaRecorder with high quality options
      let options = {};
      const bitrate = getBitrateSettings();

      // Try different high-quality MIME types based on browser support
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: bitrate,
        };
        console.log(`Using audio/webm;codecs=opus at ${bitrate}bps`);
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = {
          mimeType: "audio/webm",
          audioBitsPerSecond: bitrate,
        };
        console.log(`Using audio/webm at ${bitrate}bps`);
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        options = {
          mimeType: "audio/mp4",
          audioBitsPerSecond: bitrate,
        };
        console.log(`Using audio/mp4 at ${bitrate}bps`);
      } else {
        console.log(
          `Using default recorder options with ${bitrate}bps bitrate`
        );
        options = { audioBitsPerSecond: bitrate };
      }

      const destStream = destinationRef.current.stream;
      console.log(
        `Destination stream has ${
          destStream.getAudioTracks().length
        } audio tracks`
      );

      mediaRecorderRef.current = new MediaRecorder(destStream, options);

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log(`Data available event: ${event.data.size} bytes`);
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // Start recording with smaller chunks
      mediaRecorderRef.current.start(2000); // 2 second chunks for better quality control
      setIsRecording(true);
      startTimer();

      console.log(`Recording started with ${audioQuality} quality`);
    } catch (error) {
      console.error("Error starting enhanced recording:", error);
    }
  };

  // Add a new audio stream to the recording with enhanced quality
  const addStreamToRecording = (peerId, streamObject) => {
    if (!isRecording || !audioContextRef.current) return;

    try {
      const mediaStream = extractMediaStream(streamObject);

      if (!mediaStream) {
        console.log(
          `Cannot add stream: No valid media stream for peer ${peerId}`
        );
        return;
      }

      const audioTracks = mediaStream.getAudioTracks();

      if (audioTracks.length > 0) {
        // Remove existing connection if any
        if (audioSourcesRef.current[peerId]) {
          // Clean up processing nodes
          if (gainNodesRef.current[peerId]) {
            gainNodesRef.current[peerId].disconnect();
          }

          if (filterNodesRef.current[peerId]) {
            if (filterNodesRef.current[peerId].highPass)
              filterNodesRef.current[peerId].highPass.disconnect();
            if (filterNodesRef.current[peerId].lowPass)
              filterNodesRef.current[peerId].lowPass.disconnect();
          }

          audioSourcesRef.current[peerId].disconnect();
        }

        // Apply constraints if possible for better quality
        try {
          // Use more flexible constraints that browsers are more likely to support
          const audioConstraints = {
            echoCancellation: { ideal: true },
            noiseSuppression: { ideal: true },
            autoGainControl: { ideal: true },
            // Remove sampleRate, channelCount and sampleSize constraints
          };

          audioTracks[0].applyConstraints(audioConstraints).catch((err) => {
            console.log(`Using default audio settings: ${err.message}`);
          });
        } catch (err) {
          console.log(
            `Browser doesn't support constraint application: ${err.message}`
          );
        }

        // Create and connect new audio source with processing
        const audioSource =
          audioContextRef.current.createMediaStreamSource(mediaStream);
        applyAudioProcessing(audioSource, peerId);
        audioSourcesRef.current[peerId] = audioSource;

        console.log(`Added/updated enhanced stream for peer ${peerId}`);
      }
    } catch (err) {
      console.error(`Error adding stream for peer ${peerId}:`, err);
    }
  };

  // Remove an audio stream from recording
  const removeStreamFromRecording = (peerId) => {
    if (!isRecording || !audioContextRef.current) return;

    const audioSource = audioSourcesRef.current[peerId];
    if (audioSource) {
      try {
        // Disconnect audio processing chain
        if (gainNodesRef.current[peerId]) {
          gainNodesRef.current[peerId].disconnect();
          delete gainNodesRef.current[peerId];
        }

        if (filterNodesRef.current[peerId]) {
          if (filterNodesRef.current[peerId].highPass)
            filterNodesRef.current[peerId].highPass.disconnect();
          if (filterNodesRef.current[peerId].lowPass)
            filterNodesRef.current[peerId].lowPass.disconnect();
          delete filterNodesRef.current[peerId];
        }

        audioSource.disconnect();
        delete audioSourcesRef.current[peerId];
        console.log(`Removed stream for peer ${peerId}`);
      } catch (err) {
        console.error(`Error removing stream for peer ${peerId}:`, err);
      }
    }
  };

  // Update when a user is muted/unmuted
  const updateStreamMuteStatus = (peerId, muted) => {
    if (!isRecording || !audioContextRef.current) return;

    if (muted && gainNodesRef.current[peerId]) {
      try {
        // Instead of disconnecting, set gain to 0 for smoother transitions
        gainNodesRef.current[peerId].gain.setValueAtTime(
          0,
          audioContextRef.current.currentTime
        );
        console.log(`Muted stream for peer ${peerId}`);
      } catch (err) {
        console.error(`Error muting stream for peer ${peerId}:`, err);
      }
    } else if (!muted && gainNodesRef.current[peerId]) {
      try {
        // Fade in gain for smoother unmuting
        gainNodesRef.current[peerId].gain.setValueAtTime(
          0,
          audioContextRef.current.currentTime
        );
        gainNodesRef.current[peerId].gain.linearRampToValueAtTime(
          1.0,
          audioContextRef.current.currentTime + 0.1
        );
        console.log(`Unmuted stream for peer ${peerId}`);
      } catch (err) {
        console.error(`Error unmuting stream for peer ${peerId}:`, err);
      }
    } else if (!muted) {
      // If node doesn't exist yet, add the stream
      const streamElement = streams[peerId];
      if (streamElement) {
        addStreamToRecording(peerId, streamElement);
      }
    }
  };

  // Adjust audio quality setting
  const setAudioQualityLevel = (quality) => {
    if (["standard", "high", "studio"].includes(quality)) {
      setAudioQuality(quality);
      console.log(`Audio quality set to ${quality}`);

      // If already recording, we can't change quality mid-recording
      if (isRecording) {
        console.log("Quality will apply to next recording session");
      }
    } else {
      console.warn(`Invalid quality setting: ${quality}`);
    }
  };

  // Adjust gain for a specific peer
  const adjustPeerGain = (peerId, gainValue) => {
    if (!isRecording || !audioContextRef.current) return;

    if (gainNodesRef.current[peerId]) {
      try {
        // Smoothly transition to new gain value
        gainNodesRef.current[peerId].gain.linearRampToValueAtTime(
          gainValue,
          audioContextRef.current.currentTime + 0.1
        );
        console.log(`Adjusted gain for peer ${peerId} to ${gainValue}`);
      } catch (err) {
        console.error(`Error adjusting gain for peer ${peerId}:`, err);
      }
    }
  };

  // Upload recording to S3 bucket
  const uploadToS3 = async (audioBlob, fileName) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Create S3 client
      const s3Client = new S3Client({
        region: s3ConfigRef.current.region,
        credentials: s3ConfigRef.current.credentials,
      });

      const bucketName = s3ConfigRef.current.bucket;
      const key = `recordings/${roomId}/${fileName}`;

      // Convert blob to buffer for upload
      console.log(`Preparing ${audioBlob.size} bytes for S3 upload`);
      const buffer = await audioBlob.arrayBuffer();

      // Optional metadata
      const metadata = {
        "x-amz-meta-quality": audioQuality,
        "x-amz-meta-recording-date": new Date().toISOString(),
        "x-amz-meta-duration-seconds": recordingTime.toString(),
      };

      // Create upload command
      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: audioBlob.type,
        Metadata: metadata,
        ACL: "private", // Ensure recording is private by default
      };

      // Upload to S3
      console.log(`Uploading recording to S3: ${bucketName}/${key}`);
      setUploadProgress(10); // Show upload has started

      const command = new PutObjectCommand(uploadParams);
      const response = await s3Client.send(command);

      console.log("S3 upload successful:", response);
      setUploadProgress(100);
      setIsUploading(false);

      return {
        success: true,
        key,
        bucket: bucketName,
        fileSize: audioBlob.size,
        fileType: audioBlob.type,
        duration: recordingTime,
      };
    } catch (error) {
      console.error("Error uploading to S3:", error);
      setUploadError(error.message || "Error uploading to S3");
      setIsUploading(false);
      return {
        success: false,
        error: error.message || "Unknown S3 upload error",
        fileSize: audioBlob?.size,
        fileType: audioBlob?.type,
      };
    }
  };

  // Amplify audio and upload directly to S3
  const amplifyAndUploadToS3 = async () => {
    if (recordedChunks.length === 0) {
      console.warn("No recorded data available for S3 upload");
      return { success: false, error: "No recorded data available" };
    }

    try {
      console.log(
        `Processing ${recordedChunks.length} chunks for amplification and S3 upload`
      );

      // Use appropriate MIME type
      let mimeType = "audio/webm";
      if (recordedChunks[0] && recordedChunks[0].type) {
        mimeType = recordedChunks[0].type;
      }

      const blob = new Blob(recordedChunks, { type: mimeType });
      console.log(
        `Created blob of size ${blob.size} bytes and type ${mimeType}`
      );

      try {
        // Always attempt to amplify the audio first
        console.log("Amplifying audio before S3 upload...");
        const amplifiedBlob = await amplifyAudio(blob, mimeType);
        const timestamp = new Date().toISOString();
        const fileName = `interview-recording-amplified.wav`;

        console.log(
          `Uploading amplified audio (${amplifiedBlob.size} bytes) to S3 as ${fileName}`
        );
        return await uploadToS3(amplifiedBlob, fileName);
      } catch (ampError) {
        console.error(
          "Error during audio amplification for S3 upload:",
          ampError
        );

        // Fallback: upload original blob if amplification fails
        console.log("Falling back to original audio for S3 upload");
        const timestamp = new Date().toISOString();
        const fileName = `interview-recording-original.webm`;

        console.log(
          `Uploading original audio (${blob.size} bytes) to S3 as ${fileName}`
        );
        return await uploadToS3(blob, fileName);
      }
    } catch (error) {
      console.error("Error in amplify and upload process:", error);
      setUploadError(
        error.message || "Error processing recording for S3 upload"
      );
      return {
        success: false,
        error: error.message || "Unknown error during upload process",
      };
    }
  };

  // Stop recording, process, and upload to S3
  const stopRecording = async () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      console.log("MediaRecorder not active, nothing to stop");
      return { success: false, error: "Not recording" };
    }

    console.log("Stopping recording and preparing for S3 upload");
    try {
      return new Promise((resolve) => {
        // Add event listener to handle the recording stopping
        mediaRecorderRef.current.addEventListener("stop", async () => {
          stopTimer();
          setIsRecording(false);

          // Clean up audio context connections
          Object.keys(audioSourcesRef.current).forEach((peerId) => {
            try {
              // Disconnect all audio processing nodes
              if (gainNodesRef.current[peerId]) {
                gainNodesRef.current[peerId].disconnect();
              }

              if (filterNodesRef.current[peerId]) {
                if (filterNodesRef.current[peerId].highPass)
                  filterNodesRef.current[peerId].highPass.disconnect();
                if (filterNodesRef.current[peerId].lowPass)
                  filterNodesRef.current[peerId].lowPass.disconnect();
              }

              const source = audioSourcesRef.current[peerId];
              if (source) source.disconnect();
            } catch (err) {
              console.error(
                `Error disconnecting source for peer ${peerId}:`,
                err
              );
            }
          });

          audioSourcesRef.current = {};
          gainNodesRef.current = {};
          filterNodesRef.current = {};

          if (
            audioContextRef.current &&
            audioContextRef.current.state !== "closed"
          ) {
            try {
              await audioContextRef.current.close();
            } catch (err) {
              console.error("Error closing audio context:", err);
            }
          }

          console.log("Recording stopped, amplifying and uploading to S3");

          // Always prioritize uploading the amplified version
          const uploadResult = await amplifyAndUploadToS3();

          // Reset recording state
          if (uploadResult.success) {
            setRecordedChunks([]);
          }

          setRecordingTime(0); // Reset timer
          resolve(uploadResult);
        });

        // Stop the media recorder to trigger the event above
        mediaRecorderRef.current.stop();
      });
    } catch (error) {
      console.error("Error stopping recording:", error);
      return { success: false, error };
    }
  };

  // Helper function to amplify the audio
  const amplifyAudio = async (blob, mimeType) => {
    try {
      console.log(
        `Starting audio amplification process for ${blob.size} bytes of ${mimeType}`
      );

      // Create a temporary audio context
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Convert blob to ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      console.log(
        `Converted blob to ArrayBuffer of ${arrayBuffer.byteLength} bytes`
      );

      // Decode audio data
      console.log("Decoding audio data...");
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log(
        `Decoded audio: ${audioBuffer.length} samples, ${audioBuffer.numberOfChannels} channels, ${audioBuffer.sampleRate}Hz`
      );

      // Create offline context for processing (same number of channels and sample rate)
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      // Create buffer source
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create gain node for amplification
      const gainNode = offlineContext.createGain();

      // Set gain value (amplification factor) based on quality settings
      // Higher quality recordings typically need less amplification
      let amplificationFactor;
      switch (audioQuality) {
        case "studio":
          amplificationFactor = 2.0; // Moderate amplification for studio
          break;
        case "high":
          amplificationFactor = 2.5; // Medium amplification
          break;
        case "standard":
        default:
          amplificationFactor = 3.0; // Higher amplification for standard
      }

      console.log(`Amplifying audio by factor ${amplificationFactor}`);
      gainNode.gain.value = amplificationFactor;

      // Create dynamic compressor to prevent clipping/distortion
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.value = -24; // Start compressing at -24dB
      compressor.knee.value = 30; // Smooth compression curve
      compressor.ratio.value = 12; // Fairly aggressive compression ratio
      compressor.attack.value = 0.003; // Fast attack
      compressor.release.value = 0.25; // Medium release

      // Create a limiter to ensure we don't clip
      const limiter = offlineContext.createDynamicsCompressor();
      limiter.threshold.value = -0.5; // Very high threshold (just below 0 dB)
      limiter.knee.value = 0.0; // Hard knee for true limiting
      limiter.ratio.value = 20.0; // Very high ratio for limiting
      limiter.attack.value = 0.001; // Very fast attack
      limiter.release.value = 0.1; // Fast release

      // Connect nodes: source -> gain -> compressor -> limiter -> destination
      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(limiter);
      limiter.connect(offlineContext.destination);

      // Start source
      source.start(0);

      // Render audio
      console.log("Rendering amplified audio...");
      const renderedBuffer = await offlineContext.startRendering();
      console.log("Audio rendering complete");

      // Convert back to wav format for better compatibility
      console.log("Converting to WAV format...");
      const wavBlob = audioBufferToWav(renderedBuffer);
      console.log(`Created WAV blob of ${wavBlob.size} bytes`);

      return wavBlob;
    } catch (error) {
      console.error("Error in amplifyAudio:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  // Save recording as audio file with amplification to increase loudness
  const downloadRecording = () => {
    if (recordedChunks.length === 0) {
      console.warn("No recorded data available");
      return;
    }

    try {
      console.log(`Creating blob from ${recordedChunks.length} chunks`);

      // Use appropriate MIME type
      let mimeType = "audio/webm";
      if (recordedChunks[0] && recordedChunks[0].type) {
        mimeType = recordedChunks[0].type;
      }

      const blob = new Blob(recordedChunks, { type: mimeType });
      console.log(
        `Created blob of size ${blob.size} bytes and type ${mimeType}`
      );

      // Process the audio for amplification if Web Audio API is supported
      amplifyAndDownloadAudio(blob, mimeType);
    } catch (error) {
      console.error("Error processing recording:", error);
      // Fallback to regular download if amplification fails
      directDownload(new Blob(recordedChunks));
    }
  };

  // Helper function to amplify the audio before downloading
  const amplifyAndDownloadAudio = async (blob, mimeType) => {
    try {
      const amplifiedBlob = await amplifyAudio(blob, mimeType);

      // Download the amplified file
      const url = URL.createObjectURL(amplifiedBlob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = `interview-recording-amplified.wav`;
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setRecordedChunks([]);

      console.log(`Amplified ${audioQuality} quality recording downloaded`);
    } catch (error) {
      console.error("Error amplifying audio:", error);
      // Fallback to direct download
      directDownload(blob);
    }
  };

  // Helper function for direct download without amplification (fallback)
  const directDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `interview-recording-${audioQuality}-${new Date().toISOString()}.webm`;
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setRecordedChunks([]);
    console.log(
      `Original ${audioQuality} quality recording downloaded (no amplification)`
    );
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer) => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2; // 2 bytes per sample (16-bit)
    const sampleRate = buffer.sampleRate;

    // Create buffer for WAV file data
    const wavBuffer = new ArrayBuffer(44 + length); // 44 bytes for header
    const view = new DataView(wavBuffer);

    // Write WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + length, true); // File size - 8
    writeString(view, 8, "WAVE");

    // "fmt " sub-chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numOfChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
    view.setUint16(32, numOfChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample

    // "data" sub-chunk
    writeString(view, 36, "data");
    view.setUint32(40, length, true); // Sub-chunk size

    // Write audio data
    const channelData = [];
    for (let i = 0; i < numOfChannels; i++) {
      channelData.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        // Convert float to 16-bit PCM
        let sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // Helper function to write strings to DataView
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    audioQuality,
    setAudioQualityLevel,
    startRecording,
    stopRecording,
    downloadRecording,
    addStreamToRecording,
    removeStreamFromRecording,
    updateStreamMuteStatus,
    adjustPeerGain,
    isUploading,
    uploadProgress,
    uploadError,
    // S3 Configuration helpers
    updateS3Config: (config) => {
      s3ConfigRef.current = { ...s3ConfigRef.current, ...config };
    },
  };
};
