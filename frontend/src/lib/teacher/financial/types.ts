// Financial Management Types for Teacher

export enum PayoutStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PENDING = "PENDING",
}

export interface MonthlyRevenueStats {
  month: string; // Format: "YYYY-MM"
  revenue: number;
  enrollments: number;
}

export interface CourseRevenueBreakdown {
  courseId: number;
  courseName: string;
  revenue: number;
  enrollments: number;
  percentage: number;
}

export interface RevenueOverview {
  totalRevenue: number;
  currentBalance: number;
  totalPayouts: number;
  pendingPayouts: number;
  monthlyStats: MonthlyRevenueStats[];
  courseBreakdown: CourseRevenueBreakdown[];
}

export interface PaymentTransaction {
  id: number;
  transactionDate: string;
  studentName: string;
  studentAvatar?: string;
  courseName: string;
  courseId: number;
  amount: number;
  platformFee: number;
  netEarnings: number;
  status: TransactionStatus;
  paymentMethod?: string;
}

export interface PayoutRequest {
  id: number;
  requestDate: string;
  amount: number;
  transactionCode: string;
  status: PayoutStatus;
  processedDate?: string;
  note?: string;
  rejectReason?: string;
}

export interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  isDefault: boolean;
}

export interface CreatePayoutRequestData {
  amount: number;
  bankAccountId?: number;
  note?: string;
}

export interface AvailableBalance {
  available: number;
  pending: number;
  minimumPayout: number;
}

// API Response Types
export interface RevenueResponse {
  success: boolean;
  data: RevenueOverview;
}

export interface TransactionsResponse {
  success: boolean;
  data: PaymentTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PayoutsResponse {
  success: boolean;
  data: PayoutRequest[];
  total: number;
}

export interface PayoutDetailResponse {
  success: boolean;
  data: PayoutRequest;
}

// Filter Types
export interface TransactionFilters {
  search?: string;
  courseId?: number;
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
}
