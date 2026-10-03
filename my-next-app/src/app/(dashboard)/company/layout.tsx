// pages/dashboard/layout.tsx
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { CompanyDashboardProvider } from "@/components/company/company-dashboard-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Dashboard",
  description: "Basic dashboard for companies for TechHire activities.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar type={1} />

      <main className="w-full flex-1 overflow-hidden">
        <Header type={1} />
        <CompanyDashboardProvider>{children}</CompanyDashboardProvider>
      </main>
    </div>
  );
}
