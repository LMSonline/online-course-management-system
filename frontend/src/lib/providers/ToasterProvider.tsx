"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "rounded-xl border text-sm shadow-lg backdrop-blur-md",

          success:
            "bg-emerald-600 text-white border-emerald-700",

          error:
            "bg-red-600 text-white border-red-700",

          warning:
            "bg-amber-500 text-black border-amber-600",

          info:
            "bg-blue-600 text-white border-blue-700",
        },
      }}
    />
  );
}
