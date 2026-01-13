// Hooks cho notification APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerNotificationService } from '../../services/learner/notificationService';
import { NotificationListResponse, NotificationResponse } from '../../lib/learner/notification/notifications';

/** Lấy danh sách notification của student */
export function useNotifications(studentId: number) {
  return useQuery<NotificationListResponse>({
    queryKey: ['learner-notifications', studentId],
    queryFn: () => learnerNotificationService.getNotifications(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết notification */
export function useNotificationDetail(notificationId: number) {
  return useQuery<NotificationResponse>({
    queryKey: ['learner-notification-detail', notificationId],
    queryFn: () => learnerNotificationService.getNotificationDetail(notificationId),
    enabled: !!notificationId,
  });
}

/** Đánh dấu đã đọc notification */
export function useMarkNotificationAsRead() {
  return useMutation({
    mutationFn: (notificationId: number) => learnerNotificationService.markAsRead(notificationId),
  });
}
