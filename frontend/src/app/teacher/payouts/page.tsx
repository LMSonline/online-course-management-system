"use client";

import { useState } from "react";
import Link from "next/link";
import {
    DollarSign,
    TrendingUp,
    Clock,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart,
    Calendar,
    ChevronRight,
} from "lucide-react";
import { useRevenue } from "@/hooks/teacher/useRevenue";
import { usePayouts, useTransactions } from "@/hooks/teacher/usePayouts";

export default function TeacherPayoutsPage() {
    const { revenue, loading: revenueLoading } = useRevenue();
    const { payouts, loading: payoutsLoading } = usePayouts();
    const { transactions, loading: transactionsLoading } = useTransactions();

    // Get recent transactions (last 5)
    const recentTransactions = transactions.slice(0, 5);

    // Get pending payouts count
    const pendingPayoutsCount = payouts.filter((p) => p.status === "PENDING").length;

    // Calculate growth percentage (mock)
    const lastMonthRevenue = revenue?.monthlyStats[revenue.monthlyStats.length - 1]?.revenue || 0;
    const previousMonthRevenue = revenue?.monthlyStats[revenue.monthlyStats.length - 2]?.revenue || 1;
    const growthPercent = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

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
        }).format(new Date(dateString));
    };

    if (revenueLoading || payoutsLoading || transactionsLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!revenue) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-400">Failed to load revenue data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Tổng Quan Tài Chính
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Quản lý doanh thu và yêu cầu rút tiền
                        </p>
                    </div>
                    <Link
                        href="/teacher/payouts/requests"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
                    >
                        <Wallet className="w-5 h-5" />
                        Yêu Cầu Rút Tiền
                    </Link>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Available Balance - Highlighted */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-2xl text-white col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Wallet className="w-6 h-6" />
                            </div>
                            {growthPercent > 0 ? (
                                <div className="flex items-center gap-1 text-emerald-200 text-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span className="font-semibold">+{growthPercent.toFixed(1)}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-red-200 text-sm">
                                    <ArrowDownRight className="w-4 h-4" />
                                    <span className="font-semibold">{growthPercent.toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-indigo-100 mb-1">Số Dư Khả Dụng</p>
                        <p className="text-3xl font-bold mb-2">
                            {formatCurrency(revenue.currentBalance)}
                        </p>
                        <p className="text-xs text-indigo-200">Có thể rút ngay</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Tổng Doanh Thu
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {formatCurrency(revenue.totalRevenue)}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            Trọn đời
                        </p>
                    </div>

                    {/* Total Withdrawn */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Đã Rút
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {formatCurrency(revenue.totalPayouts)}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            {((revenue.totalPayouts / revenue.totalRevenue) * 100).toFixed(0)}% tổng doanh thu
                        </p>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Đang Xử Lý
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {formatCurrency(revenue.pendingPayouts)}
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                            {pendingPayoutsCount} yêu cầu
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Monthly Revenue Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    Doanh Thu Theo Tháng
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    12 tháng gần nhất
                                </p>
                            </div>
                        </div>

                        {/* Simple Bar Chart */}
                        <div className="space-y-3">
                            {revenue.monthlyStats.slice(-12).map((stat, index) => {
                                const maxRevenue = Math.max(...revenue.monthlyStats.map(s => s.revenue));
                                const widthPercent = (stat.revenue / maxRevenue) * 100;
                                const date = new Date(stat.month);
                                const monthName = date.toLocaleDateString("vi-VN", { month: "short", year: "numeric" });

                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium w-24">
                                                {monthName}
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-semibold">
                                                {formatCurrency(stat.revenue)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-500">
                                            {stat.enrollments} đăng ký
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-purple-600" />
                                Top Khóa Học
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Theo doanh thu
                            </p>
                        </div>

                        <div className="space-y-4">
                            {revenue.courseBreakdown.slice(0, 5).map((course, index) => {
                                const colors = [
                                    "from-indigo-600 to-purple-600",
                                    "from-blue-600 to-cyan-600",
                                    "from-emerald-600 to-teal-600",
                                    "from-orange-600 to-pink-600",
                                    "from-rose-600 to-pink-600",
                                ];

                                return (
                                    <div key={course.courseId} className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                                                    {course.courseName}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {course.enrollments} học viên
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">
                                                {course.percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-500`}
                                                    style={{ width: `${course.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {formatCurrency(course.revenue)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Giao Dịch Gần Đây
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Sinh viên mua khóa học
                            </p>
                        </div>
                        <Link
                            href="/teacher/payouts/transactions"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1"
                        >
                            Xem Tất Cả
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Học Viên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Khóa Học
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Thực Nhận
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Chưa có giao dịch nào
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    {formatDate(transaction.transactionDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {transaction.studentAvatar && (
                                                        <img
                                                            src={transaction.studentAvatar}
                                                            alt={transaction.studentName}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    )}
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {transaction.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                                    {transaction.courseName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-bold ${transaction.status === "REFUNDED"
                                                    ? "text-red-600 dark:text-red-400 line-through"
                                                    : "text-emerald-600 dark:text-emerald-400"
                                                    }`}>
                                                    {formatCurrency(transaction.netEarnings)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/teacher/payouts/transactions"
                        className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    Lịch Sử Giao Dịch
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Xem chi tiết các giao dịch mua khóa học
                                </p>
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </Link>

                    <Link
                        href="/teacher/payouts/requests"
                        className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    Quản Lý Rút Tiền
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Tạo yêu cầu và theo dõi trạng thái rút tiền
                                </p>
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Chính Sách Chia Sẻ Doanh Thu
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Nền tảng thu phí <span className="font-bold text-indigo-600 dark:text-indigo-400">30%</span> trên mỗi giao dịch bán khóa học.
                                Bạn nhận được <span className="font-bold text-emerald-600 dark:text-emerald-400">70%</span> giá trị khóa học.
                            </p>
                            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                <li>• Số tiền rút tối thiểu: <span className="font-semibold">500,000 VNĐ</span></li>
                                <li>• Thời gian xử lý: <span className="font-semibold">3-5 ngày làm việc</span></li>
                                <li>• Phương thức: Chuyển khoản ngân hàng</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
