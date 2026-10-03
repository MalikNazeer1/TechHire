// app/interviewer-dashboard/layout.tsx
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interviewer Dashboard",
  description: "Basic dashboard for interviewers for TechHire activities.",
};

export default function InterviewerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar type={3} />
      <main className="w-full flex-1 overflow-hidden">
        <Header type={3} />
        {children}
      </main>
    </div>
  );
}