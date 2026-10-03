"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Building, BriefcaseIcon, Loader2Icon, CalendarIcon, ClockIcon, BuildingIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Interview {
  id: number;
  scheduledAt: string;
  durationInMinutes: number;
  status: string;
  jobDescription: {
    id: number;
    title: string;
    company: {
      name: string;
      id: number;
    };
  };
}

interface JobDescription {
  id: number;
  title: string;
  description: string;
  experienceLevel: string;
  skills: string[];
  company: {
    name: string;
  };
}

interface Company {
  id: number;
  name: string;
  description: string;
  industry: string;
  companySize: number;
  email: string;
  portfolio?: string;
}

export default function ScheduledInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  // State for modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<JobDescription | null>(null);
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false);
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    const fetchInterviews = async () => {
      try {
        const response = await fetch(
          `/api/interviewer/interviews?email=${userEmail}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        console.log("Data: ", data);

        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching interviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [userEmail]);

  // Fetch job details when job modal is opened
  useEffect(() => {
    if (isJobModalOpen && selectedJobId) {
      const fetchJobDetails = async () => {
        setIsLoadingJobDetails(true);
        try {
          const response = await fetch(`/api/jobs/${selectedJobId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch job details");
          }
          const data = await response.json();
          setJobDetails(data);
        } catch (err) {
          console.error("Error fetching job details:", err);
        } finally {
          setIsLoadingJobDetails(false);
        }
      };

      fetchJobDetails();
    }
  }, [isJobModalOpen, selectedJobId]);

  // Fetch company details when company modal is opened
  useEffect(() => {
    if (isCompanyModalOpen && selectedCompanyId) {
      const fetchCompanyDetails = async () => {
        setIsLoadingCompanyDetails(true);
        try {
          const response = await fetch(`/api/companies/${selectedCompanyId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch company details");
          }
          const data = await response.json();
          setCompanyDetails(data);
        } catch (err) {
          console.error("Error fetching company details:", err);
        } finally {
          setIsLoadingCompanyDetails(false);
        }
      };

      fetchCompanyDetails();
    }
  }, [isCompanyModalOpen, selectedCompanyId]);

  const handleOpenJobModal = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobModalOpen(true);
  };

  const handleOpenCompanyModal = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setIsCompanyModalOpen(true);
  };

  // Handle unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please sign in to see your interviews</p>
      </div>
    );
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Format time to readable string
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid time";

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  if (!userEmail) return <p>Please sign In</p>;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <InterviewCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                Scheduled Interviews
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-[400px]">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Scheduled Interviews
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View and manage your upcoming interviews
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Scheduled Interviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                You don't have any interviews scheduled at the moment. Check back later for updates.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {interview.jobDescription.title}
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {interview.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(interview.scheduledAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatTime(interview.scheduledAt)} ({interview.durationInMinutes} mins)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BuildingIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {interview.jobDescription.company.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BriefcaseIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {interview.jobDescription.title}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenJobModal(interview.jobDescription.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View Job Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCompanyModal(interview.jobDescription.company.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View Company Info
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-700/50">
                    <CountdownTimer date={interview.scheduledAt} />
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                      <Link href={`/qora/${interview.id}`} className="flex items-center justify-center space-x-2">
                        <span>Join Interview</span>
                        <ExternalLinkIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Job Description Modal */}
        <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                {jobDetails?.title || "Job Description"}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500 dark:text-gray-400">
                Detailed information about the position
              </DialogDescription>
            </DialogHeader>
            {isLoadingJobDetails ? (
              <ModalSkeleton />
            ) : jobDetails ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Company</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{jobDetails.company.name}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {jobDetails.experienceLevel.toLowerCase()}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(jobDetails.skills) ? (
                      jobDetails.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No specific skills listed</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Job Description</h3>
                  <div className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-base text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {jobDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">Unable to load job details. Please try again later.</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Company Information Modal */}
        <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                {companyDetails?.name || "Company Information"}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500 dark:text-gray-400">
                Detailed information about the company
              </DialogDescription>
            </DialogHeader>
            {isLoadingCompanyDetails ? (
              <ModalSkeleton />
            ) : companyDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Industry</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{companyDetails.industry}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Company Size</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{companyDetails.companySize} employees</p>
                  </div>
                </div>

                {companyDetails.portfolio && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Portfolio/Website</h3>
                    <a
                      href={companyDetails.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:text-blue-700 flex items-center space-x-2 text-base"
                    >
                      <span>{companyDetails.portfolio}</span>
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">About the Company</h3>
                  <div className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-base text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {companyDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">Unable to load company details. Please try again later.</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

interface CountdownProps {
  date: string;
}

function CountdownTimer({ date }: CountdownProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    let timeLeft: Record<string, number> = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span key={interval} className="text-sm font-medium">
        {timeLeft[interval]}{interval.charAt(0)}
      </span>
    );
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {timerComponents.length ? (
        <>
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 w-fit">
            Time Remaining
          </Badge>
          <div className="flex flex-wrap gap-2">
            {timerComponents}
          </div>
        </>
      ) : (
        <Badge variant="destructive">Time's up!</Badge>
      )}
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

// Add this skeleton component for interview cards
function InterviewCardSkeleton() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );
}
