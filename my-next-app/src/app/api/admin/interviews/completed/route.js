import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * API endpoint to fetch all completed interviews with their feedback
 * Supports pagination with page and limit parameters
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10;
    const skip = (page - 1) * limit;

    // Fetch completed interviews
    const completedInterviews = await prisma.interview.findMany({
      where: { status: "COMPLETED" },
      include: {
        jobDescription: {
          include: {
            company: true,
          },
        },
        // interviewer: true,
        feedbacks: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
      skip,
      take: limit,
    });

    // Total count
    const totalCount = await prisma.interview.count({
      where: { status: "COMPLETED" },
    });

    // Format interviews
    const formattedInterviews = completedInterviews.map((interview) => {
      const scheduledDate = new Date(interview.scheduledAt);
      const feedback = interview.feedbacks[0] || {};

      let skillRatings = {};
      let qAndAWithScore = [];

      try {
        if (feedback.skillRatings) {
          skillRatings = JSON.parse(JSON.stringify(feedback.skillRatings));
        }
        if (feedback.qAndAWithScore) {
          qAndAWithScore = JSON.parse(JSON.stringify(feedback.qAndAWithScore));
        }
      } catch (e) {
        console.error("Error parsing JSON fields:", e);
      }

      const position = interview.jobDescription?.title || "Unknown Position";
      const score = Math.round(feedback.averageScore || 0);
      const comments = feedback.feedbackText || "";
      const skills = Object.keys(skillRatings || {});

      const feedbackDetails = {
        technicalSkill: calculateAverageSkillRating(skillRatings),
        communicationSkill: feedback.communicationScore || 0,
        problemSolving: feedback.problemSolvingScore || 0,
        codeQuality: 0, // Not available in schema
        notes: comments,
      };

      return {
        id: interview.id,
        candidateName: interview.intervieweeEmail.split("@")[0],
        position,
        company: interview.jobDescription?.company?.name || "Unknown Company",
        intervieweeEmail: interview.intervieweeEmail,
        date: scheduledDate.toISOString().split("T")[0],
        time: scheduledDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        interviewer: interview.interviewer?.name || "Unknown",
        interviewerEmail: interview.interviewerEmail,
        score,
        skills,
        comments,
        hiringDecision: feedback.hiringDecision || "NO",
        feedbackDetails,
      };
    });

    const totalInterviews = formattedInterviews.length;
    const totalScores = formattedInterviews.reduce(
      (sum, i) => sum + i.score,
      0
    );
    const averageScore =
      totalInterviews > 0 ? (totalScores / totalInterviews).toFixed(1) : "0.0";
    const topScore =
      totalInterviews > 0
        ? Math.max(...formattedInterviews.map((i) => i.score))
        : 0;

    return NextResponse.json({
      interviews: formattedInterviews,
      stats: {
        total: totalInterviews,
        averageScore,
        topScore,
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching completed interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch completed interviews" },
      { status: 500 }
    );
  }
}

// Helper function
function calculateAverageSkillRating(skills) {
  if (
    !skills ||
    typeof skills !== "object" ||
    Object.keys(skills).length === 0
  ) {
    return 0;
  }

  const values = Object.values(skills);
  const sum = values.reduce(
    (acc, val) => acc + (typeof val === "number" ? val : 0),
    0
  );
  return Math.round(sum / values.length);
}
