"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const seniorityLevels = [
  { id: 'internship', title: 'Internship', experience: '0 yrs of experience' },
  { id: 'entry-level', title: 'Entry Level', experience: '0-1 yrs of experience' },
  { id: 'intermediate', title: 'Intermediate', experience: '1-3 yrs of experience' },
  { id: 'mid-senior', title: 'Mid-senior', experience: '3-5 yrs of experience' },
  { id: 'senior', title: 'Senior', experience: '5-8 yrs of experience' },
  { id: 'senior-plus', title: 'Senior+', experience: '8-10 yrs of experience' },
  { id: 'staff', title: 'Staff', experience: '10+ yrs of experience' },
];

interface SenioritySelectionProps {
  onBack: () => void;
  onNext: () => void;
  selectedSeniority: string | null;
  setSelectedSeniority: (seniority: string) => void;
}

export default function SenioritySelection({
  onBack,
  onNext,
  selectedSeniority,
  setSelectedSeniority,
}: SenioritySelectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Select seniority
        </h1>
      </div>

      {/* Seniority Levels */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {seniorityLevels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSeniority(level.id)}
            className={`group cursor-pointer rounded-lg p-4 flex items-center justify-between transition-all duration-200 ${
              selectedSeniority === level.id
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-500"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-md"
            }`}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {level.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {level.experience}
              </p>
            </div>
            <ChevronRight
              className={`h-5 w-5 transition-all ${
                selectedSeniority === level.id
                  ? "text-blue-500"
                  : "text-gray-400 group-hover:text-blue-500"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
          disabled={!selectedSeniority}
        >
          Next
        </Button>
      </div>
    </div>
  );
}