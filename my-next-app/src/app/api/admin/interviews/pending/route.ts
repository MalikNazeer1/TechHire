import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch all pending interviews
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

    // Find all pending interviews
    const pendingInterviews = await prisma.interview.findMany({
      where: {
        status: {
          in: ["Pending", "PENDING"],
        },
      },
      include: {
        jobDescription: {
          select: {
            title: true,
            skills: true,
            experienceLevel: true,
            postedAt: true,
            company: {
              select: {
                name: true,
              },
            },
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
        status: {
          in: ["Pending", "PENDING"],
        },
      },
    });

    // Format the interviews data for response
    const formattedInterviews = pendingInterviews.map((interview) => {
      const jobTitle = interview.jobDescription?.title || "Unknown Position";
      const companyName =
        interview.jobDescription?.company?.name || "Unknown Company";
      // Parse JSON skills field with error handling
      let skills: string[] = [];
      try {
        if (interview.jobDescription?.skills) {
          const skillsData = interview.jobDescription.skills as any;
          if (typeof skillsData === "object" && skillsData.requiredSkills) {
            skills = skillsData.requiredSkills;
          }
          else {
            skills = skillsData;
          }
        }
      } catch (e) {
        console.error("Error parsing skills:", e);
      }

      return {
        id: interview.id,
        candidateName: interview.intervieweeEmail.split("@")[0], // Simple name extraction
        position: jobTitle,
        company: companyName,
        intervieweeEmail: interview.intervieweeEmail,
        uploadDate: interview.jobDescription
          ? new Date(interview.jobDescription.postedAt)
              .toISOString()
              .split("T")[0]
          : null,
        skills,
        experienceLevel: interview.jobDescription?.experienceLevel,
      };
    });

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
    console.error("Error fetching pending interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending interviews" },
      { status: 500 }
    );
  }
}
