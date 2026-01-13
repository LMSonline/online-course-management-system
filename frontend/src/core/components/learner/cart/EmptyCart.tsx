import React from "react";

export const EmptyCart: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <img src="/images/cart/empty_cart.png" alt="Empty cart" className="w-32 h-32 mb-4" />
    <div>Your cart is empty.</div>
  </div>
);
