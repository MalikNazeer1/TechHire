import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: { email: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
  [key: string]: any;
}

interface RequestBody {
  event: CalendarEvent;
  accessToken: string;
}

export async function POST(request: Request) {
  try {
    // Get session from the request
    const token = await getToken({ req: request as any });

    // Parse the request body
    const body: RequestBody = await request.json();
    const { event, accessToken } = body;

    if (!token || !accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Create calendar event using Google Calendar API
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      }
    );

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Calendar API error:", errorData);

      // More detailed error response for debugging
      return NextResponse.json(
        {
          message: "Failed to create calendar event",
          error: errorData.error?.message || "Unknown error",
          code: errorData.error?.code || response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { message: "Failed to create calendar event", error: String(error) },
      { status: 500 }
    );
  }
}
