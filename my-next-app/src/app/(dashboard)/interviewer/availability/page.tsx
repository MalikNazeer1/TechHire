"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { format, parseISO, isToday, set, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2Icon } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slot {
  date: string;
  slot: string;
  status: string;
}

// Full list of slot options
const ALL_SLOT_OPTIONS = [
  { time: "10:00 AM - 11:00 AM", startHour: 10 },
  { time: "11:00 AM - 12:00 PM", startHour: 11 },
  { time: "12:00 PM - 01:00 PM", startHour: 12 },
  { time: "01:00 PM - 02:00 PM", startHour: 13 },
  { time: "02:00 PM - 03:00 PM", startHour: 14 },
  { time: "03:00 PM - 04:00 PM", startHour: 15 },
  { time: "04:00 PM - 05:00 PM", startHour: 16 },
  { time: "05:00 PM - 06:00 PM", startHour: 17 },
  { time: "06:00 PM - 07:00 PM", startHour: 18 },
  { time: "07:00 PM - 08:00 PM", startHour: 19 },
  { time: "08:00 PM - 09:00 PM", startHour: 20 },
  { time: "09:00 PM - 10:00 PM", startHour: 21 },
];

// Custom calendar styles
const calendarStyles = {
  day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
  day_today: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
  day_disabled: "text-gray-400 dark:text-gray-600",
  day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900 dark:aria-selected:bg-blue-900/30 dark:aria-selected:text-blue-300",
  day_hidden: "invisible",
  head_cell: "text-gray-600 dark:text-gray-400 font-medium",
  cell: "text-gray-900 dark:text-gray-100",
  button: "hover:bg-gray-100 dark:hover:bg-gray-800",
  nav_button: "hover:bg-gray-100 dark:hover:bg-gray-800",
};

