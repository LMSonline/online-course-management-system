"use client";

import { useState } from "react";
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Download,
    CreditCard,
    Calendar,
} from "lucide-react";

interface PayoutHistory {
    id: number;
    date: string;
    amount: number;
    method: string;
    status: "Completed" | "Processing" | "Pending";
}

export default function TeacherPayoutsPage() {
    const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

    // Mock data - Replace with real API call
    const currentBalance = 12340;
    const totalEarned = 284567;
    const pendingPayouts = 0;
    const processingFee = 0.99;

    const payoutHistory: PayoutHistory[] = [
        {
            id: 1,
            date: "2025-10-01",
            amount: 8900,
            method: "Bank Transfer",
            status: "Completed",
        },
        {
            id: 2,
            date: "2024-09-01",
            amount: 7825,
            method: "PayPal",
            status: "Completed",
        },
        {
            id: 3,
            date: "2024-08-01",
            amount: 9234,
            method: "Bank Transfer",
            status: "Completed",
        },
        {
            id: 4,
            date: "2024-07-01",
            amount: 8789,
            method: "Bank Transfer",
            status: "Completed",
        },
    ];

    const handleRequestPayout = () => {
        console.log("Requesting payout with method:", paymentMethod);
        // TODO: Integrate with API
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                        Completed
                    </span>
                );
            case "Processing":
                return (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        Processing
                    </span>
                );
            case "Pending":
                return (
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">
                        Pending
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payouts</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage your earnings and request payouts
                    </p>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-indigo-100 mb-1">Current Balance</p>
                        <p className="text-4xl font-bold mb-2">${currentBalance.toLocaleString()}</p>
                        <p className="text-xs text-indigo-200">Available for payout</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Earned</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                            ${totalEarned.toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">+12% from last month</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Payouts</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            ${pendingPayouts}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Processing</p>
                    </div>
                </div>

                {/* Request Payout Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Request Payout
                            </h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                        Available Balance
                                    </p>
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ${currentBalance.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option>Bank Transfer</option>
                                        <option>PayPal</option>
                                        <option>Stripe</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Payout Amount:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            ${currentBalance.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Processing Fee:</span>
                                        <span className="text-slate-900 dark:text-white">
                                            ${processingFee.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-900 dark:text-white">You'll Receive:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            ${(currentBalance - processingFee).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestPayout}
                                    disabled={currentBalance <= 0}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Request Payout
                                </button>

                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                    Minimum payout: $50. Payouts are processed within 3-5 business days.
                                </p>
                            </div>

                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Revenue Share: Platform
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    fee is 30% of course price. You keep 70% from each sale.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payout History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Payout History
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                Method
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {payoutHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        No payout history yet
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            payoutHistory.map((payout) => (
                                                <tr
                                                    key={payout.id}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-slate-400" />
                                                            <span className="text-sm text-slate-900 dark:text-white">
                                                                {new Date(payout.date).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            ${payout.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                {payout.method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(payout.status)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
