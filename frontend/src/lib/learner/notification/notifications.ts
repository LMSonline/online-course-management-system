// Type definitions for learner notification APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Notification {
  id: number;
  studentId: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'system' | 'assignment' | 'course' | 'other';
}

export interface NotificationListResponse {
  notifications: Notification[];
}

export interface NotificationResponse {
  notification: Notification;
}
