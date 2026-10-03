// app/api/recording/[roomId]/route.js

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// You can move these to env vars or config
const s3Config = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
  bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
};

export async function GET(request, { params }) {
  const { roomId } = params;

  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
  }

  const s3Client = new S3Client({
    region: s3Config.region,
    credentials: s3Config.credentials,
  });

  const fileKey = `recordings/${roomId}/interview-recording-amplified.wav`; // update if your filename changes

  const command = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: fileKey,
  });

  try {
    // Generate a signed URL (valid for 5 minutes)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({
      success: true,
      roomId,
      url: signedUrl,
    });
  } catch (err) {
    console.error("Error fetching recording from S3:", err);
    return NextResponse.json(
      { error: "Recording not found or failed to fetch" },
      { status: 500 }
    );
  }
}
