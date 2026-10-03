// File: lib/utils/company.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Find a company by email and return its ID and job IDs
 */
export async function findCompanyByEmail(email: string) {
  if (!email) {
    throw new Error("Company email is required");
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
    throw new Error("Company not found");
  }

  // Find all job descriptions for this company
  const jobDescriptions = await prisma.jobDescription.findMany({
    where: {
      companyId: company.id,
    },
    select: {
      id: true,
    },
  });

  const jobIds = jobDescriptions.map((job) => job.id);

  return {
    companyId: company.id,
    jobIds,
  };
}

/**
 * Enum for interview status types
 */
export enum InterviewStatus {
  PENDING = "PENDING",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DROPPED = "DROPPED",
}

/**
 * Get interview statistics for a company
 */
export async function getInterviewStatistics(companyId: number) {
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

  // Get all interviews for these job descriptions
  const interviews = await prisma.interview.findMany({
    where: {
      jobId: {
        in: jobIds,
      },
    },
  });

  // Calculate statistics
  const now = new Date();
  const normalized = interviews.map((interview) => ({
    ...interview,
    normalizedStatus: (interview.status || "").toUpperCase(),
  }));

  const upcomingScheduledInterviews = normalized.filter(
    (interview) =>
      interview.scheduledAt > now &&
      interview.normalizedStatus === InterviewStatus.SCHEDULED
  );

  const inProgressInterviews = normalized.filter(
    (interview) => interview.normalizedStatus === InterviewStatus.IN_PROGRESS
  );

  const completedInterviews = normalized.filter(
    (interview) => interview.normalizedStatus === InterviewStatus.COMPLETED
  );

  const recentlyCompletedInterviews = completedInterviews.filter(
    (interview) => {
      const interviewDate = new Date(interview.scheduledAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return interviewDate >= thirtyDaysAgo && interviewDate <= now;
    }
  );

  const inProcessCount =
    upcomingScheduledInterviews.length + inProgressInterviews.length;

  const cancelledInterviews = normalized.filter(
    (interview) => interview.normalizedStatus === InterviewStatus.CANCELLED
  );

  const droppedInterviews = normalized.filter(
    (interview) => interview.normalizedStatus === InterviewStatus.DROPPED
  );

  const pendingInterviews = normalized.filter(
    (interview) => interview.normalizedStatus === InterviewStatus.PENDING
  );

  // Keep dashboard "Total Candidates" consistent with the status buckets shown in cards.
  const totalCandidates =
    pendingInterviews.length +
    inProcessCount +
    completedInterviews.length +
    cancelledInterviews.length +
    droppedInterviews.length;

  return {
    upcomingInterviewsCount: upcomingScheduledInterviews.length,
    recentlyCompletedInterviewsCount: recentlyCompletedInterviews.length,
    totalCandidates,
    totalCompletedInterviewsCount: completedInterviews.length,
    inProcessInterviewsCount: inProcessCount,
    cancelledInterviewsCount: cancelledInterviews.length,
    droppedInterviewsCount: droppedInterviews.length,
    pendingInterviewsCount: pendingInterviews.length,
  };
}
