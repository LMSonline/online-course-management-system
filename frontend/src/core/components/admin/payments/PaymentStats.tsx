"use client";

import { CreditCard } from "lucide-react";

type Props = {
  totalPayments: number;
};

export function PaymentStats({ totalPayments }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-sm">Total Payments</span>
            <p className="text-2xl font-bold text-white mt-1">
              {totalPayments}
            </p>
          </div>
          <CreditCard className="w-8 h-8 text-emerald-400/50" />
        </div>
      </div>
    </div>
  );
}
