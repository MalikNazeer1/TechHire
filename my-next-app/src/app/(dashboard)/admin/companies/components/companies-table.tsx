// components/companies-table.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Trash,
  Eye,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyDetailsDialog } from "./company-details-dialog";
import { JobDescriptionsDialog } from "./job-descriptions-dialog";
import {
  getCompanies,
  toggleCompanyVerification,
  deleteCompany,
} from "@/lib/api/admin";
import type { Company } from "@/constants/data";
import { motion } from "framer-motion";
import { Building, Briefcase, Users, Mail, Calendar, CheckCircle2 } from "lucide-react";

interface CompaniesTableProps {
  filter: "all" | "verified" | "unverified";
}

export function CompaniesTable({ filter }: CompaniesTableProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showJobDescriptions, setShowJobDescriptions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, [filter]); // Re-fetch when filter changes

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError("Failed to fetch companies");
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && company.verified) ||
      (filter === "unverified" && !company.verified);

    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleVerify = async (companyId: number) => {
    try {
      const company = companies.find((c) => c.id === companyId);
      if (!company) return;

      await toggleCompanyVerification(companyId, !company.verified);

      // Update local state
      setCompanies(
        companies.map((company) =>
          company.id === companyId
            ? { ...company, verified: !company.verified }
            : company
        )
      );

      toast({
        title: "Company updated",
        description: `${company.name} has been ${
          !company.verified ? "verified" : "unverified"
        } successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update company verification status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (companyId: number) => {
    try {
      await deleteCompany(companyId);
      setCompanies(companies.filter((company) => company.id !== companyId));

      toast({
        title: "Company deleted",
        description: "Company has been removed from the system",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const handleViewJobs = (company: Company) => {
    setSelectedCompany(company);
    setShowJobDescriptions(true);
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchCompanies}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="w-full pl-8 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing <strong className="text-gray-900 dark:text-white">{filteredCompanies.length}</strong> of{" "}
              <strong className="text-gray-900 dark:text-white">{companies.length}</strong> companies
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="text-gray-500 dark:text-gray-400">Name</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Industry</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Size</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Verification</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Email</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Created At</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{company.industry}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{company.companySize}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.verified ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <XCircle className="mr-1 h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{company.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-gray-500 dark:text-gray-400">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(company)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Eye className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewJobs(company)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">View Job Descriptions</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleVerify(company.id)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Check className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {company.verified ? "Unverify" : "Verify"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(company.id)}
                            className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg text-gray-500 dark:text-gray-400">
                        No companies found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedCompany && (
        <>
          <CompanyDetailsDialog
            company={selectedCompany}
            open={showCompanyDetails}
            onOpenChange={setShowCompanyDetails}
            onCompanyUpdate={(updatedCompany) => {
              setCompanies(
                companies.map((c) =>
                  c.id === updatedCompany.id ? updatedCompany : c
                )
              );
            }}
          />

          <JobDescriptionsDialog
            companyId={selectedCompany.id}
            companyName={selectedCompany.name}
            open={showJobDescriptions}
            onOpenChange={setShowJobDescriptions}
          />
        </>
      )}
    </>
  );
}
