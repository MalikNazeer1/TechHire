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
import {
  CalendarIcon,
  ClockIcon,
  BuildingIcon,
  BriefcaseIcon,
  Loader2,
  AlertCircle,
  Badge,
  ArrowUpRight,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduledInterviews() {
  const { data: session, status } = useSession();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `/api/interviewee/scheduledInterviews?email=${session?.user?.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }
        const data = await response.json();
        setInterviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-4 w-32" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Error Loading Interviews</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Scheduled Interviews
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View and manage your upcoming interviews
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="mb-6">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect x="10" y="30" width="100" height="60" rx="12" fill="#e0e7ff" />
                  <rect x="25" y="45" width="70" height="30" rx="6" fill="#fff" />
                  <rect x="40" y="60" width="40" height="6" rx="3" fill="#a5b4fc" />
                  <circle cx="60" cy="90" r="6" fill="#60a5fa" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Interviews Scheduled
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md text-center">
                You currently have no upcoming interviews. Once you are invited to an interview, it will appear here.
              </p>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                onClick={() => window.location.href = "/interviewee/interview-preparation"}
              >
                Prepare for Interviews
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {interviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            {interview.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {interview.position}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          {interview.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(interview.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {interview.time} ({interview.durationInMinutes} mins)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BuildingIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {interview.company}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BriefcaseIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {interview.position}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Job Description
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {interview.jobDescription}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Company Information
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {interview.companyInfo}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                      <CountdownTimer date={interview.date} />
                      <Button
                        asChild
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!interview.meetingLink}
                      >
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2"
                        >
                          <span>Join Interview</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}

function CountdownTimer({ date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

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
      <span key={interval} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <div className="flex items-center space-x-2">
      <ClockIcon className="h-4 w-4 text-blue-500" />
      {timerComponents.length ? (
        <div className="flex space-x-2">{timerComponents}</div>
      ) : (
        <span className="text-red-500 font-medium">Time's up!</span>
      )}
    </div>
  );
}
