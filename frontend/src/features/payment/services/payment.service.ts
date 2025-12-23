/**
 * Payment service - handles payment/checkout API calls
 * 
 * NOTE: Backend payment endpoints are NOT IMPLEMENTED (PaymentController is empty)
 * This service provides mock implementation for demo purposes.
 * When backend endpoints are available, replace mock calls with real API calls.
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { unwrapApiResponse } from "@/services/core/unwrap";
import type { CheckoutRequest, CheckoutResponse, PaymentDetails } from "../types/payment.types";

/**
 * Create checkout / payment order
 * 
 * In mock mode: simulates network delay (400-800ms) then returns success
 * In real mode: calls POST /api/v1/payments/checkout
 */
export async function createCheckout(payload: CheckoutRequest): Promise<CheckoutResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    const delay = 400 + Math.random() * 400; // 400-800ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Generate mock order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Calculate total
    const subtotal = payload.items.reduce((sum, item) => sum + item.price, 0);
    const total = payload.discount ? Math.max(0, subtotal - payload.discount) : subtotal;

    return {
      orderId,
      paymentId,
      total,
      status: "SUCCESS",
      message: "Payment processed successfully (demo mode)",
    };
  }

  try {
    // Real API call (when backend is implemented)
    const response = await apiClient.post<ApiResponse<CheckoutResponse>>("/payments/checkout", payload);
    return unwrapApiResponse(response.data);
  } catch (error) {
    console.error("Failed to create checkout:", error);
    throw error;
  }
}

/**
 * Get payment details by ID
 * 
 * In mock mode: returns mock payment details
 * In real mode: calls GET /api/v1/payments/{id}
 */
export async function getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
  if (USE_MOCK) {
    return {
      orderId: `ORD-${paymentId}`,
      paymentId,
      total: 0,
      status: "SUCCESS",
      createdAt: new Date().toISOString(),
      items: [],
    };
  }

  try {
    const response = await apiClient.get<ApiResponse<PaymentDetails>>(`/payments/${paymentId}`);
    return unwrapApiResponse(response.data);
  } catch (error) {
    console.error(`Failed to get payment details for ${paymentId}:`, error);
    throw error;
  }
}

/**
 * Confirm payment
 * 
 * In mock mode: returns success
 * In real mode: calls POST /api/v1/payments/{id}/confirm
 */
export async function confirmPayment(paymentId: string): Promise<{ status: string }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { status: "SUCCESS" };
  }

  try {
    const response = await apiClient.post<ApiResponse<{ status: string }>>(`/payments/${paymentId}/confirm`);
    return unwrapApiResponse(response.data);
  } catch (error) {
    console.error(`Failed to confirm payment ${paymentId}:`, error);
    throw error;
  }
}

