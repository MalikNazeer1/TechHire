"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

interface Candidate {
  name: string;
  phoneNumber: string;
  experienceInYears: number;
  email: string; // Added to match CustomizeInterview's interface
  availability?: string;
  resumeLink?: string;
}

interface CandidateUploadProps {
  onComplete: (candidates: Candidate[]) => void;
}

export default function CandidateUpload({ onComplete }: CandidateUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const validateData = (data: any[]): { isValid: boolean; error?: string } => {
    if (!Array.isArray(data) || data.length === 0) {
      return { isValid: false, error: "No data found in the file" };
    }

    const requiredColumns = [
      "Name",
      "Phone Number",
      "Experience in Years",
      "Email",
    ];
    const headers = Object.keys(data[0]);

    for (const column of requiredColumns) {
      if (!headers.includes(column)) {
        return { isValid: false, error: `Missing required column: ${column}` };
      }
    }

    for (const row of data) {
      if (!row.Name || typeof row.Name !== "string") {
        return { isValid: false, error: "Invalid name in row" };
      }
      if (
        !row["Phone Number"] ||
        (typeof row["Phone Number"] !== "string" &&
          typeof row["Phone Number"] !== "number")
      ) {
        return { isValid: false, error: "Invalid phone number in row" };
      }
      if (
        !row["Experience in Years"] ||
        isNaN(Number(row["Experience in Years"]))
      ) {
        return { isValid: false, error: "Invalid experience years in row" };
      }
      if (!row.Email || typeof row.Email !== "string") {
        return { isValid: false, error: "Invalid email in row" };
      }
    }

    return { isValid: true };
  };

  const processFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validation = validateData(jsonData);
      if (!validation.isValid) {
        setError(validation.error || "Invalid data format");
        return;
      }

      const processedCandidates = jsonData.map((row: any) => ({
        name: row.Name,
        phoneNumber: row["Phone Number"],
        experienceInYears: Number(row["Experience in Years"]),
        email: row.Email,
        availability: row["Availability (optional)"] || undefined,
        resumeLink: row["Resume Link"] || undefined,
      }));

      setCandidates(processedCandidates);
      setSuccess(true);
      setError(null);
      onComplete(processedCandidates);
    } catch (err) {
      setError("Error processing file. Please ensure it's a valid Excel file.");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      await processFile(file);
    } else {
      setError("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Candidates</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onComplete(candidates)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isDragging 
                ? "bg-blue-100 dark:bg-blue-900/30" 
                : "bg-gray-100 dark:bg-gray-800"
            }`}>
              <Upload className={`h-8 w-8 transition-colors duration-200 ${
                isDragging 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-400 dark:text-gray-500"
              }`} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop your Excel file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse (.xlsx or .xls)
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="mt-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Select File
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">
                  Successfully uploaded {candidates.length} candidates
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {candidates.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {candidates.length} candidates
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {candidates.map((candidate, index) => (
                      <tr 
                        key={index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {candidate.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {candidate.phoneNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {candidate.experienceInYears} years
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {candidate.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => onComplete(candidates)}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onComplete(candidates)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={candidates.length === 0}
          >
            Confirm Upload
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
