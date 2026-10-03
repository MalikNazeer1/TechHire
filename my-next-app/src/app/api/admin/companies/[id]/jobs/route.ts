// /api/admin/companies/[id]/jobs/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);

    const jobDescriptions = await prisma.jobDescription.findMany({
      where: {
        companyId,
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    return NextResponse.json(jobDescriptions);
  } catch (error) {
    console.error("Error fetching job descriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch job descriptions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    const body = await request.json();

    const jobDescription = await prisma.jobDescription.create({
      data: {
        title: body.title,
        experienceLevel: body.experienceLevel,
        skills: body.skills,
        description: body.description || "",
        questions: body.questions || [],
        candidates: body.candidates || [],
        isActive: body.isActive ?? true,
        postedAt: body.postedAt || new Date().toISOString(),
        companyId: companyId,
      },
    });

    return NextResponse.json(jobDescription, { status: 201 });
  } catch (error) {
    console.error("Error creating job description:", error);
    return NextResponse.json(
      { error: "Failed to create job description" },
      { status: 500 }
    );
  }
}
