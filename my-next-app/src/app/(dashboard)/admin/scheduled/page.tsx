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
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, X, Calendar, Clock, User, Building, Briefcase } from "lucide-react";

type Stats = {
  scheduled: number;
  inProgress: number;
  today: number;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Scheduled Interviews", link: "/admin/scheduled" },
];

interface ScheduledInterview {
  id: number;
  candidateName: string;
  position: string;
  company: string;
  date: string;
  time: string;
  interviewer: string;
  interviewerEmail: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  meetingLink?: string;
}

export default function ScheduledInterviews() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<ScheduledInterview | null>(null);
  const [scheduledInterviews, setScheduledInterviews] = useState<
    ScheduledInterview[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    scheduled: 0,
    inProgress: 0,
    today: 0,
  });

  const [pagination, setPagination] = useState<Pagination>({
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/interviews/scheduled");
        if (!response.ok) {
          throw new Error("Failed to fetch scheduled interviews");
        }
        const data = await response.json();

        // Format the data to match our interface
        const formattedData = data.interviews.map((interview: any) => ({
          id: interview.id,
          candidateName: interview.intervieweeEmail.split("@")[0], // Temporary until we get full names
          position: interview.position || "Unknown Position",
          company: interview.company || "Unknown Company",
          date: new Date(interview.date).toISOString().split("T")[0],
          time: new Date(interview.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          interviewer: interview.interviewer || "Unknown",
          interviewerEmail: interview.interviewerEmail,
          status: interview.status,
          meetingLink: interview.meetingLink,
        }));

        setScheduledInterviews(formattedData);
        setStats(data.stats);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        console.error("Error fetching scheduled interviews:", err);
        setError(
          "Failed to load scheduled interviews. Please try again later."
        );

        toast({
          title: "Failed to load interviews",
          description: "Please try again later",
          variant: "destructive",
        });

        // Use mock data for now
        setScheduledInterviews([
          {
            id: 1,
            candidateName: "Jane Doe",
            position: "Frontend Developer",
            company: "TechCorp",
            date: "2023-04-20",
            time: "10:00 AM",
            interviewer: "Alex Johnson",
            interviewerEmail: "alex.johnson@example.com",
            status: "Scheduled",
            meetingLink: "https://meet.example.com/interview-1",
          },
          {
            id: 2,
            candidateName: "John Smith",
            position: "Backend Developer",
            company: "DataSys Inc.",
            date: "2023-04-21",
            time: "11:30 AM",
            interviewer: "Maria Garcia",
            interviewerEmail: "maria.garcia@example.com",
            status: "Scheduled",
            meetingLink: "https://meet.example.com/interview-2",
          },
          {
            id: 3,
            candidateName: "Emily Johnson",
            position: "Full Stack Developer",
            company: "WebSolutions",
            date: "2023-04-19",
            time: "09:00 AM",
            interviewer: "David Chen",
            interviewerEmail: "david.chen@example.com",
            status: "In Progress",
            meetingLink: "https://meet.example.com/interview-3",
          },
          {
            id: 4,
            candidateName: "Michael Brown",
            position: "DevOps Engineer",
            company: "CloudTech",
            date: "2023-04-22",
            time: "02:00 PM",
            interviewer: "Lisa Patel",
            interviewerEmail: "lisa.patel@example.com",
            status: "Scheduled",
            meetingLink: "https://meet.example.com/interview-4",
          },
          {
            id: 5,
            candidateName: "Sarah Wilson",
            position: "Data Scientist",
            company: "AnalyticsPro",
            date: "2023-04-23",
            time: "03:30 PM",
            interviewer: "Robert Kim",
            interviewerEmail: "robert.kim@example.com",
            status: "Scheduled",
            meetingLink: "https://meet.example.com/interview-5",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledInterviews();
  }, [toast]);

  const handleViewDetails = (interview: ScheduledInterview) => {
    setSelectedInterview(interview);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInterview(null);
  };

  const cancelInterview = async (interviewId: number) => {
    try {
      const response = await fetch(
        `/api/admin/interviews/${interviewId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel interview");

      // Update the local state to reflect the cancelled interview
      setScheduledInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId
            ? { ...interview, status: "Cancelled" }
            : interview
        )
      );

      toast({
        title: "Interview Cancelled",
        description: "The interview has been cancelled successfully",
        variant: "default",
      });

      console.log("Interview cancelled successfully");
    } catch (err) {
      console.error("Error cancelling interview:", err);

      toast({
        title: "Failed to Cancel Interview",
        description: "An error occurred while cancelling the interview",
        variant: "destructive",
      });
    }
  };

  const scheduledCount = stats.scheduled;
  const inProgressCount = stats.inProgress;
  const todayCount = stats.today;

  // Update the pagination logic
  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/interviews/scheduled?page=${newPage}&limit=${pagination.limit}`);
      if (!response.ok) throw new Error("Failed to fetch interviews");
      const data = await response.json();
      
      setScheduledInterviews(data.interviews);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      toast({
        title: "Failed to load interviews",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

        {/* Stats Cards with better loading states */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Scheduled", value: scheduledCount, icon: Calendar, color: "blue" },
            { title: "In Progress", value: inProgressCount, icon: Clock, color: "green" },
            { title: "Today's Interviews", value: todayCount, icon: Clock, color: "blue" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded-md" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
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

        {/* Main Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Scheduled Interviews
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
            ) : scheduledInterviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <Calendar className="w-full h-full" />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No scheduled interviews found
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
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Interviewer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledInterviews.map((interview) => (
                        <TableRow key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium">
                            {interview.candidateName}
                          </TableCell>
                          <TableCell>{interview.position}</TableCell>
                          <TableCell>{interview.company}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{interview.date}</span>
                              <span className="text-sm text-gray-500">{interview.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{interview.interviewer}</span>
                              <span className="text-sm text-gray-500">{interview.interviewerEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                interview.status === "Scheduled"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  : interview.status === "In Progress"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : interview.status === "Completed"
                                  ? "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {interview.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                onClick={() => handleViewDetails(interview)}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </Button>
                              <Button
                                onClick={() => cancelInterview(interview.id)}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Enhanced Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} interviews
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
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
                        disabled={pagination.page === pagination.totalPages}
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

      {/* Enhanced Modal */}
      {selectedInterview && (
        <Modal
          title="Interview Details"
          description={`Details for ${selectedInterview.candidateName}'s interview`}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        >
          <div className="space-y-6 py-4">
            {/* Header with status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedInterview.candidateName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedInterview.position}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedInterview.status === "Scheduled"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : selectedInterview.status === "In Progress"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : selectedInterview.status === "Completed"
                    ? "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {selectedInterview.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{selectedInterview.company}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</p>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{selectedInterview.position}</p>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                  <p className="text-gray-900 dark:text-white">{selectedInterview.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                  <p className="text-gray-900 dark:text-white">{selectedInterview.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviewer</p>
                  <p className="text-gray-900 dark:text-white">{selectedInterview.interviewer}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedInterview.interviewerEmail}</p>
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            {selectedInterview.meetingLink && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Meeting Link</p>
                <a
                  href={selectedInterview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span className="truncate">{selectedInterview.meetingLink}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={closeDetailsModal}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                Close
              </Button>
              {selectedInterview.status === "Scheduled" && (
                <Button
                  onClick={() => {
                    cancelInterview(selectedInterview.id);
                    closeDetailsModal();
                  }}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Interview
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
