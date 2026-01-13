"use client";

import { Filter, User } from "lucide-react";
import type { PaymentStatus } from "@/lib/admin/payment.types";

type Props = {
  status: PaymentStatus | "";
  studentId: string;
  onStatusChange: (status: PaymentStatus | "") => void;
  onStudentIdChange: (studentId: string) => void;
};

export function PaymentFilters({
  status,
  studentId,
  onStatusChange,
  onStudentIdChange,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Filter className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Status</label>
          <select
            className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as PaymentStatus | "")}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Student ID
          </label>
          <input
            className="w-full bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
            value={studentId}
            onChange={(e) => onStudentIdChange(e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
      </div>
    </div>
  );
}
