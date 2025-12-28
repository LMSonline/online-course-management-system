import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { DEMO_MODE } from "@/lib/env";
import {
  CommentCreateRequest,
  CommentResponse,
  ViolationReportCreateRequest,
  ViolationReportResponse,
  ViolationReportDetailResponse,
  NotificationResponse,
  NotificationChannelResponse,
  UpdateNotificationChannelRequest,
} from "./community.types";

const COMMENT_PREFIX = "/api/v1";
const REPORT_PREFIX = "/api/v1/reports";
const ADMIN_REPORT_PREFIX = "/api/v1/admin/reports";
const NOTIFICATION_PREFIX = "/api/v1/notifications";

export const communityService = {
  // ===========================
  // Comment APIs
  // ===========================

  /**
   * Create course comment
   */
  createCourseComment: async (
    courseId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Create lesson comment
   */
  createLessonComment: async (
    lessonId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Reply to comment
   */
  replyToComment: async (
    commentId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}/reply`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Get course comments
   */
  getCourseComments: async (courseId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`
    );
    return unwrapResponse(response);
  },

  /**
   * Get lesson comments
   */
  getLessonComments: async (lessonId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`
    );
    return unwrapResponse(response);
  },

  /**
   * Get comment replies
   */
  getCommentReplies: async (commentId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/comments/${commentId}/replies`
    );
    return unwrapResponse(response);
  },

  /**
   * Update comment
   */
  updateComment: async (
    commentId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.put<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/${commentId}`,
      payload
    );
    return unwrapResponse(response);
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${COMMENT_PREFIX}/${commentId}`
    );
    return unwrapResponse(response);
  },

  // ===========================
  // Violation Report APIs
  // ===========================

  /**
   * Create violation report
   */
  createViolationReport: async (
    payload: ViolationReportCreateRequest
  ): Promise<ViolationReportDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<ViolationReportDetailResponse>
    >(REPORT_PREFIX, payload);
    return unwrapResponse(response);
  },

  /**
   * Get my reports
   */
  getMyReports: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<ViolationReportResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<ViolationReportResponse>>
    >(REPORT_PREFIX, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Get all reports (Admin only)
   */
  getAllReports: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<ViolationReportResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<ViolationReportResponse>>
    >(ADMIN_REPORT_PREFIX, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Get report detail
   */
  getReportDetail: async (
    id: number
  ): Promise<ViolationReportDetailResponse> => {
    const response = await axiosClient.get<
      ApiResponse<ViolationReportDetailResponse>
    >(`${REPORT_PREFIX}/${id}`);
    return unwrapResponse(response);
  },

  // ===========================
  // Notification APIs
  // ===========================

  /**
   * Get notifications
   */
  getNotifications: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<NotificationResponse>> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<
      ApiResponse<PageResponse<NotificationResponse>>
    >(NOTIFICATION_PREFIX, {
      params: { page, size },
    });
    return unwrapResponse(response);
  },

  /**
   * Get notification detail
   */
  getNotificationDetail: async (id: number): Promise<NotificationResponse> => {
    const response = await axiosClient.get<ApiResponse<NotificationResponse>>(
      `${NOTIFICATION_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (id: number): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${NOTIFICATION_PREFIX}/${id}/mark-read`
    );
    return unwrapResponse(response);
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async (): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${NOTIFICATION_PREFIX}/mark-all-read`
    );
    return unwrapResponse(response);
  },

  /**
   * Delete notification
   */
  deleteNotification: async (id: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${NOTIFICATION_PREFIX}/${id}`
    );
    return unwrapResponse(response);
  },

  /**
   * Count unread notifications
   */
  countUnreadNotifications: async (): Promise<number> => {
    // DEMO_MODE: Skip protected endpoint
    if (DEMO_MODE) {
      const error: any = new Error("DEMO_MODE: Auth disabled");
      error.code = "DEMO_SKIP_AUTH";
      throw error;
    }
    
    const response = await axiosClient.get<ApiResponse<number>>(
      `${NOTIFICATION_PREFIX}/count-unread`
    );
    return unwrapResponse(response);
  },
};
