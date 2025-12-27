// ===========================
// Comment Types
// ===========================

export interface CommentCreateRequest {
  content: string;
  parentId?: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  authorId: number;
  authorName?: string;
  authorAvatarUrl?: string;
  courseId?: number;
  lessonId?: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  replies?: CommentResponse[];
}

// ===========================
// Violation Report Types
// ===========================

export type ViolationReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "DISMISSED";
export type ViolationReportType =
  | "SPAM"
  | "HARASSMENT"
  | "INAPPROPRIATE_CONTENT"
  | "COPYRIGHT"
  | "MISINFORMATION"
  | "OTHER";

export interface ViolationReportCreateRequest {
  reportType: ViolationReportType;
  reason: string;
  targetType: "COMMENT" | "COURSE" | "USER";
  targetId: number;
}

export interface ViolationReportResponse {
  id: number;
  reportType: ViolationReportType;
  reason: string;
  status: ViolationReportStatus;
  targetType: string;
  targetId: number;
  reporterId: number;
  reporterName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViolationReportDetailResponse extends ViolationReportResponse {
  reviewNote?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  actionTaken?: string;
}

// ===========================
// Notification Types
// ===========================

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

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  accountId: number;
  relatedEntityType?: string;
  relatedEntityId?: number;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationChannelResponse {
  id: number;
  channelName: string;
  enabled: boolean;
  accountId: number;
  preferences?: Record<string, any>;
}

export interface UpdateNotificationChannelRequest {
  enabled: boolean;
  preferences?: Record<string, any>;
}
