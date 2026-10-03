import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { date, slot, email, newStatus } = await req.json();

    if (!email || !date || !slot || !newStatus) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (newStatus !== "available" && newStatus !== "booked") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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

    const currentSlots = (interviewer.availableSlots as any[]) || [];

    const slotIndex = currentSlots.findIndex(
      (s) => s.date === date && s.slot === slot
    );

    if (slotIndex === -1) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const currentStatus = currentSlots[slotIndex].status;

    if (currentStatus === newStatus) {
      return NextResponse.json(
        { error: `Slot is already ${currentStatus}` },
        { status: 400 }
      );
    }

    if (
      !(
        (currentStatus === "available" && newStatus === "booked") ||
        (currentStatus === "booked" && newStatus === "available")
      )
    ) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }

    currentSlots[slotIndex].status = newStatus;

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
