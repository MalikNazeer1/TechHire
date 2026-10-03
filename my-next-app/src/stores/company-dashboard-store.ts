import { create } from "zustand";

/** Max rows per list when hydrating company area (dashboard + candidates table). */
const LIST_LIMIT = 500;

export interface CompanyStatistics {
  upcomingInterviewsCount: number;
  recentlyCompletedInterviewsCount: number;
  totalCompletedInterviewsCount: number;
  inProcessInterviewsCount: number;
  cancelledInterviewsCount: number;
  droppedInterviewsCount: number;
  pendingInterviewsCount: number;
  totalCandidates: number;
}

export interface CompanyInterviewBase {
  id: number;
  jobTitle: string;
  interviewerEmail?: string;
  intervieweeEmail: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: string;
  meetingLink?: string;
  cancelledReason?: string;
}

export interface CompanyCompletedInterview extends CompanyInterviewBase {
  feedbacks: Array<{ averageScore: number; hiringDecision: string }>;
}

/** Normalized row for the candidates / interviews data table */
export type CompanyInterviewTableRow = CompanyInterviewBase & {
  feedbacks?: CompanyCompletedInterview["feedbacks"];
};

interface CompanyInterviewListResponse {
  interviews?: unknown[];
  pagination?: unknown;
}

function buildTableRows(
  pending: CompanyInterviewListResponse,
  upcoming: CompanyInterviewListResponse,
  completed: CompanyInterviewListResponse,
  cancelled: CompanyInterviewListResponse
): CompanyInterviewTableRow[] {
  return [
    ...(pending.interviews ?? []).map((interview: any) => ({
      ...interview,
      status: "Pending",
    })),
    ...(upcoming.interviews ?? []).map((interview: any) => ({
      ...interview,
      status: "Scheduled",
    })),
    ...(completed.interviews ?? []).map((interview: any) => ({
      ...interview,
      status: "Completed",
    })),
    ...(cancelled.interviews ?? []).map((interview: any) => ({
      ...interview,
      status: "Cancelled",
    })),
  ];
}

function computeRecentCompleted(
  completed: CompanyCompletedInterview[]
): CompanyCompletedInterview[] {
  const week = new Date();
  week.setDate(week.getDate() - 7);
  return completed.filter(
    (interview) => new Date(interview.scheduledAt) >= week
  );
}

interface CompanyDashboardState {
  cachedEmail: string | null;
  statistics: CompanyStatistics | null;
  upcomingInterviews: CompanyInterviewBase[];
  completedInterviews: CompanyCompletedInterview[];
  recentlyCompletedInterviews: CompanyCompletedInterview[];
  candidatesTableRows: CompanyInterviewTableRow[];
  isLoading: boolean;
  error: string | null;
}

interface CompanyDashboardActions {
  reset: () => void;
  invalidateCache: () => void;
  ensureLoaded: (email: string | undefined) => Promise<void>;
  refresh: (email: string | undefined) => Promise<void>;
}

const initialState: CompanyDashboardState = {
  cachedEmail: null,
  statistics: null,
  upcomingInterviews: [],
  completedInterviews: [],
  recentlyCompletedInterviews: [],
  candidatesTableRows: [],
  isLoading: false,
  error: null,
};

let loadPromise: Promise<void> | null = null;
let loadPromiseForEmail: string | null = null;

export const useCompanyDashboardStore = create<
  CompanyDashboardState & CompanyDashboardActions
>((set, get) => ({
  ...initialState,

  reset: () => {
    loadPromise = null;
    loadPromiseForEmail = null;
    set(initialState);
  },

  invalidateCache: () => {
    set({ cachedEmail: null });
  },

  ensureLoaded: async (email) => {
    if (!email) return;
    const { cachedEmail, statistics } = get();
    if (cachedEmail === email && statistics !== null) return;

    if (loadPromise && loadPromiseForEmail === email) {
      await loadPromise;
      return;
    }

    loadPromiseForEmail = email;
    loadPromise = get()
      .refresh(email)
      .finally(() => {
        loadPromise = null;
        loadPromiseForEmail = null;
      });
    await loadPromise;
  },

  refresh: async (email) => {
    if (!email) return;

    set({ isLoading: true, error: null });

    try {
      const q = encodeURIComponent(email);
      const [
        statsRes,
        pendingRes,
        upcomingRes,
        completedRes,
        cancelledRes,
      ] = await Promise.all([
        fetch(`/api/company/dashboard?email=${q}`),
        fetch(
          `/api/company/pending-interviews?email=${q}&limit=${LIST_LIMIT}&page=1`
        ),
        fetch(
          `/api/company/upcoming-interviews?email=${q}&limit=${LIST_LIMIT}&page=1`
        ),
        fetch(
          `/api/company/completed-interviews?email=${q}&limit=${LIST_LIMIT}&page=1`
        ),
        fetch(
          `/api/company/cancelled-interviews?email=${q}&limit=${LIST_LIMIT}&page=1`
        ),
      ]);

      const statistics = statsRes.ok
        ? ((await statsRes.json()) as CompanyStatistics)
        : null;

      if (!statsRes.ok) {
        const errBody = await statsRes.json().catch(() => ({} as any));
        set({
          error:
            typeof errBody?.error === "string"
              ? errBody.error
              : "Failed to load dashboard statistics",
        });
      }

      const pendingData: CompanyInterviewListResponse = pendingRes.ok
        ? await pendingRes.json()
        : { interviews: [] };
      const upcomingData: CompanyInterviewListResponse = upcomingRes.ok
        ? await upcomingRes.json()
        : { interviews: [] };
      const completedData: CompanyInterviewListResponse = completedRes.ok
        ? await completedRes.json()
        : { interviews: [] };
      const cancelledData: CompanyInterviewListResponse = cancelledRes.ok
        ? await cancelledRes.json()
        : { interviews: [] };

      const completedList = (completedData.interviews ?? []) as CompanyCompletedInterview[];

      set({
        statistics,
        upcomingInterviews: (upcomingData.interviews ?? []) as CompanyInterviewBase[],
        completedInterviews: completedList,
        recentlyCompletedInterviews: computeRecentCompleted(completedList),
        candidatesTableRows: buildTableRows(
          pendingData,
          upcomingData,
          completedData,
          cancelledData
        ),
        cachedEmail: email,
        isLoading: false,
      });
    } catch (e) {
      console.error("Company dashboard bundle fetch failed:", e);
      set({
        isLoading: false,
        error: "Failed to load company data",
      });
    }
  },
}));

/** Call after mutations (e.g. new interview scheduled) so the next view refetches. */
export function invalidateCompanyDashboardCache() {
  useCompanyDashboardStore.getState().invalidateCache();
}
