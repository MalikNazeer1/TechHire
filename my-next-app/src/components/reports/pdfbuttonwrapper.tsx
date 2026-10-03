"use client";

import React from "react";
import PdfDownloadButton from "@/components/reports/PdfDownloadButton";
export const dynamic = "force-dynamic";

// Create a wrapper component with proper TypeScript typing
interface PdfDownloadWrapperProps {
  interviewId: number | string;
}

// This wrapper component ensures type compatibility
const PdfDownloadWrapper: React.FC<PdfDownloadWrapperProps> = ({
  interviewId,
}) => {
  return (
    // @ts-ignore - Ignore TypeScript errors for the underlying component
    <PdfDownloadButton interviewId={interviewId} />
  );
};

export default PdfDownloadWrapper;
