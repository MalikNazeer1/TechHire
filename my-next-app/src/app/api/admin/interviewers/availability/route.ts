import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define types for the data structures
type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  lastSignIn: Date;
  isActive: boolean;
};

type InterviewerData = {
  id: number; // Changed from string to number
  userId: string;
  description: string; // Added this field
  expertiseArea: string; // Changed from string[] to string
  level: number;
  hourlyRate: number;
  totalInterviews: number;
  avgRating: number;
  skills: string[];
  isVerified: boolean;
  availableSlots: Record<string, any>;
  user: UserData;
};

type FormattedInterviewer = {
  id: number; // Changed from string to number
  userId: string;
  name: string;
  email: string;
  description: string; // Added this field
  expertiseArea: string; // Changed from string[] to string
  level: string;
  hourlyRate: number;
  totalInterviews: number;
  avgRating: number;
  skills: string[];
  isVerified: boolean;
  isActive: boolean;
  avatar: string | null;
  lastSignIn: Date;
  availableSlots: Record<string, any>;
};

/**
 * GET /api/interviewers/availability
 * Get all interviewers with their availability slots
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get all interviewers with their user data
    const interviewers: InterviewerData[] = await prisma.interviewer.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            lastSignIn: true,
            isActive: true,
          },
        },
      },
    });

    // Map and format the response data
    const formattedInterviewers: FormattedInterviewer[] = interviewers.map(
      (interviewer) => {
        // Parse availableSlots and filter for available ones
        const availableSlots = JSON.parse(
          JSON.stringify(interviewer.availableSlots)
        ).filter(
          (slot: { status: string }) =>
            slot.status.toLowerCase() === "available"
        );

        return {
          id: interviewer.id,
          userId: interviewer.userId,
          name: interviewer.user.name,
          email: interviewer.user.email,
          description: interviewer.description, // Added this field
          expertiseArea: interviewer.expertiseArea,
          level: interviewer.level.toString(),
          hourlyRate: interviewer.hourlyRate,
          totalInterviews: interviewer.totalInterviews,
          avgRating: interviewer.avgRating,
          skills: interviewer.skills,
          isVerified: interviewer.isVerified,
          isActive: interviewer.user.isActive,
          avatar: interviewer.user.avatar,
          lastSignIn: interviewer.user.lastSignIn,
          availableSlots: availableSlots,
        };
      }
    );

    return NextResponse.json(formattedInterviewers);
  } catch (error) {
    console.error("Error fetching interviewers availability:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
