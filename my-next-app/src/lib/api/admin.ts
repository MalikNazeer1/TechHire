// lib/api/admin.ts
import { Company, JobDescription } from "@/constants/data";

const API_BASE_URL = "/api/admin";

/**
 * Fetch all companies
 */
export async function getCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_BASE_URL}/companies`);

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return response.json();
}

/**
 * Fetch a single company by ID
 */
export async function getCompany(id: number): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch company");
  }

  return response.json();
}

/**
 * Toggle company verification status
 */
export async function toggleCompanyVerification(
  id: number,
  verified: boolean
): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ verified }),
  });

  if (!response.ok) {
    throw new Error("Failed to update company verification status");
  }

  return response.json();
}

/**
 * Delete a company
 */
export async function deleteCompany(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete company");
  }
}

/**
 * Fetch job descriptions for a company
 */
export async function getJobDescriptions(
  companyId: number
): Promise<JobDescription[]> {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/jobs`);

  if (!response.ok) {
    throw new Error("Failed to fetch job descriptions");
  }

  return response.json();
}

/**
 * Create a new job description
 */
export async function createJobDescription(
  companyId: number,
  data: Partial<JobDescription>
): Promise<JobDescription> {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create job description");
  }

  return response.json();
}

/**
 * Fetch company statistics
 */
export async function getCompanyStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch company statistics");
  }

  return response.json();
}

/**
 * Delete a job description
 */
export async function deleteJobDescription(jobId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete job description");
  }
}

/**
 * Update job description
 */
export async function updateJobDescription(
  id: number,
  data: Partial<JobDescription>
): Promise<JobDescription> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update job description");
  }

  return response.json();
}

/**
 * Update company details
 */
export async function updateCompany(
  id: number,
  data: Partial<Company>
): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update company");
  }

  return response.json();
}

/**
 * Create a new company
 */
export async function createCompany(data: Partial<Company>): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create company");
  }

  return response.json();
}
