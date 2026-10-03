// /api/admin/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(jobDescription);
  } catch (error) {
    console.error("Error fetching job description:", error);
    return NextResponse.json(
      { error: "Failed to fetch job description" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedJobDescription = await prisma.company.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedJobDescription);
  } catch (error) {
    console.error("Error updating job description:", error);
    return NextResponse.json(
      { error: "Failed to update job description" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.jobDescription.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Job description deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job description:", error);
    return NextResponse.json(
      { error: "Failed to delete job description" },
      { status: 500 }
    );
  }
}
