"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompaniesTable } from "./components/companies-table";
import { CompanyStats } from "./components/company-stats";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCompanyStats } from "@/lib/api/admin";
import type { CompanyStats as CompanyStatsType } from "@/constants/data";
import { motion } from "framer-motion";
import { Building, Users, Briefcase, TrendingUp, CheckCircle2, XCircle, FileText } from "lucide-react";

export default function CompaniesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<CompanyStatsType | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getCompanyStats();
      setStats(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch company statistics",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await fetchStats();
      toast({
        title: "Refreshed",
        description: "Company data has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Company data export has been initiated",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Please select a file to import company data",
    });
  };

  return (
    <PageContainer scrollable={false}>
      <div className="space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Companies Management
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="bg-gray-100 dark:bg-gray-800/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Companies
              </TabsTrigger>
              <TabsTrigger value="verified" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Verified
              </TabsTrigger>
              <TabsTrigger value="unverified" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Unverified
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            <CompaniesTable filter="all" />
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            <CompaniesTable filter="verified" />
          </TabsContent>

          <TabsContent value="unverified" className="space-y-4">
            <CompaniesTable filter="unverified" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {statsLoading ? (
              <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : stats ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { 
                      title: "Total Companies", 
                      value: stats.totalCompanies,
                      icon: Building,
                      color: "blue",
                      change: `+${stats.companyGrowth.lastMonth} from last month`
                    },
                    { 
                      title: "Verified Companies", 
                      value: stats.verifiedCompanies,
                      icon: CheckCircle2,
                      color: "green",
                      change: `${(stats.verifiedCompanies / stats.totalCompanies) * 100}% of total`
                    },
                    { 
                      title: "Active Job Descriptions", 
                      value: stats.activeJobDescriptions,
                      icon: FileText,
                      color: "yellow",
                      change: `${Math.round(stats.activeJobDescriptions / stats.totalCompanies)} per company avg.`
                    },
                    { 
                      title: "Average Company Size", 
                      value: stats.avgCompanySize,
                      icon: Users,
                      color: "purple",
                      change: "Employees per company"
                    }
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
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.change}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Company Distribution by Industry
                      </CardTitle>
                      <CardDescription>
                        Distribution of companies across different industries
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <CompanyStats type="industry" />
                    </CardContent>
                  </Card>
                  <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Company Size Distribution
                      </CardTitle>
                      <CardDescription>
                        Distribution of companies by size
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <CompanyStats type="size" />
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <XCircle className="w-full h-full" />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Failed to load statistics. Please try refreshing the page.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
