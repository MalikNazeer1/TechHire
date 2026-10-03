import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const skip = (page - 1) * limit;

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
        // isActive: false, // Removed as it does not exist in the schema
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
        title: true,
      },
    });

    const jobIds = jobDescriptions.map((job) => job.id);

    // Get cancelled interviews
    const cancelledInterviews = await prisma.interview.findMany({
      where: {
        jobId: {
          in: jobIds,
        },
        status: "CANCELLED",
      },
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
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.interview.count({
      where: {
        jobId: {
          in: jobIds,
        },
        status: "CANCELLED",
      },
    });

    // Format the interviews data for response
    const formattedInterviews = cancelledInterviews.map((interview) => ({
      id: interview.id,
      jobTitle: interview.jobDescription.title,
      interviewerEmail: interview.interviewerEmail,
      intervieweeEmail: interview.intervieweeEmail,
      scheduledAt: interview.scheduledAt,
      durationInMinutes: interview.durationInMinutes,
      status: interview.status,
      cancelledReason: interview.cancelReason || "No reason provided", // This assumes you might add a cancelReason field to your schema
    }));

    return NextResponse.json({
      interviews: formattedInterviews,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cancelled interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch cancelled interviews" },
      { status: 500 }
    );
  }
}
