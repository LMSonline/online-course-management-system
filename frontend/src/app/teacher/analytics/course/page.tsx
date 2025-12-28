"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    TrendingUp,
    Users,
    Clock,
    Award,
    ExternalLink,
} from "lucide-react";
import { useCourseAnalytics } from "@/hooks/teacher/useAnalytics";
import type { CourseAnalytics } from "@/hooks/teacher/useAnalytics";

export default function CourseAnalyticsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: courses, loading } = useCourseAnalytics();

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    const filteredCourses = courses.filter((course: CourseAnalytics) =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
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
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/analytics"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Course Analytics
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Phân tích chi tiết theo từng khóa học
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm khóa học..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Course Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredCourses.map((course: CourseAnalytics) => (
                        <div
                            key={course.courseId}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {course.courseName}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            ID: {course.courseId}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/teacher/analytics/course/${course.courseId}`}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        View Details
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                                Total Enrollments
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatNumber(course.totalEnrollments)}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                                Active Students
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatNumber(course.activeStudents)}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                                Completion Rate
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {course.completionRate.toFixed(1)}%
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                                Avg. Time
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {course.averageTimeSpent}h
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Student Progress Distribution
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                                        <div
                                            className="bg-emerald-500 transition-all"
                                            style={{
                                                width: `${(course.studentsCompleted / course.totalEnrollments) * 100}%`,
                                            }}
                                            title={`Completed: ${course.studentsCompleted}`}
                                        />
                                        <div
                                            className="bg-blue-500 transition-all"
                                            style={{
                                                width: `${(course.studentsInProgress / course.totalEnrollments) * 100}%`,
                                            }}
                                            title={`In Progress: ${course.studentsInProgress}`}
                                        />
                                        <div
                                            className="bg-slate-400 transition-all"
                                            style={{
                                                width: `${(course.studentsNotStarted / course.totalEnrollments) * 100}%`,
                                            }}
                                            title={`Not Started: ${course.studentsNotStarted}`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-6 mt-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Completed: {course.studentsCompleted}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                In Progress: {course.studentsInProgress}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-slate-400 rounded"></div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Not Started: {course.studentsNotStarted}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-12 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            Không tìm thấy khóa học nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
