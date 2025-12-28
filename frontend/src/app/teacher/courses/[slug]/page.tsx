"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    Users,
    Star,
    DollarSign,
    FileText,
    Calendar,
    Clock,
    Target,
    BookOpen,
    TrendingUp,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseDetailResponse, CourseVersionResponse } from "@/services/courses/course.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import Link from "next/link";

export default function CourseOverviewPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Fetch course details
    const {
        data: course,
        isLoading: loadingCourse,
    } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    // Fetch course versions
    const {
        data: versions,
        isLoading: loadingVersions,
    } = useQuery<CourseVersionResponse[]>({
        queryKey: ["course-versions", course?.id],
        queryFn: () => courseVersionService.getCourseVersions(course!.id),
        enabled: !!course?.id,
    });

    if (loadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 dark:text-slate-400">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Course not found
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                        The course you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    const publishedVersion = versions?.find((v) => v.status === "PUBLISHED");
    const draftVersions = versions?.filter((v) => v.status === "DRAFT") || [];
    const pendingVersions = versions?.filter((v) => v.status === "PENDING") || [];

    return (
        <CourseManagementLayout course={course}>
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Students */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                Total
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            1,234
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Students Enrolled
                        </p>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                                Rating
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                4.8
                            </p>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            from 456 reviews
                        </p>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                                Revenue
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            $45.2K
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total earnings
                        </p>
                    </div>

                    {/* Completion Rate */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
                                Rate
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            78%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Completion rate
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Course Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Published Version Info */}
                        {publishedVersion && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">
                                                    Published Version
                                                </h3>
                                                <p className="text-emerald-50 text-sm">
                                                    Version {publishedVersion.versionNumber}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/teacher/courses/${slug}/versions/${publishedVersion.id}/view`}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Eye className="w-4 h-4 inline mr-2" />
                                            View
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        {publishedVersion.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        {publishedVersion.description}
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                ${publishedVersion.price || 0}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Price
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {publishedVersion.durationDays || 0}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Days
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {publishedVersion.chapterCount || 0}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Chapters
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <Target className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                {publishedVersion.passScore || 0}%
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Pass Score
                                            </p>
                                        </div>
                                    </div>

                                    {publishedVersion.publishedAt && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                Published on{" "}
                                                {new Date(publishedVersion.publishedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Course Description */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                About This Course
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {course.shortDescription || "No description available"}
                            </p>
                        </div>

                        {/* Tags */}
                        {course.tags && course.tags.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    Course Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {course.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Quick Info & Actions */}
                    <div className="space-y-6">
                        {/* Version Status */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Version Status
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    href={`/teacher/courses/${slug}/versions`}
                                    className="block p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Total Versions
                                        </span>
                                        <FileText className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {versions?.length || 0}
                                    </p>
                                </Link>

                                {draftVersions.length > 0 && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                Draft Versions
                                            </span>
                                            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                            {draftVersions.length}
                                        </p>
                                    </div>
                                )}

                                {pendingVersions.length > 0 && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                Pending Approval
                                            </span>
                                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                            {pendingVersions.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {publishedVersion && (
                                    <>
                                        <Link
                                            href={`/teacher/courses/${course.slug}/versions/${publishedVersion.id}/view`}
                                            target="_blank"
                                            className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                                        >
                                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-colors">
                                                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    View as Student
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Preview course page
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            href={`/teacher/courses/${slug}/versions/${publishedVersion.id}/view`}
                                            className="flex items-center gap-3 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                                        >
                                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 rounded-lg flex items-center justify-center transition-colors">
                                                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    View Content
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Review chapters & lessons
                                                </p>
                                            </div>
                                        </Link>
                                    </>
                                )}

                                {draftVersions.length > 0 && draftVersions[0] && (
                                    <Link
                                        href={`/teacher/courses/${slug}/versions/${draftVersions[0].id}/content`}
                                        className="flex items-center gap-3 p-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors group border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                                    >
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 rounded-lg flex items-center justify-center transition-colors">
                                            <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                Edit Draft
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Edit draft version content
                                            </p>
                                        </div>
                                    </Link>
                                )}

                                <Link
                                    href={`/teacher/courses/${slug}/versions/create`}
                                    className="flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                                >
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 rounded-lg flex items-center justify-center transition-colors">
                                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            New Version
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Create a new version
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    href={`/teacher/courses/${slug}/students`}
                                    className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                                >
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            View Students
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Manage enrollments
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* SEO Information */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                SEO Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        Indexed
                                    </span>
                                    <span
                                        className={`text-sm font-medium ${course.indexed
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-slate-400"
                                            }`}
                                    >
                                        {course.indexed ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" />
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <XCircle className="w-4 h-4" />
                                                No
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                        Meta Title
                                    </p>
                                    <p className="text-sm text-slate-900 dark:text-white line-clamp-1">
                                        {course.metaTitle || "Not set"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CourseManagementLayout>
    );
}
