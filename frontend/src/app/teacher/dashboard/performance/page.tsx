// src/app/teacher/dashboard/performance/page.tsx
"use client";

import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Star,
    BookOpen,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PerformanceDetailPage() {
    const [timeRange, setTimeRange] = useState("30");

    // Mock data
    const performanceMetrics = {
        studentGrowth: {
            current: 1234,
            previous: 987,
            change: 25,
            trend: "up" as const,
        },
        revenueGrowth: {
            current: 45678,
            previous: 38234,
            change: 19.5,
            trend: "up" as const,
        },
        ratingChange: {
            current: 4.8,
            previous: 4.6,
            change: 4.3,
            trend: "up" as const,
        },
        courseCompletion: {
            current: 68,
            previous: 72,
            change: -5.6,
            trend: "down" as const,
        },
    };

    const topCourses = [
        {
            id: 1,
            title: "Complete Web Development Bootcamp",
            students: 12453,
            revenue: 45670,
            rating: 4.9,
            growth: 23,
        },
        {
            id: 2,
            title: "Advanced React Patterns",
            students: 8921,
            revenue: 32140,
            rating: 4.8,
            growth: 18,
        },
        {
            id: 3,
            title: "Node.js Deep Dive",
            students: 6234,
            revenue: 21890,
            rating: 4.7,
            growth: 15,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/dashboard"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Performance Analytics
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Detailed performance metrics and growth analysis
                        </p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                    </select>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            {performanceMetrics.studentGrowth.trend === "up" ? (
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            ) : (
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Student Growth</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            +{performanceMetrics.studentGrowth.current.toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            +{performanceMetrics.studentGrowth.change}% from last period
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Revenue Growth</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            ${performanceMetrics.revenueGrowth.current.toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            +{performanceMetrics.revenueGrowth.change}% from last period
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rating Change</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {performanceMetrics.ratingChange.current}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            +{performanceMetrics.ratingChange.change}% improvement
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {performanceMetrics.courseCompletion.current}%
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                            {performanceMetrics.courseCompletion.change}% from last period
                        </p>
                    </div>
                </div>

                {/* Top Performing Courses */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Top Performing Courses
                    </h2>
                    <div className="space-y-4">
                        {topCourses.map((course, index) => (
                            <div
                                key={course.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg font-bold text-indigo-600 dark:text-indigo-400">
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {course.students.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            ${course.revenue.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            {course.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        +{course.growth}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
