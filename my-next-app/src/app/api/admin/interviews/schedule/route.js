// File: /app/api/admin/interviews/schedule/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
    const {
      interviewId,
      interviewerEmail,
      scheduledAt,
      durationInMinutes = 60,
      selectedDate, // The date string for finding the slot
      selectedSlot, // The slot string for finding the slot (e.g., "10:00 AM - 11:00 AM")
    } = await request.json();

    // Validate required fields
    if (!interviewId || !interviewerEmail || !scheduledAt) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: interviewId, interviewerEmail, scheduledAt",
        },
        { status: 400 }
      );
    }

    // Parse the scheduledAt string to a Date object
    const scheduledDateTime = new Date(scheduledAt);

    // Update the interview in the database
    const updatedInterview = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        interviewerEmail: interviewerEmail,
        scheduledAt: scheduledDateTime,
        status: "SCHEDULED",
        durationInMinutes: durationInMinutes,
      },
    });

    // Generate a meeting link (this is a placeholder - you might want to integrate with a calendar API)
    const meetingLink = `https://meet.yourdomain.com/${updatedInterview.id}`;

    // Update the interview with the meeting link
    const finalInterview = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        meetingLink: meetingLink,
      },
    });

    // Find the interviewer by email to update their available slots
    const user = await prisma.user.findUnique({
      where: { email: interviewerEmail },
      include: { interviewer: true },
    });
    console.log;
    if (user?.interviewer) {
      // Get current slots from the interviewer
      const interviewer = user.interviewer;
      const availableSlots = interviewer.availableSlots || [];

      // Find the slot that matches the date, time selected, and has status "available"
      const slotIndex = availableSlots.findIndex(
        (s) =>
          s.date === selectedDate &&
          s.slot === selectedSlot &&
          s.status === "available"
      );
      console.log("available slots:", availableSlots);
      console.log("slot selected:", selectedSlot);
      console.log(selectedDate);
      if (slotIndex !== -1) {
        // Update the slot status to "booked" instead of removing it
        availableSlots[slotIndex].status = "booked";

        // Update the interviewer's available slots
        await prisma.interviewer.update({
          where: { id: interviewer.id },
          data: {
            availableSlots: availableSlots,
          },
        });
      } else {
        console.warn(
          `Slot not found or already booked: date=${selectedDate}, slot=${selectedSlot}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Interview scheduled successfully",
      interview: finalInterview,
    });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    return NextResponse.json(
      { error: "Failed to schedule interview", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
