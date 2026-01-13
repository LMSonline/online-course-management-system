// Type definitions for learner payment APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Payment {
  id: number;
  studentId: number;
  courseId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
}

export interface PaymentResponse {
  payment: Payment;
}
