/* =====================
 * Enums
 * ===================== */

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

/* =====================
 * DTO: PaymentTransactionResponse
 * ===================== */

export interface PaymentTransactionResponse {
  id: number;

  studentId: number;
  studentName: string;

  courseId: number;
  courseTitle: string;

  courseVersionId: number;
  versionNumber: number;

  amount: string;          // BigDecimal → string
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;

  providerTransactionId?: string;

  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  errorCode?: string;

  refundedAt?: string;
  refundAmount?: string;
  refundReason?: string;

  transactionFee?: string;
  netAmount?: string;

  createdAt: string;
  updatedAt: string;

  canRefund: boolean;
}

/* =====================
 * DTO: CoursePaymentStatsResponse
 * ===================== */

export interface CoursePaymentStatsResponse {
  courseId: number;
  courseTitle: string;

  teacherId: number;
  teacherName: string;

  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;

  totalRevenue: string;
  totalRefunded: string;
  netRevenue: string;

  teacherRevenue: string;
  platformRevenue: string;

  revenueSharePercentage: number;
}
