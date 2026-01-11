"use client";

import { useState } from "react";
import {
  DollarSign,
  Filter,
  User,
  CreditCard,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";
import {
  useAdminPayments,
  useRefundPayment,
  useStudentPaymentHistory,
} from "@/hooks/admin/useAdminPayments";
import type {
  PaymentTransactionResponse,
  PaymentStatus,
} from "@/lib/admin/payment.types";
import PaymentDetailModal from "@/core/components/admin/payments/PaymentDetailModal ";

export default function AdminPaymentsPage() {
  /* =====================
   * Filters & paging
   * ===================== */
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [studentId, setStudentId] = useState<string>("");
  const [page, setPage] = useState(0);

  const pageSize = 10;

  const {
    data,
    isLoading,
    isError,
  } = useAdminPayments({
    status: status || undefined,
    studentId: studentId ? Number(studentId) : undefined,
    page,
    size: pageSize,
  });

  const refundMutation = useRefundPayment();

  /* =====================
   * Student history modal
   * ===================== */
  const [selectedStudentId, setSelectedStudentId] =
    useState<number | null>(null);

  const { data: studentHistory } = useStudentPaymentHistory(
    selectedStudentId ?? 0
  );

  /* =====================
   * Payment Detail Modal
   * ===================== */
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  /* =====================
   * Handlers
   * ===================== */

  const handleRefund = async (
    payment: PaymentTransactionResponse
  ) => {
    if (!payment.canRefund) {
      alert("This payment cannot be refunded");
      return;
    }

    const reason = prompt("Refund reason?");
    if (!reason) return;

    await refundMutation.mutateAsync({
      id: payment.id,
      payload: { reason },
    });
  };

  /* =====================
   * Helper functions
   * ===================== */

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

  /* =====================
   * Render states
   * ===================== */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 font-medium">Failed to load payments</p>
        </div>
      </div>
    );
  }

  const payments: PaymentTransactionResponse[] = data?.items ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Payment Management</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Monitor and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-sm">Total Payments</span>
              <p className="text-2xl font-bold text-white mt-1">
                {data?.totalItems ?? 0}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-400/50" />
          </div>
        </div>
      </div>

      {/* Filters */}
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
              onChange={(e) => setStatus(e.target.value as PaymentStatus | "")}
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
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 12"
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
                  onClick={() => setSelectedPaymentId(p.id)}
                >
                  <td className="px-6 py-4">
                    <span className="text-white font-mono font-semibold">#{p.id}</span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-2 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudentId(p.studentId);
                      }}
                    >
                      <User className="w-4 h-4" />
                      {p.studentName}
                      <span className="text-gray-500 text-sm">(#{p.studentId})</span>
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{p.courseTitle}</div>
                    <div className="text-gray-500 text-xs mt-1">Version {p.versionNumber}</div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-white">
                      {p.amount} <span className="text-gray-400 text-sm">{p.currency}</span>
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

                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPaymentId(p.id);
                        }}
                        className="px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {p.status === "SUCCESS" && (
                        <button
                          disabled={!p.canRefund || refundMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefund(p);
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
            Page {(data?.page ?? 0) + 1} of {data?.totalPages ?? 1}
            <span className="text-gray-600 ml-2">
              ({data?.totalItems ?? 0} total)
            </span>
          </span>

          <div className="flex gap-2">
            <button
              disabled={!data?.hasPrevious}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <button
              disabled={!data?.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student history modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Payment History</h2>
                  <p className="text-gray-400 text-sm">Student #{selectedStudentId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {studentHistory && studentHistory.length > 0 ? (
                <div className="space-y-3">
                  {studentHistory.map((p: PaymentTransactionResponse) => (
                    <div
                      key={p.id}
                      className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedStudentId(null);
                        setSelectedPaymentId(p.id);
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
                  <p className="text-gray-400">
                    No payment history found
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
              <button
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-white rounded-lg font-medium transition-all"
                onClick={() => setSelectedStudentId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}
    </div>
  );
}
