"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react"; // Import for authentication
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Building,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Pending Interviews", link: "/admin/pending" },
];

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  company: string;
  uploadDate: string;
  skills: string[];
  experienceLevel: string;
  intervieweeEmail?: string;
  jobId?: number;
}

interface Interviewer {
  id: number;
  name: string;
  email: string;
  skills: string[];
  isActive: boolean;
  availableSlots: {
    date: string;
    slot: string;
    status: string;
  }[];
}

interface AvailableSlot {
  date: string;
  slot: string;
  interviewerId: number;
  interviewerEmail: string;
  interviewerName: string;
  interviewerLevel: number;
  isRecommended: boolean;
  recommendationScore: number;
  matchReasons: string[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const getSlotValue = (slot: AvailableSlot) =>
  `${slot.interviewerId}__${slot.date}__${slot.slot}`;

export default function PendingInterviews() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession(); // Get authentication session
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [pendingInterviews, setPendingInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedulingInProgress, setSchedulingInProgress] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Calendar and scheduling states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const fetchInterviews = async (page = 1) => {
    try {
      setLoading(true);
      const interviewsResponse = await fetch(
        `/api/admin/interviews/pending?page=${page}&limit=${pagination.limit}`
      );
      if (!interviewsResponse.ok) {
        throw new Error("Failed to fetch pending interviews");
      }
      const interviewsData = await interviewsResponse.json();

      // API already returns the shape we need; keep defaults for resilience.
      const formattedInterviews = (interviewsData.interviews || []).map(
        (interview: any) => ({
          id: interview.id,
          jobId: interview.jobId || interview.id,
          candidateName:
            interview.candidateName ||
            interview.intervieweeEmail?.split("@")[0] ||
            "Unknown Candidate",
          intervieweeEmail: interview.intervieweeEmail,
          position: interview.position || "Unknown Position",
          company: interview.company || "Unknown Company",
          uploadDate: interview.uploadDate || "",
          skills: interview.skills || [],
          experienceLevel: interview.experienceLevel || "Unknown",
        })
      );

      setPendingInterviews(formattedInterviews);
      setPagination(
        interviewsData.pagination || {
          total: formattedInterviews.length,
          page,
          limit: pagination.limit,
          totalPages: 1,
        }
      );
      setError(null);
    } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interviews. Please try again later.");
        toast({
          title: "Failed to load interviews",
          description: "Please try again later",
          variant: "destructive",
        });

        // Use mock data for interviews
        setPendingInterviews([
          {
            id: 1,
            candidateName: "Jane Doe",
            intervieweeEmail: "jane@example.com",
            position: "Frontend Developer",
            company: "TechCorp",
            experienceLevel: "Senior",
            uploadDate: "2023-04-15",
            skills: ["React", "TypeScript", "CSS"],
          },
          {
            id: 2,
            candidateName: "John Smith",
            intervieweeEmail: "john@example.com",
            position: "Backend Developer",
            company: "DataSys Inc.",
            experienceLevel: "Senior",
            uploadDate: "2023-04-16",
            skills: ["Node.js", "Express", "MongoDB"],
          },
        ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews(1);
  }, [toast]);

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || loading) return;
    await fetchInterviews(nextPage);
  };

