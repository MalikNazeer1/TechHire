// my-next-app/src/app/api/admin/interviewers/recommendations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define seniority levels
const seniorityLevels = [
  { id: 'internship', title: 'Internship', experience: '0 yrs of experience', value: 1 },
  { id: 'entry-level', title: 'Entry Level', experience: '0-1 yrs of experience', value: 2 },
  { id: 'intermediate', title: 'Intermediate', experience: '1-3 yrs of experience', value: 3 },
  { id: 'mid-senior', title: 'Mid-senior', experience: '3-5 yrs of experience', value: 4 },
  { id: 'senior', title: 'Senior', experience: '5-8 yrs of experience', value: 5 },
  { id: 'senior-plus', title: 'Senior+', experience: '8-10 yrs of experience', value: 6 },
  { id: 'staff', title: 'Staff', experience: '10+ yrs of experience', value: 7 },
];

export async function POST(request: NextRequest) {
  try {
    const { skills, experienceLevel } = await request.json();

    // Get all active interviewers with their availability
    const interviewers = await prisma.interviewer.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    // Calculate recommendation scores for each interviewer
    const recommendations = interviewers.map((interviewer) => {
      const matchReasons: string[] = [];
      let score = 0;

      // 1. Skill Matching (40% of total score)
      let skillScore = 0;
      if (skills && skills.length > 0) {
        const skillMatches = skills.filter((skill: string) =>
          interviewer.skills.includes(skill)
        );
        skillScore = (skillMatches.length / skills.length) * 40;
        if (skillMatches.length > 0) {
          matchReasons.push(`Matches ${skillMatches.length} required skills`);
        }
      }
      score += skillScore;

      // 2. Experience Level Matching (30% of total score)
      const interviewerLevel = parseInt(interviewer.level.toString()) || 1; // Convert to number, default to 1
      const requiredLevel = getExperienceLevelNumber(experienceLevel);
      const levelDiff = Math.abs(interviewerLevel - requiredLevel);
      
      let levelScore = 0;
      if (levelDiff === 0) {
        levelScore = 30;
        matchReasons.push(`Perfect experience level match`);
      } else if (levelDiff === 1) {
        levelScore = 25;
        matchReasons.push(`Close experience level match`);
      } else if (levelDiff === 2) {
        levelScore = 15;
        matchReasons.push(`Acceptable experience level match`);
      } else if (interviewerLevel > requiredLevel) {
        levelScore = Math.max(10, 30 - (levelDiff * 5));
        matchReasons.push(`More experienced than required`);
      } else {
        levelScore = Math.max(5, 30 - (levelDiff * 7));
        matchReasons.push(`Less experienced than required`);
      }
      score += levelScore;

      // 3. Interview Count (15% of total score)
      const interviewScore = Math.min(15, (interviewer.totalInterviews || 0) * 0.5);
      if (interviewScore > 0) {
        matchReasons.push(`Has conducted ${interviewer.totalInterviews} interviews`);
      }
      score += interviewScore;

      // 4. Rating Score (15% of total score)
      const ratingScore = (interviewer.avgRating || 0) * 3;
      if (ratingScore > 0) {
        matchReasons.push(`Has a rating of ${interviewer.avgRating.toFixed(1)}`);
      }
      score += ratingScore;

      return {
        interviewer: {
          id: interviewer.id,
          name: interviewer.user.name,
          email: interviewer.user.email,
          skills: interviewer.skills,
          level: interviewerLevel,
          expertiseArea: interviewer.expertiseArea,
          totalInterviews: interviewer.totalInterviews || 0,
          avgRating: interviewer.avgRating || 0,
          availableSlots: interviewer.availableSlots || [],
        },
        score: Math.round(score), // Round the score to avoid decimal places
        matchReason: matchReasons,
      };
    });

    // Sort recommendations by score
    recommendations.sort((a, b) => b.score - a.score);

    // Filter out interviewers with no available slots
    const availableRecommendations = recommendations.filter(
      (rec) => rec.interviewer.availableSlots.length > 0
    );

    return NextResponse.json({
      recommendations: availableRecommendations,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

// Helper function to convert experience level string to number
function getExperienceLevelNumber(level: string): number {
  const levelMap: { [key: string]: number } = {
    'internship': 1,
    'entry-level': 2,
    'intermediate': 3,
    'mid-senior': 4,
    'senior': 5,
    'senior-plus': 6,
    'staff': 7
  };

  // Handle both id and title formats
  const normalizedLevel = level.toLowerCase().replace(/\s+/g, '-');
  return levelMap[normalizedLevel] || 1; // Default to internship level if not found
}