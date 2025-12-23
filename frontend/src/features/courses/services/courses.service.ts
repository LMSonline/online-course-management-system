/**
 * Courses service - handles course-related API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import type { PageResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { COURSE_CATALOG_MOCK } from "../mocks/catalog.mocks";
import type { CourseSummary } from "../types/catalog.types";
import type { CourseDetail } from "../types/course-detail.types";

export interface CourseListParams {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  code: string;
  description: string;
  visible: boolean;
  parentId: number | null;
  deletedAt: string | null;
  children: CategoryResponseDto[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  thumbnailUrl: string;
}

export interface CourseResponse {
  id: number;
  title: string;
  shortDescription: string;
  difficulty: string;
  thumbnailUrl: string;
  slug: string;
  isClosed: boolean;
  categoryId: number;
  categoryName: string;
  teacherId: number;
  teacherName: string;
  publicVersionId: number;
}

export interface CourseReviewResponse {
  id: number;
  rating: number;
  comment: string;
  studentId: number;
  studentName: string;
  studentAvatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface RatingSummaryResponse {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    [key: number]: number; // rating -> count
  };
}

export interface ChapterDto {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: LessonDTO[];
}

export interface LessonDTO {
  id: number;
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl: string | null;
  resources: any[];
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

  try {
    const response = await apiClient.get<PageResponse<CourseResponse>>("/courses", {
      params: {
        page: params?.page || 0,
        size: params?.size || 20,
      },
    });
    
    // Transform backend response to frontend format
    return response.data.items.map((course) => ({
      id: course.id.toString(),
      title: course.title,
      instructor: course.teacherName,
      category: course.categoryName,
      level: course.difficulty as "Beginner" | "Intermediate" | "Advanced",
      rating: 4.5, // TODO: Get from reviews
      ratingCount: 0, // TODO: Get from reviews
      students: 0, // TODO: Get from enrollment count
      duration: "0h 0m", // TODO: Calculate from lessons
      lectures: 0, // TODO: Count lessons
      thumbColor: "from-blue-500 to-purple-600",
      priceLabel: "₫2,239,000",
    }));
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return COURSE_CATALOG_MOCK;
  }
}

/**
 * Get course by slug
 */
export async function getCourseBySlug(slug: string): Promise<CourseDetail> {
  if (USE_MOCK) {
    const { MOCK_COURSE } = await import("../mocks/course-detail.mocks");
    if (MOCK_COURSE.slug === slug || MOCK_COURSE.id === slug) {
      return Promise.resolve(MOCK_COURSE);
    }
    throw new Error("Course not found");
  }

  try {
    const response = await apiClient.get<CourseResponse>(`/courses/${slug}`);
    const course = response.data;
    
    // Transform backend response to frontend format
    // Note: This is a simplified transformation - you may need to fetch additional data
    return {
      id: course.id.toString(),
      slug: course.slug,
      title: course.title,
      subtitle: course.shortDescription,
      rating: 4.5, // TODO: Get from reviews
      ratingCount: 0, // TODO: Get from reviews
      studentsCount: 0, // TODO: Get from enrollment count
      lastUpdated: new Date().toISOString(),
      language: "English",
      subtitles: [],
      level: course.difficulty as "Beginner" | "Intermediate" | "Advanced",
      whatYouWillLearn: [],
      includes: [],
      sections: [],
      description: course.shortDescription,
      instructor: {
        name: course.teacherName,
        title: "Instructor",
        about: "",
      },
    };
  } catch (error) {
    console.error("Failed to fetch course:", error);
    const { MOCK_COURSE } = await import("../mocks/course-detail.mocks");
    if (MOCK_COURSE.slug === slug || MOCK_COURSE.id === slug) {
      return MOCK_COURSE;
    }
    throw new Error("Course not found");
  }
}

/**
 * Get category tree
 */
export async function getCategoryTree(): Promise<CategoryResponseDto[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<CategoryResponseDto[]>("/categories/tree");
  return response.data;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryResponseDto> {
  if (USE_MOCK) {
    throw new Error("Category not found");
  }

  const response = await apiClient.get<CategoryResponseDto>(`/categories/slug/${slug}`);
  return response.data;
}

/**
 * Get course reviews
 */
export async function getCourseReviews(
  courseId: number,
  page = 0,
  size = 10
): Promise<PageResponse<CourseReviewResponse>> {
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

  const response = await apiClient.get<PageResponse<CourseReviewResponse>>(
    `/courses/${courseId}/reviews`,
    { params: { page, size } }
  );
  return response.data;
}

/**
 * Get course rating summary
 */
export async function getCourseRatingSummary(courseId: number): Promise<RatingSummaryResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      averageRating: 4.5,
      totalRatings: 0,
      ratingDistribution: {},
    });
  }

  const response = await apiClient.get<RatingSummaryResponse>(
    `/courses/${courseId}/rating-summary`
  );
  return response.data;
}

/**
 * Create course review
 */
export async function createCourseReview(
  courseId: number,
  payload: { rating: number; comment: string }
): Promise<CourseReviewResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: Date.now(),
      ...payload,
      studentId: 1,
      studentName: "Mock User",
      studentAvatarUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  const response = await apiClient.post<CourseReviewResponse>(
    `/courses/${courseId}/reviews`,
    payload
  );
  return response.data;
}

/**
 * Get chapters for a course version
 */
export async function getChapters(
  courseId: number,
  versionId: number
): Promise<ChapterDto[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<ChapterDto[]>(
    `/courses/${courseId}/versions/${versionId}/chapters`
  );
  return response.data;
}

/**
 * Get lessons by chapter
 */
export async function getLessonsByChapter(chapterId: number): Promise<LessonDTO[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<LessonDTO[]>(`/chapters/${chapterId}/lessons`);
  return response.data;
}

/**
 * Get lesson by ID
 */
export async function getLessonById(lessonId: number): Promise<LessonDTO> {
  if (USE_MOCK) {
    throw new Error("Lesson not found");
  }

  const response = await apiClient.get<LessonDTO>(`/lessons/${lessonId}`);
  return response.data;
}

/**
 * Get video stream URL for a lesson
 */
export async function getVideoStreamUrl(lessonId: number): Promise<string> {
  if (USE_MOCK) {
    return Promise.resolve("https://example.com/video.mp4");
  }

  const response = await apiClient.get<{ streamUrl: string }>(
    `/lessons/${lessonId}/video/stream-url`
  );
  return response.data.streamUrl;
}

