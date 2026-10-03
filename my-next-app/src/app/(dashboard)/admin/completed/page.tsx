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
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { FileDown, Star, Calendar, User, Building, Briefcase, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Completed Interviews", link: "/admin/completed" },
];

interface CompletedInterview {
  id: number;
  candidateName: string;
  position: string;
  company: string;
  intervieweeEmail: string;
  date: string;
  time: string;
  interviewer: string;
  interviewerEmail: string;
  score: number;
  skills: string[];
  comments: string;
  hiringDecision: string;
  feedbackDetails?: {
    technicalSkill: number;
    communicationSkill: number;
    problemSolving: number;
    codeQuality: number;
    notes: string;
  };
}

interface InterviewStats {
  total: number;
  averageScore: string;
  topScore: number;
}

interface InterviewPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CompletedInterviewsResponse {
  interviews: CompletedInterview[];
  stats: InterviewStats;
  pagination: InterviewPagination;
}

export default function CompletedInterviews() {
  const router = useRouter();
  const { toast } = useToast();
  const [completedInterviews, setCompletedInterviews] = useState<
    CompletedInterview[]
  >([]);
  const [stats, setStats] = useState<InterviewStats>({
    total: 0,
    averageScore: "0.0",
    topScore: 0,
  });
  const [pagination, setPagination] = useState<InterviewPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedInterviews = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/interviews/completed");
        if (!response.ok)
          throw new Error("Failed to fetch completed interviews");

        const data: CompletedInterviewsResponse = await response.json();

        setCompletedInterviews(data.interviews);
        setStats(data.stats);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        console.error("Error fetching completed interviews:", err);
        setError(
          "Failed to load completed interviews. Please try again later."
        );

        toast({
          title: "Failed to load interviews",
          description: "Please try again later",
          variant: "destructive",
        });

        // Use mock data for now
        const mockData: CompletedInterviewsResponse = {
          interviews: [
            {
              id: 18,
              candidateName: "arjun.yadav",
              position: "ADOBE Interview",
              company: "Shiv Technologies",
              intervieweeEmail: "arjun.yadav@example.com",
              date: "2025-03-31",
              time: "01:25 PM",
              interviewer: "Unknown",
              interviewerEmail: "interviewer@example.com",
              score: 0,
              skills: [],
              comments: "",
              hiringDecision: "NO",
              feedbackDetails: {
                technicalSkill: 0,
                communicationSkill: 0,
                problemSolving: 0,
                codeQuality: 0,
                notes: "",
              },
            },
          ],
          stats: {
            total: 1,
            averageScore: "0.0",
            topScore: 0,
          },
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        };

        setCompletedInterviews(mockData.interviews);
        setStats(mockData.stats);
        setPagination(mockData.pagination);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedInterviews();
  }, [toast]);

  const handleDownloadReport = async (interviewId: number) => {
    try {
      const response = await fetch(
        `/api/admin/interviews/report/${interviewId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to download report");

      // Create a blob from the response and create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-report-${interviewId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Report Downloaded",
        description: "The interview report has been downloaded successfully",
        variant: "default",
      });

      console.log("Report downloaded successfully");
    } catch (err) {
      console.error("Error downloading report:", err);

      toast({
        title: "Failed to Download Report",
        description: "An error occurred while downloading the interview report",
        variant: "destructive",
      });
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

        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Total Completed", value: stats.total, icon: CheckCircle2, color: "blue" },
            { title: "Average Score", value: stats.averageScore, icon: Star, color: "yellow" },
            { title: "Top Score", value: stats.topScore, icon: Star, color: "green" }
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Completed Interviews
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
            ) : completedInterviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <CheckCircle2 className="w-full h-full" />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No completed interviews found
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Interviewer</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedInterviews.map((interview) => (
                      <TableRow key={interview.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{interview.candidateName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span>{interview.position}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span>{interview.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{interview.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{interview.interviewer}</span>
                            <span className="text-sm text-gray-500">{interview.interviewerEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  index < interview.score
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              interview.hiringDecision === "YES"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : interview.hiringDecision === "NO"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                : interview.hiringDecision === "MAYBE"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                            }`}
                          >
                            {interview.hiringDecision || "PENDING"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDownloadReport(interview.id)}
                            variant="outline"
                            className="h-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <FileDown className="w-4 h-4 mr-2" />
                            Download Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} interviews
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => {
                      // Add pagination logic here
                    }}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => {
                      // Add pagination logic here
                    }}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
