// ===========================
// Notification Types
// ===========================

/** Backend: NotificationType (from type field) */
export type NotificationType =
  | "COURSE_UPDATE"
  | "NEW_ASSIGNMENT"
  | "ASSIGNMENT_GRADED"
  | "NEW_COMMENT"
  | "COMMENT_REPLY"
  | "COURSE_ENROLLMENT"
  | "CERTIFICATE_ISSUED"
  | "SYSTEM_ANNOUNCEMENT"
  | "OTHER";

/** Backend: NotificationResponse */
export interface NotificationResponse {
  id: number;
  type: string; // NotificationType as string
  title: string;
  content: string;
  isRead: boolean;
  referenceType?: string;
  referenceId?: string;
  deliveredAt: string; // ISO datetime string
  createdAt: string; // ISO datetime string
}

/** Backend: SendBulkNotificationRequest */
export interface SendBulkNotificationRequest {
  accountIds: number[];
  type: string;
  title: string;
  content: string;
}
