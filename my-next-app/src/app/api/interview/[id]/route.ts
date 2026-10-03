// No auth check here — just return full interview detail
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const interviewId = Number(params.id);

  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        jobDescription: true,
        codeSubmissions: true,
        aiEvaluations: true,
        feedbacks: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    console.log("interview is : ", interview);

    return NextResponse.json(interview, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
