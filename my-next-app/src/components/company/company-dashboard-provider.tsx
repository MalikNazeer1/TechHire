"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useCompanyDashboardStore } from "@/stores/company-dashboard-store";

/**
 * Keeps company dashboard + candidates table data in Zustand and loads once per session
 * (until invalidated) while navigating under /company/*.
 */
export function CompanyDashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (status === "loading") return;

    if (!email) {
      useCompanyDashboardStore.getState().reset();
      return;
    }

    void useCompanyDashboardStore.getState().ensureLoaded(email);
  }, [email, status]);

  return <>{children}</>;
}
