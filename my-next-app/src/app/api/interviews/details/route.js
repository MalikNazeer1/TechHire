// app/api/interviews/details/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch interview details
 * Includes integration with the JobDescription and other related data
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log("ID:", id); // Log the ID for debugging
    if (!id) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Parse the ID to integer as required by Prisma
    const interviewId = parseInt(id, 10);

    // Fetch the interview with related data
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        jobDescription: true,
        //   interviewer: {
        //     select: {
        //       name: true,
        //       email: true,
        //     },
        //   },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error fetching interview details:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview details" },
      { status: 500 }
    );
  }
}
