import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * API endpoint to update an interviewer's status
 */
export async function PUT(request: NextRequest) {
  try {
    const { interviewerId, status, notes } = await request.json();

    if (!interviewerId) {
      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 }
      );
    }

    // Status should be a boolean (true for approved, false for rejected)
    if (typeof status !== "boolean") {
      return NextResponse.json(
        { error: "Status must be a boolean value" },
        { status: 400 }
      );
    }

    // Update the interviewer status
    const updatedInterviewer = await prisma.interviewer.update({
      where: {
        id: interviewerId,
      },
      data: {
        isVerified: status,
      } as any,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create a notification for the interviewer
    await prisma.notification.create({
      data: {
        userId: updatedInterviewer.user.id,
        type: status ? "INTERVIEWER_APPROVED" : "INTERVIEWER_REJECTED",
        message: status
          ? "Your interviewer application has been approved! You can now start conducting interviews."
          : `Your interviewer application has been rejected.${
              notes ? ` Reason: ${notes}` : ""
            }`,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      interviewer: {
        id: updatedInterviewer.id,
        name: updatedInterviewer.user.name,
        email: updatedInterviewer.user.email,
        status: (updatedInterviewer as any).isVerified ? "Approved" : "Rejected",
      },
    });
  } catch (error) {
    console.error("Error updating interviewer status:", error);
    return NextResponse.json(
      { error: "Failed to update interviewer status" },
      { status: 500 }
    );
  }
} 