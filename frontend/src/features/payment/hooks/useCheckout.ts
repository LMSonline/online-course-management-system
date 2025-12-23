"use client";

import { useState } from "react";
import { createCheckout } from "../services/payment.service";
import type { CheckoutRequest, CheckoutResponse } from "../types/payment.types";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCheckout = async (payload: CheckoutRequest): Promise<CheckoutResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createCheckout(payload);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process payment";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitCheckout,
    loading,
    error,
  };
}

