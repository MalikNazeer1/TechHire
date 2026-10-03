"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSession } from "next-auth/react";
import { Loader2Icon, TrendingUpIcon, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InterviewStatData {
  month: string;
  count: number;
}

export default function InterviewStatistics() {
  const [interviewStats, setInterviewStats] = useState<InterviewStatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;
    const fetchInterviewStats = async () => {
      try {
        const response = await fetch(
          `/api/interviewer/statistics/?email=${userEmail}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch interview statistics");
        }

        const data = await response.json();
        setInterviewStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching interview statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewStats();
  }, [userEmail]);

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Interviews Conducted",
        data: allMonths.map((month) => {
          const found = interviewStats.find((stat) => stat.month === month);
          return found ? found.count : 0;
        }),
        backgroundColor: "rgba(59, 130, 246, 0.2)", // blue-500 with opacity
        borderColor: "rgb(59, 130, 246)", // blue-500
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `Interviews: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          precision: 0,
          stepSize: 1,
          color: "#6b7280",
          font: {
            size: 11
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11
          }
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Calculate total interviews
  const totalInterviews = interviewStats.reduce((sum, stat) => sum + stat.count, 0);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentMonthInterviews = interviewStats.find(stat => stat.month === currentMonth)?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Interview Statistics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track your interview performance and progress
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Interviews</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{totalInterviews}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{currentMonthInterviews}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average per Month</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {Math.round(totalInterviews / 12)}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Monthly Interview Distribution
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Last 12 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Bar data={chartData} options={options} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
