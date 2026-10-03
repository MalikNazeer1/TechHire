import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch all interviewers
 * Supports filtering by status (active/pending)
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
    const status = searchParams.get("status"); // "active" or "pending"
    const skip = (page - 1) * limit;

    // Build where clause based on status filter
    const where: any = {};
    if (status === "active") {
      where.isVerified = true;
    } else if (status === "pending") {
      where.isVerified = false;
    }

    // Find all interviewers
    const interviewers = await prisma.interviewer.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.interviewer.count({ where });

    // Get count of pending/active interviewers for stats
    const activeCount = await prisma.interviewer.count({
      where: { isVerified: true } as any,
    });
    const pendingCount = await prisma.interviewer.count({
      where: { isVerified: false } as any,
    });

    // Format the interviewers data for response
    const formattedInterviewers = interviewers.map((interviewer: any) => ({
      id: interviewer.id,
      name: interviewer.user.name,
      email: interviewer.user.email,
      skills: interviewer.skills,
      yearsOfExperience: Math.floor(interviewer.level / 2), // Converting level to approximate years
      status: interviewer.isVerified ? "Approved" : "Pending",
      expertiseArea: interviewer.expertiseArea,
      applicationDate: interviewer.user.createdAt.toISOString().split("T")[0],
      hourlyRate: interviewer.hourlyRate,
      completedInterviews: interviewer.totalInterviews,
      rating: interviewer.avgRating,
      resumeUrl: interviewer.resume,
    }));

    return NextResponse.json({
      interviewers: formattedInterviewers,
      stats: {
        total: totalCount,
        active: activeCount,
        pending: pendingCount,
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviewers" },
      { status: 500 }
    );
  }
}
