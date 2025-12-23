/**
 * Instructor service - handles instructor-related API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { INSTRUCTOR_DASHBOARD_MOCK } from "../mocks/dashboard.mocks";
import type { InstructorDashboardData } from "../types/dashboard.types";

/**
 * Get instructor dashboard data
 */
export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  if (USE_MOCK) {
    return Promise.resolve(INSTRUCTOR_DASHBOARD_MOCK);
  }

  // TODO: Replace with actual API endpoint when backend is ready
  // Expected endpoint: GET /api/v1/teachers/{id}/stats
  // This should combine stats, revenue, courses, etc.
  const teacherId = typeof window !== "undefined" ? localStorage.getItem("teacherId") : null;
  if (!teacherId) {
    throw new Error("Teacher ID not found");
  }

  // For now, return mock until backend endpoint is ready
  // const response = await apiClient.get<ApiResponse<InstructorDashboardData>>(
  //   `/api/v1/teachers/${teacherId}/stats`
  // );
  // return response.data.data;

  return Promise.resolve(INSTRUCTOR_DASHBOARD_MOCK);
}

