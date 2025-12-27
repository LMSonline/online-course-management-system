"use client";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Users,
    Search,
    Filter,
    Mail,
    Calendar,
    TrendingUp,
    Award,
    Clock,
    CheckCircle,
    XCircle,
    Download,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";

export default function CourseStudentsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "dropped">("all");

    // Fetch course details
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // Mock students data (replace with actual API call)
    const mockStudents = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            enrolledAt: "2024-01-15",
            progress: 75,
            status: "active",
            lastActivity: "2024-03-20",
            completedLessons: 15,
            totalLessons: 20,
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            enrolledAt: "2024-01-20",
            progress: 100,
            status: "completed",
            lastActivity: "2024-03-18",
            completedLessons: 20,
            totalLessons: 20,
        },
        // Add more mock data as needed
    ];

    const filteredStudents = useMemo(() => {
        let result = mockStudents;

        if (filterStatus !== "all") {
            result = result.filter((s) => s.status === filterStatus);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(query) ||
                    s.email.toLowerCase().includes(query)
            );
        }

        return result;
    }, [filterStatus, searchQuery]);

    const stats = {
        total: mockStudents.length,
        active: mockStudents.filter((s) => s.status === "active").length,
        completed: mockStudents.filter((s) => s.status === "completed").length,
        dropped: mockStudents.filter((s) => s.status === "dropped").length,
    };

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <CourseManagementLayout course={course}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Enrolled Students
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage and monitor your students' progress
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg">
                        <Download className="w-5 h-5" />
                        Export Data
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "all"
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.total}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total Students
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("active")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "active"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.active}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Active Students
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("completed")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "completed"
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.completed}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Completed
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("dropped")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "dropped"
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-red-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.dropped}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Dropped
                        </p>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search students by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        />
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Enrolled
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {student.name}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {student.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(student.enrolledAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[120px]">
                                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${student.progress === 100
                                                                    ? "bg-emerald-500"
                                                                    : student.progress >= 70
                                                                        ? "bg-blue-500"
                                                                        : student.progress >= 40
                                                                            ? "bg-amber-500"
                                                                            : "bg-red-500"
                                                                }`}
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {student.progress}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {student.completedLessons}/{student.totalLessons} lessons
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${student.status === "completed"
                                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                                        : student.status === "active"
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                    }`}
                                            >
                                                {student.status === "completed" ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : student.status === "active" ? (
                                                    <Clock className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(student.lastActivity).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                                <Mail className="w-4 h-4" />
                                                Contact
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400">
                                No students found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CourseManagementLayout>
    );
}
