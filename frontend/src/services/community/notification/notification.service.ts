import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  NotificationResponse,
  SendBulkNotificationRequest,
} from "./notification.types";

const NOTIFICATION_PREFIX = "/notifications";
const ADMIN_NOTIFICATION_PREFIX = "/admin/notifications";

export const notificationService = {
  /**
   * Get list of notifications for current user
   */
  getNotifications: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<NotificationResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<NotificationResponse>>
    >(NOTIFICATION_PREFIX, {
      params: {
        page,
        size,
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Get notification detail by ID
   */
  getNotificationById: async (id: number): Promise<NotificationResponse> => {
    const response = await axiosClient.get<ApiResponse<NotificationResponse>>(
      `${NOTIFICATION_PREFIX}/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: number): Promise<void> => {
    await axiosClient.post<void>(`${NOTIFICATION_PREFIX}/${id}/mark-read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosClient.post<void>(`${NOTIFICATION_PREFIX}/mark-all-read`);
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${NOTIFICATION_PREFIX}/${id}`);
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await axiosClient.get<ApiResponse<{ count: number }>>(
      `${NOTIFICATION_PREFIX}/count-unread`
    );

    const data = unwrapResponse(response);
    return data.count;
  },

  /**
   * Send bulk notifications to multiple users (Admin only)
   */
  sendBulkNotifications: async (
    payload: SendBulkNotificationRequest
  ): Promise<void> => {
    await axiosClient.post<void>(
      `${ADMIN_NOTIFICATION_PREFIX}/send-bulk`,
      payload
    );
  },
};
