"use client";

import { ToastContainer } from "./Toast";
import { useToastStore } from "@/lib/toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastStore((state) => state.toasts);
  const remove = useToastStore((state) => state.remove);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </>
  );
}

