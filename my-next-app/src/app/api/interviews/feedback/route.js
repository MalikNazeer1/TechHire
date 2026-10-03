// app/api/interviews/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "path";

const prisma = new PrismaClient();

// GET handler to fetch interview feedback by ID
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Fetch a specific interview feedback
      const feedbackRecord = await prisma.interviewFeedback.findFirst({
        where: { interviewId: parseInt(id) },
        select: { id: true },
      });

      if (!feedbackRecord) {
        return NextResponse.json(
          { error: "Interview feedback not found for this interview" },
          { status: 404 }
        );
      }
      const interviewFeedback = await prisma.interviewFeedback.findUnique({
        where: { id: feedbackRecord.id },
        include: { interview: true },
      });

      if (!interviewFeedback) {
        return NextResponse.json(
          { error: "Interview feedback not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(interviewFeedback);
    } else {
      // Fetch all interview feedbacks
      const interviewFeedbacks = await prisma.interviewFeedback.findMany({
        include: { interview: true },
      });

      return NextResponse.json(interviewFeedbacks);
    }
  } catch (error) {
    console.error("Error fetching interview feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview feedback" },
      { status: 500 }
    );
  }
}

// POST handler to create new interview feedback
export async function POST(request) {
  try {
    const data = await request.json();

    // Format data to match Prisma schema
    const interviewFeedbackData = {
      interviewId: parseInt(data.interviewId),

      // Restructure candidateInfo from form
      candidateInfo: {
        name: data.candidateInfo.name,
        position: data.candidateInfo.position,
        interviewerCredentials: data.candidateInfo.interviewerCredentials,
        interviewDate: data.candidateInfo.interviewDate,
        totalTimeSpent: data.candidateInfo.totalTimeSpent,
        roundName: data.candidateInfo.roundName,
      },

      // Convert decision string to enum value
      hiringDecision: data.candidateInfo.interviewerDecision,

      // Technical skills assessment
      technicalSkills: data.ratings,

      // Convert interview questions to required format
      interviewQuestions: data.questionsAsked.slice(1).map((section) => ({
        category: section.section,
        questions: section.questions.filter((q) => q.trim() !== ""),
      })),

      // Format detailed assessment
      detailedAssessment: data.evaluations.map((evaluation) => {
        if (evaluation.subSections) {
          // Handle React evaluation which has subsections
          return {
            category: evaluation.section,
            subsections: evaluation.subSections.map((subsection) => {
              // Extract rating from subsection title (e.g., "Main Concepts (7/10)")
              const ratingMatch = subsection.title.match(/\((\d+)\/10\)/);
              const score = ratingMatch ? parseInt(ratingMatch[1]) : 0;

              return {
                title: subsection.title.replace(/\s\(\d+\/10\).*$/, ""), // Remove rating text
                score: score,
                rating: getRatingText(score),
                strengths: subsection.strengths,
                areasForImprovement: subsection.areasOfImprovement,
              };
            }),
          };
        } else {
          // Handle standard evaluations
          // Extract rating if it's a string like "HTML/CSS basic and advanced concepts (7/10)"
          let score = 0;
          if (typeof evaluation.rating === "string") {
            const ratingMatch = evaluation.rating.match(/\((\d+)\/10\)/);
            score = ratingMatch ? parseInt(ratingMatch[1]) : 0;
          } else {
            score = evaluation.rating || 0;
          }

          return {
            category: evaluation.section,
            score: score,
            rating: getRatingText(score),
            description: evaluation.rating,
            strengths: evaluation.strengths,
            areasForImprovement: evaluation.areasOfImprovement,
          };
        }
      }),

      // Calculate average score
      averageScore: calculateAverageScore(data.ratings),
    };

    // Create the interview feedback in the database
    const result = await prisma.interviewFeedback.create({
      data: interviewFeedbackData,
    });
    await prisma.interview.update({
      where: { id: parseInt(data.interviewId) },
      data: {
        status: "completed",
        feedbacks: {
          connect: { id: result.id },
        },
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating interview feedback:", error);
    return NextResponse.json(
      { error: "Failed to create interview feedback" },
      { status: 500 }
    );
  }
}

// Helper function to get rating text based on score
function getRatingText(rating) {
  if (rating >= 8) return "Strong yes";
  if (rating >= 6) return "Yes";
  if (rating >= 4) return "No";
  return "Strong no";
}

// Helper function to calculate average score
function calculateAverageScore(ratings) {
  const scores = Object.values(ratings).filter(
    (score) => typeof score === "number"
  );
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}
