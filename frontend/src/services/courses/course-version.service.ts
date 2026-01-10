import { CourseVersionRequest, CourseVersionResponse } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { RejectRequest } from "../account";

export const courseVersionService = {
  /**
   * Create a new course version (Teacher only)
   */
  createCourseVersion: async (
    courseId: number,
    payload: CourseVersionRequest
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all course versions (Teacher only)
   */
  getCourseVersions: async (
    courseId: number
  ): Promise<CourseVersionResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CourseVersionResponse[]>
    >(`/courses/${courseId}/versions`);

    return unwrapResponse(response);
  },

  /**
   * Get deleted course versions (Teacher only)
   */
  getDeletedCourseVersions: async (
    courseId: number
  ): Promise<CourseVersionResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CourseVersionResponse[]>
    >(`/courses/${courseId}/versions/deleted`);

    return unwrapResponse(response);
  },

  /**
   * Get course version by ID (Teacher only)
   */
  getCourseVersionById: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}`
    );

    return unwrapResponse(response);
  },

  /**
   * Update course version (Teacher only)
   */
  updateCourseVersion: async (
    courseId: number,
    versionId: number,
    payload: CourseVersionRequest
  ): Promise<CourseVersionResponse> => {
    console.log("Updating course version:", { courseId, versionId, payload });

    const response = await axiosClient.put<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Delete course version (Teacher only, only DRAFT/PENDING/REJECTED)
   */
  deleteCourseVersion: async (
    courseId: number,
    versionId: number
  ): Promise<void> => {
    const response = await axiosClient.delete(
      `/courses/${courseId}/versions/${versionId}`
    );
  },

  /**
   * Get course versions by status (Teacher only)
   */
  getCourseVersionsByStatus: async (
    courseId: number,
    status: string
  ): Promise<CourseVersionResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CourseVersionResponse[]>
    >(`/courses/${courseId}/versions/status/${status}`);

    return unwrapResponse(response);
  },

  /**
   * Submit version for approval (Teacher only)
   */
  submitApproval: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/submit-approval`
    );

    return unwrapResponse(response);
  },

  /**
   * Approve course version (Admin only)
   */
  approveCourseVersion: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/approve`
    );

    return unwrapResponse(response);
  },

  /**
   * Reject course version (Admin only)
   */
  rejectCourseVersion: async (
    courseId: number,
    versionId: number,
    payload: RejectRequest
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/reject`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Publish course version (Teacher only)
   */
  publishCourseVersion: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/publish`
    );

    return unwrapResponse(response);
  },

  /**
   * Get all pending course versions (Admin only)
   */
  getAllPendingCourseVersions: async (
    page?: number,
    size?: number,
    filter?: string
  ): Promise<PageResponse<CourseVersionResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseVersionResponse>>
    >("/courses/admin/versions/pending", {
      params: { page, size, filter },
    });

    return unwrapResponse(response);
  },
};
