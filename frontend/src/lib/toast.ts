"use client";

import { create } from "zustand";
import type { Toast, ToastType } from "@/components/ui/Toast";

interface ToastStore {
  toasts: Toast[];
  show: (type: ToastType, message: string, duration?: number) => void;
  remove: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (type, message, duration) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
  },
  remove: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  success: (message, duration) => {
    useToastStore.getState().show("success", message, duration);
  },
  error: (message, duration) => {
    useToastStore.getState().show("error", message, duration);
  },
  info: (message, duration) => {
    useToastStore.getState().show("info", message, duration);
  },
  warning: (message, duration) => {
    useToastStore.getState().show("warning", message, duration);
  },
}));

