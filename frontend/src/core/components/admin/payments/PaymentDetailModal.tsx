"use client";

import { X, User, BookOpen, Calendar, Hash, DollarSign, AlertCircle, Percent, TrendingUp } from "lucide-react";
import { useAdminPaymentDetail } from "@/hooks/admin/useAdminPayments";
import type { PaymentStatus } from "@/lib/admin/payment.types";

type Props = {
  paymentId: number;
  onClose: () => void;
};

export default function PaymentDetailModal({
  paymentId,
  onClose,
}: Props) {
  const { data, isLoading, isError } = useAdminPaymentDetail(paymentId);

  /* =======================
   * Helper
   * ======================= */
  const getStatusConfig = (status: PaymentStatus) => {
    const configs = {
      PENDING: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
      },
      SUCCESS: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
      },
      FAILED: {
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/30",
      },
      REFUNDED: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/30",
      },
    };

    return configs[status] || configs.PENDING;
  };

  /* =======================
   * Loading / Error
   * ======================= */
  if (isLoading) {
    return (
      <Overlay onClose={onClose}>
        <div className="bg-[#1e293b] border border-gray-700 p-10 rounded-xl text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-gray-300 text-sm">Loading payment details...</span>
          </div>
        </div>
      </Overlay>
    );
  }

  if (isError || !data) {
    return (
      <Overlay onClose={onClose}>
        <div className="bg-[#1e293b] border border-rose-500/30 p-10 rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-rose-400 font-semibold">Failed to load payment details</p>
          </div>
        </div>
      </Overlay>
    );
  }

  const statusConfig = getStatusConfig(data.status);

  // Calculate revenue breakdown
  const teacherPercentage = 70; // TODO: Get from API
  const platformPercentage = 30;
  const teacherAmount = Math.round((data.amount * teacherPercentage) / 100);
  const platformAmount = Math.round((data.amount * platformPercentage) / 100);

  /* =======================
   * Render
   * ======================= */
  return (
    <Overlay onClose={onClose}>
      <div className="w-full max-w-2xl bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Payment Details</h2>
              <p className="text-gray-400 text-xs">Transaction #{data.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block font-medium">Payment Status</label>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} w-full justify-center`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.text.replace('text-', 'bg-')}`}></div>
                <span className="font-semibold text-sm">{data.status}</span>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block font-medium">Total Amount</label>
              <div className="bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-center">
                <span className="font-bold text-lg">{data.amount?.toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-1">₫</span>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Transaction ID"
              value={`#${data.id}`}
              icon={<Hash className="w-4 h-4 text-blue-400" />}
            />
            <FormField
              label="Currency"
              value={data.currency || "VND"}
              icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            />
          </div>

          {/* Date */}
          <div>
            <FormField
              label="Created At"
              value={new Date(data.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              icon={<Calendar className="w-4 h-4 text-purple-400" />}
            />
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Student Name"
              value={data.studentName}
              icon={<User className="w-4 h-4 text-cyan-400" />}
            />
            <FormField
              label="Student ID"
              value={`#${data.studentId}`}
              icon={<Hash className="w-4 h-4 text-cyan-400" />}
            />
          </div>

          {/* Course Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Course Title"
              value={data.courseTitle}
              icon={<BookOpen className="w-4 h-4 text-amber-400" />}
            />
            <FormField
              label="Course ID"
              value={`#${data.courseId}`}
              icon={<Hash className="w-4 h-4 text-amber-400" />}
            />
          </div>

          {/* Revenue Share - Only for SUCCESS */}
          {data.status === "SUCCESS" && (
            <>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-gray-300 text-sm font-semibold">Revenue Share</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">Teacher Receives</label>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-emerald-400 font-bold">{teacherAmount.toLocaleString()} ₫</div>
                      </div>
                      <div className="text-emerald-400 text-sm font-semibold">{teacherPercentage}%</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">Platform Receives</label>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-cyan-400 font-bold">{platformAmount.toLocaleString()} ₫</div>
                      </div>
                      <div className="text-cyan-400 text-sm font-semibold">{platformPercentage}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-blue-400 text-xs font-medium">Total</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
              </div>
            </>
          )}

          {/* Refund Reason */}
          {data.refundReason && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-rose-400 font-semibold text-xs mb-1">Refund Reason</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{data.refundReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-[#0f172a] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* =======================
 * Reusable UI parts
 * ======================= */

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: any;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-gray-400 text-xs mb-2 block font-medium">{label}</label>
      <div className="bg-slate-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="font-medium text-sm truncate">{value ?? "-"}</span>
      </div>
    </div>
  );
}
