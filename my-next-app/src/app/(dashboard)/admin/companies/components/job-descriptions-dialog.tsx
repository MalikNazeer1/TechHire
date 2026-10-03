"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Trash, Clock, User, Tag, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getJobDescriptions, deleteJobDescription } from "@/lib/api/admin";
import { JobDescription } from "@/constants/data";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Building, Briefcase, Users, Calendar, CheckCircle2, XCircle } from "lucide-react";

interface JobDescriptionsDialogProps {
  companyId: number;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDescriptionsDialog({
  companyId,
  companyName,
  open,
  onOpenChange,
}: JobDescriptionsDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchJobDescriptions = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const data = await getJobDescriptions(companyId);
      setJobDescriptions(data);
    } catch (error) {
      console.error("Failed to fetch job descriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load job descriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJobDescriptions();
    }
  }, [open, companyId]);

  const handleDelete = async (jobId: number) => {
    try {
      await deleteJobDescription(jobId);
      setJobDescriptions(jobDescriptions.filter((job) => job.id !== jobId));
      toast({
        title: "Job description deleted",
        description: "The job description has been removed",
      });
    } catch (error) {
      console.error("Failed to delete job description:", error);
      toast({
        title: "Error",
        description: "Failed to delete job description",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (jobId: number) => {
    toast({
      title: "View job details",
      description: `Viewing details for job ID: ${jobId}`,
    });
    // You could navigate to a job detail page or open another modal here
  };

  const handleAddJobDescription = () => {
    // Navigate to job creation page or open a job creation modal
    toast({
      title: "Add job description",
      description: "Opening job creation form",
    });
    // Implement navigation or modal opening logic here
  };

  const filteredJobs = jobDescriptions.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.experienceLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Job Descriptions
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            View and manage job descriptions for {companyName}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search job descriptions..."
                  className="pl-8 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddJobDescription}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Job
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredJobs.length} job descriptions found
              </span>
              <div className="flex gap-2">
                <Badge
                  variant={filteredJobs.filter((j) => j.isActive).length > 0 ? "default" : "outline"}
                  className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {filteredJobs.filter((j) => j.isActive).length} Active
                </Badge>
                <Badge
                  variant={filteredJobs.filter((j) => !j.isActive).length > 0 ? "secondary" : "outline"}
                  className="bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  {filteredJobs.filter((j) => !j.isActive).length} Inactive
                </Badge>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-4 transition-all hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                            {job.isActive ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-3 mt-1">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {job.experienceLevel}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(job.postedAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap sm:justify-end items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(job.id)}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                      <Briefcase className="w-full h-full" />
                    </div>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No job descriptions found
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
