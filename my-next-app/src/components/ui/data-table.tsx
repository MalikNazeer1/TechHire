"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import PdfDownloadWrapper from "@/components/reports/pdfbuttonwrapper"; // Import the PDF download component
import { Search, Users } from "lucide-react";
import {
  useCompanyDashboardStore,
  type CompanyInterviewTableRow,
} from "@/stores/company-dashboard-store";

type InterviewData = CompanyInterviewTableRow;

export default function DataTable() {
  // State management
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<CompanyInterviewTableRow | null>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const interviews = useCompanyDashboardStore((s) => s.candidatesTableRows);
  const bundleLoading = useCompanyDashboardStore((s) => s.isLoading);

  useEffect(() => {
    if (!userEmail) return;
    void useCompanyDashboardStore.getState().ensureLoaded(userEmail);
  }, [userEmail]);

  const isLoading = bundleLoading && interviews.length === 0;

  // Filter interviews based on status and search query
  const filteredInterviews = useMemo(() => {
    let filtered = interviews;

    // Filter by status
    if (filter !== "All") {
      filtered = filtered.filter((interview) => interview.status === filter);
    }

    // Filter by search query (candidate or interviewer email)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (interview) =>
          interview.intervieweeEmail.toLowerCase().includes(query) ||
          (interview.interviewerEmail &&
            interview.interviewerEmail.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [interviews, filter, searchQuery]);

  // Handle view details for an interview
  const handleViewDetails = (interview: InterviewData) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);

    // Different modal content based on status
    if (interview.status === "Completed") {
      const feedback = interview.feedbacks?.[0];
      setModalContent(
        <div className="space-y-4">
          <div>
            <p className="font-medium">Job: {interview.jobTitle}</p>
            <p className="text-sm text-muted-foreground">
              Interviewer: {interview.interviewerEmail || "Not assigned"}
            </p>
            <p className="text-sm text-muted-foreground">
              Interviewee: {interview.intervieweeEmail}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {format(new Date(interview.scheduledAt), "dd MMM yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              Time: {format(new Date(interview.scheduledAt), "hh:mm a")}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {interview.durationInMinutes} minutes
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {interview.status}
            </p>
          </div>
          {feedback && (
            <>
              <div>
                <p className="font-medium">
                  Score: {feedback.averageScore.toFixed(1)}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(feedback.averageScore)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">Hiring Decision:</p>
                <Badge
                  className={
                    feedback.hiringDecision === "STRONG_YES" ||
                    feedback.hiringDecision === "YES"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {feedback.hiringDecision.replace("_", " ")}
                </Badge>
              </div>
            </>
          )}
          {/* Add PDF Download Button for completed interviews */}
          <div className="mt-6">
            <PdfDownloadWrapper interviewId={interview.id} />
          </div>
        </div>
      );
    } else if (interview.status === "Cancelled") {
      setModalContent(
        <div className="space-y-4">
          <div>
            <p className="font-medium">Job: {interview.jobTitle}</p>
            <p className="text-sm text-muted-foreground">
              Interviewer: {interview.interviewerEmail || "Not assigned"}
            </p>
            <p className="text-sm text-muted-foreground">
              Interviewee: {interview.intervieweeEmail}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {format(new Date(interview.scheduledAt), "dd MMM yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              Time: {format(new Date(interview.scheduledAt), "hh:mm a")}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {interview.durationInMinutes} minutes
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {interview.status}
            </p>
            <p className="text-sm text-muted-foreground">
              Cancellation Reason:{" "}
              {interview.cancelledReason || "No reason provided"}
            </p>
          </div>
        </div>
      );
    } else {
      setModalContent(
        <div className="space-y-4">
          <div>
            <p className="font-medium">Job: {interview.jobTitle}</p>
            <p className="text-sm text-muted-foreground">
              Interviewer: {interview.interviewerEmail || "Not assigned"}
            </p>
            <p className="text-sm text-muted-foreground">
              Interviewee: {interview.intervieweeEmail}
            </p>
            <p className="text-sm text-muted-foreground">
              Date: {format(new Date(interview.scheduledAt), "dd MMM yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              Time: {format(new Date(interview.scheduledAt), "hh:mm a")}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {interview.durationInMinutes} minutes
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {interview.status}
            </p>
          </div>
        </div>
      );
    }
  };

  // Define table columns
  const columns: ColumnDef<InterviewData>[] = [
    {
      accessorKey: "intervieweeEmail",
      header: "Candidate",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            {row.original.intervieweeEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {row.original.intervieweeEmail}
            </p>
            <p className="text-sm text-gray-500">{row.original.jobTitle}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "scheduledAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.scheduledAt);
        return (
          <div>
            <p>{format(date, "dd MMM yyyy")}</p>
            <p className="text-sm text-gray-500">{format(date, "hh:mm a")}</p>
            <p className="text-xs text-gray-400">
              {row.original.durationInMinutes} min
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let statusClass = "";

        switch (status) {
          case "Scheduled":
            statusClass = "bg-blue-100 text-blue-600";
            break;
          case "Pending":
            statusClass = "bg-yellow-100 text-yellow-600";
            break;
          case "Completed":
            statusClass = "bg-green-100 text-green-600";
            break;
          case "Cancelled":
            statusClass = "bg-red-100 text-red-600";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-600";
        }

        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        // Don't show action button for pending interviews
        if (row.original.status !== "Pending") {
          return (
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleViewDetails(row.original)}
            >
              View Details
            </button>
          );
        }
        return null;
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: filteredInterviews,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInterview(null);
    setModalContent(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            placeholder="Search by email..."
            className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Tabs for Filtering */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        {["All", "Pending", "Scheduled", "Completed", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                filter === status
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-gray-400" />
                      <p>No interviews found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {filteredInterviews.length > 0
              ? table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredInterviews.length
            )}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {filteredInterviews.length}
          </span>{" "}
          interviews
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Interview Details"
        description="Details of the selected interview"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {modalContent}
      </Modal>
    </div>
  );
}
