import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch recent activities for the admin dashboard
 */
export async function GET() {
  try {
    // Get recent scheduled interviews
    const recentInterviews = await prisma.interview.findMany({
      take: 5,
      orderBy: {
        scheduledAt: "desc",
      },
      where: {
        status: {
          in: ["SCHEDULED", "COMPLETED"],
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
      },
    });

    // Get recently approved interviewers
    const recentInterviewers = await prisma.interviewer.findMany({
      take: 3,
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            name: true,
            createdAt: true,
          },
        },
      },
    });

    // Get recently joined companies
    const recentCompanies = await prisma.company.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        name: true,
        createdAt: true,
      },
    });

    // Format the data into a unified activities array
    const activities = [
      ...recentInterviews.map((interview) => ({
        action:
          interview.status === "SCHEDULED"
            ? "Scheduled Interview"
            : "Completed Interview",
        details: `${interview.intervieweeEmail.split("@")[0]} - ${
          interview.jobDescription?.title || "Unknown Position"
        }`,
        date: formatDate(interview.scheduledAt),
        timestamp: interview.scheduledAt.getTime(),
      })),
      ...recentInterviewers.map((interviewer) => ({
        action: "Approved Interviewer",
        details: `${interviewer.user.name} - ${interviewer.expertiseArea}`,
        date: formatDate(interviewer.user.createdAt),
        timestamp: interviewer.user.createdAt.getTime(),
      })),
      ...recentCompanies.map((company) => ({
        action: "New Company Onboarded",
        details: company.name,
        date: formatDate(company.createdAt),
        timestamp: company.createdAt.getTime(),
      })),
    ];

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp - a.timestamp);

    // Return the top 5 activities
    return NextResponse.json(activities.slice(0, 5));
  } catch (error) {
    console.error("Error fetching dashboard activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard activities" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to format dates in a readable way
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // If today
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // If within the last week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
  }

  // Otherwise, show the date
  return date.toLocaleDateString();
}
