/**
 * Courses service - handles course-related API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { COURSE_CATALOG_MOCK } from "../mocks/catalog.mocks";
import type { CourseSummary } from "../types/catalog.types";

export interface CourseListParams {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  size?: number;
}

/**
 * Get list of courses
 */
export async function listCourses(params?: CourseListParams): Promise<CourseSummary[]> {
  if (USE_MOCK) {
    let result = [...COURSE_CATALOG_MOCK];

    // Apply filters
    if (params?.category && params.category !== "All") {
      result = result.filter((c) => c.category === params.category);
    }
    if (params?.level) {
      result = result.filter((c) => c.level === params.level);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(result);
  }

  // TODO: Replace with actual API endpoint
  // Expected endpoint: GET /api/v1/courses
  // const response = await apiClient.get<ApiResponse<CourseSummary[]>>("/api/v1/courses", {
  //   params,
  // });
  // return response.data.data;

  return Promise.resolve(COURSE_CATALOG_MOCK);
}

/**
 * Get course by slug
 */
export async function getCourseBySlug(slug: string): Promise<any> {
  if (USE_MOCK) {
    // Import mock dynamically to avoid circular dependencies
    const { MOCK_COURSE } = await import("../mocks/course-detail.mocks");
    // Simple slug matching for mock
    if (MOCK_COURSE.slug === slug || MOCK_COURSE.id === slug) {
      return Promise.resolve(MOCK_COURSE);
    }
    throw new Error("Course not found");
  }

  // TODO: Replace with actual API endpoint
  // Expected endpoint: GET /api/v1/courses/{slug}
  // const response = await apiClient.get<ApiResponse<CourseDetail>>(`/api/v1/courses/${slug}`);
  // return response.data.data;

  // Fallback to mock for now
  const { MOCK_COURSE } = await import("../mocks/course-detail.mocks");
  if (MOCK_COURSE.slug === slug || MOCK_COURSE.id === slug) {
    return Promise.resolve(MOCK_COURSE);
  }
  throw new Error("Course not found");
}

