import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  CourseEnrollmentResponse,
  EnrollmentStatsResponse,
} from "./enrollment.types";

const ENROLLMENT_PREFIX = "/enrollments";
const TEACHER_PREFIX = "/teacher/enrollments";

export const enrollmentService = {
  /**
   * Get enrollments for a specific course (Teacher only)
   * TODO: Update endpoint when backend is ready
   */
  getCourseEnrollments: async (
    courseId: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<CourseEnrollmentResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseEnrollmentResponse>>
    >(`${TEACHER_PREFIX}/course/${courseId}`, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Get enrollment statistics for a course (Teacher only)
   * TODO: Update endpoint when backend is ready
   */
  getCourseEnrollmentStats: async (
    courseId: number
  ): Promise<EnrollmentStatsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<EnrollmentStatsResponse>
    >(`${TEACHER_PREFIX}/course/${courseId}/stats`);
    return unwrapResponse(response);
  },

  /**
   * Export course enrollments data (Teacher only)
   * TODO: Update endpoint when backend is ready
   */
  exportCourseEnrollments: async (
    courseId: number,
    format: "CSV" | "EXCEL" = "CSV"
  ): Promise<Blob> => {
    const response = await axiosClient.get(
      `${TEACHER_PREFIX}/course/${courseId}/export`,
      {
        params: { format },
        responseType: "blob",
      }
    );
    return response.data;
  },
};
