import { useCallback } from "react";
import { useAuthStore } from "@/lib/auth/authStore";

export type CartItem = {
  courseId: string;
  slug: string;
  addedAt: number;
};

function getCartKey(userId?: number | string) {
  return userId ? `cart_${userId}` : "cart_guest";
}

export function useCart() {
  const { studentId } = useAuthStore();
  const cartKey = getCartKey(studentId ?? undefined);

  // Lấy toàn bộ cart
  const getCart = useCallback((): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [cartKey]);

  // Lấy 5 khóa học gần nhất
  const getRecentCart = useCallback((): CartItem[] => {
    return getCart()
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5);
  }, [getCart]);


  // Thêm vào cart
  const addToCart = useCallback((courseId: string, slug: string) => {
    if (typeof window === "undefined") return;
    const cart = getCart();
    if (cart.some((item) => item.courseId === courseId)) return;
    const newCart = [...cart, { courseId, slug, addedAt: Date.now() }];
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartKey, getCart]);

  // Xóa khỏi cart
  const removeFromCart = useCallback((courseId: string) => {
    if (typeof window === "undefined") return;
    const cart = getCart().filter((item) => item.courseId !== courseId);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartKey, getCart]);

  // Xóa toàn bộ cart
  const clearCart = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(cartKey);
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartKey]);

  // Kiểm tra đã có trong cart chưa
  const isInCart = useCallback((courseId: string) => {
    return getCart().some((item) => item.courseId === courseId);
  }, [getCart]);

  return {
    getCart,
    getRecentCart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
}
