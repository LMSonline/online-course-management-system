"use client";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Plus,
    FileText,
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    Archive,
    Calendar,
    DollarSign,
    BookOpen,
    Target,
    Send,
    Rocket,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import { useCourseVersions } from "@/hooks/teacher";

export default function CourseVersionsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED" | "ARCHIVED">("all");

    // Fetch course details
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // Fetch versions with hook
    const {
        versions,
        stats,
        isLoading,
        mutations: { deleteVersion, submitApproval, publishVersion },
    } = useCourseVersions({
        courseId: course?.id || 0,
        status: statusFilter,
    });

    // Filter versions by search
    const filteredVersions = useMemo(() => {
        if (!searchQuery) return versions;
        const query = searchQuery.toLowerCase();
        return versions.filter(
            (v) =>
                v.title.toLowerCase().includes(query) ||
                v.description?.toLowerCase().includes(query) ||
                `v${v.versionNumber}`.includes(query)
        );
    }, [versions, searchQuery]);

    const getStatusBadge = (status: string) => {
        const badges = {
            DRAFT: {
                bg: "bg-slate-100 dark:bg-slate-800",
                text: "text-slate-700 dark:text-slate-300",
                border: "border-slate-300 dark:border-slate-600",
                icon: FileText,
            },
            PENDING: {
                bg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-700 dark:text-amber-300",
                border: "border-amber-300 dark:border-amber-600",
                icon: Clock,
            },
            APPROVED: {
                bg: "bg-blue-100 dark:bg-blue-900/30",
                text: "text-blue-700 dark:text-blue-300",
                border: "border-blue-300 dark:border-blue-600",
                icon: CheckCircle,
            },
            REJECTED: {
                bg: "bg-red-100 dark:bg-red-900/30",
                text: "text-red-700 dark:text-red-300",
                border: "border-red-300 dark:border-red-600",
                icon: XCircle,
            },
            PUBLISHED: {
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-700 dark:text-emerald-300",
                border: "border-emerald-300 dark:border-emerald-600",
                icon: CheckCircle,
            },
            ARCHIVED: {
                bg: "bg-gray-100 dark:bg-gray-900/30",
                text: "text-gray-700 dark:text-gray-300",
                border: "border-gray-300 dark:border-gray-600",
                icon: Archive,
            },
        };
        return badges[status as keyof typeof badges] || badges.DRAFT;
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
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Course Versions
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage and track all versions of your course
                        </p>
                    </div>
                    <Link
                        href={`/teacher/courses/${slug}/versions/create`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Version
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "all"
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.total}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Total
                        </p>
                    </button>

                    <button
                        onClick={() => setStatusFilter("DRAFT")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "DRAFT"
                            ? "border-slate-500 bg-slate-50 dark:bg-slate-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.draft}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Draft
                        </p>
                    </button>

                    <button
                        onClick={() => setStatusFilter("PENDING")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "PENDING"
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.pending}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Pending
                        </p>
                    </button>

                    <button
                        onClick={() => setStatusFilter("APPROVED")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "APPROVED"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.approved}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Approved
                        </p>
                    </button>

                    <button
                        onClick={() => setStatusFilter("REJECTED")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "REJECTED"
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-red-300"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.rejected}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Rejected
                        </p>
                    </button>

                    <button
                        onClick={() => setStatusFilter("PUBLISHED")}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === "PUBLISHED"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                            }`}
                    >
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stats.published}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Published
                        </p>
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search versions by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        />
                    </div>
                </div>

                {/* Versions List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredVersions.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredVersions.map((version) => {
                            const statusBadge = getStatusBadge(version.status);
                            const StatusIcon = statusBadge.icon;

                            return (
                                <div
                                    key={version.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        Version {version.versionNumber}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                                                    >
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {version.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    {version.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                    {version.description || "No description"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Version Details */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <DollarSign className="w-4 h-4" />
                                                <span>${version.price || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{version.durationDays || 0} days</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{version.chapterCount || 0} chapters</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Target className="w-4 h-4" />
                                                <span>{version.passScore || 0}% pass</span>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
                                            {version.publishedAt && (
                                                <span className="flex items-center gap-1">
                                                    <Rocket className="w-3.5 h-3.5" />
                                                    Published: {new Date(version.publishedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <Link
                                                href={`/teacher/courses/${slug}/versions/${version.id}/view`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>

                                            {version.status !== "PUBLISHED" && version.status !== "ARCHIVED" && (
                                                <Link
                                                    href={`/teacher/courses/${slug}/versions/${version.id}/content`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit Content
                                                </Link>
                                            )}

                                            {version.status === "DRAFT" && (
                                                <button
                                                    onClick={() => submitApproval.mutate(version.id)}
                                                    disabled={submitApproval.isPending}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Submit for Approval
                                                </button>
                                            )}

                                            {version.status === "APPROVED" && (
                                                <button
                                                    onClick={() => publishVersion.mutate(version.id)}
                                                    disabled={publishVersion.isPending}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <Rocket className="w-4 h-4" />
                                                    Publish
                                                </button>
                                            )}

                                            {(version.status === "DRAFT" ||
                                                version.status === "PENDING" ||
                                                version.status === "REJECTED") && (
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Are you sure you want to delete this version? This action cannot be undone."
                                                                )
                                                            ) {
                                                                deleteVersion.mutate(version.id);
                                                            }
                                                        }}
                                                        disabled={deleteVersion.isPending}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            No versions found
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by creating your first version"}
                        </p>
                        {!searchQuery && statusFilter === "all" && (
                            <Link
                                href={`/teacher/courses/${slug}/versions/create`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Your First Version
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </CourseManagementLayout>
    );
}
