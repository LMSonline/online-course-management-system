// Service cho payment APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { PaymentListResponse, PaymentResponse } from '@/lib/learner/payment/payments';

export const learnerPaymentService = {
  /** Lấy danh sách payment của student */
  getPayments: async (studentId: number): Promise<PaymentListResponse> => {
    const res = await axiosClient.get(`/api/v1/students/${studentId}/payments`);
    return unwrapResponse(res);
  },

  /** Lấy chi tiết payment */
  getPaymentDetail: async (paymentId: number): Promise<PaymentResponse> => {
    const res = await axiosClient.get(`/api/v1/payments/${paymentId}`);
    return unwrapResponse(res);
  },

  /** Tạo payment mới */
  createPayment: async (studentId: number, courseId: number, amount: number, currency: string, method: string): Promise<PaymentResponse> => {
    const res = await axiosClient.post(`/api/v1/payments`, {
      studentId,
      courseId,
      amount,
      currency,
      method,
    });
    return unwrapResponse(res);
  },
};
