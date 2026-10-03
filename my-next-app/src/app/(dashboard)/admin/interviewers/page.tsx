"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { User, Briefcase, Calendar, Star, CheckCircle2, XCircle } from "lucide-react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Interviewers", link: "/admin/interviewers" },
];

interface Interviewer {
  id: number;
  name: string;
  email: string;
  skills: string[];
  yearsOfExperience: number;
  status: "Pending" | "Approved" | "Rejected";
  applicationDate: string;
  completedInterviews?: number;
  rating?: number;
}

export default function InterviewersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [notes, setNotes] = useState("");
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/admin/interviewers/all');
        if (!response.ok) throw new Error('Failed to fetch interviewers');
        const data = await response.json();
        
        setInterviewers(data.interviewers);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviewers:", err);
        setError("Failed to load interviewers. Please try again later.");
        
        toast({
          title: "Failed to load interviewers",
          description: "Please try again later",
          variant: "destructive",
        });
        
        // Use mock data for now
        setInterviewers([
          {
            id: 1,
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            skills: ["React", "TypeScript", "CSS"],
            yearsOfExperience: 5,
            status: "Approved",
            applicationDate: "2023-03-10",
            completedInterviews: 12,
            rating: 4.8
          },
          {
            id: 2,
            name: "Maria Garcia",
            email: "maria.garcia@example.com",
            skills: ["Node.js", "Express", "MongoDB"],
            yearsOfExperience: 7,
            status: "Approved",
            applicationDate: "2023-03-12",
            completedInterviews: 8,
            rating: 4.5
          },
          {
            id: 3,
            name: "David Chen",
            email: "david.chen@example.com",
            skills: ["React", "Node.js", "PostgreSQL"],
            yearsOfExperience: 4,
            status: "Approved",
            applicationDate: "2023-03-15",
            completedInterviews: 5,
            rating: 4.2
          },
          {
            id: 4,
            name: "Lisa Patel",
            email: "lisa.patel@example.com",
            skills: ["Docker", "Kubernetes", "AWS"],
            yearsOfExperience: 6,
            status: "Pending",
            applicationDate: "2023-04-16"
          },
          {
            id: 5,
            name: "Robert Kim",
            email: "robert.kim@example.com",
            skills: ["Python", "TensorFlow", "SQL"],
            yearsOfExperience: 3,
            status: "Pending",
            applicationDate: "2023-04-17"
          },
          {
            id: 6,
            name: "Jennifer Wilson",
            email: "jennifer.wilson@example.com",
            skills: ["Java", "Spring Boot", "PostgreSQL"],
            yearsOfExperience: 8,
            status: "Pending",
            applicationDate: "2023-04-18"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterviewers();
  }, [toast]);
  
  const handleViewDetails = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
    setIsDetailsModalOpen(true);
    setNotes(""); // Reset notes when opening modal
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInterviewer(null);
  };

  const handleStatusChange = async (interviewerId: number, newStatus: "Approved" | "Rejected") => {
    try {
      const response = await fetch(`/api/admin/interviewers/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewerId: interviewerId,
          status: newStatus === "Approved" ? true : false,
          notes: notes
        })
      });
      
      if (!response.ok) throw new Error(`Failed to update interviewer status: ${response.statusText}`);
      
      // Update the local state to reflect the status change
      setInterviewers(prev => 
        prev.map(interviewer => 
          interviewer.id === interviewerId ? { ...interviewer, status: newStatus } : interviewer
        )
      );
      
      // Close modal and show success message
      closeDetailsModal();
      
      toast({
        title: `Interviewer ${newStatus}`,
        description: `Interviewer has been ${newStatus.toLowerCase()} successfully`,
        variant: "default",
      });
      
      console.log("Interviewer status updated successfully");
    } catch (err) {
      console.error("Error updating interviewer status:", err);
      
      toast({
        title: "Failed to Update Status",
        description: "An error occurred while updating the interviewer status",
        variant: "destructive",
      });
    }
  };

  const pendingInterviewers = interviewers.filter(i => i.status === "Pending");
  const approvedInterviewers = interviewers.filter(i => i.status === "Approved");

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
            { title: "Total Interviewers", value: interviewers.length, icon: User, color: "blue" },
            { title: "Pending Approval", value: pendingInterviewers.length, icon: Calendar, color: "yellow" },
            { title: "Active Interviewers", value: approvedInterviewers.length, icon: CheckCircle2, color: "green" }
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
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Pending Approval ({pendingInterviewers.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Approved Interviewers ({approvedInterviewers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Pending Approval Requests
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
                ) : pendingInterviewers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                      <CheckCircle2 className="w-full h-full" />
                    </div>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No pending approval requests
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Application Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInterviewers.map((interviewer) => (
                          <TableRow key={interviewer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <TableCell className="font-medium">{interviewer.name}</TableCell>
                            <TableCell>{interviewer.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{interviewer.yearsOfExperience} years</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {interviewer.skills.map((skill, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{interviewer.applicationDate}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => handleViewDetails(interviewer)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Approved Interviewers
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
                ) : approvedInterviewers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                      <User className="w-full h-full" />
                    </div>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No approved interviewers
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Interviews</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedInterviewers.map((interviewer) => (
                          <TableRow key={interviewer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <TableCell className="font-medium">{interviewer.name}</TableCell>
                            <TableCell>{interviewer.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{interviewer.yearsOfExperience} years</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {interviewer.skills.map((skill, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{interviewer.completedInterviews}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="font-medium">{interviewer.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => handleViewDetails(interviewer)}
                                variant="outline"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedInterviewer && (
        <Modal
          title={selectedInterviewer.status === "Pending" ? "Review Interviewer Application" : "Interviewer Details"}
          description={`${selectedInterviewer.name} - ${selectedInterviewer.email}`}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        >
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedInterviewer.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedInterviewer.email}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedInterviewer.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                }`}
              >
                {selectedInterviewer.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</p>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{selectedInterviewer.yearsOfExperience} years</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Date</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{selectedInterviewer.applicationDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedInterviewer.skills.map((skill, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedInterviewer.status === "Approved" && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviews Completed</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 dark:text-white">{selectedInterviewer.completedInterviews}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <p className="text-gray-900 dark:text-white">{selectedInterviewer.rating}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedInterviewer.status === "Pending" && (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Review Notes
                </Label>
                <Input
                  id="notes"
                  placeholder="Add any notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={closeDetailsModal}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {selectedInterviewer.status === "Pending" ? "Cancel" : "Close"}
              </Button>
              
              {selectedInterviewer.status === "Pending" && (
                <>
                  <Button 
                    onClick={() => handleStatusChange(selectedInterviewer.id, "Rejected")}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleStatusChange(selectedInterviewer.id, "Approved")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
} 