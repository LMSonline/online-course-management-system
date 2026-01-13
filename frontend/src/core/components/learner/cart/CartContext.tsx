"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartCourse = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  currency?: string;
  thumbnailUrl?: string;
  level?: string;
  rating?: number;
  studentsCount?: number;
};

export type CartContextType = {
  cart: CartCourse[];
  addCourse: (course: CartCourse) => void;
  removeCourse: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  removeSelected: (ids: string[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartCourse[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("lms_cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("lms_cart", JSON.stringify(cart));
  }, [cart]);

  const addCourse = (course: CartCourse) => {
    if (!cart.find((c) => c.id === course.id)) {
      setCart([...cart, course]);
    }
  };

  const removeCourse = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const clearCart = () => setCart([]);

  const isInCart = (id: string) => cart.some((c) => c.id === id);

  const removeSelected = (ids: string[]) => {
    setCart(cart.filter((c) => !ids.includes(c.id)));
  };

  return (
    <CartContext.Provider value={{ cart, addCourse, removeCourse, clearCart, isInCart, removeSelected }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
