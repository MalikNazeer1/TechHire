"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Building, Mail, User, Calendar, CheckCircle, XCircle, Briefcase, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyDetailsDialogProps {
  company: {
    id: number;
    name: string;
    industry: string;
    companySize: number;
    verified: boolean;
    email: string;
    createdAt: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function CompanyDetailsDialog({ company, open, onOpenChange }: CompanyDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CompanyUser | null>(null);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Simulate API call to get company details
      setIsLoading(true);
      setTimeout(() => {
        setDescription("This is a mock company description. The company specializes in delivering innovative solutions for their clients. They have been in business for several years and have a strong track record of success.");
        setUser({
          id: "user-1",
          name: "John Doe",
          email: company.email,
          role: "Admin",
          avatar: undefined
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [open, company.email]);

  const handleVerificationChange = (checked: boolean) => {
    toast({
      title: checked ? "Company verified" : "Company unverified",
      description: `${company.name} has been ${checked ? "verified" : "unverified"} successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Company Details
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            View and manage details for {company.name}
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Account
              </TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Company Name", value: company.name, icon: Building },
                  { label: "Industry", value: company.industry, icon: Briefcase },
                  { label: "Company Size", value: `${company.companySize} employees`, icon: User },
                  { label: "Contact Email", value: company.email, icon: Mail },
                  { label: "Registration Date", value: new Date(company.createdAt).toLocaleDateString(), icon: Calendar },
                  { 
                    label: "Verification Status", 
                    value: company.verified ? "Verified" : "Unverified",
                    icon: company.verified ? CheckCircle : XCircle,
                    badge: true
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </Label>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <item.icon className={`h-4 w-4 ${
                        item.badge 
                          ? company.verified 
                            ? "text-green-500" 
                            : "text-yellow-500"
                          : "text-gray-400"
                      }`} />
                      {item.badge ? (
                        <Badge className={
                          company.verified
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }>
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Company Description
                </Label>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {description}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Associated User Account</h3>
                
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</Label>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm text-gray-600 dark:text-gray-300">{user.id}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</Label>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm text-gray-600 dark:text-gray-300">{user.role}</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View User Details
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company Verification</h3>
                  <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="space-y-0.5">
                      <div className="font-medium text-gray-900 dark:text-white">Verification Status</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle to verify or unverify this company
                      </div>
                    </div>
                    <Switch 
                      checked={company.verified} 
                      onCheckedChange={handleVerificationChange}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-red-200 dark:border-red-800/50 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-red-600 dark:text-red-400">Delete Company</div>
                          <div className="text-sm text-red-500 dark:text-red-400">
                            Permanently delete this company and all associated data
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Company
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}