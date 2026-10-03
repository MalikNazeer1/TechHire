import { NextResponse, NextRequest } from "next/server";
// import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
// import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // // Get the authenticated user's session
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // if (!user || !user.interviewer) {
    //   return NextResponse.json(
    //     { error: "User is not an interviewer" },
    //     { status: 403 }
    //   );
    // }

    // Get all scheduled interviews for this interviewer
    const interviews = await prisma.interview.findMany({
      where: {
        interviewerEmail: user.email,
        status: "SCHEDULED",
        scheduledAt: {
          gte: new Date(), // Only future interviews
        },
      },
      include: {
        jobDescription: {
          include: {
            company: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: "asc", // Sort by date ascending (soonest first)
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
