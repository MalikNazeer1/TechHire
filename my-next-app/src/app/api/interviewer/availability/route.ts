// app/api/interviewer/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseISO } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    // Step 1: Get the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 2: Get the Interviewer profile using userId
    const interviewer = await prisma.interviewer.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        availableSlots: true,
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer profile not found" },
        { status: 404 }
      );
    }

    // Step 3: Get Interviews associated with this Interviewer
    const interviews = await prisma.interview.findMany({
      where: {
        interviewerEmail: user.email,
      },
      select: {
        id: true,
        scheduledAt: true,
        status: true,
      },
    });

    return NextResponse.json(interviewer.availableSlots || [], {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    const { slot } = await req.json();

    if (!slot) {
      return NextResponse.json({ error: "Slot is required" }, { status: 400 });
    }

    const slotDate = parseISO(slot);

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 2: Find the interviewer using userId
    const interviewer = await prisma.interviewer.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        availableSlots: true,
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer profile not found" },
        { status: 404 }
      );
    }

    // Step 3: Check if the interviewer already has 5 slots
    if (interviewer.availableSlots.length >= 5) {
      return NextResponse.json(
        { error: "Maximum number of slots (5) reached" },
        { status: 400 }
      );
    }

    // Step 4: Update availableSlots
    const updatedInterviewer = await prisma.interviewer.update({
      where: { id: interviewer.id },
      data: {
        availableSlots: {
          push: slotDate.toISOString(),
        },
      },
    });

    return NextResponse.json(updatedInterviewer.availableSlots, {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding availability slot:", error);
    return NextResponse.json(
      { error: "Failed to add availability slot" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Interviewer email is required" },
        { status: 400 }
      );
    }

    const { slot } = await req.json();

    if (!slot) {
      return NextResponse.json({ error: "Slot is required" }, { status: 400 });
    }

    const slotToDelete = parseISO(slot);

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 2: Find the interviewer by userId
    const interviewer = await prisma.interviewer.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        availableSlots: true,
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: "Interviewer profile not found" },
        { status: 404 }
      );
    }

    // Step 3: Check if the slot is already booked in an interview
    const interview = await prisma.interview.findFirst({
      where: {
        interviewerEmail: user.email,
        scheduledAt: slotToDelete,
      },
    });

    if (interview) {
      return NextResponse.json(
        { error: "Cannot delete a booked slot" },
        { status: 400 }
      );
    }

    // Step 4: Filter out the slot to delete
    const updatedSlots = interviewer.availableSlots.filter(
      (existingSlot) =>
        new Date(existingSlot).getTime() !== slotToDelete.getTime()
    );

    // Step 5: Update the interviewer's availableSlots
    const updatedInterviewer = await prisma.interviewer.update({
      where: { id: interviewer.id },
      data: {
        availableSlots: updatedSlots,
      },
    });

    return NextResponse.json(updatedInterviewer.availableSlots, {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting availability slot:", error);
    return NextResponse.json(
      { error: "Failed to delete availability slot" },
      { status: 500 }
    );
  }
}
