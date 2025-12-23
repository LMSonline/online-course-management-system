/**
 * Cart service - local adapter that uses cart store
 * 
 * This service provides a consistent API that can be swapped with backend API later.
 * Currently uses the local cart store (Zustand + localStorage).
 */

import { useCartStore } from "@/store/cart.store";
import type { CartItem, CartState } from "../types/cart.types";

/**
 * Get current cart state
 */
export function getCart(): CartState {
  const store = useCartStore.getState();
  return {
    items: store.items,
    couponCode: store.couponCode,
    discount: store.discount,
    total: store.total,
    subtotal: store.subtotal,
  };
}

/**
 * Add course to cart
 */
export function addToCart(item: Omit<CartItem, "addedAt">): void {
  useCartStore.getState().addItem(item);
}

/**
 * Remove course from cart
 */
export function removeFromCart(courseId: string): void {
  useCartStore.getState().removeItem(courseId);
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  useCartStore.getState().clearCart();
}

/**
 * Apply coupon code
 * Note: In real implementation, this would call backend to validate coupon
 */
export function applyCoupon(code: string, discount?: number): void {
  useCartStore.getState().updateCoupon(code, discount);
}

/**
 * Remove coupon
 */
export function removeCoupon(): void {
  useCartStore.getState().removeCoupon();
}

/**
 * Check if course is in cart
 */
export function isInCart(courseId: string): boolean {
  return useCartStore.getState().isInCart(courseId);
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  return useCartStore.getState().getItemCount();
}

