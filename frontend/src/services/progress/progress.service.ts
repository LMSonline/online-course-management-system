import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";

/**
 * Course Progress Response Type
 * Matches backend CourseProgressResponse DTO
 */
export interface CourseProgressResponse {
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  courseVersionId: number;
  enrollmentId: number;
  enrollmentStatus: string;
  overallCompletionPercentage: number;
  totalChapters: number;
  completedChapters: number;
  totalLessons: number;
  completedLessons: number;
  totalWatchedMinutes: number;
  averageScore?: number;
  chapters: ChapterProgressResponse[];
}

export interface ChapterProgressResponse {
  chapterId: number;
  chapterTitle: string;
  chapterOrder: number;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  lessons: LessonProgressResponse[];
}

export interface LessonProgressResponse {
  lessonId: number;
  lessonTitle: string;
  lessonOrder: number;
  lessonType: string;
  isCompleted: boolean;
  isViewed: boolean;
  watchedSeconds: number;
  lastAccessedAt?: string;
  completedAt?: string;
}

export const progressService = {
  /**
   * Get student course progress (PROGRESS_GET_COURSE)
   * Contract Key: PROGRESS_GET_COURSE
   * Endpoint: GET /api/v1/students/{studentId}/courses/{courseId}/progress
   */
  getCourseProgress: async (
    studentId: number,
    courseId: number
  ): Promise<CourseProgressResponse> => {
    // DEMO_MODE: Return mock data
    if (DEMO_MODE) {
      return {
        studentId,
        studentName: "Demo Student",
        courseId,
        courseTitle: "Demo Course",
        courseVersionId: 1,
        enrollmentId: 1,
        enrollmentStatus: "ENROLLED",
        overallCompletionPercentage: 45.5,
        totalChapters: 5,
        completedChapters: 2,
        totalLessons: 20,
        completedLessons: 9,
        totalWatchedMinutes: 120,
        averageScore: 8.2,
        chapters: [],
      };
    }

    const response = await axiosClient.get<
      ApiResponse<CourseProgressResponse>
    >(`/students/${studentId}/courses/${courseId}/progress`, {
      contractKey: CONTRACT_KEYS.PROGRESS_GET_COURSE,
    });

    return unwrapResponse(response);
  },

  /**
   * Mark lesson as viewed (PROGRESS_MARK_VIEWED_ACTION)
   * Contract Key: PROGRESS_MARK_VIEWED_ACTION
   * Endpoint: POST /api/v1/lessons/{lessonId}/mark-viewed
   */
  markLessonAsViewed: async (lessonId: number): Promise<LessonProgressResponse> => {
    if (DEMO_MODE) {
      return {
        lessonId,
        lessonTitle: "Demo Lesson",
        lessonOrder: 1,
        lessonType: "VIDEO",
        isCompleted: false,
        isViewed: true,
        watchedSeconds: 0,
      };
    }

    const response = await axiosClient.post<ApiResponse<LessonProgressResponse>>(
      `/lessons/${lessonId}/mark-viewed`,
      {},
      {
        contractKey: CONTRACT_KEYS.PROGRESS_MARK_VIEWED_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Mark lesson as completed (PROGRESS_MARK_COMPLETED_ACTION)
   * Contract Key: PROGRESS_MARK_COMPLETED_ACTION
   * Endpoint: POST /api/v1/lessons/{lessonId}/mark-completed
   */
  markLessonAsCompleted: async (lessonId: number): Promise<LessonProgressResponse> => {
    if (DEMO_MODE) {
      return {
        lessonId,
        lessonTitle: "Demo Lesson",
        lessonOrder: 1,
        lessonType: "VIDEO",
        isCompleted: true,
        isViewed: true,
        watchedSeconds: 0,
        completedAt: new Date().toISOString(),
      };
    }

    const response = await axiosClient.post<ApiResponse<LessonProgressResponse>>(
      `/lessons/${lessonId}/mark-completed`,
      {},
      {
        contractKey: CONTRACT_KEYS.PROGRESS_MARK_COMPLETED_ACTION,
      }
    );

    return unwrapResponse(response);
  },
};

