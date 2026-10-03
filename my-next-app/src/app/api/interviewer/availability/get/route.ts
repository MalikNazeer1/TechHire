import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId: user.id },
    });
    if (!interviewer)
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 }
      );

    return NextResponse.json(interviewer.availableSlots || []);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
