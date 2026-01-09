import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
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
   * Create course comment (COMMENT_CREATE_COURSE)
   * Contract Key: COMMENT_CREATE_COURSE
   * Endpoint: POST /api/v1/courses/{courseId}/comments
   */
  createCourseComment: async (
    courseId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`,
      payload,
      {
        contractKey: CONTRACT_KEYS.COMMENT_CREATE_COURSE,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Create lesson comment (COMMENT_CREATE_LESSON)
   * Contract Key: COMMENT_CREATE_LESSON
   * Endpoint: POST /api/v1/lessons/{lessonId}/comments
   */
  createLessonComment: async (
    lessonId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`,
      payload,
      {
        contractKey: CONTRACT_KEYS.COMMENT_CREATE_LESSON,
      }
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
   * Get course comments (COMMENT_GET_COURSE_LIST)
   * Contract Key: COMMENT_GET_COURSE_LIST
   * Endpoint: GET /api/v1/courses/{courseId}/comments
   */
  getCourseComments: async (courseId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`,
      {
        contractKey: CONTRACT_KEYS.COMMENT_GET_COURSE_LIST,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Get lesson comments (COMMENT_GET_LESSON_LIST)
   * Contract Key: COMMENT_GET_LESSON_LIST
   * Endpoint: GET /api/v1/lessons/{lessonId}/comments
   */
  getLessonComments: async (lessonId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`,
      {
        contractKey: CONTRACT_KEYS.COMMENT_GET_LESSON_LIST,
      }
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
   * Update comment (COMMENT_UPDATE)
   * Contract Key: COMMENT_UPDATE
   * Endpoint: PUT /api/v1/comments/{id}
   */
  updateComment: async (
    commentId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.put<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.COMMENT_UPDATE,
      }
    );
    return unwrapResponse(response);
  },

  /**
   * Delete comment (COMMENT_DELETE)
   * Contract Key: COMMENT_DELETE
   * Endpoint: DELETE /api/v1/comments/{id}
   */
  deleteComment: async (commentId: number): Promise<void> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${COMMENT_PREFIX}/comments/${commentId}`,
      {
        contractKey: CONTRACT_KEYS.COMMENT_DELETE,
      }
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
   * Mark notification as read (NOTIFICATION_MARK_READ_ACTION)
   * Contract Key: NOTIFICATION_MARK_READ_ACTION
   * Endpoint: POST /api/v1/notifications/{id}/mark-read
   */
  markNotificationAsRead: async (id: number): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${NOTIFICATION_PREFIX}/${id}/mark-read`,
      {},
      {
        contractKey: CONTRACT_KEYS.NOTIFICATION_MARK_READ_ACTION,
      }
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
