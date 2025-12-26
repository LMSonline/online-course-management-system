import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  StudentDetailResponse,
  UpdateStudentRequest,
  StudentCourseResponse,
  StudentCertificateResponse,
  TeacherDetailResponse,
  UpdateTeacherRequest,
  ApproveTeacherRequest,
  RejectTeacherRequest,
  TeacherStatsResponse,
  TeacherRevenueResponse,
  AdminUserListResponse,
  UserFilterRequest,
  UserStatsResponse,
  ExportUsersRequest,
} from "./user.types";
import { UploadAvatarResponse } from "../account/account.types";

const STUDENT_PREFIX = "/students";
const TEACHER_PREFIX = "/teachers";
const USER_MANAGEMENT_PREFIX = "/admin/users";

export const userService = {
  // ===========================
  // Student APIs
  // ===========================

  /**
   * Get student by ID
   */
  getStudentById: async (id: number): Promise<StudentDetailResponse> => {
    const response = await axiosClient.get<ApiResponse<StudentDetailResponse>>(
      `${STUDENT_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Get student by code
   */
  getStudentByCode: async (code: string): Promise<StudentDetailResponse> => {
    const response = await axiosClient.get<ApiResponse<StudentDetailResponse>>(
      `${STUDENT_PREFIX}/code/${code}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update student information
   */
  updateStudent: async (
    id: number,
    payload: UpdateStudentRequest
  ): Promise<StudentDetailResponse> => {
    const response = await axiosClient.put<ApiResponse<StudentDetailResponse>>(
      `${STUDENT_PREFIX}/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Upload student avatar
   */
  uploadStudentAvatar: async (
    id: number,
    file: File
  ): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.put<ApiResponse<UploadAvatarResponse>>(
      `${STUDENT_PREFIX}/${id}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get student's courses
   */
  getStudentCourses: async (
    id: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<StudentCourseResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<StudentCourseResponse>>
    >(`${STUDENT_PREFIX}/${id}/courses`, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Get student's certificates
   */
  getStudentCertificates: async (
    id: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<StudentCertificateResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<StudentCertificateResponse>>
    >(`${STUDENT_PREFIX}/${id}/certificates`, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Delete student (Admin only)
   */
  deleteStudent: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${STUDENT_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Teacher APIs
  // ===========================

  /**
   * Get teacher by ID
   */
  getTeacherById: async (id: number): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.get<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher by code
   */
  getTeacherByCode: async (code: string): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.get<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/code/${code}`
    );
    return unwrapResponse(response);
  },

  /**
   * Update teacher information
   */
  updateTeacher: async (
    id: number,
    payload: UpdateTeacherRequest
  ): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.put<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/${id}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Upload teacher avatar
   */
  uploadTeacherAvatar: async (
    id: number,
    file: File
  ): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.put<ApiResponse<UploadAvatarResponse>>(
      `${TEACHER_PREFIX}/${id}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Request teacher approval
   */
  requestTeacherApproval: async (
    id: number
  ): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.post<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/${id}/request-approval`
    );
    return unwrapResponse(response);
  },

  /**
   * Approve teacher (Admin only)
   */
  approveTeacher: async (
    id: number,
    payload?: ApproveTeacherRequest
  ): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.post<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/${id}/approve`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Reject teacher (Admin only)
   */
  rejectTeacher: async (
    id: number,
    payload: RejectTeacherRequest
  ): Promise<TeacherDetailResponse> => {
    const response = await axiosClient.post<ApiResponse<TeacherDetailResponse>>(
      `${TEACHER_PREFIX}/${id}/reject`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher statistics
   */
  getTeacherStats: async (id: number): Promise<TeacherStatsResponse> => {
    const response = await axiosClient.get<ApiResponse<TeacherStatsResponse>>(
      `${TEACHER_PREFIX}/${id}/stats`
    );
    return unwrapResponse(response);
  },

  /**
   * Get teacher revenue
   */
  getTeacherRevenue: async (
    id: number,
    startDate?: string,
    endDate?: string
  ): Promise<TeacherRevenueResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<TeacherRevenueResponse[]>
    >(`${TEACHER_PREFIX}/${id}/revenue`, {
      params: { startDate, endDate },
    });
    return unwrapResponse(response);
  },

  /**
   * Delete teacher (Admin only)
   */
  deleteTeacher: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${TEACHER_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // User Management APIs (Admin)
  // ===========================

  /**
   * Get all users (Admin only)
   */
  getAllUsers: async (
    filter?: UserFilterRequest,
    page?: number,
    size?: number
  ): Promise<PageResponse<AdminUserListResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<AdminUserListResponse>>
    >(USER_MANAGEMENT_PREFIX, {
      params: {
        keyword: filter?.keyword,
        role: filter?.role,
        status: filter?.status,
        teacherApproved: filter?.teacherApproved,
        sortBy: filter?.sortBy,
        sortDirection: filter?.sortDirection,
        page,
        size,
      },
    });
    return unwrapResponse(response);
  },

  /**
   * Get user statistics (Admin only)
   */
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await axiosClient.get<ApiResponse<UserStatsResponse>>(
      `${USER_MANAGEMENT_PREFIX}/stats`
    );
    return unwrapResponse(response);
  },

  /**
   * Export users to file (Admin only)
   */
  exportUsers: async (payload: ExportUsersRequest): Promise<Blob> => {
    const response = await axiosClient.post(
      `${USER_MANAGEMENT_PREFIX}/export`,
      payload,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};
