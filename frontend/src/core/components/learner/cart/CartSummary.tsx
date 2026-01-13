import React from "react";

export interface CartSummaryProps {
  total: number;
  count: number;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ total, count, onCheckout }) => {
  return (
    <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-emerald-600/90 to-emerald-400/80 p-6 shadow-xl flex flex-col gap-4">
      <div className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="text-3xl font-extrabold">{count}</span>
        <span>courses in cart</span>
      </div>
      <div className="text-2xl font-bold text-white">Total: <span className="text-yellow-200">${total.toLocaleString()}</span></div>
      <button
        className="w-full rounded-xl bg-white/90 py-3 text-lg font-bold text-emerald-700 hover:bg-white transition"
        onClick={onCheckout}
      >
        Enroll selected
      </button>
      <div className="text-xs text-white/80 text-center mt-2">30-day money-back guarantee · Lifetime access</div>
    </div>
  );
};
