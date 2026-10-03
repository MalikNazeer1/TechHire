import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch all scheduled interviews
 * Supports pagination with page and limit parameters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const skip = (page - 1) * limit;

    // Find all scheduled interviews
    const scheduledInterviews = await prisma.interview.findMany({
      where: {
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
      },
      include: {
        jobDescription: {
          select: {
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
        interviewer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.interview.count({
      where: {
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
      },
    });

    // Count statistics for the dashboard cards
    const scheduledCount = await prisma.interview.count({
      where: {
        status: "SCHEDULED",
      },
    });

    const inProgressCount = await prisma.interview.count({
      where: {
        status: "IN_PROGRESS",
      },
    });

    // Count today's interviews
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    const todayCount = await prisma.interview.count({
      where: {
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
        scheduledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Format the interviews data for response
    const formattedInterviews = scheduledInterviews.map((interview) => {
      const scheduledDate = new Date(interview.scheduledAt);

      return {
        id: interview.id,
        candidateName: interview.intervieweeEmail.split("@")[0], // Simple name extraction
        position: interview.jobDescription?.title || "Unknown Position",
        company: interview.jobDescription?.company?.name || "Unknown Company",
        intervieweeEmail: interview.intervieweeEmail,
        date: scheduledDate.toISOString().split("T")[0],
        time: scheduledDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        interviewer: interview.interviewer?.name || "Unknown",
        interviewerEmail: interview.interviewerEmail,
        status: interview.status,
        meetingLink: interview.meetingLink,
      };
    });

    return NextResponse.json({
      interviews: formattedInterviews,
      stats: {
        scheduled: scheduledCount,
        inProgress: inProgressCount,
        today: todayCount,
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled interviews" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to cancel an interview
 */
export async function PUT(request: NextRequest) {
  try {
    const { interviewId, reason } = await request.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Update the interview status to CANCELLED
    // Since there's no cancelReason field in the schema,
    // we'll include the reason in the status field
    const cancellationStatus = reason ? `CANCELLED (${reason})` : "CANCELLED";

    const updatedInterview = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        status: cancellationStatus,
      },
    });

    return NextResponse.json({
      success: true,
      interview: updatedInterview,
    });
  } catch (error) {
    console.error("Error cancelling interview:", error);
    return NextResponse.json(
      { error: "Failed to cancel interview" },
      { status: 500 }
    );
  }
}
