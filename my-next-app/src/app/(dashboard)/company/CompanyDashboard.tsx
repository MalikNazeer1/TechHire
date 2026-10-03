"use client";

import { useState, useEffect, useMemo } from "react";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PdfDownloadWrapper from "@/components/reports/pdfbuttonwrapper";
import { Loader2, Calendar, Users, CheckCircle2, XCircle, UserX, ChevronRight, Clock, Briefcase } from "lucide-react";
import {
  useCompanyDashboardStore,
  type CompanyCompletedInterview,
} from "@/stores/company-dashboard-store";

const UPCOMING_PREVIEW_LIMIT = 12;

const CompanyDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<CompanyCompletedInterview | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "";

  const statistics = useCompanyDashboardStore((s) => s.statistics);
  const upcomingInterviewsAll = useCompanyDashboardStore(
    (s) => s.upcomingInterviews
  );
  const recentlyCompletedInterviews = useCompanyDashboardStore(
    (s) => s.recentlyCompletedInterviews
  );
  const isLoading = useCompanyDashboardStore((s) => s.isLoading);

  useEffect(() => {
    if (!userEmail) return;
    void useCompanyDashboardStore.getState().ensureLoaded(userEmail);
  }, [userEmail]);

  const upcomingInterviews = useMemo(
    () => upcomingInterviewsAll.slice(0, UPCOMING_PREVIEW_LIMIT),
    [upcomingInterviewsAll]
  );

  const showInitialSkeleton = !statistics && isLoading;

  const handleViewReport = (interview: CompanyCompletedInterview) => {
    setSelectedReport(interview);
    setIsModalOpen(true);
  };

  const openScheduleModal = () => {
    router.push("/company/interviewScheduling");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state with enhanced skeleton UI
  if (showInitialSkeleton) {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-10 w-56 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl" />
            <div className="h-11 w-44 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="p-6 flex-1 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="h-7 w-28 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-3" />
                <div className="h-10 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg" />
              </Card>
            ))}
          </div>

          {/* Interviews Section Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(2)].map((_, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-6" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 mb-4 last:mb-0 rounded-xl bg-white dark:bg-gray-800/50">
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                      <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                    </div>
                    <div className="h-7 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full" />
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Company Dashboard
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome back! Here's an overview of your interviews
            </p>
          </div>
          <Button 
            onClick={openScheduleModal}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Schedule an Interview
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              title: "Total Candidates",
              value: statistics?.totalCandidates || 0,
              icon: <Users className="w-6 h-6" />,
              gradient: "from-blue-400 to-blue-500",
              bgGradient: "from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10",
              iconBg: "bg-blue-100 dark:bg-blue-900/20",
              iconColor: "text-blue-500 dark:text-blue-400",
            },
            {
              title: "Completed",
              value: statistics?.totalCompletedInterviewsCount || 0,
              icon: <CheckCircle2 className="w-6 h-6" />,
              gradient: "from-green-400 to-green-500",
              bgGradient: "from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10",
              iconBg: "bg-green-100 dark:bg-green-900/20",
              iconColor: "text-green-500 dark:text-green-400",
            },
            {
              title: "In Process",
              value: statistics?.inProcessInterviewsCount || 0,
              icon: <Clock className="w-6 h-6" />,
              gradient: "from-yellow-400 to-yellow-500",
              bgGradient: "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/10 dark:to-yellow-800/10",
              iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
              iconColor: "text-yellow-500 dark:text-yellow-400",
            },
            {
              title: "Cancelled",
              value: statistics?.cancelledInterviewsCount || 0,
              icon: <XCircle className="w-6 h-6" />,
              gradient: "from-red-400 to-red-500",
              bgGradient: "from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-800/10",
              iconBg: "bg-red-100 dark:bg-red-900/20",
              iconColor: "text-red-500 dark:text-red-400",
            },
            {
              title: "Dropped",
              value: statistics?.droppedInterviewsCount || 0,
              icon: <UserX className="w-6 h-6" />,
              gradient: "from-purple-400 to-purple-500",
              bgGradient: "from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/10",
              iconBg: "bg-purple-100 dark:bg-purple-900/20",
              iconColor: "text-purple-500 dark:text-purple-400",
            },
          ].map((stat, index) => (
            <Card key={index} className={`p-6 border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <div className={stat.iconColor}>
                      {stat.icon}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interviews Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Upcoming Interviews */}
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {interview.intervieweeEmail}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {interview.jobTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {formatDate(interview.scheduledAt)} • {formatTime(interview.scheduledAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          {interview.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No upcoming interviews found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Completed Interviews */}
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                Recently Completed Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentlyCompletedInterviews.length > 0 ? (
                <div className="space-y-3">
                  {recentlyCompletedInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {interview.intervieweeEmail}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {interview.jobTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {formatDate(interview.scheduledAt)} • {formatTime(interview.scheduledAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                          COMPLETED
                        </span>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleViewReport(interview)}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No completed interviews found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedReport && (
        <Modal
          title="Interview Report"
          description="Detailed report of the interview."
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <p className="font-medium">
                Email: {selectedReport.intervieweeEmail}
              </p>
              <p className="text-sm text-muted-foreground">
                Position: {selectedReport.jobTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {formatDate(selectedReport.scheduledAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Time: {formatTime(selectedReport.scheduledAt)}
              </p>
              <p className="text-sm text-muted-foreground">Status: COMPLETED</p>
            </div>
            {selectedReport.feedbacks &&
              selectedReport.feedbacks.length > 0 && (
                <div>
                  <p className="font-medium">Score:</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const score = Math.round(
                        selectedReport.feedbacks[0].averageScore
                      );
                      return (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < score ? "text-yellow-500" : "text-gray-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="font-medium mt-4">Hiring Decision:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.feedbacks[0].hiringDecision}
                  </p>
                </div>
              )}

            {/* PDF Download Button added here */}
            <div className="mt-6">
              <PdfDownloadWrapper interviewId={selectedReport.id} />
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CompanyDashboard;
