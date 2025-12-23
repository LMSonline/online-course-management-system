"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { cn } from "@/lib/cn";

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <Link href="/cart" className={cn("relative inline-flex items-center", className)}>
      <ShoppingCart size={18} className="text-slate-200 hover:text-[var(--brand-300)] transition" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-600)] text-[10px] font-bold text-white shadow-lg">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

