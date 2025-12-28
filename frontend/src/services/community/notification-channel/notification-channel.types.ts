// ===========================
// Notification Channel Types
// ===========================

/** Backend: ChannelType enum */
export type ChannelType = "WEB" | "MOBILE_PUSH" | "EMAIL" | "SMS";

/** Backend: ChannelStatus enum */
export type ChannelStatus = "PENDING" | "SENT" | "FAILED";

/** Backend: NotificationChannelCreateRequest */
export interface NotificationChannelCreateRequest {
  notificationId: number;
  channel: string; // ChannelType as string
  status: string; // ChannelStatus as string
}

/** Backend: NotificationChannel (inferred from controller response) */
export interface NotificationChannelResponse {
  id: number;
  notificationId: number;
  channel: ChannelType;
  status: ChannelStatus;
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}
