// File: app/api/company/pending-interviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { findCompanyByEmail } from "@/lib/utils/company";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

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

    try {
      const { jobIds } = await findCompanyByEmail(email);

      // Get pending interviews for these job descriptions
      const pendingInterviews = await prisma.interview.findMany({
        where: {
          jobId: {
            in: jobIds,
          },
          status: {
            equals: "PENDING",
            mode: "insensitive",
          },
        },
        include: {
          jobDescription: {
            select: {
              title: true,
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
          jobId: {
            in: jobIds,
          },
          status: {
            equals: "PENDING",
            mode: "insensitive",
          },
        },
      });

      // Format the interviews data for response
      const formattedInterviews = pendingInterviews.map((interview) => ({
        id: interview.id,
        jobTitle: interview.jobDescription.title,
        intervieweeEmail: interview.intervieweeEmail,
        scheduledAt: interview.scheduledAt,
        durationInMinutes: interview.durationInMinutes,
        status: interview.status,
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
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching pending interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending interviews" },
      { status: 500 }
    );
  }
}
