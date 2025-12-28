"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    TrendingDown,
    Users,
    Clock,
    Award,
    AlertTriangle,
    CheckCircle,
    XCircle,
    BarChart3,
    Eye,
} from "lucide-react";
import { useCourseCompletion } from "@/hooks/teacher/useAnalytics";

export default function CourseDetailAnalyticsPage() {
    const params = useParams();
    const courseId = params.id as string;
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, loading } = useCourseCompletion(courseId);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-600 dark:text-slate-400">No data available</p>
            </div>
        );
    }

    const filteredStudents = data.students.filter((student: any) => {
        const matchesSearch = student.studentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || student.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            not_started: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
        };
        const labels = {
            completed: "Completed",
            in_progress: "In Progress",
            not_started: "Not Started",
        };
        return (
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/analytics/course"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {data.courseName}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Chi tiết phân tích khóa học
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Registered</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatNumber(data.funnel.registered)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">50% Complete</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatNumber(data.funnel.halfComplete)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {((data.funnel.halfComplete / data.funnel.registered) * 100).toFixed(1)}% retention
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Exam Eligible</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatNumber(data.funnel.examEligible)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {((data.funnel.examEligible / data.funnel.halfComplete) * 100).toFixed(1)}% from 50%
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Certified</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatNumber(data.funnel.certified)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {((data.funnel.certified / data.funnel.examEligible) * 100).toFixed(1)}% pass rate
                        </p>
                    </div>
                </div>

                {/* Completion Funnel Visual */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Completion Funnel
                    </h2>

                    <div className="space-y-4">
                        {[
                            { label: "Registered", value: data.funnel.registered, color: "bg-indigo-500" },
                            { label: "50% Complete", value: data.funnel.halfComplete, color: "bg-blue-500" },
                            { label: "Exam Eligible", value: data.funnel.examEligible, color: "bg-purple-500" },
                            { label: "Certified", value: data.funnel.certified, color: "bg-emerald-500" },
                        ].map((stage, index) => (
                            <div key={stage.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {stage.label}
                                    </span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatNumber(stage.value)} (
                                        {((stage.value / data.funnel.registered) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                                    <div
                                        className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-4`}
                                        style={{
                                            width: `${(stage.value / data.funnel.registered) * 100}%`,
                                        }}
                                    >
                                        <span className="text-white text-sm font-bold">
                                            {formatNumber(stage.value)}
                                        </span>
                                    </div>
                                </div>
                                {index < 3 && (
                                    <div className="flex items-center gap-2 mt-2 ml-4">
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <span className="text-xs text-red-600 dark:text-red-400">
                                            Drop-off: {formatNumber([
                                                data.funnel.registered - data.funnel.halfComplete,
                                                data.funnel.halfComplete - data.funnel.examEligible,
                                                data.funnel.examEligible - data.funnel.certified,
                                            ][index])} students
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assessment Performance */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Assessment Performance
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Average Score</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                {data.assessmentStats.averageScore.toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Pass Rate</p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {data.assessmentStats.passRate.toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Completion Rate</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {data.assessmentStats.completionRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Most Difficult Questions */}
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                            Most Difficult Questions
                        </h3>
                        <div className="space-y-3">
                            {data.assessmentStats.difficultQuestions.map((q: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                                                {q.questionText}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Lesson: {q.lessonName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                            {q.correctRate.toFixed(1)}%
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            correct rate
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lesson Engagement */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        Lesson Engagement
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Lesson
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Views
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Avg. Time
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Completion
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Drop-off
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {data.lessonEngagement.map((lesson: any) => (
                                    <tr
                                        key={lesson.lessonId}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {lesson.lessonTitle}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm text-slate-900 dark:text-white">
                                                {formatNumber(lesson.viewCount)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm text-slate-900 dark:text-white">
                                                {lesson.avgWatchTime}m
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                {lesson.completionRate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span
                                                className={`text-sm font-medium ${lesson.dropOffRate > 30
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-slate-600 dark:text-slate-400"
                                                    }`}
                                            >
                                                {lesson.dropOffRate.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Student Progress List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            Student Progress
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search students..."
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["all", "completed", "in_progress", "not_started"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        {status === "all"
                                            ? "All"
                                            : status
                                                .split("_")
                                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                                .join(" ")}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Time Spent
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredStudents.map((student: any) => (
                                    <tr
                                        key={student.studentId}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {student.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {student.studentName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                                                        style={{ width: `${student.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white w-12">
                                                    {student.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm text-slate-900 dark:text-white">
                                                {student.timeSpent}h
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(student.lastActivity).toLocaleDateString("vi-VN")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(student.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                No students found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
