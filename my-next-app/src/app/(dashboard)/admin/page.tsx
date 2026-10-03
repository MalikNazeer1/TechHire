"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Users, 
  Building2, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  UserCheck,
  Building,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import LoadingOverlay from "@/components/ui/loading-overlay";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Admin Panel", link: "/admin" },
];

interface DashboardStats {
  pendingInterviews: number;
  scheduledInterviews: number;
  completedInterviews: number;
  interviewers: number;
  companies: number;
}

interface Activity {
  action: string;
  details: string;
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    pendingInterviews: 0,
    scheduledInterviews: 0,
    completedInterviews: 0,
    interviewers: 0,
    companies: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/admin/dashboard/stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats');
        const statsData = await statsResponse.json();
        
        // Fetch recent activities
        const activitiesResponse = await fetch('/api/admin/dashboard/activities');
        if (!activitiesResponse.ok) throw new Error('Failed to fetch recent activities');
        const activitiesData = await activitiesResponse.json();
        
        setStats(statsData);
        setActivities(activitiesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        
        // Use mock data for now
        setStats({
          pendingInterviews: 45,
          scheduledInterviews: 32,
          completedInterviews: 78,
          interviewers: 24,
          companies: 12
        });
        
        setActivities([
          {
            action: "Scheduled Interview",
            details: "Jane Doe - Frontend Developer",
            date: "Today, 10:25 AM"
          },
          {
            action: "Approved Interviewer",
            details: "John Smith - Senior Developer",
            date: "Today, 09:15 AM"
          },
          {
            action: "New Company Onboarded",
            details: "TechCorp Solutions",
            date: "Yesterday, 03:30 PM"
          },
          {
            action: "Interview Completed",
            details: "Michael Brown - Data Scientist",
            date: "Yesterday, 01:45 PM"
          },
          {
            action: "New Batch Uploaded",
            details: "DataSys Inc. - 12 candidates",
            date: "2 days ago"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleNavigation = (route: string) => {
    setIsNavigating(true);
    router.push(route);
  };

  if (loading) {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions and Recent Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={false}>
      {isNavigating && <LoadingOverlay />}
      <div className="space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { 
              title: "Pending Interviews", 
              value: stats.pendingInterviews, 
              route: "/admin/pending",
              icon: Clock,
              color: "text-gray-700 dark:text-gray-300",
              bgColor: "bg-gray-50 dark:bg-gray-800/50"
            },
            { 
              title: "Scheduled Interviews", 
              value: stats.scheduledInterviews, 
              route: "/admin/scheduled",
              icon: CalendarCheck,
              color: "text-blue-600 dark:text-blue-400",
              bgColor: "bg-blue-50 dark:bg-blue-900/20"
            },
            { 
              title: "Completed Interviews", 
              value: stats.completedInterviews, 
              route: "/admin/completed",
              icon: CheckCircle2,
              color: "text-green-600 dark:text-green-400",
              bgColor: "bg-green-50 dark:bg-green-900/20"
            },
            { 
              title: "Interviewers", 
              value: stats.interviewers, 
              route: "/admin/interviewers",
              icon: UserCheck,
              color: "text-gray-700 dark:text-gray-300",
              bgColor: "bg-gray-50 dark:bg-gray-800/50"
            },
            { 
              title: "Companies", 
              value: stats.companies, 
              route: "/admin/companies",
              icon: Building,
              color: "text-gray-700 dark:text-gray-300",
              bgColor: "bg-gray-50 dark:bg-gray-800/50"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="relative p-3 cursor-pointer transition-all duration-200 border-0 bg-white dark:bg-gray-800 overflow-hidden group hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleNavigation(stat.route)}
              >
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                
                <CardHeader className="pb-2 relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {stat.title}
                </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`} />
                    </motion.div>
                  </div>
              </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-baseline justify-between">
                    <motion.div
                      className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </motion.div>
                </div>
                  
                  {/* Bottom border animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-600"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4 border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Schedule Pending Interviews Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
              <Button 
                  className="w-full h-16 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => handleNavigation("/admin/pending")}
                >
                  <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center space-x-3">
                      <CalendarCheck className="h-5 w-5" />
                      <span>Schedule Pending Interviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.pendingInterviews}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
              </Button>
              </motion.div>

              {/* Approve Interviewers Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
              <Button 
                  className="w-full h-16 bg-white dark:bg-gray-800 border-2 border-gray-600 dark:border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => handleNavigation("/admin/interviewers")}
                >
                  <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5" />
                      <span>Approve Interviewers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.interviewers}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
              </Button>
              </motion.div>

              {/* Manage Companies Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
              <Button 
                  className="w-full h-16 bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  onClick={() => handleNavigation("/admin/companies")}
                >
                  <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5" />
                      <span>Manage Companies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.companies}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
              </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity, index) => {
                  // Determine activity type and color
                  const getActivityStyle = (action: string) => {
                    if (action.includes("Scheduled")) return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
                    if (action.includes("Approved")) return "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
                    if (action.includes("New Company")) return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300";
                    if (action.includes("Completed")) return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                    return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
                  };

                  return (
                    <div 
                      key={index} 
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${getActivityStyle(activity.action)}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm opacity-80">{activity.details}</p>
                        <p className="text-xs opacity-60 mt-1">{activity.date}</p>
                      </div>
                  </div>
                  );
                })}
                  </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
} 