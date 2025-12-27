"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    TrendingUp,
    Users,
    DollarSign,
    Eye,
    Clock,
    Award,
    BarChart3,
    PieChart,
    Calendar,
    Download,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { analyticsService } from "@/services/courses/analytics.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CourseAnalyticsResponse } from "@/services/courses/analytics.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import { toast } from "sonner";

export default function CourseAnalyticsPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Fetch course details
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // TODO: Uncomment when backend API is ready
    // Fetch analytics data
    // const { data: analytics, isLoading: loadingAnalytics } = useQuery<CourseAnalyticsResponse>({
    //     queryKey: ["course-analytics", course?.id],
    //     queryFn: () => analyticsService.getCourseAnalytics(course!.id),
    //     enabled: !!course?.id,
    // });

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Mock data (replace with actual API calls)
    const analyticsData = {
        enrollmentTrend: [
            { month: "Jan", count: 45 },
            { month: "Feb", count: 78 },
            { month: "Mar", count: 92 },
            { month: "Apr", count: 156 },
        ],
        revenue: {
            total: 45200,
            thisMonth: 8400,
            growth: 24.5,
        },
        engagement: {
            avgCompletionRate: 78,
            avgTimeSpent: "4.2 hours",
            activeStudents: 234,
        },
    };

    const handleExportReport = async () => {
        if (!course?.id) return;

        try {
            toast.info("Export functionality will be available when API is ready");
            // TODO: Uncomment when API is ready
            // const blob = await analyticsService.exportAnalyticsReport(course.id, "PDF");
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = `${course.slug}-analytics-report.pdf`;
            // document.body.appendChild(a);
            // a.click();
            // window.URL.revokeObjectURL(url);
            // document.body.removeChild(a);
            // toast.success("Report exported successfully!");
        } catch (error: any) {
            toast.error(error?.message || "Failed to export report");
        }
    };

    return (
        <CourseManagementLayout course={course}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Course Analytics
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Track performance and student engagement
                        </p>
                    </div>
                    <button
                        onClick={handleExportReport}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                    >
                        <Download className="w-5 h-5" />
                        Export Report
                    </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                Total
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            1,234
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total Enrollments
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">+24%</span>
                            <span className="text-slate-500">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                Revenue
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            ${analyticsData.revenue.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total Revenue
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">+{analyticsData.revenue.growth}%</span>
                            <span className="text-slate-500">growth</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                                Rate
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {analyticsData.engagement.avgCompletionRate}%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Completion Rate
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                            <span>Above average</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                                Avg
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {analyticsData.engagement.avgTimeSpent}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Avg. Time Spent
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                            <span>Per student</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Enrollment Trend */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Enrollment Trend
                            </h3>
                            <BarChart3 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="h-64 flex items-end justify-around gap-4">
                            {analyticsData.enrollmentTrend.map((data) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg flex items-end justify-center relative group">
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-lg transition-all hover:opacity-80"
                                            style={{
                                                height: `${(data.count / 200) * 100}%`,
                                                minHeight: "60px",
                                            }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded">
                                                {data.count}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {data.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Lessons */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Top Lessons
                            </h3>
                            <PieChart className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Introduction to React", views: 856, completion: 92 },
                                { name: "React Hooks Deep Dive", views: 743, completion: 85 },
                                { name: "State Management", views: 691, completion: 78 },
                                { name: "Advanced Patterns", views: 624, completion: 71 },
                            ].map((lesson, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {lesson.name}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {lesson.views} views
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            style={{ width: `${lesson.completion}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coming Soon Notice */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-white/80 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Advanced Analytics Coming Soon
                    </h3>
                    <p className="text-indigo-100 max-w-2xl mx-auto">
                        We're working on bringing you detailed insights including student behavior analysis,
                        revenue forecasting, and personalized recommendations to improve your course performance.
                    </p>
                </div>
            </div>
        </CourseManagementLayout>
    );
}
