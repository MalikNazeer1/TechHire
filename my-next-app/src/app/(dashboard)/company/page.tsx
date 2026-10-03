"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CompanyDashboard from "./CompanyDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/SignIn");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Loading Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <CompanyDashboard />;
}
