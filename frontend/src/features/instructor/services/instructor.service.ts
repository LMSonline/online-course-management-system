/**
 * Instructor service - handles instructor-related API calls
 */

import { apiClient } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { INSTRUCTOR_DASHBOARD_MOCK } from "../mocks/dashboard.mocks";
import type { InstructorDashboardData } from "../types/dashboard.types";

/**
 * Get instructor dashboard data
 * Combines stats, revenue, courses, etc.
 */
export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  if (USE_MOCK) {
    return Promise.resolve(INSTRUCTOR_DASHBOARD_MOCK);
  }

  const teacherId = typeof window !== "undefined" ? localStorage.getItem("teacherId") : null;
  if (!teacherId) {
    throw new Error("Teacher ID not found");
  }

  try {
    // Fetch stats, revenue, and courses in parallel
    const [stats, revenue, courses] = await Promise.all([
      apiClient.get(`/teachers/${teacherId}/stats`).catch(() => null),
      apiClient.get(`/teachers/${teacherId}/revenue`).catch(() => null),
      apiClient.get(`/teachers/${teacherId}/courses`, { params: { page: 0, size: 10 } }).catch(() => null),
    ]);

    // Transform backend data to dashboard format
    // Note: This is a simplified transformation - adjust based on actual backend response shapes
    return {
      overview: {
        totalCourses: stats?.data?.totalCourses || 0,
        totalStudents: stats?.data?.totalStudents || 0,
        totalRevenue: revenue?.data?.totalRevenue || 0,
        averageRating: stats?.data?.averageRating || 0,
      },
      revenueHistory: revenue?.data?.monthlyRevenue || [],
      enrollmentByCourse: courses?.data?.items?.map((c: { id: number; title: string }) => ({
        courseId: c.id,
        courseTitle: c.title,
        enrollments: 0, // TODO: Get from course stats
      })) || [],
      quickSections: [],
      tasks: [],
      reviews: [],
      courses: courses?.data?.items?.map((c: { id: number; title: string; categoryName?: string; difficulty?: string; isClosed?: boolean }) => ({
        id: c.id.toString(),
        title: c.title,
        category: c.categoryName || "",
        level: (c.difficulty || "Beginner") as "Beginner" | "Intermediate" | "Advanced",
        students: 0,
        revenue: 0,
        rating: 0,
        completionRate: 0,
        status: c.isClosed ? "Private" as const : "Published" as const,
        lastUpdated: new Date().toLocaleDateString(),
      })) || [],
    };
  } catch (error) {
    console.error("Failed to load instructor dashboard:", error);
    return INSTRUCTOR_DASHBOARD_MOCK;
  }
}

/**
 * Get current teacher profile
 */
export async function getCurrentTeacher() {
  if (USE_MOCK) {
    return Promise.resolve({
      id: 1,
      accountId: 1,
      teacherCode: "GV001",
      fullName: "Mock Teacher",
      email: "teacher@example.com",
      username: "teacher",
      approved: true,
    });
  }

  const response = await apiClient.get("/teachers/me");
  return response.data;
}

/**
 * Get teacher stats
 */
export async function getTeacherStats(teacherId: number) {
  if (USE_MOCK) {
    return Promise.resolve({
      totalCourses: 0,
      totalStudents: 0,
      averageRating: 0,
      totalReviews: 0,
    });
  }

  const response = await apiClient.get(`/teachers/${teacherId}/stats`);
  return response.data;
}

/**
 * Get teacher revenue
 */
export async function getTeacherRevenue(teacherId: number) {
  if (USE_MOCK) {
    return Promise.resolve({
      totalRevenue: 0,
      monthlyRevenue: [],
    });
  }

  const response = await apiClient.get(`/teachers/${teacherId}/revenue`);
  return response.data;
}

/**
 * Get teacher courses
 */
export async function getTeacherCourses(teacherId: number, page = 0, size = 10) {
  if (USE_MOCK) {
    return Promise.resolve({
      items: [],
      page: 0,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }

  const response = await apiClient.get(`/teachers/${teacherId}/courses`, {
    params: { page, size },
  });
  return response.data;
}

