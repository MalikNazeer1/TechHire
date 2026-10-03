import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch overview statistics for the admin dashboard
 */
export async function GET() {
  try {
    // Query counts from database
    const [
      pendingInterviewsCount,
      scheduledInterviewsCount,
      completedInterviewsCount,
      interviewersCount,
      companiesCount,
    ] = await Promise.all([
      // Count interviews with PENDING status
      prisma.interview.count({
        where: {
          status: {
            in: ["Pending", "PENDING"],
          },
        },
      }),
      // Count interviews with SCHEDULED status
      prisma.interview.count({
        where: {
          status: "SCHEDULED",
        },
      }),
      // Count interviews with COMPLETED status
      prisma.interview.count({
        where: {
          status: "COMPLETED",
        },
      }),
      // Count active interviewers
      prisma.interviewer.count({
        where: {
          isVerified: true,
        },
      }),
      // Count verified companies
      prisma.company.count({
        where: {
          verified: false,
        },
      }),
    ]);

    return NextResponse.json({
      pendingInterviews: pendingInterviewsCount,
      scheduledInterviews: scheduledInterviewsCount,
      completedInterviews: completedInterviewsCount,
      interviewers: interviewersCount,
      companies: companiesCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
