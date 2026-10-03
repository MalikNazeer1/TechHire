"use client";

import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import InterviewReportPDF from "@/components/reports/InterviewReport";
export const dynamic = "force-dynamic";

/**
 * Button component that fetches interview feedback data and generates a PDF report
 * @param {Object} props - Component props
 * @param {string|number} props.interviewId - The ID of the interview to generate PDF for
 * @returns {React.Component} Download button component
 */
export default function PdfDownloadButton({ interviewId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch interview feedback data
  useEffect(() => {
    const fetchInterviewData = async () => {
      if (!interviewId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/interviews/feedback?id=${interviewId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch interview data: ${response.statusText}`
          );
        }

        const data = await response.json();
        const formattedData = formatDataForReport(data);
        setReportData(formattedData);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  /**
   * Formats API response data into the structure required by InterviewReportPDF
   * @param {Object} apiData - Raw data from the API
   * @returns {Object} Formatted data for PDF report
   */
  const formatDataForReport = (apiData) => {
    if (!apiData) return null;

    // Extract data from API response
    const {
      candidateInfo,
      technicalSkills,
      interviewQuestions,
      detailedAssessment,
      hiringDecision,
      averageScore,
      interview,
    } = apiData;

    // Format candidate info
    const formattedCandidateInfo = {
      position: candidateInfo.position || "Not specified",
      interviewerCredentials: candidateInfo.interviewer || "Not specified",
      interviewDate: candidateInfo.date || new Date().toLocaleDateString(),
      totalTimeSpent: candidateInfo.duration || "Not specified",
      roundName: candidateInfo.round || "Technical Interview",
      interviewerDecision: hiringDecision || "Not specified",
    };

    // Format ratings

    // Format questions
    const formattedQuestions = Array.isArray(interviewQuestions)
      ? interviewQuestions.map((category) => ({
          section: category.category,
          questions: category.questions || [],
        }))
      : [];

    // Format detailed evaluations
    const formattedEvaluations = Array.isArray(detailedAssessment)
      ? detailedAssessment.map((assessment) => ({
          section: assessment.category,
          rating: assessment.score,
          strengths: assessment.strengths || "Not specified",
          areasOfImprovement: assessment.areasForImprovement || "Not specified",
        }))
      : [];

    // Return the formatted data
    return {
      candidateInfo: formattedCandidateInfo,
      ratings: technicalSkills || [],
      questionsAsked: formattedQuestions,
      evaluations: formattedEvaluations,
    };
  };

  // If data is still loading, show loading button
  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading data...
      </Button>
    );
  }

  // If there was an error, show error button
  if (error) {
    return (
      <Button variant="destructive" className="w-full" disabled>
        Error loading data
      </Button>
    );
  }

  // If no data is available yet, show disabled button
  if (!reportData) {
    return (
      <Button disabled className="w-full">
        Prepare PDF Report
      </Button>
    );
  }

  // When data is ready, show download link
  return (
    <PDFDownloadLink
      document={<InterviewReportPDF data={reportData} />}
      fileName={`interview_report_${interviewId}.pdf`}
      className="w-full"
    >
      {({ blob, url, loading, error }) => (
        <Button disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            "Download Interview Report"
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
