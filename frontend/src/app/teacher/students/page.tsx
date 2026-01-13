"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    TrendingUp,
    Users,
    Target,
    Award,
    Eye,
    Clock,
    BookOpen,
    FileText,
    Download,
} from "lucide-react";
import { useTeacherCourses } from "@/hooks/teacher/useTeacherCourses";
import {
    useCourseEnrollments,
    useCourseEnrollmentStats,
    useExportEnrollments
} from "@/hooks/teacher/useStudentManagement";
import type { EnrollmentResponse } from "@/services/learning/enrollment.types";
import Button from "@/core/components/ui/Button";
import { mockStudents, mockEnrollmentStats, mockCourses } from "@/lib/teacher/mockData";

export default function TeacherStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCourse, setFilterCourse] = useState<number | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED">("all");

    // Use custom hooks
    const { courses: apiCourses, isLoading: coursesLoading } = useTeacherCourses();
    const exportMutation = useExportEnrollments();

    // Use mock data as fallback
    const courses = apiCourses && apiCourses.length > 0 ? apiCourses : mockCourses;

    const firstCourseId = courses?.[0]?.id;
    const selectedCourseId = filterCourse === "all" ? firstCourseId : filterCourse;

    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useCourseEnrollments(
        selectedCourseId,
        0,
        100
    );

    const { data: apiStats } = useCourseEnrollmentStats(selectedCourseId);

    // Use mock stats as fallback
    const stats = apiStats || mockEnrollmentStats;

    const filteredStudents = useMemo(() => {
        // Use API data if available, otherwise use mock data
        const enrollments = (enrollmentsData?.items && enrollmentsData.items.length > 0)
            ? enrollmentsData.items
            : mockStudents;
        return enrollments.filter((enrollment: any) => {
            const matchesSearch =
                searchTerm === "" ||
                enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                filterStatus === "all" || enrollment.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [enrollmentsData, searchTerm, filterStatus]);

    const topPerformers = useMemo(() => {
        // Use API data if available, otherwise use mock data
        const enrollments = (enrollmentsData?.items && enrollmentsData.items.length > 0)
            ? enrollmentsData.items
            : mockStudents;
        return [...enrollments]
            .sort((a, b) => b.completionPercentage - a.completionPercentage)
            .slice(0, 3);
    }, [enrollmentsData]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            ACTIVE: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", label: "Active" },
            COMPLETED: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Completed" },
            CANCELLED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Cancelled" },
            EXPIRED: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", label: "Expired" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;

        return (
            <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs font-semibold rounded-full`}>
                {config.label}
            </span>
        );
    };

    const getLastActive = (lastActivityAt?: string) => {
        if (!lastActivityAt) return "Never";
        const date = new Date(lastActivityAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return "Just now";
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const handleExportData = () => {
        if (selectedCourseId) {
            exportMutation.mutate({ courseId: selectedCourseId, format: "CSV" });
        }
    };

    const isLoading = coursesLoading || enrollmentsLoading;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        My Students
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage and track your students' progress
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                {filterCourse === "all" ? "All courses" : "This course"}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : stats?.totalEnrollments || 0}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Total Students
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-400 text-sm">
                                {stats?.totalEnrollments ? Math.round((stats.activeEnrollments / stats.totalEnrollments) * 100) : 0}% of total
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : stats?.activeEnrollments || 0}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Active Students
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                                Average
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : `${Math.round(stats?.averageCompletionPercentage || 0)}%`}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Avg. Progress
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">
                                Certificates
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isLoading ? "..." : stats?.completedEnrollments || 0}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Completions
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                All Students
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <select
                                    value={filterCourse}
                                    onChange={(e) => setFilterCourse(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Courses</option>
                                    {courses?.map((course: any) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="EXPIRED">Expired</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                {isLoading ? (
                                    <div className="text-center py-12 text-slate-500">Loading students...</div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">No students found</div>
                                ) : (
                                    filteredStudents.map((student: EnrollmentResponse) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=6366f1&color=fff`}
                                                    alt={student.studentName}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {student.studentName}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {student.studentEmail}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="hidden md:flex items-center gap-6">
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {Math.round(student.completionPercentage)}%
                                                    </p>
                                                    <p className="text-xs text-slate-500">Progress</p>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {student.completedLessons}/{student.totalLessons}
                                                    </p>
                                                    <p className="text-xs text-slate-500">Lessons</p>
                                                </div>

                                                <div className="text-center min-w-[100px]">
                                                    {getStatusBadge(student.status)}
                                                </div>

                                                <div className="text-center min-w-[80px]">
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {getLastActive(student.lastAccessedAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/teacher/students/${student.studentId}`}
                                                className="ml-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Top Performers
                            </h2>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-6 text-slate-500">Loading...</div>
                                ) : topPerformers.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500">No data yet</div>
                                ) : (
                                    topPerformers.map((student, index) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                {index + 1}
                                            </div>
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.studentName)}&background=6366f1&color=fff`}
                                                alt={student.studentName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                                                    {student.studentName}
                                                </h3>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                    {Math.round(student.completionPercentage)}% complete
                                                </p>
                                            </div>
                                            <Award className="w-5 h-5 text-amber-500" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-2">Export Student Data</h3>
                            <p className="text-sm text-indigo-100 mb-4">
                                Download detailed reports of your students' progress
                            </p>
                            <Button
                                onClick={handleExportData}
                                disabled={!selectedCourseId || exportMutation.isPending}
                                className="w-full px-4 py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                {exportMutation.isPending ? "Exporting..." : "Download CSV"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
