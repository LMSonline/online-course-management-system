"use client";

import { useState } from "react";
import { DollarSign, X } from "lucide-react";
import {
  useAdminPayments,
  useRefundPayment,
  useStudentPaymentHistory,
} from "@/hooks/admin/useAdminPayments";
import type {
  PaymentTransactionResponse,
  PaymentStatus,
} from "@/lib/admin/payment.types";
import PaymentDetailModal from "@/core/components/admin/payments/PaymentDetailModal";
import { PaymentStats } from "@/core/components/admin/payments/PaymentStats";
import { PaymentFilters } from "@/core/components/admin/payments/PaymentFilters";
import { PaymentTable } from "@/core/components/admin/payments/PaymentTable";
import { StudentHistoryModal } from "@/core/components/admin/payments/StudentHistoryModal";

export default function AdminPaymentsPage() {
  /* =====================
   * Filters & paging
   * ===================== */
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [studentId, setStudentId] = useState<string>("");
  const [page, setPage] = useState(0);

  const pageSize = 10;

  const { data, isLoading, isError } = useAdminPayments({
    status: status || undefined,
    studentId: studentId ? Number(studentId) : undefined,
    page,
    size: pageSize,
  });

  const refundMutation = useRefundPayment();

  /* =====================
   * Student history modal
   * ===================== */
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const { data: studentHistory } = useStudentPaymentHistory(
    selectedStudentId ?? 0
  );

  /* =====================
   * Payment Detail Modal
   * ===================== */
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );

  /* =====================
   * Handlers
   * ===================== */
  const handleRefund = async (payment: PaymentTransactionResponse) => {
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
            <h1 className="text-3xl font-bold text-white">
              Payment Management
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Monitor and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <PaymentStats totalPayments={data?.totalItems ?? 0} />

      {/* Filters */}
      <PaymentFilters
        status={status}
        studentId={studentId}
        onStatusChange={setStatus}
        onStudentIdChange={setStudentId}
      />

      {/* Table */}
      <PaymentTable
        payments={payments}
        currentPage={data?.page ?? 0}
        totalPages={data?.totalPages ?? 1}
        totalItems={data?.totalItems ?? 0}
        hasNext={data?.hasNext ?? false}
        hasPrevious={data?.hasPrevious ?? false}
        onPageChange={setPage}
        onViewPayment={setSelectedPaymentId}
        onViewStudentHistory={setSelectedStudentId}
        onRefund={handleRefund}
        isRefunding={refundMutation.isPending}
      />

      {/* Student history modal */}
      {selectedStudentId && (
        <StudentHistoryModal
          studentId={selectedStudentId}
          payments={studentHistory ?? []}
          onClose={() => setSelectedStudentId(null)}
          onViewPayment={setSelectedPaymentId}
        />
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
