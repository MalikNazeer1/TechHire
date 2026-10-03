import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { date, slot, email } = await req.json();

    if (!email || !date || !slot) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

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

    const updatedSlots = ((interviewer.availableSlots as any[]) || []).filter(
      (s) => !(s.date === date && s.slot === slot)
    );

    await prisma.interviewer.update({
      where: { userId: user.id },
      data: { availableSlots: updatedSlots },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
