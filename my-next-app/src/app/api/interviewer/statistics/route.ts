import { NextResponse, NextRequest } from "next/server";
// import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
// import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user's session
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    // Get the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // // Now fetch the interviewer using userId
    // const interviewer = await prisma.interviewer.findUnique({
    //   where: { userId: user.id },
    // });

    // if (!interviewer) {
    //   return NextResponse.json(
    //     { error: "User is not an interviewer" },
    //     { status: 403 }
    //   );
    // }

    // Get the current year
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year

    // Get interviews conducted by this interviewer in the current year
    const interviews = await prisma.interview.findMany({
      where: {
        interviewerEmail: user.email,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
      select: {
        scheduledAt: true,
      },
    });

    // Define all months
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Count interviews by month
    const interviewsByMonth = interviews.reduce(
      (acc: Record<string, number>, interview) => {
        const month = months[interview.scheduledAt.getMonth()];
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {}
    );

    // Format data for the frontend
    const statistics = months.map((month) => ({
      month,
      count: interviewsByMonth[month] || 0,
    }));

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching interview statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
