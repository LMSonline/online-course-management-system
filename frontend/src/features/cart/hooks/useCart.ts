"use client";

import { useCartStore } from "@/store/cart.store";
import type { CartState } from "../types/cart.types";

/**
 * Hook to access cart state and actions
 */
export function useCart(): CartState & {
  addItem: (item: Omit<import("../types/cart.types").CartItem, "addedAt">) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  updateCoupon: (code: string, discount?: number) => void;
  removeCoupon: () => void;
  getItemCount: () => number;
  isInCart: (courseId: string) => boolean;
} {
  const store = useCartStore();
  return {
    items: store.items,
    couponCode: store.couponCode,
    discount: store.discount,
    total: store.total,
    subtotal: store.subtotal,
    addItem: store.addItem,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    updateCoupon: store.updateCoupon,
    removeCoupon: store.removeCoupon,
    getItemCount: store.getItemCount,
    isInCart: store.isInCart,
  };
}

