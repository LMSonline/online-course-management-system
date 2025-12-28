"use client";

import { useState } from "react";
import Link from "next/link";
import {
    DollarSign,
    Users,
    Star,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    ChevronRight,
    BarChart3,
    FileText,
    ShieldAlert,
} from "lucide-react";
import { useGlobalAnalytics } from "@/hooks/teacher/useAnalytics";

export default function TeacherAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"30" | "90" | "180" | "365" | "all">("30");

    const { data: analytics, loading } = useGlobalAnalytics({ timeRange });

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Format number
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    if (loading || !analytics) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const maxRevenue = Math.max(...analytics.revenueTrend.map((m) => m.revenue));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Analytics Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Tổng quan hiệu suất giảng dạy và kinh doanh
                        </p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 3 months</option>
                        <option value="180">Last 6 months</option>
                        <option value="365">This year</option>
                        <option value="all">All time</option>
                    </select>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            {analytics.revenueGrowth >= 0 ? (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span className="font-semibold">+{analytics.revenueGrowth.toFixed(1)}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                                    <ArrowDownRight className="w-4 h-4" />
                                    <span className="font-semibold">{analytics.revenueGrowth.toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {formatCurrency(analytics.totalRevenue)}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            from previous period
                        </p>
                    </div>

                    {/* Total Enrollments */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-semibold">+{analytics.enrollmentGrowth.toFixed(1)}%</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Enrollments</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {formatNumber(analytics.totalEnrollments)}
                        </p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            total registrations
                        </p>
                    </div>

                    {/* Active Students */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Students</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {formatNumber(analytics.activeStudents)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                            currently learning
                        </p>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-semibold">+{analytics.ratingChange.toFixed(1)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg. Course Rating</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {analytics.avgCourseRating.toFixed(1)}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                            based on reviews
                        </p>
                    </div>
                </div>

                {/* Revenue Trend Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                                Revenue Trend
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Monthly revenue overview
                            </p>
                        </div>
                    </div>

                    <div className="h-80 flex items-end justify-between gap-2">
                        {analytics.revenueTrend.map((data, index) => {
                            const height = (data.revenue / maxRevenue) * 100;
                            const colors = [
                                "from-indigo-600 to-purple-600",
                                "from-blue-600 to-cyan-600",
                                "from-violet-600 to-pink-600",
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="relative w-full mb-2">
                                            <div
                                                className={`bg-gradient-to-t ${color} rounded-t-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer`}
                                                style={{ height: `${height}%`, minHeight: "40px" }}
                                            >
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap">
                                                    <div>{formatCurrency(data.revenue)}</div>
                                                    <div className="text-slate-300 dark:text-slate-600">{data.enrollments} enrollments</div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                                            {data.month}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Top Performing Courses
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Courses with highest revenue
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Course Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Revenue
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Enrollments
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {analytics.topPerformingCourses.map((course, index) => (
                                    <tr
                                        key={course.courseId}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${index === 0 ? "from-yellow-400 to-orange-500" : index === 1 ? "from-indigo-400 to-purple-500" : "from-blue-400 to-cyan-500"} flex items-center justify-center text-white font-bold shadow-lg`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {course.courseName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(course.revenue)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                {formatNumber(course.enrollments)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {course.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/teacher/analytics/course/${course.courseId}`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center justify-end gap-1"
                                            >
                                                View Details
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/teacher/analytics/revenue"
                        className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Financial Analytics
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Chi tiết doanh thu theo từng khóa học
                        </p>
                    </Link>

                    <Link
                        href="/teacher/analytics/course"
                        className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Course Analytics
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Tiến độ & hiệu suất học tập chi tiết
                        </p>
                    </Link>

                    <Link
                        href="/teacher/analytics/integrity"
                        className="group bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                                <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Integrity Reports
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Báo cáo vi phạm và cảnh báo gian lận
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
