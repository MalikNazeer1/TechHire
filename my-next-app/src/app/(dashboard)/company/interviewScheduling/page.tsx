"use client";

import { useState } from "react";
import ProfileSelection from "@/components/ProfileSelection";
import SkillSelection from "@/components/SkillSelection";
import SenioritySelection from "@/components/SenioritySelection";
import CustomizeInterview from "@/components/CustomizeInterview";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { invalidateCompanyDashboardCache } from "@/stores/company-dashboard-store";

interface Candidate {
  name: string;
  phoneNumber: string;
  experienceInYears: number;
  email: string;
  resumeLink?: string;
  availability?: string;
}

interface InterviewData {
  companyId: number;
  title: string;
  description: string;
  skills: string[];
  questions: string[];
  experienceLevel: string;
  students: Candidate[];
  interviewerEmail: string;
}

export default function InterviewScheduling() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState<string | null>(
    null
  );
  const [selectedRubrics, setSelectedRubrics] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSelect = (profile: string) => {
    setSelectedProfile(profile);
    setStep(2);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleCandidateUpload = (uploadedCandidates: Candidate[]) => {
    setCandidates(uploadedCandidates);
    handleSubmit(uploadedCandidates);
  };

  const handleSubmit = async (uploadedCandidates: Candidate[]) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const companyId = parseInt(localStorage.getItem("companyId") || "0", 10);
      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Default interviewer email - you might want to get this from a form or context
      const interviewerEmail = "interviewer@company.com";

      const interviewData: InterviewData = {
        companyId,
        title: `${selectedProfile?.toUpperCase()} Interview`,
        description: `Interview for ${selectedProfile} position at ${selectedSeniority} level`,
        skills: selectedSkills,
        questions: selectedRubrics,
        experienceLevel: selectedSeniority || "Entry Level",
        students: uploadedCandidates,
        interviewerEmail,
      };

      const response = await fetch("/api/company/jobDescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to schedule interview");
      }

      await response.json();
      invalidateCompanyDashboardCache();
      router.push("/company");

      // You might want to redirect to a success page or show a success message
      // For now, we'll stay on the same page with a success state
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error("Error scheduling interview:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Select Profile" },
    { number: 2, title: "Choose Skills" },
    { number: 3, title: "Set Seniority" },
    { number: 4, title: "Customize Interview" },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileSelection onSelect={handleProfileSelect} />;
      case 2:
        return (
          <SkillSelection
            onBack={handleBack}
            onNext={handleNext}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            selectedProfile={selectedProfile}
          />
        );
      case 3:
        return (
          <SenioritySelection
            onBack={handleBack}
            onNext={handleNext}
            selectedSeniority={selectedSeniority}
            setSelectedSeniority={setSelectedSeniority}
          />
        );
      case 4:
        return (
          <CustomizeInterview
            onBack={handleBack}
            selectedRubrics={selectedRubrics}
            setSelectedRubrics={setSelectedRubrics}
            selectedSeniority={selectedSeniority}
            selectedSkills={selectedSkills}
            selectedProfile={selectedProfile} // Pass the selectedProfile prop
            onSubmit={handleCandidateUpload}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <ProfileSelection onSelect={handleProfileSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= s.number
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {s.number}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      step > s.number
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((s) => (
              <span
                key={s.number}
                className={`text-sm ${
                  step >= s.number
                    ? "text-blue-500 font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.2,
                ease: "easeInOut"
              }}
              style={{ width: "100%" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-4 right-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg shadow-lg flex items-center gap-3 z-50"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-700 dark:text-gray-300">
                Scheduling interviews...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}