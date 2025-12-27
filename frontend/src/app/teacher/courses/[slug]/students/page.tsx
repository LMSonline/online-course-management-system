"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { enrollmentService } from "@/services/courses/enrollment.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import {
    CourseEnrollmentResponse,
    EnrollmentStatus,
} from "@/services/courses/enrollment.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import {
    Users,
    Download,
    Search,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Calendar,
    BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function CourseStudentsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | EnrollmentStatus>("all");

    // Fetch course details
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // TODO: Uncomment when backend API is ready
    // Fetch enrollments
    // const { data: enrollmentsData, isLoading: loadingEnrollments } = useQuery({
    //     queryKey: ["course-enrollments", course?.id],
    //     queryFn: () => enrollmentService.getCourseEnrollments(course!.id, 0, 100),
    //     enabled: !!course?.id,
    // });
    // const enrollments = enrollmentsData?.items || [];

    // Fetch enrollment stats
    // const { data: stats } = useQuery({
    //     queryKey: ["course-enrollment-stats", course?.id],
    //     queryFn: () => enrollmentService.getCourseEnrollmentStats(course!.id),
    //     enabled: !!course?.id,
    // });

    // Mock data (temporary - replace with real API when ready)
    const mockEnrollments: CourseEnrollmentResponse[] = [
        {
            id: 1,
            courseId: course?.id || 0,
            studentId: 101,
            studentName: "John Doe",
            studentEmail: "john.doe@example.com",
            enrolledAt: "2024-01-15T10:00:00Z",
            progress: 75,
            status: "ACTIVE",
            lastActivityAt: "2024-03-20T14:30:00Z",
            completedLessons: 15,
            totalLessons: 20,
            quizScore: 85,
            certificateIssued: false,
        },
        {
            id: 2,
            courseId: course?.id || 0,
            studentId: 102,
            studentName: "Jane Smith",
            studentEmail: "jane.smith@example.com",
            enrolledAt: "2024-01-20T09:00:00Z",
            progress: 100,
            status: "COMPLETED",
            lastActivityAt: "2024-03-18T16:45:00Z",
            completedLessons: 20,
            totalLessons: 20,
            quizScore: 92,
            certificateIssued: true,
        },
        {
            id: 3,
            courseId: course?.id || 0,
            studentId: 103,
            studentName: "Bob Johnson",
            studentEmail: "bob.johnson@example.com",
            enrolledAt: "2024-02-01T11:30:00Z",
            progress: 45,
            status: "ACTIVE",
            lastActivityAt: "2024-03-19T10:15:00Z",
            completedLessons: 9,
            totalLessons: 20,
            quizScore: 78,
            certificateIssued: false,
        },
        {
            id: 4,
            courseId: course?.id || 0,
            studentId: 104,
            studentName: "Alice Williams",
            studentEmail: "alice.w@example.com",
            enrolledAt: "2024-02-10T13:00:00Z",
            progress: 20,
            status: "DROPPED",
            lastActivityAt: "2024-02-25T09:00:00Z",
            completedLessons: 4,
            totalLessons: 20,
            certificateIssued: false,
        },
    ];

    const enrollments = mockEnrollments;

    const filteredEnrollments = useMemo(() => {
        let result = enrollments;

        if (filterStatus !== "all") {
            result = result.filter((e) => e.status === filterStatus);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (e) =>
                    e.studentName.toLowerCase().includes(query) ||
                    e.studentEmail.toLowerCase().includes(query)
            );
        }

        return result;
    }, [enrollments, filterStatus, searchQuery]);

    const stats = {
        total: enrollments.length,
        active: enrollments.filter((e) => e.status === "ACTIVE").length,
        completed: enrollments.filter((e) => e.status === "COMPLETED").length,
        dropped: enrollments.filter((e) => e.status === "DROPPED").length,
        paused: enrollments.filter((e) => e.status === "PAUSED").length,
        avgProgress: enrollments.length > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
            : 0,
    };

    const getStatusBadge = (status: EnrollmentStatus) => {
        const styles = {
            ACTIVE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            DROPPED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        };
        return styles[status];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleExportData = async () => {
        if (!course?.id) return;

        try {
            toast.info("Export functionality will be available when API is ready");
            // TODO: Uncomment when API is ready
            // const blob = await enrollmentService.exportCourseEnrollments(course.id, "CSV");
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = `${course.slug}-enrollments.csv`;
            // document.body.appendChild(a);
            // a.click();
            // window.URL.revokeObjectURL(url);
            // document.body.removeChild(a);
            // toast.success("Enrollments exported successfully!");
        } catch (error: any) {
            toast.error(error?.message || "Failed to export data");
        }
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
                            {stats.total} total enrollment{stats.total !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <button
                        onClick={handleExportData}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                    >
                        <Download className="w-5 h-5" />
                        Export Data
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "all"
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 bg-white dark:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.total}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total Students
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("ACTIVE")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "ACTIVE"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.active}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Active
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("COMPLETED")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "COMPLETED"
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 bg-white dark:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.completed}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Completed
                        </p>
                    </button>

                    <button
                        onClick={() => setFilterStatus("DROPPED")}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${filterStatus === "DROPPED"
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-red-300 bg-white dark:bg-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.dropped}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Dropped
                        </p>
                    </button>

                    <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stats.avgProgress}%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Avg. Progress
                        </p>
                    </div>
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

                {/* Students Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Enrolled
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Quiz Score
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr
                                        key={enrollment.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {enrollment.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {enrollment.studentName}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail className="w-3 h-3" />
                                                        {enrollment.studentEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(enrollment.enrolledAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-900 dark:text-white font-medium">
                                                        {enrollment.progress}%
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {enrollment.completedLessons}/{enrollment.totalLessons}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${enrollment.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                    enrollment.status
                                                )}`}
                                            >
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.lastActivityAt ? (
                                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(enrollment.lastActivityAt)}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.quizScore !== undefined ? (
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {enrollment.quizScore}%
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredEnrollments.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400 mb-1">
                                No students found
                            </p>
                            <p className="text-sm text-slate-500">
                                {searchQuery
                                    ? "Try adjusting your search"
                                    : "Students will appear here once they enroll"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CourseManagementLayout>
    );
}
