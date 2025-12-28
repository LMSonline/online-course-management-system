import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  EnrollCourseRequest,
  CancelEnrollmentRequest,
  EnrollmentResponse,
  EnrollmentDetailResponse,
  EnrollmentStatsResponse,
} from "./enrollment.types";

export const enrollmentService = {
  // ===========================
  // Student APIs
  // ===========================

  /**
   * POST /courses/{courseId}/enroll - Enroll in a course
   */
  enrollCourse: async (
    courseId: number,
    payload: EnrollCourseRequest
  ): Promise<EnrollmentDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<EnrollmentDetailResponse>
    >(`/courses/${courseId}/enroll`, payload);
    return unwrapResponse(response);
  },

  /**
   * GET /students/{studentId}/enrollments - Get student enrollments
   */
  getStudentEnrollments: async (
    studentId: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<EnrollmentResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<EnrollmentResponse>>
    >(`/students/${studentId}/enrollments`, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * GET /enrollments/{id} - Get enrollment details
   */
  getEnrollmentDetail: async (
    id: number
  ): Promise<EnrollmentDetailResponse> => {
    const response = await axiosClient.get<
      ApiResponse<EnrollmentDetailResponse>
    >(`/enrollments/${id}`);
    return unwrapResponse(response);
  },

  /**
   * POST /enrollments/{id}/cancel - Cancel enrollment
   */
  cancelEnrollment: async (
    id: number,
    payload: CancelEnrollmentRequest
  ): Promise<EnrollmentDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<EnrollmentDetailResponse>
    >(`/enrollments/${id}/cancel`, payload);
    return unwrapResponse(response);
  },

  // ===========================
  // Teacher APIs
  // ===========================

  /**
   * GET /courses/{courseId}/enrollments - Get course enrollments (Teacher)
   */
  getCourseEnrollments: async (
    courseId: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<EnrollmentResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<EnrollmentResponse>>
    >(`/courses/${courseId}/enrollments`, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * POST /enrollments/{id}/complete - Complete enrollment (Teacher)
   */
  completeEnrollment: async (id: number): Promise<EnrollmentDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<EnrollmentDetailResponse>
    >(`/enrollments/${id}/complete`);
    return unwrapResponse(response);
  },

  /**
   * GET /courses/{courseId}/enrollment-stats - Get enrollment statistics (Teacher)
   */
  getEnrollmentStats: async (
    courseId: number
  ): Promise<EnrollmentStatsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<EnrollmentStatsResponse>
    >(`/courses/${courseId}/enrollment-stats`);
    return unwrapResponse(response);
  },
};
