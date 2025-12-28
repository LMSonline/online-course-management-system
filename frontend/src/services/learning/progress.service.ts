import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  StudentProgressOverviewResponse,
  CourseProgressResponse,
  LessonProgressResponse,
  CourseProgressStatsResponse,
} from "./progress.types";

export const progressService = {
  // ===========================
  // Student APIs
  // ===========================

  /**
   * GET /students/{studentId}/progress - Get student overall progress
   */
  getStudentProgress: async (
    studentId: number
  ): Promise<StudentProgressOverviewResponse> => {
    const response = await axiosClient.get<
      ApiResponse<StudentProgressOverviewResponse>
    >(`/students/${studentId}/progress`);
    return unwrapResponse(response);
  },

  /**
   * GET /students/{studentId}/courses/{courseId}/progress - Get student course progress
   */
  getStudentCourseProgress: async (
    studentId: number,
    courseId: number
  ): Promise<CourseProgressResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseProgressResponse>>(
      `/students/${studentId}/courses/${courseId}/progress`
    );
    return unwrapResponse(response);
  },

  /**
   * GET /students/{studentId}/lessons/{lessonId}/progress - Get student lesson progress
   */
  getStudentLessonProgress: async (
    studentId: number,
    lessonId: number
  ): Promise<LessonProgressResponse> => {
    const response = await axiosClient.get<ApiResponse<LessonProgressResponse>>(
      `/students/${studentId}/lessons/${lessonId}/progress`
    );
    return unwrapResponse(response);
  },

  /**
   * POST /lessons/{lessonId}/mark-viewed - Mark lesson as viewed
   */
  markLessonAsViewed: async (
    lessonId: number
  ): Promise<LessonProgressResponse> => {
    const response = await axiosClient.post<
      ApiResponse<LessonProgressResponse>
    >(`/lessons/${lessonId}/mark-viewed`);
    return unwrapResponse(response);
  },

  /**
   * POST /lessons/{lessonId}/mark-completed - Mark lesson as completed
   */
  markLessonAsCompleted: async (
    lessonId: number
  ): Promise<LessonProgressResponse> => {
    const response = await axiosClient.post<
      ApiResponse<LessonProgressResponse>
    >(`/lessons/${lessonId}/mark-completed`);
    return unwrapResponse(response);
  },

  // ===========================
  // Teacher APIs
  // ===========================

  /**
   * GET /courses/{courseId}/progress-stats - Get course progress statistics (Teacher)
   */
  getCourseProgressStats: async (
    courseId: number
  ): Promise<CourseProgressStatsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<CourseProgressStatsResponse>
    >(`/courses/${courseId}/progress-stats`);
    return unwrapResponse(response);
  },
};
