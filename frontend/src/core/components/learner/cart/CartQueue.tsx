import React from "react";
import { useCart } from "./CartContext";
import Link from "next/link";

export const CartQueue: React.FC<{ onRemove?: (id: string) => void }> = ({
  onRemove,
}) => {
  const { cart, removeCourse } = useCart();

  /* EMPTY STATE */
  if (cart.length === 0)
    return (
      <div className="w-72 rounded-xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex flex-col items-center justify-center px-5 py-7 text-center">
          <img
            src="/images/cart/empty_cart.png"
            alt="Empty cart"
            className="mb-2 h-12 w-12 opacity-80"
          />
          <p className="text-sm font-medium text-slate-300 mb-1">
            Your cart is empty
          </p>
          <p className="text-xs text-slate-500">
            Browse courses and add them to your cart
          </p>
        </div>
      </div>
    );

  /* CART LIST */
  return (
    <div className="w-72 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-xl">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-2">
        <h4 className="text-xs font-semibold text-white">
          Cart ({cart.length})
        </h4>
      </div>
      {/* Items */}
      <div className="max-h-60 overflow-y-auto divide-y divide-slate-800">
        {cart.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-2 px-3 py-2"
          >
            <img
              src={course.thumbnailUrl || "/images/lesson_thum.png"}
              alt={course.title}
              className="w-10 h-10 rounded object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {course.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {course.level}
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-400">
              {course.currency ?? "$"}
              {course.price.toLocaleString()}
            </div>
            <button
              className="ml-2 p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
              title="Remove"
              onClick={() => removeCourse(course.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* Footer CTA */}
      <div className="border-t border-white/10 p-3">
        <Link href="/learner/cart">
          <button className="w-full rounded-lg bg-[var(--brand-600)] py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition">
            View cart
          </button>
        </Link>
      </div>
    </div>
  );
};
