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

// backend
// package vn.uit.lms.shared.dto.response.billing;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class PaymentUrlResponse {

//     private Long paymentId;
//     private String paymentUrl;
//     private String message;
// }


export interface PaymentResponse {
  payment: Payment;
  paymentId: number;
  paymentUrl: string;
  message: string;
}
