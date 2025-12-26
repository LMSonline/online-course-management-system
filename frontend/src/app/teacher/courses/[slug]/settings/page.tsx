"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Settings,
    Globe,
    Lock,
    Eye,
    EyeOff,
    Save,
    AlertCircle,
    CheckCircle,
    Tag,
    DollarSign,
    Clock,
    Shield,
} from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import { toast } from "sonner";

export default function CourseSettingsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const queryClient = useQueryClient();

    // Fetch course details
    const { data: course, isLoading } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

    const [settings, setSettings] = useState({
        isOpen: true,
        autoApproveEnrollments: false,
        allowReviews: true,
        showStudentCount: true,
        certificateEnabled: true,
    });

    // Toggle course status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: (isClosed: boolean) => {
            return isClosed
                ? courseService.openCourse(course!.id)
                : courseService.closeCourse(course!.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course-detail", slug] });
            toast.success("Course status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update course status");
        },
    });

    if (isLoading || !course) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <CourseManagementLayout course={course}>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        Course Settings
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Configure your course preferences and visibility
                    </p>
                </div>

                {/* Course Status */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Course Status
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Control whether new students can enroll in your course
                            </p>
                        </div>
                        <div
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${course.isClosed
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                }`}
                        >
                            {course.isClosed ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Closed
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4" />
                                    Open
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white mb-1">
                                {course.isClosed ? "Open Course for Enrollment" : "Close Course"}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {course.isClosed
                                    ? "Allow new students to enroll in this course"
                                    : "Prevent new students from enrolling"}
                            </p>
                        </div>
                        <button
                            onClick={() => toggleStatusMutation.mutate(course.isClosed || false)}
                            disabled={toggleStatusMutation.isPending}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${course.isClosed
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            {toggleStatusMutation.isPending
                                ? "Updating..."
                                : course.isClosed
                                    ? "Open Course"
                                    : "Close Course"}
                        </button>
                    </div>

                    {course.isClosed && (
                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                        Course is currently closed
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        Students cannot enroll, but existing students can still access the content.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enrollment Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Enrollment Settings
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">
                                    Auto-approve Enrollments
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Automatically approve enrollment requests
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        autoApproveEnrollments: !prev.autoApproveEnrollments,
                                    }))
                                }
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.autoApproveEnrollments
                                        ? "bg-indigo-600"
                                        : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoApproveEnrollments ? "translate-x-7" : ""
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">
                                    Show Student Count
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Display the number of enrolled students publicly
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        showStudentCount: !prev.showStudentCount,
                                    }))
                                }
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.showStudentCount
                                        ? "bg-indigo-600"
                                        : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.showStudentCount ? "translate-x-7" : ""
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Course Features */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Course Features
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">
                                    Allow Reviews
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Let students rate and review your course
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        allowReviews: !prev.allowReviews,
                                    }))
                                }
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.allowReviews
                                        ? "bg-indigo-600"
                                        : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.allowReviews ? "translate-x-7" : ""
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">
                                    Certificate of Completion
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Award certificates to students who complete the course
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        certificateEnabled: !prev.certificateEnabled,
                                    }))
                                }
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.certificateEnabled
                                        ? "bg-indigo-600"
                                        : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.certificateEnabled ? "translate-x-7" : ""
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        SEO & Visibility
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white mb-1">
                                    Search Engine Indexing
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {course.indexed
                                        ? "Your course is visible to search engines"
                                        : "Your course is hidden from search engines"}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${course.indexed
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                    }`}
                            >
                                {course.indexed ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Indexed
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="w-4 h-4" />
                                        Not Indexed
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Save Changes */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => toast.success("Settings saved successfully")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </CourseManagementLayout>
    );
}
