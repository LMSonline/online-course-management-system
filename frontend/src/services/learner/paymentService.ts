// Service cho payment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { PaymentListResponse, PaymentResponse } from '@/lib/learner/payment/payments';

export const learnerPaymentService = {
  /** Tạo payment mới */
  createPayment: async (courseId: number, courseVersionId: number, paymentProvider: string, returnUrl: string): Promise<PaymentResponse> => {
    const res = await axiosClient.post(`/payments/create-payment`, {
      courseId,
      courseVersionId,
      paymentProvider,
      returnUrl,
    });
    return unwrapResponse(res);
  },

  /** Gọi API verify payment */
  verifyPayment: async (paymentId: number): Promise<PaymentResponse> => {
    const res = await axiosClient.post(`/payments/verify-payment`, { paymentId });
    return unwrapResponse(res);
  },

  /** Gọi API retry enrollment từ payment */
  retryEnrollment: async (paymentId: number): Promise<any> => {
    const res = await axiosClient.post(`/payments/${paymentId}/retry-enrollment`);
    return unwrapResponse(res);
  },

  /** Gọi API lấy trạng thái enrollment từ payment */
  getEnrollmentStatus: async (paymentId: number): Promise<any> => {
    const res = await axiosClient.get(`/payments/${paymentId}/enrollment-status`);
    return unwrapResponse(res);
  },

  /** Lấy danh sách payment của student */
  getPayments: async (studentId: number): Promise<PaymentListResponse> => {
    const res = await axiosClient.get(`/students/${studentId}/payments`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết payment */
  getPaymentDetail: async (paymentId: number): Promise<PaymentResponse> => {
    const res = await axiosClient.get(`/payments/${paymentId}`);
    return unwrapResponse(res);
  },
};
