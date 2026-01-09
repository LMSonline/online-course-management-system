import { axiosClient } from "@/lib/api/axios";

export const paymentService = {
  /**
   * Create payment transaction for a course
   * POST /api/v1/payments/create-payment
   */
  createPayment: async (courseId: string | number, amount: number) => {
    const response = await axiosClient.post("/payments/create-payment", {
      courseId,
      amount,
    });
    return response.data; // Should contain paymentUrl, transactionId, etc.
  },

  /**
   * Get payment transaction by ID
   * GET /api/v1/payments/{id}
   */
  getPaymentById: async (id: string | number) => {
    const response = await axiosClient.get(`/payments/${id}`);
    return response.data;
  },
};
