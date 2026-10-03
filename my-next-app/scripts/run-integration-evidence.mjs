import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const runId = `evidence_${Date.now()}`;

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function callApi(path, method, body) {
  const start = Date.now();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const elapsedMs = Date.now() - start;
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: response.status, body: json, elapsedMs };
}

function makeSlot(index, status = "available") {
  return {
    date: `2030-12-${String(index).padStart(2, "0")}`,
    slot: `${9 + index}:00 - ${10 + index}:00`,
    status,
  };
}

async function main() {
  const results = [];

  const interviewerUser = await prisma.user.create({
    data: {
      id: `${runId}_u_int`,
      email: `${runId}_interviewer@test.local`,
      name: "Interviewer A",
      role: "interviewer",
    },
  });

  const interviewer = await prisma.interviewer.create({
    data: {
      userId: interviewerUser.id,
      description: "Integration test interviewer",
      expertiseArea: "Frontend",
      level: 3,
      availableSlots: [makeSlot(1), makeSlot(2), makeSlot(3), makeSlot(4), makeSlot(5)],
      hourlyRate: 100,
      totalInterviews: 10,
      avgRating: 4.2,
      skills: ["React", "Node.js", "TypeScript"],
      isVerified: true,
    },
  });

  const lowSkillUser = await prisma.user.create({
    data: {
      id: `${runId}_u_low`,
      email: `${runId}_low@test.local`,
      name: "Interviewer Low",
      role: "interviewer",
    },
  });

  await prisma.interviewer.create({
    data: {
      userId: lowSkillUser.id,
      description: "Low matching interviewer",
      expertiseArea: "Backend",
      level: 2,
      availableSlots: [makeSlot(6)],
      hourlyRate: 60,
      totalInterviews: 1,
      avgRating: 3.1,
      skills: ["Python", "Django"],
      isVerified: true,
    },
  });

  const companyUser = await prisma.user.create({
    data: {
      id: `${runId}_u_company`,
      email: `${runId}_company@test.local`,
      name: "Company A",
      role: "company",
    },
  });

  const company = await prisma.company.create({
    data: {
      userId: companyUser.id,
      description: "Integration test company",
      industry: "Software",
      email: companyUser.email,
      companySize: 20,
      name: "TechHire Test Co",
      verified: true,
    },
  });

  // IT-01
  try {
    const res = await callApi("/api/interviewer/availability/add", "POST", {
      email: interviewerUser.email,
      date: "2030-12-15",
      slot: "15:00 - 16:00",
    });
    assertCondition(res.status === 400, `Expected 400, got ${res.status}`);
    assertCondition(
      String(res.body?.error || "").includes("Maximum 5 slots allowed"),
      `Unexpected error: ${JSON.stringify(res.body)}`
    );
    results.push({ id: "IT-01", pass: true, status: res.status, body: res.body });
  } catch (error) {
    results.push({ id: "IT-01", pass: false, error: error.message });
  }

  // IT-02
  await prisma.interviewer.update({
    where: { id: interviewer.id },
    data: { availableSlots: [makeSlot(1)] },
  });
  try {
    const res = await callApi("/api/interviewer/availability/add", "POST", {
      email: interviewerUser.email,
      date: makeSlot(1).date,
      slot: makeSlot(1).slot,
    });
    assertCondition(res.status === 400, `Expected 400, got ${res.status}`);
    assertCondition(
      String(res.body?.error || "").toLowerCase().includes("slot"),
      `Unexpected error: ${JSON.stringify(res.body)}`
    );
    results.push({ id: "IT-02", pass: true, status: res.status, body: res.body });
  } catch (error) {
    results.push({ id: "IT-02", pass: false, error: error.message });
  }

  // IT-03
  try {
    const res = await callApi("/api/interviewer/availability/update", "PATCH", {
      email: interviewerUser.email,
      date: makeSlot(1).date,
      slot: makeSlot(1).slot,
      newStatus: "available",
    });
    assertCondition(res.status === 400, `Expected 400, got ${res.status}`);
    results.push({ id: "IT-03", pass: true, status: res.status, body: res.body });
  } catch (error) {
    results.push({ id: "IT-03", pass: false, error: error.message });
  }

  // IT-04
  try {
    const res = await callApi(
      "/api/admin/interviewers/recommendations",
      "POST",
      { skills: ["React", "Node.js"], experienceLevel: "entry-level" }
    );
    assertCondition(res.status === 200, `Expected 200, got ${res.status}`);
    const recs = res.body?.recommendations || [];
    assertCondition(recs.length > 0, "No recommendations returned");
    const highRec = recs.find((r) => r?.interviewer?.email === interviewerUser.email);
    const lowRec = recs.find((r) => r?.interviewer?.email === lowSkillUser.email);
    assertCondition(highRec && lowRec, "Expected test interviewers not found in recommendations");
    assertCondition(
      (lowRec?.score ?? -1) < (highRec?.score ?? -1),
      "Low-skill interviewer score is not below high-skill interviewer"
    );
    results.push({
      id: "IT-04",
      pass: true,
      status: res.status,
      body: {
        highSkillEmail: highRec?.interviewer?.email,
        lowSkillEmail: lowRec?.interviewer?.email,
        highScore: highRec?.score,
        lowScore: lowRec?.score,
      },
    });
  } catch (error) {
    results.push({ id: "IT-04", pass: false, error: error.message });
  }

  // Setup interview for IT-05
  const scheduleJob = await prisma.jobDescription.create({
    data: {
      companyId: company.id,
      title: "Schedule Test Job",
      description: "Job for scheduling test",
      skills: ["React", "Node.js"],
      questions: ["Q1"],
      experienceLevel: "entry-level",
      candidates: [],
      isActive: true,
    },
  });

  const scheduleInterview = await prisma.interview.create({
    data: {
      jobId: scheduleJob.id,
      interviewerEmail: interviewerUser.email,
      intervieweeEmail: `${runId}_candidate@test.local`,
      scheduledAt: new Date("2030-12-20T10:00:00.000Z"),
      durationInMinutes: 60,
      status: "Pending",
      meetingLink: "pending",
    },
  });

  await prisma.interviewer.update({
    where: { id: interviewer.id },
    data: {
      availableSlots: [{ date: "2030-12-21", slot: "10:00 AM - 11:00 AM", status: "available" }],
    },
  });

  // IT-05
  try {
    const res = await callApi("/api/admin/interviews/schedule", "POST", {
      interviewId: scheduleInterview.id,
      interviewerEmail: interviewerUser.email,
      scheduledAt: "2030-12-21T10:00:00.000Z",
      durationInMinutes: 60,
      selectedDate: "2030-12-21",
      selectedSlot: "10:00 AM - 11:00 AM",
    });
    const updated = await prisma.interview.findUnique({ where: { id: scheduleInterview.id } });
    const intAfter = await prisma.interviewer.findUnique({ where: { id: interviewer.id } });
    const bookedSlot = (intAfter?.availableSlots || []).find(
      (s) => s.date === "2030-12-21" && s.slot === "10:00 AM - 11:00 AM"
    );

    assertCondition(res.status === 200, `Expected 200, got ${res.status}`);
    assertCondition(updated?.status === "SCHEDULED", `Interview status=${updated?.status}`);
    assertCondition(updated?.interviewerEmail === interviewerUser.email, "Wrong interviewer email");
    assertCondition(bookedSlot?.status === "booked", `Slot status=${bookedSlot?.status}`);
    results.push({
      id: "IT-05",
      pass: true,
      status: res.status,
      body: {
        responseSuccess: res.body?.success,
        interviewStatus: updated?.status,
        interviewerEmail: updated?.interviewerEmail,
        slotStatus: bookedSlot?.status,
      },
    });
  } catch (error) {
    results.push({ id: "IT-05", pass: false, error: error.message });
  }

  // IT-06
  const students3 = [
    { name: "Cand 1", phoneNumber: "111", experienceInYears: 1, email: `${runId}_c1@test.local` },
    { name: "Cand 2", phoneNumber: "222", experienceInYears: 2, email: `${runId}_c2@test.local` },
    { name: "Cand 3", phoneNumber: "333", experienceInYears: 3, email: `${runId}_c3@test.local` },
  ];
  let jobForFeedback = null;
  try {
    const res = await callApi("/api/company/jobDescriptions", "POST", {
      companyId: company.id,
      title: "Upload 3 candidates",
      description: "JD for IT-06",
      skills: ["React"],
      questions: ["Q1"],
      experienceLevel: "entry-level",
      students: students3,
      interviewerEmail: interviewerUser.email,
    });
    assertCondition(res.status === 201, `Expected 201, got ${res.status}`);
    assertCondition(res.body?.totalInterviews === 3, `Expected 3, got ${res.body?.totalInterviews}`);
    const statuses = (res.body?.interviews || []).map((i) => i.status);
    assertCondition(
      statuses.every((s) => String(s).toUpperCase() === "PENDING"),
      `Unexpected statuses: ${statuses.join(",")}`
    );
    jobForFeedback = res.body?.job;
    results.push({
      id: "IT-06",
      pass: true,
      status: res.status,
      body: { totalInterviews: res.body?.totalInterviews, statuses },
    });
  } catch (error) {
    results.push({ id: "IT-06", pass: false, error: error.message });
  }

  // IT-07
  try {
    const res = await callApi("/api/company/jobDescriptions", "POST", {
      companyId: company.id,
      title: "Missing Email",
      description: "JD for IT-07",
      skills: ["React"],
      questions: ["Q1"],
      experienceLevel: "entry-level",
      students: [{ name: "No Mail", phoneNumber: "444", experienceInYears: 1 }],
      interviewerEmail: interviewerUser.email,
    });
    const shouldPass = res.status === 400 && String(res.body?.error || "").includes("Required columns missing");
    results.push({
      id: "IT-07",
      pass: shouldPass,
      status: res.status,
      body: res.body,
      note: shouldPass ? "matched expected behavior" : "actual behavior differs from expected spec",
    });
  } catch (error) {
    results.push({ id: "IT-07", pass: false, error: error.message });
  }

  // IT-08
  try {
    const candidateInterview = await prisma.interview.findFirst({
      where: { jobId: jobForFeedback?.id, intervieweeEmail: `${runId}_c1@test.local` },
    });
    assertCondition(candidateInterview, "No candidate interview found for IT-08");

    const payload = {
      interviewId: String(candidateInterview.id),
      candidateInfo: {
        name: "Cand 1",
        position: "Frontend Engineer",
        interviewerCredentials: "Senior Engineer",
        interviewDate: "2030-12-22",
        totalTimeSpent: "60 min",
        roundName: "Technical Round",
        interviewerDecision: "YES",
      },
      ratings: { javascript: 8, react: 7, communication: 7 },
      questionsAsked: [
        { section: "Intro", questions: ["Hello"] },
        { section: "React", questions: ["What is useEffect?"] },
      ],
      evaluations: [
        {
          section: "JavaScript",
          rating: "Core JS (8/10)",
          strengths: ["Good basics"],
          areasOfImprovement: ["Edge cases"],
        },
      ],
    };

    const res = await callApi("/api/interviews/feedback", "POST", payload);
    const updated = await prisma.interview.findUnique({ where: { id: candidateInterview.id } });
    assertCondition(res.status === 200, `Expected 200, got ${res.status}`);
    assertCondition(
      String(updated?.status || "").toUpperCase() === "COMPLETED",
      `Expected COMPLETED, got ${updated?.status}`
    );
    results.push({
      id: "IT-08",
      pass: true,
      status: res.status,
      body: { feedbackId: res.body?.id, interviewStatus: updated?.status },
    });
  } catch (error) {
    results.push({ id: "IT-08", pass: false, error: error.message });
  }

  // IT-09
  try {
    const res = await callApi("/api/execute", "POST", {
      language: "javascript",
      code: 'console.log("hello")',
    });
    const ok =
      res.status === 200 &&
      String(res.body?.output || "").includes("hello") &&
      res.elapsedMs <= 10000;
    results.push({
      id: "IT-09",
      pass: ok,
      status: res.status,
      elapsedMs: res.elapsedMs,
      body: res.body,
      note: ok
        ? "output contains hello and completed within 10 seconds"
        : "executor output/timing differs from expected",
    });
  } catch (error) {
    results.push({ id: "IT-09", pass: false, error: error.message });
  }

  // IT-10
  const noProfileUser = await prisma.user.create({
    data: {
      id: `${runId}_u_noprofile`,
      email: `${runId}_noprofile@test.local`,
      name: "No Profile User",
      role: null,
    },
  });
  try {
    const res = await callApi(
      `/api/auth/check-profile?email=${encodeURIComponent(noProfileUser.email)}`,
      "GET"
    );
    assertCondition(res.status === 200, `Expected 200, got ${res.status}`);
    assertCondition(res.body?.hasProfile === false, `Expected hasProfile false, got ${res.body?.hasProfile}`);
    results.push({ id: "IT-10", pass: true, status: res.status, body: res.body });
  } catch (error) {
    results.push({ id: "IT-10", pass: false, error: error.message });
  }

  console.log("Integration Evidence Run:", runId);
  console.log("Base URL:", BASE_URL);
  console.log("=".repeat(80));
  for (const row of results) {
    const mark = row.pass ? "PASS" : "FAIL";
    console.log(`${row.id} | ${mark}`);
    if (row.status !== undefined) console.log(`status=${row.status}`);
    if (row.elapsedMs !== undefined) console.log(`elapsedMs=${row.elapsedMs}`);
    if (row.body !== undefined) console.log(`body=${JSON.stringify(row.body)}`);
    if (row.note) console.log(`note=${row.note}`);
    if (row.error) console.log(`error=${row.error}`);
    console.log("-".repeat(80));
  }

  const passCount = results.filter((r) => r.pass).length;
  console.log(`TOTAL: ${passCount}/${results.length} passing`);
}

main()
  .catch((error) => {
    console.error("Runner crashed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
