// Hooks cho payment APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerPaymentService } from '../../services/learner/paymentService';
import { PaymentListResponse, PaymentResponse } from '../../lib/learner/payment/payments';

/** Lấy danh sách payment của student */
export function usePayments(studentId: number) {
  return useQuery<PaymentListResponse>({
    queryKey: ['learner-payments', studentId],
    queryFn: () => learnerPaymentService.getPayments(studentId),
    enabled: !!studentId,
  });
}

/** Lấy chi tiết payment */
export function usePaymentDetail(paymentId: number) {
  return useQuery<PaymentResponse>({
    queryKey: ['learner-payment-detail', paymentId],
    queryFn: () => learnerPaymentService.getPaymentDetail(paymentId),
    enabled: !!paymentId,
  });
}

/** Tạo payment mới */
export function useCreatePayment() {
  return useMutation({
    mutationFn: ({ studentId, courseId, amount, currency, method }: { studentId: number; courseId: number; amount: number; currency: string; method: string }) =>
      learnerPaymentService.createPayment(studentId, courseId, amount, currency, method),
  });
}
