// File: app/api/company/interview-stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const statType = searchParams.get("type"); // completed, in-process, cancelled, dropped, pending

    if (!email) {
      return NextResponse.json(
        { error: "Company email is required" },
        { status: 400 }
      );
    }

    // Find company by email
    const company = await prisma.company.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const companyId = company.id;

    // Find all job descriptions for this company
    const jobDescriptions = await prisma.jobDescription.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
      },
    });

    const jobIds = jobDescriptions.map((job) => job.id);

    let whereClause = {
      jobId: {
        in: jobIds,
      },
    };

    // Determine status filter based on stat type
    if (statType === "completed") {
      whereClause["status"] = "COMPLETED";
    } else if (statType === "in-process") {
      whereClause["status"] = { in: ["SCHEDULED", "IN_PROGRESS"] };
    } else if (statType === "cancelled") {
      whereClause["status"] = "CANCELLED";
    } else if (statType === "dropped") {
      whereClause["status"] = "DROPPED";
    } else if (statType === "pending") {
      whereClause["status"] = "PENDING";
    }

    // Get count
    const count = await prisma.interview.count({
      where: whereClause,
    });

    // Get interviews with job titles
    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: {
        jobDescription: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
      take: 5, // Just get the most recent 5 for preview
    });

    // Format the interviews data for response
    const formattedInterviews = interviews.map((interview) => ({
      id: interview.id,
      jobTitle: interview.jobDescription.title,
      interviewerEmail: interview.interviewerEmail,
      intervieweeEmail: interview.intervieweeEmail,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
    }));

    return NextResponse.json({
      count,
      recentInterviews: formattedInterviews,
    });
  } catch (error) {
    console.error("Error fetching interview statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview statistics" },
      { status: 500 }
    );
  }
}
