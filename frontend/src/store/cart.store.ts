"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartState } from "@/features/cart/types/cart.types";

interface CartStore extends CartState {
  // Actions
  addItem: (item: Omit<CartItem, "addedAt">) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  updateCoupon: (code: string, discount?: number) => void;
  removeCoupon: () => void;
  getItemCount: () => number;
  isInCart: (courseId: string) => boolean;
}

const calculateTotals = (items: CartItem[], discount?: number): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = discount ? Math.max(0, subtotal - discount) : subtotal;
  return { subtotal, total };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      discount: undefined,
      total: 0,
      subtotal: 0,

      addItem: (item) => {
        const state = get();
        // Check if already in cart
        if (state.items.some((i) => i.courseId === item.courseId)) {
          return; // Already in cart
        }

        const newItem: CartItem = {
          ...item,
          addedAt: new Date().toISOString(),
        };

        const newItems = [...state.items, newItem];
        const { subtotal, total } = calculateTotals(newItems, state.discount);

        set({
          items: newItems,
          subtotal,
          total,
        });
      },

      removeItem: (courseId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.courseId !== courseId);
        const { subtotal, total } = calculateTotals(newItems, state.discount);

        set({
          items: newItems,
          subtotal,
          total,
        });
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: undefined,
          discount: undefined,
          subtotal: 0,
          total: 0,
        });
      },

      updateCoupon: (code, discount) => {
        const state = get();
        const { subtotal, total } = calculateTotals(state.items, discount);

        set({
          couponCode: code,
          discount,
          subtotal,
          total,
        });
      },

      removeCoupon: () => {
        const state = get();
        const { subtotal, total } = calculateTotals(state.items);

        set({
          couponCode: undefined,
          discount: undefined,
          subtotal,
          total,
        });
      },

      getItemCount: () => {
        return get().items.length;
      },

      isInCart: (courseId) => {
        return get().items.some((item) => item.courseId === courseId);
      },
    }),
    {
      name: "lms_cart_v1",
      storage: createJSONStorage(() => localStorage),
      // Recalculate totals on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { subtotal, total } = calculateTotals(state.items, state.discount);
          state.subtotal = subtotal;
          state.total = total;
        }
      },
    }
  )
);