export default function AvailabilityPage() {
  // Hydration-safe session handling
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<string>("");

  // Ensure email is set only on client-side
  useEffect(() => {
    if (status === "authenticated") {
      setEmail(session?.user?.email || "");
    }
  }, [session, status]);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Loading states
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  // Ensure this only runs on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (email && isClient) {
      fetchSlots();
    }
  }, [email, isClient]);

  // Dynamic slot generation based on selected date
  const availableSlotOptions = useMemo(() => {
    if (!selectedDate) return [];

    const now = new Date();

    // If selected date is today
    if (isToday(selectedDate)) {
      // Filter slots based on current time
      return ALL_SLOT_OPTIONS.filter((slot) => {
        // Create a date object with today's date and the slot's start hour
        const slotTime = set(now, {
          hours: slot.startHour,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });

        // Return slots that start after current time
        return slotTime > now;
      }).map((slot) => slot.time);
    }

    // If selected date is in the future, return all slots
    return ALL_SLOT_OPTIONS.map((slot) => slot.time);
  }, [selectedDate]);

  const fetchSlots = async () => {
    setIsFetchingSlots(true);
    try {
      const res = await fetch(
        `/api/interviewer/availability/get?email=${email}`
      );
      const data = await res.json();
      
      // Debug the response
      console.log('API Response:', data);
      
      // Check if data is an object with a slots property
      if (data && data.slots) {
        setSlots(data.slots);
      } else if (data && Array.isArray(data)) {
        setSlots(data);
      } else {
        // If data is not in expected format, set empty array
        setSlots([]);
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast({
        title: "Error",
        description: "Failed to fetch availability slots",
        variant: "destructive",
      });
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const addSlot = async () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Validation Error",
        description: "Please select both date and time slot",
        variant: "destructive",
      });
      return;
    }

    // Check slot limit
    if (slots.length >= 5) {
      toast({
        title: "Slot Limit Reached",
        description:
          "You can only add up to 5 availability slots. Please delete an existing slot first.",
        variant: "default",
      });
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    setIsAddingSlot(true);
    try {
      const response = await fetch("/api/interviewer/availability/add", {
        method: "POST",
        body: JSON.stringify({
          date: formattedDate,
          slot: selectedSlot,
          email,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      console.log("response data:", data);

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to add availability slot",
          variant: "destructive",
        });
        return;
      }

      await fetchSlots();

      toast({
        title: "Success",
        description: "Availability slot added successfully",
      });

      setSelectedDate(undefined);
      setSelectedSlot("");
    } catch (error) {
      console.log("Error:", error);

      toast({
        title: "Network Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAddingSlot(false);
    }
  };

  const deleteSlot = async (date: string, slot: string) => {
    const slotId = `${date}-${slot}`;
    setDeletingSlotId(slotId);

    try {
      const response = await fetch("/api/interviewer/availability/delete", {
        method: "POST",
        body: JSON.stringify({ date, slot, email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete slot");
      }

      await fetchSlots();

      toast({
        title: "Success",
        description: "Availability slot deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete availability slot",
        variant: "destructive",
      });
    } finally {
      setDeletingSlotId(null);
    }
  };

  // Prevent rendering on server
  if (!isClient) {
    return null;
  }

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please sign in to manage your availability</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Manage Your Availability
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Set your interview availability slots for potential candidates
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Calendar and Slot Selection */}
          <div className="space-y-4">
            {/* Calendar Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    Select Date
                  </CardTitle>
                  {selectedDate && (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-[220px] mx-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = startOfDay(new Date());
                      return date < today;
                    }}
                    className="rounded-md border"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        calendarStyles.nav_button
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: cn(
                        "text-gray-600 dark:text-gray-400 rounded-md w-8 font-normal text-[0.8rem]",
                        calendarStyles.head_cell
                      ),
                      row: "flex w-full mt-2",
                      cell: cn(
                        "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        calendarStyles.cell
                      ),
                      day: cn(
                        "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                        calendarStyles.button
                      ),
                      day_selected: calendarStyles.day_selected,
                      day_today: calendarStyles.day_today,
                      day_outside: calendarStyles.day_disabled,
                      day_disabled: calendarStyles.day_disabled,
                      day_range_middle: calendarStyles.day_range_middle,
                      day_hidden: calendarStyles.day_hidden,
                    }}
                    components={{
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Selected Date</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Disabled Dates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection Card - Reduce padding and spacing */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  value={selectedSlot}
                  onValueChange={setSelectedSlot}
                  disabled={!selectedDate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlotOptions.length > 0 ? (
                      availableSlotOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">
                        No available slots for selected date
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <Button
                  onClick={addSlot}
                  disabled={!selectedDate || !selectedSlot || isAddingSlot}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAddingSlot ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Adding Slot...
                    </>
                  ) : (
                    "Add Availability Slot"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Current Availability */}
          <div>
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    Current Availability
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {slots.length}/5 slots
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isFetchingSlots ? (
                  <div className="flex justify-center items-center h-[350px]">
                    <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 mb-4">
                      <CalendarIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Availability Slots
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                      You haven't added any availability slots yet. Select a date and time to get started.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[350px]">
                    <div className="space-y-3">
                      {slots.map((slot) => {
                        const slotId = `${slot.date}-${slot.slot}`;
                        const isDeleting = deletingSlotId === slotId;

                        return (
                          <motion.div
                            key={slotId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {format(parseISO(slot.date), "MMMM d, yyyy")}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <ClockIcon className="h-4 w-4 text-blue-500" />
                                      <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {slot.slot}
                                      </span>
                                    </div>
                                    <Badge
                                      variant={slot.status === "booked" ? "destructive" : "default"}
                                      className="mt-2"
                                    >
                                      {slot.status}
                                    </Badge>
                                  </div>
                                  {slot.status === "available" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      disabled={isDeleting}
                                      onClick={() => deleteSlot(slot.date, slot.slot)}
                                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      {isDeleting ? (
                                        <>
                                          <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                                          Deleting
                                        </>
                                      ) : (
                                        "Remove"
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
