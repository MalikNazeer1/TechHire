import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate a random meeting link
function generateMeetingLink() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let result = "meet.google.com/";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to validate student data
function validateStudent(student) {
  return (
    student.name &&
    student.phoneNumber &&
    student.experienceInYears &&
    student.email // Adding email validation
  );
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      companyId,
      title,
      description,
      skills,
      questions,
      experienceLevel,
      students, // Array of student objects
      interviewerEmail, // Email of the interviewer
    } = body;

    // Validate required fields for job description
    if (!companyId || !title || !description || !skills || !experienceLevel) {
      return NextResponse.json(
        { error: "Missing required fields for job description" },
        { status: 400 }
      );
    }

    // Validate students array
    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "Students array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Enforce required candidate columns upfront (integration spec IT-07).
    const requiredCandidateFields = ["name", "phoneNumber", "experienceInYears", "email"];
    const hasMissingRequiredColumns = students.some((student) =>
      requiredCandidateFields.some((field) => {
        const value = student?.[field];
        return value === undefined || value === null || value === "";
      })
    );
    if (hasMissingRequiredColumns) {
      return NextResponse.json(
        { error: "Required columns missing" },
        { status: 400 }
      );
    }

    // Validate interviewer email
    if (!interviewerEmail) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    // Create job description with students data
    const newJob = await prisma.jobDescription.create({
      data: {
        companyId,
        title,
        description,
        skills,
        questions,
        experienceLevel,
        isActive: true,
        candidates: students, // Store students array as JSON
      },
    });

    // Create interviews for each student
    const interviewPromises = students.map(async (student) => {
      // Validate student data
      if (!validateStudent(student)) {
        console.warn(`Invalid student data for: ${student.name}`);
        return null;
      }

      try {
        return await prisma.interview.create({
          data: {
            jobId: newJob.id,
            interviewerEmail: interviewerEmail,
            intervieweeEmail: student.email,
            scheduledAt:
              student.availability ||
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now if no availability
            durationInMinutes: 60, // Default duration
            status: "Pending",
            meetingLink: generateMeetingLink(),
          },
        });
      } catch (error) {
        console.error(
          `Failed to create interview for student: ${student.email}`,
          error
        );
        return null;
      }
    });

    // Wait for all interviews to be created
    const createdInterviews = await Promise.all(interviewPromises);

    // Filter out null values (failed interview creations)
    const successfulInterviews = createdInterviews.filter(
      (interview) => interview !== null
    );

    return NextResponse.json(
      {
        message: "Job description and interviews created successfully",
        job: newJob,
        interviews: successfulInterviews,
        totalInterviews: successfulInterviews.length,
        failedInterviews:
          createdInterviews.length - successfulInterviews.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in job description API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Parse the ID to integer as required by Prisma
      const jobDescId = parseInt(id, 10);

      // Fetch a specific job description
      const jobDescription = await prisma.jobDescription.findUnique({
        where: { id: jobDescId },
      });

      if (!jobDescription) {
        return NextResponse.json(
          { error: "Job description not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(jobDescription);
    } else {
      // Fetch all job descriptions
      const jobDescriptions = await prisma.jobDescription.findMany();
      return NextResponse.json(jobDescriptions);
    }
  } catch (error) {
    console.error("Error fetching job description:", error);
    return NextResponse.json(
      { error: "Failed to fetch job description" },
      { status: 500 }
    );
  }
}
