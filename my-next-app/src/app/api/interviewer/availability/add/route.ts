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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId: user.id },
    });
    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer not found" },
        { status: 404 }
      );
    }

    const currentSlots = (interviewer.availableSlots as any[]) || [];

    // Check if the slot with same date and time already exists
    const duplicateSlot = currentSlots.find(
      (s: any) => s.date === date && s.slot === slot
    );

    if (duplicateSlot) {
      return NextResponse.json(
        { error: "This slot already exists" },
        { status: 400 }
      );
    }

    if (currentSlots.length >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 slots allowed" },
        { status: 400 }
      );
    }

    // Push the new slot
    currentSlots.push({ date, slot, status: "available" });

    await prisma.interviewer.update({
      where: { userId: user.id },
      data: { availableSlots: currentSlots },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
