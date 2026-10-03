// File: app/api/company/candidates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const skip = (page - 1) * limit;

    if (!email) {
      return NextResponse.json(
        { error: "Company email is required" },
        { status: 400 }
      );
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
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const companyId = company.id;

    // Find all job descriptions for this company
    const jobDescriptions = await prisma.jobDescription.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        title: true,
        candidates: true,
      },
    });

    // Calculate total candidates
    let totalCandidates = 0;
    const candidatesByJob = {};

    jobDescriptions.forEach((job) => {
      const candidatesArray = job.candidates as any[];
      if (Array.isArray(candidatesArray)) {
        totalCandidates += candidatesArray.length;
        candidatesByJob[job.id] = {
          jobTitle: job.title,
          candidatesCount: candidatesArray.length,
          candidates: candidatesArray,
        };
      }
    });

    // Paginate candidates
    let allCandidates = [];

    // Flatten candidates from all jobs
    for (const jobId in candidatesByJob) {
      const jobCandidates = candidatesByJob[jobId].candidates.map(
        (candidate) => ({
          ...candidate,
          jobId: parseInt(jobId),
          jobTitle: candidatesByJob[jobId].jobTitle,
        })
      );
      allCandidates = [...allCandidates, ...jobCandidates];
    }

    // Sort candidates by application date if available
    allCandidates.sort((a, b) => {
      const dateA = a.applicationDate
        ? new Date(a.applicationDate)
        : new Date(0);
      const dateB = b.applicationDate
        ? new Date(b.applicationDate)
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedCandidates = allCandidates.slice(skip, skip + limit);

    return NextResponse.json({
      totalCandidates,
      candidates: paginatedCandidates,
      pagination: {
        total: totalCandidates,
        page,
        limit,
        totalPages: Math.ceil(totalCandidates / limit),
      },
      candidatesByJob: Object.values(candidatesByJob).map((job) => ({
        jobTitle: job.jobTitle,
        candidatesCount: job.candidatesCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
