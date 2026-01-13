// Service cho notification APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Notification, NotificationListResponse, NotificationResponse } from '@/lib/learner/notification/notifications';

export const learnerNotificationService = {
  /** Lấy danh sách notification của student */
  getNotifications: async (studentId: number): Promise<NotificationListResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/notifications`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết notification */
  getNotificationDetail: async (notificationId: number): Promise<NotificationResponse> => {
    const res = await axiosClient.get(`/notifications/${notificationId}`);
    return unwrapResponse(res);
  },

  /** Đánh dấu đã đọc notification */
  markAsRead: async (notificationId: number): Promise<NotificationResponse> => {
    const res = await axiosClient.post(`/notifications/${notificationId}/read`);
    return unwrapResponse(res);
  },
};
