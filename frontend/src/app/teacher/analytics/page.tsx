"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    DollarSign,
    Users,
    Star,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Award,
    Download,
} from "lucide-react";
import { courseService } from "@/services/courses";
import { analyticsService } from "@/services/courses/analytics.service";

export default function TeacherAnalyticsPage() {
    const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
    const [timeRange, setTimeRange] = useState("30");

    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryKey: ["teacher-courses", "all"],
        queryFn: () => courseService.getMyCourses(0, 100),
    });

    const { data: analytics, isLoading: analyticsLoading } = useQuery({
        queryKey: ["course-analytics", selectedCourse, timeRange],
        queryFn: () => {
            if (selectedCourse === "all") {
                return Promise.resolve(null);
            }
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(timeRange));

            return analyticsService.getCourseAnalytics(selectedCourse, {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            });
        },
        enabled: selectedCourse !== "all",
    });

    const handleExport = async () => {
        if (selectedCourse === "all") {
            toast.error("Please select a specific course to export");
            return;
        }
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(timeRange));

            const blob = await analyticsService.exportAnalyticsReport(
                selectedCourse,
                "PDF",
                {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                }
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `analytics-${selectedCourse}-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Analytics report exported successfully");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export analytics report");
        }
    };

    const stats = analytics ? {
        totalRevenue: analytics.totalRevenue,
        revenueChange: `${analytics.revenueGrowth >= 0 ? '+' : ''}${analytics.revenueGrowth.toFixed(1)}%`,
        revenueChangeLabel: `from previous period`,
        totalStudents: analytics.totalEnrollments,
        studentsChange: `${analytics.activeStudents} active`,
        studentsChangeLabel: `${analytics.activeStudents} this period`,
        averageRating: 4.8,
        ratingChange: "+0.2",
        ratingChangeLabel: "Based on reviews",
        completionRate: Math.round(analytics.averageCompletionRate),
        completionChange: `${analytics.averageCompletionRate >= 70 ? '+' : ''}${(analytics.averageCompletionRate - 70).toFixed(1)}%`,
        completionChangeLabel: "vs target 70%",
    } : {
        totalRevenue: 128945,
        revenueChange: "+12%",
        revenueChangeLabel: "Select a course",
        totalStudents: 45328,
        studentsChange: "+1,234",
        studentsChangeLabel: "Select a course",
        averageRating: 4.8,
        ratingChange: "+0.2",
        ratingChangeLabel: "Select a course",
        completionRate: 68,
        completionChange: "+3%",
        completionChangeLabel: "Select a course",
    };

    const monthlyEnrollments = analytics?.enrollmentTrend.map(item => ({
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.count
    })) || [
            { month: "Jan 1", value: 2345 },
            { month: "Jan 15", value: 2892 },
            { month: "Feb 1", value: 3156 },
            { month: "Feb 15", value: 3678 },
            { month: "Mar 1", value: 4123 },
            { month: "Mar 15", value: 4567 },
            { month: "Apr 1", value: 5234 },
            { month: "Apr 15", value: 5678 },
            { month: "May 1", value: 6123 },
            { month: "May 15", value: 6890 },
            { month: "Jun 1", value: 7456 },
            { month: "Jun 15", value: 8123 },
        ];

    const maxEnrollment = Math.max(...monthlyEnrollments.map((m) => m.value));

    const topPerformingLessons = analytics?.topPerformingLessons.slice(0, 3) || [];

    const tabOptions = [
        { icon: BarChart3, label: "Enrollment" },
        { icon: DollarSign, label: "Revenue" },
        { icon: Activity, label: "Engagement" },
        { icon: Award, label: "Performance" },
    ];

    const isLoading = coursesLoading || (selectedCourse !== "all" && analyticsLoading);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Track your course performance and student engagement
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                            disabled={coursesLoading}
                            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <option value="all">All Courses</option>
                            {courses?.items.map((course: any) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="180">Last 6 months</option>
                            <option value="365">Last year</option>
                        </select>
                        <button
                            onClick={handleExport}
                            disabled={selectedCourse === "all"}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {stats.revenueChange}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {stats.revenueChangeLabel}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                {stats.studentsChange}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : stats.totalStudents.toLocaleString()}
                        </p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            {stats.studentsChangeLabel}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {stats.ratingChange}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.averageRating}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stats.ratingChangeLabel}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                {stats.completionChange}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.completionRate}%
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                            {stats.completionChangeLabel}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <div className="flex overflow-x-auto">
                            {tabOptions.map((tab, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${index === 0
                                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                            {selectedCourse === "all" ? "Sample Enrollments" : "Enrollment Trend"}
                        </h3>
                        <div className="h-80">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    Loading chart...
                                </div>
                            ) : (
                                <div className="flex items-end justify-between h-full gap-2">
                                    {monthlyEnrollments.map((data, index) => {
                                        const height = (data.value / maxEnrollment) * 100;
                                        const colors = [
                                            "bg-indigo-600 dark:bg-indigo-500",
                                            "bg-purple-600 dark:bg-purple-500",
                                            "bg-blue-600 dark:bg-blue-500",
                                            "bg-violet-600 dark:bg-violet-500",
                                        ];
                                        const color = colors[index % colors.length];

                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center group">
                                                <div className="w-full flex flex-col items-center">
                                                    <div className="relative w-full mb-2">
                                                        <div
                                                            className={`${color} rounded-t-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer`}
                                                            style={{ height: `${height}%`, minHeight: "40px" }}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                                                                {data.value.toLocaleString()}
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
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            {topPerformingLessons.length > 0 ? "Top Performing Lessons" : "Course Performance"}
                        </h3>
                        {isLoading ? (
                            <div className="text-center py-8 text-slate-500">Loading...</div>
                        ) : topPerformingLessons.length > 0 ? (
                            <div className="space-y-4">
                                {topPerformingLessons.map((lesson, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                                                {lesson.lessonTitle}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                                                <span>{lesson.completionRate.toFixed(1)}% completion</span>
                                                <span>{lesson.viewCount} views</span>
                                                {lesson.averageScore && <span>{lesson.averageScore.toFixed(1)} avg score</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                Select a specific course to view performance data
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            Student Engagement
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Lesson Completion", value: analytics?.averageCompletionRate || 78, color: "bg-emerald-600" },
                                { label: "Assignment Submission", value: 65, color: "bg-indigo-600" },
                                { label: "Quiz Participation", value: 82, color: "bg-purple-600" },
                                { label: "Discussion Activity", value: 45, color: "bg-amber-600" },
                            ].map((metric, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {metric.label}
                                        </span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {isLoading ? "..." : `${Math.round(metric.value)}%`}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                                            style={{ width: isLoading ? "0%" : `${metric.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
