import { useQuery, useMutation, useQueryClient, keepPreviousData, } from "@tanstack/react-query";
import { adminPaymentService } from "@/services/admin/payment.service";

export const useAdminPayments = (params?: {
  status?: string;
  studentId?: number;
  courseId?: number;
  page?: number;
  size?: number;
}) =>
  useQuery({
    queryKey: ["admin-payments", params],
    queryFn: () => adminPaymentService.getAllPayments(params),

    //  React Query v5
    placeholderData: keepPreviousData,
  });


export const useRefundPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      adminPaymentService.refundPayment(id, payload),
    onSuccess: () => {
qc.invalidateQueries({ queryKey: ["admin-payments"] });
    },
  });
};

export const useStudentPaymentHistory = (studentId: number) =>
  useQuery({
    queryKey: ["admin", "payments", "student", studentId],
    queryFn: () =>
      adminPaymentService.getStudentPaymentHistory(studentId),
    enabled: !!studentId,
  });


  export const useAdminPaymentDetail = (paymentId?: number) =>
  useQuery({
    queryKey: ["admin-payment-detail", paymentId],
    queryFn: () =>
      adminPaymentService.getPaymentDetail(paymentId!),
    enabled: !!paymentId, 
  });