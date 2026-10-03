"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

// Mock data for available slots - in real app, fetch from API
const AVAILABLE_SLOTS = {
  "2024-12-20": ["09:00", "10:00", "14:00"],
  "2024-12-21": ["11:00", "13:00", "15:00"],
  "2024-12-22": ["09:00", "10:00", "11:00"],
};

// Mock data for interviewers - in real app, fetch from API

export default function ScheduleInterview({ isOpen, onClose }) {
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const { data: session, status } = useSession(); // Get NextAuth session

  if (status !== "loading") {
    console.log("Session Data:", session);
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      summary: "interview",
      description: "TechHire Interview",
      start: {
        dateTime: `${
          selectedDate.toISOString().split("T")[0]
        }T${selectedTime}:00`,
        timeZone: "Asia/Karachi",
      },
      end: {
        dateTime: `${
          selectedDate.toISOString().split("T")[0]
        }T${selectedTime}:00`,
        timeZone: "Asia/Karachi",
      },
    };

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.accessToken, // Access token for google
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        // Close the modal after success
        onClose();
        toast({
          title: "Success",
          description: "Event created! Check your Google Calendar.",
          status: "success",
        });
        return data.json();
      })
      .then((data) => {
        console.log(data);
      });
  }
  // Reset state when modal closes

  // Update available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setAvailableTimeSlots(AVAILABLE_SLOTS[dateStr] || []);

      if (selectedTime && !AVAILABLE_SLOTS[dateStr]?.includes(selectedTime)) {
        setSelectedTime("");
      }
    }
  }, [selectedDate]);

  // Function to disable dates that have no available slots
  const disabledDates = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return !AVAILABLE_SLOTS[dateStr];
  };

  return (
    <Modal
      title="Schedule an Interview"
      description="Select available time slot, interviewer, and candidate."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className=" p-3 flex justify-center items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDates}
            className="rounded-md border "
            initialFocus
          />
        </div>

        <Select
          value={selectedTime}
          onValueChange={setSelectedTime}
          disabled={!selectedDate}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select candidate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="candidate1">Bob Williams</SelectItem>
            <SelectItem value="candidate2">Carol Brown</SelectItem>
            <SelectItem value="candidate3">David Lee</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => createCalendarEvent()}
          className="w-full"
          disabled={!selectedDate || !selectedTime || !selectedCandidate}
        >
          Schedule Interview
        </Button>
      </div>
    </Modal>
  );
}
