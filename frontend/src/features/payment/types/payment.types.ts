/**
 * Payment types
 */

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface CheckoutRequest {
  items: Array<{
    courseId: string;
    price: number;
  }>;
  couponCode?: string;
  discount?: number;
  billingAddress: {
    country: string;
  };
  paymentMethod: {
    type: "card";
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    nameOnCard: string;
    saveCard?: boolean;
  };
}

export interface CheckoutResponse {
  orderId: string;
  paymentId: string;
  total: number;
  status: PaymentStatus;
  message?: string;
}

export interface PaymentDetails {
  orderId: string;
  paymentId: string;
  total: number;
  status: PaymentStatus;
  createdAt: string;
  items: Array<{
    courseId: string;
    title: string;
    price: number;
  }>;
}

