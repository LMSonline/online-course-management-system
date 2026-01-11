// ===========================
// Enrollment Types - Mapped from Backend APIs
// ===========================

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export type PaymentMethod =
  | "MOMO"
  | "VNPAY"
  | "ZALOPAY"
  | "CREDIT_CARD"
  | "FREE";

// Request DTOs

/** Backend: EnrollCourseRequest */
export interface EnrollCourseRequest {
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string;
  voucherCode?: string;
}

/** Backend: CancelEnrollmentRequest */
export interface CancelEnrollmentRequest {
  reason: string;
}

// Response DTOs

/** Backend: EnrollmentResponse */
export interface EnrollmentResponse {
  id: number;
  courseId: number;
  courseName: string;
  courseImageUrl?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentCode?: string;
  status: EnrollmentStatus;
  enrolledAt: string; // ISO datetime string
  completedAt?: string; // ISO datetime string
  cancelledAt?: string; // ISO datetime string
  cancellationReason?: string;
  completionPercentage: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt?: string; // ISO datetime string
}

/** Backend: EnrollmentDetailResponse */
export interface EnrollmentDetailResponse {
  id: number;
  courseId: number;
  courseName: string;
  courseDescription?: string;
  courseImageUrl?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentCode?: string;
  studentAvatar?: string;
  status: EnrollmentStatus;
  enrolledAt: string; // ISO datetime string
  completedAt?: string; // ISO datetime string
  cancelledAt?: string; // ISO datetime string
  cancellationReason?: string;
  completionPercentage: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  averageScore?: number;
  certificateId?: number;
  lastAccessedAt?: string; // ISO datetime string
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
}

/** Backend: EnrollmentStatsResponse */
export interface EnrollmentStatsResponse {
  courseId: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  cancelledEnrollments: number;
  averageCompletionPercentage: number;
  averageScore?: number;
  completionRate: number; // percentage
  retentionRate: number; // percentage
}
