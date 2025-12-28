"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    CreditCard,
    Plus,
    RefreshCw,
    Info,
} from "lucide-react";
import { usePayouts, useAvailableBalance, useBankAccounts, useCreatePayout } from "@/hooks/teacher/usePayouts";
import { PayoutStatus } from "@/lib/teacher/financial/types";

export default function PayoutRequestsPage() {
    const { payouts, loading: payoutsLoading, refetch } = usePayouts();
    const { balance, loading: balanceLoading } = useAvailableBalance();
    const { accounts, loading: accountsLoading } = useBankAccounts();
    const { createPayout, loading: creating, error: createError } = useCreatePayout();

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestAmount, setRequestAmount] = useState("");
    const [selectedBankId, setSelectedBankId] = useState<number>(1);
    const [note, setNote] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    // Get status info
    const getStatusInfo = (status: PayoutStatus) => {
        switch (status) {
            case PayoutStatus.PENDING:
                return {
                    badge: (
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Đang Chờ
                        </span>
                    ),
                    icon: <Clock className="w-5 h-5 text-orange-600" />,
                };
            case PayoutStatus.COMPLETED:
                return {
                    badge: (
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Hoàn Thành
                        </span>
                    ),
                    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
                };
            case PayoutStatus.REJECTED:
                return {
                    badge: (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Bị Từ Chối
                        </span>
                    ),
                    icon: <XCircle className="w-5 h-5 text-red-600" />,
                };
            default:
                return {
                    badge: null,
                    icon: null,
                };
        }
    };

    const handleOpenRequestModal = () => {
        setRequestAmount("");
        setNote("");
        setShowRequestModal(true);
    };

    const handleSubmitRequest = async () => {
        const amount = parseFloat(requestAmount);

        if (isNaN(amount) || amount <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        if (amount < balance.minimumPayout) {
            alert(`Số tiền tối thiểu là ${formatCurrency(balance.minimumPayout)}`);
            return;
        }

        if (amount > balance.available) {
            alert("Số tiền vượt quá số dư khả dụng");
            return;
        }

        const success = await createPayout({
            amount,
            bankAccountId: selectedBankId,
            note: note || undefined,
        });

        if (success) {
            setShowRequestModal(false);
            setShowSuccessModal(true);
            refetch();
            // Optionally refresh balance here
        }
    };

    const defaultBank = accounts.find((a) => a.isDefault) || accounts[0];

    if (balanceLoading || payoutsLoading || accountsLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teacher/payouts"
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Quản Lý Rút Tiền
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Yêu cầu rút tiền và theo dõi trạng thái
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={refetch}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Làm mới"
                    >
                        <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Balance & Request Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Balance Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-2xl text-white mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Wallet className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-sm text-indigo-100 mb-1">Số Dư Khả Dụng</p>
                            <p className="text-4xl font-bold mb-4">
                                {formatCurrency(balance.available)}
                            </p>
                            <button
                                onClick={handleOpenRequestModal}
                                disabled={balance.available < balance.minimumPayout}
                                className="w-full px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo Yêu Cầu Rút Tiền
                            </button>
                        </div>

                        {/* Bank Account Info */}
                        {defaultBank && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg mb-6">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Tài Khoản Nhận Tiền
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            Ngân hàng:
                                        </span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {defaultBank.bankName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            Số tài khoản:
                                        </span>
                                        <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                                            {defaultBank.accountNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            Chủ tài khoản:
                                        </span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {defaultBank.accountHolderName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                                        Lưu Ý Quan Trọng:
                                    </p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Số tiền tối thiểu: {formatCurrency(balance.minimumPayout)}</li>
                                        <li>• Thời gian xử lý: 3-5 ngày làm việc</li>
                                        <li>• Chỉ được 1 yêu cầu đang chờ cùng lúc</li>
                                        <li>• Kiểm tra kỹ thông tin tài khoản</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payout History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Lịch Sử Rút Tiền
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {payouts.length} yêu cầu
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {payouts.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Chưa có yêu cầu rút tiền nào
                                        </p>
                                    </div>
                                ) : (
                                    payouts.map((payout) => {
                                        const statusInfo = getStatusInfo(payout.status);
                                        return (
                                            <div
                                                key={payout.id}
                                                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                                                            {statusInfo.icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                                {formatCurrency(payout.amount)}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                Mã GD: {payout.transactionCode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {statusInfo.badge}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                            Ngày Yêu Cầu:
                                                        </p>
                                                        <p className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(payout.requestDate)}
                                                        </p>
                                                    </div>

                                                    {payout.processedDate && (
                                                        <div>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                                Ngày Xử Lý:
                                                            </p>
                                                            <p className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(payout.processedDate)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {payout.note && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                            Ghi Chú:
                                                        </p>
                                                        <p className="text-sm text-slate-900 dark:text-white">
                                                            {payout.note}
                                                        </p>
                                                    </div>
                                                )}

                                                {payout.rejectReason && (
                                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs font-semibold text-red-900 dark:text-red-100 mb-1">
                                                                    Lý Do Từ Chối:
                                                                </p>
                                                                <p className="text-sm text-red-700 dark:text-red-300">
                                                                    {payout.rejectReason}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Payout Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Tạo Yêu Cầu Rút Tiền
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Điền thông tin để rút tiền về tài khoản
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Available Balance Display */}
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Số Dư Khả Dụng
                                </p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {formatCurrency(balance.available)}
                                </p>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Số Tiền Muốn Rút (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    value={requestAmount}
                                    onChange={(e) => setRequestAmount(e.target.value)}
                                    placeholder={`Tối thiểu ${balance.minimumPayout.toLocaleString()}`}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Bank Account Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tài Khoản Nhận
                                </label>
                                <select
                                    value={selectedBankId}
                                    onChange={(e) => setSelectedBankId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.bankName} - {account.accountNumber}
                                            {account.isDefault ? " (Mặc định)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Ghi Chú (Tùy chọn)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ví dụ: Rút tiền cuối tháng"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            {createError && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {createError}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                            <button
                                onClick={() => setShowRequestModal(false)}
                                disabled={creating}
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitRequest}
                                disabled={creating}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Đang Xử Lý...
                                    </>
                                ) : (
                                    <>Xác Nhận Rút Tiền</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Yêu Cầu Thành Công!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Yêu cầu rút tiền của bạn đã được gửi. Chúng tôi sẽ xử lý trong vòng 3-5 ngày làm việc.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
