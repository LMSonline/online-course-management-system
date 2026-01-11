"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Download,
    DollarSign,
    TrendingUp,
    PieChart as PieChartIcon,
    RefreshCw,
} from "lucide-react";
import { useRevenueBreakdown } from "@/hooks/teacher/useAnalytics";

export default function RevenueAnalyticsPage() {
    const { data: breakdown, loading, exportCSV } = useRevenueBreakdown();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    const handleExport = () => {
        exportCSV();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const totalRevenue = breakdown.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalNetEarnings = breakdown.reduce((sum, item) => sum + item.netEarnings, 0);
    const totalPlatformFee = breakdown.reduce((sum, item) => sum + item.platformFee, 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teacher/analytics"
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Financial Analytics
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Chi tiết doanh thu theo từng khóa học
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(totalRevenue)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Platform Fee (30%)</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(totalPlatformFee)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Net Earnings (70%)</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(totalNetEarnings)}
                        </p>
                    </div>
                </div>

                {/* Revenue Breakdown Pie Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Revenue by Course
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pie Chart Visual */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-64 h-64">
                                {breakdown.slice(0, 5).map((item, index) => {
                                    const colors = [
                                        { bg: "bg-indigo-600", text: "text-indigo-600" },
                                        { bg: "bg-purple-600", text: "text-purple-600" },
                                        { bg: "bg-blue-600", text: "text-blue-600" },
                                        { bg: "bg-cyan-600", text: "text-cyan-600" },
                                        { bg: "bg-teal-600", text: "text-teal-600" },
                                    ];
                                    const color = colors[index % colors.length];

                                    return (
                                        <div
                                            key={item.courseId}
                                            className={`absolute inset-0 ${color.bg} rounded-full`}
                                            style={{
                                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((item.percentage / 100) * 2 * Math.PI)}% ${50 - 50 * Math.sin((item.percentage / 100) * 2 * Math.PI)}%, 50% 50%)`,
                                                transform: `rotate(${breakdown.slice(0, index).reduce((sum, i) => sum + (i.percentage / 100) * 360, 0)}deg)`,
                                            }}
                                        />
                                    );
                                })}
                                <div className="absolute inset-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                                            {breakdown.length}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">courses</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            {breakdown.slice(0, 5).map((item, index) => {
                                const colors = [
                                    "bg-indigo-600",
                                    "bg-purple-600",
                                    "bg-blue-600",
                                    "bg-cyan-600",
                                    "bg-teal-600",
                                ];

                                return (
                                    <div key={item.courseId} className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                                                {item.courseName}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {item.percentage.toFixed(1)}%
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(item.totalRevenue)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Revenue Breakdown by Course
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Course Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Units Sold
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Total Revenue
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Platform Fee
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Net Earnings
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        % of Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {breakdown.map((item) => (
                                    <tr
                                        key={item.courseId}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {item.courseName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm text-slate-900 dark:text-white">
                                                {formatCurrency(item.price)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                {formatNumber(item.unitsSold)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(item.totalRevenue)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm text-orange-600 dark:text-orange-400">
                                                -{formatCurrency(item.platformFee)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(item.netEarnings)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                {item.percentage.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700">
                                <tr>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white" colSpan={3}>
                                        TOTAL
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(totalRevenue)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-orange-600 dark:text-orange-400">
                                        -{formatCurrency(totalPlatformFee)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(totalNetEarnings)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                        100%
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
