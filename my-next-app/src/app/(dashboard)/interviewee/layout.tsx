// pages/dashboard/layout.tsx
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { DashboardProvider } from '@/app/context/DashboardContext'; // Import the provider
import type { Metadata } from "next";
// import { ProductProvider } from '../context/ProductContext';

export const metadata: Metadata = {
  title: "Interviewee Dashboard",
  description: "Basic dashboard for interviewee for TechHire activities.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="flex">
      <Sidebar type={2} />
      <main className="w-full flex-1 overflow-hidden">
        <Header type={2} />
        {children}
      </main>
    </div>
  );
}