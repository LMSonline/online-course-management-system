// src/components/ui/IconCircleButton.tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export function IconCircleButton({ active, children, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-slate-900/70",
        "text-slate-200 hover:bg-slate-800 hover:text-white border-white/15 transition",
        active ? "border-[var(--brand-600)]/70 text-[var(--brand-100)]" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
