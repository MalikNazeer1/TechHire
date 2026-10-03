import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const evidenceUsers = await prisma.user.findMany({
    where: { email: { startsWith: "evidence_" } },
    select: { id: true },
  });
  const userIds = evidenceUsers.map((u) => u.id);

  const evidenceCompanies = await prisma.company.findMany({
    where: {
      OR: [{ email: { startsWith: "evidence_" } }, { userId: { in: userIds } }],
    },
    select: { id: true },
  });
  const companyIds = evidenceCompanies.map((c) => c.id);

  const evidenceJobs = await prisma.jobDescription.findMany({
    where: {
      OR: [
        { companyId: { in: companyIds } },
        { title: { startsWith: "Upload 3 candidates" } },
        { title: { startsWith: "Missing Email" } },
        { title: { startsWith: "Schedule Test Job" } },
      ],
    },
    select: { id: true },
  });
  const jobIds = evidenceJobs.map((j) => j.id);

  const evidenceInterviews = await prisma.interview.findMany({
    where: {
      OR: [
        { interviewerEmail: { startsWith: "evidence_" } },
        { intervieweeEmail: { startsWith: "evidence_" } },
        { jobId: { in: jobIds } },
      ],
    },
    select: { id: true },
  });
  const interviewIds = evidenceInterviews.map((i) => i.id);

  const feedbackDeleted = await prisma.interviewFeedback.deleteMany({
    where: { interviewId: { in: interviewIds } },
  });
  const interviewsDeleted = await prisma.interview.deleteMany({
    where: { id: { in: interviewIds } },
  });
  const jobsDeleted = await prisma.jobDescription.deleteMany({
    where: { id: { in: jobIds } },
  });
  const interviewersDeleted = await prisma.interviewer.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        { user: { email: { startsWith: "evidence_" } } },
      ],
    },
  });
  const intervieweesDeleted = await prisma.interviewee.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        { user: { email: { startsWith: "evidence_" } } },
      ],
    },
  });
  const companiesDeleted = await prisma.company.deleteMany({
    where: {
      OR: [
        { id: { in: companyIds } },
        { userId: { in: userIds } },
        { email: { startsWith: "evidence_" } },
      ],
    },
  });
  const notificationsDeleted = await prisma.notification.deleteMany({
    where: { userId: { in: userIds } },
  });
  const usersDeleted = await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  console.log(
    JSON.stringify(
      {
        feedbackDeleted: feedbackDeleted.count,
        interviewsDeleted: interviewsDeleted.count,
        jobsDeleted: jobsDeleted.count,
        interviewersDeleted: interviewersDeleted.count,
        intervieweesDeleted: intervieweesDeleted.count,
        companiesDeleted: companiesDeleted.count,
        notificationsDeleted: notificationsDeleted.count,
        usersDeleted: usersDeleted.count,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
