import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // First find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        interviewee: true,
        interviewer: true,
      },
    });

    if (!user) {
      return NextResponse.json({ hasProfile: false });
    }
    // Check if user has any role profile
    const hasProfile = !!(user.company || user.interviewee || user.interviewer);
    return NextResponse.json({
      hasProfile,
      role: user.role,
      userRoleId:
        user.company?.id || user.interviewee?.id || user.interviewer?.id,
    });
  } catch (error) {
    console.error("Error checking user profile:", error);
    return NextResponse.json(
      { error: "Failed to check user profile" },
      { status: 500 }
    );
  }
}
