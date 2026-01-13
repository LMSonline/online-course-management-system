"use client";

import {
  DollarSign,
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
} from "lucide-react";
import type {
  PaymentTransactionResponse,
  PaymentStatus,
} from "@/lib/admin/payment.types";

type Props = {
  payments: PaymentTransactionResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onViewPayment: (paymentId: number) => void;
  onViewStudentHistory: (studentId: number) => void;
  onRefund: (payment: PaymentTransactionResponse) => void;
  isRefunding: boolean;
};

export function PaymentTable({
  payments,
  currentPage,
  totalPages,
  totalItems,
  hasNext,
  hasPrevious,
  onPageChange,
  onViewPayment,
  onViewStudentHistory,
  onRefund,
  isRefunding,
}: Props) {
  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      SUCCESS: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      FAILED: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      REFUNDED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Student
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Course
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                Created
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {payments.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                onClick={() => onViewPayment(p.id)}
              >
                <td className="px-6 py-4">
                  <span className="text-white font-mono font-semibold">#{p.id}</span>
                </td>

                <td className="px-6 py-4">
                  <button
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-2 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewStudentHistory(p.studentId);
                    }}
                  >
                    <User className="w-4 h-4" />
                    {p.studentName}
                    <span className="text-gray-500 text-sm">(#{p.studentId})</span>
                  </button>
                </td>

                <td className="px-6 py-4">
                  <div className="text-white font-medium">{p.courseTitle}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Version {p.versionNumber}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-white">
                    {p.amount}{" "}
                    <span className="text-gray-400 text-sm">{p.currency}</span>
                  </div>
                </td>

                <td className="px-6 py-4">{getStatusBadge(p.status)}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(p.createdAt).toLocaleDateString()}
                    <span className="text-gray-600">
                      {new Date(p.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </td>

                <td
                  className="px-6 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPayment(p.id);
                      }}
                      className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {p.status === "SUCCESS" && (
                      <button
                        disabled={!p.canRefund || isRefunding}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefund(p);
                        }}
                        className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          p.canRefund
                            ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30"
                            : "bg-gray-700/20 text-gray-600 cursor-not-allowed border border-gray-700/30"
                        }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No payments found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your filters
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
        <span className="text-sm text-gray-400">
          Page {currentPage + 1} of {totalPages}
          <span className="text-gray-600 ml-2">({totalItems} total)</span>
        </span>

        <div className="flex gap-2">
          <button
            disabled={!hasPrevious}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <button
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
