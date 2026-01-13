import { axiosClient } from "@/lib/api/axios";
import type { PageResponse } from "@/lib/api/api.types";
import type { PaymentTransactionResponse } from "@/lib/admin/payment.types";

const PREFIX = "/payments";

export const adminPaymentService = {
  getAllPayments: async (params?: {
    status?: string;
    studentId?: number;
    courseId?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<PaymentTransactionResponse>> => {
   const res = await axiosClient.get(PREFIX, { params });

//  unwrap đúng tầng
const page = res.data.data;

return {
  items: page.content ?? [],
  page: page.number,
  size: page.size,
  totalItems: page.totalElements,
  totalPages: page.totalPages,
  hasNext: !page.last,
  hasPrevious: !page.first,
};

  },

  refundPayment: async (
    id: number,
    payload: { reason: string }
  ): Promise<PaymentTransactionResponse> => {
    const res = await axiosClient.post(
      `${PREFIX}/${id}/refund`,
      payload
    );
    return res.data;
  },

  getStudentPaymentHistory: async (
    studentId: number
  ): Promise<PaymentTransactionResponse[]> => {
    const res = await axiosClient.get(
      `${PREFIX}/students/${studentId}/payment-history`
    );
    return res.data ?? [];
  },
getPaymentDetail: async (id: number) => {
  const res = await axiosClient.get(`/payments/${id}`);
  return res.data.data; 
}



};
