// app/api/TechHire/interviewee/scheduled-interviews/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Get all interviews for this interviewee
    const interviews = await prisma.interview.findMany({
      where: {
        intervieweeEmail: email,
        scheduledAt: {
          gt: new Date(), // only future interviews
        },
        status: "SCHEDULED", // only scheduled interviews
      },
      include: {
        jobDescription: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
    console.log("Interviews", interviews);
    // Format the interviews data to match UI requirements
    const formattedInterviews = interviews.map((interview) => ({
      id: interview.id,
      title: `${interview.jobDescription.company.name} - ${interview.jobDescription.title}`,
      date: interview.scheduledAt,
      time: new Date(interview.scheduledAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      company: interview.jobDescription.company.name,
      position: interview.jobDescription.title,
      jobDescriptionId: interview.jobDescription.id,
      jobDescription: interview.jobDescription.description,
      companyInfo: interview.jobDescription.company.description,
      roomLink: interview.meetingLink,
      companyId: interview.jobDescription.companyId,
      status: interview.status,
      meetingLink: `/qora/${interview.id}`,
      durationInMinutes: interview.durationInMinutes,
    }));

    return NextResponse.json(formattedInterviews);
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
