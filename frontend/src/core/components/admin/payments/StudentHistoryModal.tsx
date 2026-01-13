"use client";

import { X, FileText, DollarSign } from "lucide-react";
import type {
  PaymentTransactionResponse,
  PaymentStatus,
} from "@/lib/admin/payment.types";

type Props = {
  studentId: number;
  payments: PaymentTransactionResponse[];
  onClose: () => void;
  onViewPayment: (paymentId: number) => void;
};

export function StudentHistoryModal({
  studentId,
  payments,
  onClose,
  onViewPayment,
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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Payment History</h2>
              <p className="text-gray-400 text-sm">Student #{studentId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((p: PaymentTransactionResponse) => (
                <div
                  key={p.id}
                  className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => {
                    onClose();
                    onViewPayment(p.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono font-bold">
                        #{p.id}
                      </span>
                      {getStatusBadge(p.status)}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white">
                        {p.amount}{" "}
                        <span className="text-gray-400 text-sm">
                          {p.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No payment history found</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
          <button
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
