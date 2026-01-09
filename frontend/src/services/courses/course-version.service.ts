import { CourseVersionRequest, CourseVersionResponse } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { RejectRequest } from "../account";

export const courseVersionService = {
  /**
   * Create a new course version (VERSION_CREATE)
   * Contract Key: VERSION_CREATE
   * Endpoint: POST /api/v1/courses/{courseId}/versions
   */
  createCourseVersion: async (
    courseId: number,
    payload: CourseVersionRequest
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions`,
      payload,
      {
        contractKey: CONTRACT_KEYS.VERSION_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get all course versions (VERSION_GET_LIST)
   * Contract Key: VERSION_GET_LIST
   * Endpoint: GET /api/v1/courses/{courseId}/versions
   */
  getCourseVersions: async (
    courseId: number
  ): Promise<CourseVersionResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<CourseVersionResponse[]>
    >(`/courses/${courseId}/versions`, {
      contractKey: CONTRACT_KEYS.VERSION_GET_LIST,
    });

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
   * Get course version by ID (VERSION_GET_DETAIL)
   * Contract Key: VERSION_GET_DETAIL
   * Endpoint: GET /api/v1/courses/{courseId}/versions/{versionId}
   */
  getCourseVersionById: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}`,
      {
        contractKey: CONTRACT_KEYS.VERSION_GET_DETAIL,
      }
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
   * Submit version for approval (VERSION_SUBMIT_APPROVAL_ACTION)
   * Contract Key: VERSION_SUBMIT_APPROVAL_ACTION
   * Endpoint: POST /api/v1/courses/{courseId}/versions/{versionId}/submit-approval
   */
  submitApproval: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/submit-approval`,
      {},
      {
        contractKey: CONTRACT_KEYS.VERSION_SUBMIT_APPROVAL_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Approve course version (VERSION_APPROVE_ACTION)
   * Contract Key: VERSION_APPROVE_ACTION
   * Endpoint: POST /api/v1/courses/{courseId}/versions/{versionId}/approve
   */
  approveCourseVersion: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/approve`,
      {},
      {
        contractKey: CONTRACT_KEYS.VERSION_APPROVE_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Reject course version (VERSION_REJECT_ACTION)
   * Contract Key: VERSION_REJECT_ACTION
   * Endpoint: POST /api/v1/courses/{courseId}/versions/{versionId}/reject
   */
  rejectCourseVersion: async (
    courseId: number,
    versionId: number,
    payload: RejectRequest
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/reject`,
      payload,
      {
        contractKey: CONTRACT_KEYS.VERSION_REJECT_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Publish course version (VERSION_PUBLISH_ACTION)
   * Contract Key: VERSION_PUBLISH_ACTION
   * Endpoint: POST /api/v1/courses/{courseId}/versions/{versionId}/publish
   */
  publishCourseVersion: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseVersionResponse>>(
      `/courses/${courseId}/versions/${versionId}/publish`,
      {},
      {
        contractKey: CONTRACT_KEYS.VERSION_PUBLISH_ACTION,
      }
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