  // Fetch available slots when the schedule button is clicked
  const fetchAvailableSlots = async () => {
    try {
      setFetchingSlots(true);
  
      // Clear previous selections
      setSelectedDate(undefined);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setAvailableDates([]);
  
      // First, get recommendations for the selected interview
      const recommendationsResponse = await fetch(
        "/api/admin/interviewers/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: selectedInterview?.skills || [],
            experienceLevel: selectedInterview?.experienceLevel || "Entry Level",
          }),
        }
      );
  
      if (!recommendationsResponse.ok) {
        throw new Error("Failed to fetch recommendations");
      }
  
      const recommendationsData = await recommendationsResponse.json();
      const recommendedInterviewers = new Set(
        recommendationsData.recommendations
          .slice(0, 3) // Top 3 recommendations
          .map((rec: any) => rec.interviewer.id)
      );
  
      // Then fetch all available slots
      const interviewersResponse = await fetch(
        "/api/admin/interviewers/availability"
      );
      if (!interviewersResponse.ok) {
        throw new Error("Failed to fetch interviewers");
      }
  
      const interviewersData = await interviewersResponse.json();
      
      // Process available slots with recommendations
      const allSlots: AvailableSlot[] = [];
      const datesSet = new Set<string>();
  
      interviewersData.forEach((interviewer: any) => {
        interviewer.availableSlots.forEach((slot: any) => {
          if (slot.status === "available") {
            datesSet.add(slot.date);
            allSlots.push({
              date: slot.date,
              slot: slot.slot,
              interviewerId: interviewer.id,
              interviewerEmail: interviewer.email,
              interviewerName: interviewer.name,
              interviewerLevel: interviewer.level,
              isRecommended: recommendedInterviewers.has(interviewer.id),
              recommendationScore: recommendationsData.recommendations.find(
                (rec: any) => rec.interviewer.id === interviewer.id
              )?.score || 0,
              matchReasons: recommendationsData.recommendations.find(
                (rec: any) => rec.interviewer.id === interviewer.id
              )?.matchReason || [],
            });
          }
        });
      });
  
      setAvailableSlots(allSlots);
      setAvailableDates(Array.from(datesSet));
  
      if (allSlots.length === 0) {
        toast({
          title: "No Available Slots",
          description: "No interviewers have available slots at this time.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Error fetching available slots:", err);
      toast({
        title: "Failed to load availability",
        description: "Could not fetch available interview slots.",
        variant: "destructive",
      });
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleSchedule = async (interview: Interview) => {
    setSelectedInterview(interview);
    setIsScheduleModalOpen(true);
    await fetchAvailableSlots();
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedInterview(null);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setAvailableDates([]);
  };

  // Function to disable dates that have no available slots
  const disabledDates = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return !availableDates.includes(dateStr);
  };

  // Get available slots for the selected date
  const getSlotsForDate = (date: Date | undefined) => {
    if (!date) return [];

    const dateStr = date.toISOString().split("T")[0];
    return availableSlots.filter((slot) => slot.date === dateStr);
  };

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // Parse slot string to DateTime
  const parseSlotToDateTime = (dateStr: string, slotStr: string) => {
    // Extract the start time from the slot (e.g., "04:00 PM - 05:00 PM" → "04:00 PM")
    const startTimeStr = slotStr.split(" - ")[0];

    // Parse time components
    const [timeStr, period] = startTimeStr.split(" ");
    let [hours, minutes] = timeStr.split(":").map((num) => parseInt(num));

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    // Create datetime
    const dateTime = new Date(
      `${dateStr}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`
    );
    return dateTime;
  };

  /**
   * Best-effort Google Calendar event. Requires a fresh Google OAuth access token on the session;
   * many admin sessions (expired token, non-Google sign-in) will skip without affecting scheduling.
   */
  const createCalendarEvent = async (
    startDateTime: Date,
    endDateTime: Date,
    interviewData: {
      position: string;
      candidateName: string;
      intervieweeEmail: string;
      interviewerName: string;
      interviewerEmail: string;
    }
  ): Promise<boolean> => {
    try {
      if (!session?.accessToken) {
        console.warn(
          "Skipping Google Calendar: no accessToken on session (sign in with Google + Calendar scope, or token expired)."
        );
        return false;
      }

      console.log("Creating calendar event");
      const event = {
        summary: `TechHire Interview: ${interviewData.position} - ${interviewData.candidateName}`,
        description: `TechHire Interview for ${interviewData.position} position with ${interviewData.candidateName}. 
        
Interviewer: ${interviewData.interviewerName}
Candidate: ${interviewData.candidateName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Asia/Karachi",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Asia/Karachi",
        },
        attendees: [
          { email: interviewData.intervieweeEmail },
          { email: interviewData.interviewerEmail },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 30 },
          ],
        },
        sendUpdates: "all", // Send notifications to attendees
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.accessToken,
          },
          body: JSON.stringify(event), // keep this the same
        }
      );

      console.log("Calendar event response:", response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(
          "Google Calendar API error:",
          errorData?.error?.message || response.status
        );
        return false;
      }

      const data = await response.json();
      console.log("Calendar event created:", data);
      return true;
    } catch (error) {
      console.warn("Error creating calendar event:", error);
      return false;
    }
  };

  const handleSubmitSchedule = async () => {
    if (!selectedInterview || !selectedSlot) return;

    try {
      setSchedulingInProgress(true);

      // Calculate start and end times
      const slotTimeParts = selectedSlot.slot.split(" - ");
      const startTime = parseSlotToDateTime(
        selectedSlot.date,
        selectedSlot.slot
      );

      // Calculate end time (1 hour later)
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      // Prepare scheduling data according to API requirements
      const scheduleData = {
        interviewId: selectedInterview.id,
        interviewerEmail: selectedSlot.interviewerEmail,
        scheduledAt: startTime.toISOString(),
        durationInMinutes: 60, // Default 1 hour interview
        selectedDate: selectedSlot.date,
        selectedSlot: selectedSlot.slot,
      };

      console.log("Scheduling interview with data:", scheduleData);

      // Call API to schedule the interview
      const response = await fetch("/api/admin/interviews/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to schedule interview");
      }

      // Remove the scheduled interview from the list and close UI immediately after DB success
      setPendingInterviews((prev) =>
        prev.filter((interview) => interview.id !== selectedInterview.id)
      );
      closeScheduleModal();

      // Optional: Google Calendar (must not fail the flow — token often missing/expired)
      const calendarSynced = await createCalendarEvent(startTime, endTime, {
        position: selectedInterview.position,
        candidateName: selectedInterview.candidateName,
        intervieweeEmail: selectedInterview.intervieweeEmail || "",
        interviewerName: selectedSlot.interviewerName,
        interviewerEmail: selectedSlot.interviewerEmail,
      });

      toast({
        title: "Interview Scheduled",
        description: calendarSynced
          ? `Successfully scheduled for ${selectedInterview.candidateName} on ${selectedSlot.date} at ${selectedSlot.slot}. A Google Calendar invite was created when possible.`
          : `Successfully scheduled for ${selectedInterview.candidateName} on ${selectedSlot.date} at ${selectedSlot.slot}. No Google Calendar event was added (sign in with Google with Calendar access, or add the meeting manually).`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error scheduling interview:", err);
      toast({
        title: "Failed to Schedule Interview",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred while scheduling the interview",
        variant: "destructive",
      });
    } finally {
      setSchedulingInProgress(false);
    }
  };

  return (
    <PageContainer scrollable={false}>
      <div className="space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center">
          <Breadcrumbs items={breadcrumbItems} />
          <Button 
            onClick={() => router.push("/admin")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Pending Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingInterviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <CalendarIcon className="w-full h-full" />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No pending interviews found
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Experience Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInterviews.map((interview) => (
                      <TableRow key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          {interview.candidateName}
                        </TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>{interview.company}</TableCell>
                        <TableCell>{interview.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {interview.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            {interview.experienceLevel}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleSchedule(interview)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Schedule
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total} interviews
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                        className="h-8 px-3"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        Page {pagination.page} of {pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages || loading}
                        className="h-8 px-3"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interview Scheduling Modal */}
      {selectedInterview && (
        <Modal
          title="Schedule Interview"
          description={`Schedule interview for ${selectedInterview.candidateName} - ${selectedInterview.position}`}
          isOpen={isScheduleModalOpen}
          onClose={closeScheduleModal}
        >
          <div className="space-y-6">
            {fetchingSlots ? (
              <div className="flex justify-center items-center p-10">
                <div className="space-y-4 w-full">
                  <div className="h-8 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded-md mx-auto" />
                  <div className="h-8 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded-md mx-auto" />
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 flex justify-center items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDates}
                    className="rounded-md border shadow-sm"
                    initialFocus
                  />
                </div>

                {selectedDate && (
                  <Select
                    value={selectedSlot ? getSlotValue(selectedSlot) : ""}
                    onValueChange={(value) => {
                      const matchedSlot =
                        availableSlots.find((slot) => getSlotValue(slot) === value) ||
                        null;
                      setSelectedSlot(matchedSlot);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select available slot" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {getSlotsForDate(selectedDate).map((slot, index) => (
                        <SelectItem key={index} value={getSlotValue(slot)}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{slot.slot}</span>
                            <span className="text-xs text-gray-500">
                              {slot.interviewerName} (Level {slot.interviewerLevel})
                            </span>
                            {slot.isRecommended && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                Recommended
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex flex-col gap-2">
                  {selectedDate && getSlotsForDate(selectedDate).length === 0 && (
                    <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        No available slots for the selected date.
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Please select a different date.
                      </p>
                    </div>
                  )}

                  {!selectedDate && availableDates.length > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Select a date to see available slots.
                    </div>
                  )}

                  {availableDates.length === 0 && (
                    <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        No available slots found.
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        No interviewers have slots available at this time.
                      </p>
                    </div>
                  )}

                  {selectedSlot && (
                    <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900/20">
                      <p className="font-medium text-blue-900 dark:text-blue-100">Selected slot details:</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{selectedSlot.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                          <Clock className="w-4 h-4" />
                          <span>{selectedSlot.slot}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                          <User className="w-4 h-4" />
                          <span>{selectedSlot.interviewerName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                          <Briefcase className="w-4 h-4" />
                          <span>Level {selectedSlot.interviewerLevel}</span>
                        </div>
                        {selectedSlot.isRecommended && (
                          <div className="pt-1">
                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Match Score: {Math.round(selectedSlot.recommendationScore)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmitSchedule}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!selectedSlot || schedulingInProgress}
                >
                  {schedulingInProgress ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </div>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
