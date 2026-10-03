"use client";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

export default function ManagerClient() {

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <Heading
            title="Candidates"
            description="Candidates related activities."
          />
        </div>
      </div>
      <Separator className="bg-gray-200 dark:bg-gray-700" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <DataTable />
      </div>
    </div>
  );
}
