"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseVersionRequest } from "@/services/courses/course.types";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Loader2,
    BookOpen,
    DollarSign,
    Clock,
} from "lucide-react";
import Link from "next/link";

export default function CreateVersionPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [formData, setFormData] = useState<CourseVersionRequest>({
        title: "",
        description: "",
        price: 0,
        durationDays: 0,
        passScore: 8.0,
    });

    const { data: course, isLoading: loadingCourse } = useQuery({
        queryKey: ["course", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
        enabled: !!slug,
    });

    const createMutation = useMutation({
        mutationFn: (data: CourseVersionRequest) =>
            courseVersionService.createCourseVersion(course!.id, data),
        onSuccess: (newVersion) => {
            toast.success("Version created successfully!");
            router.push(`/teacher/courses/${slug}/versions/${newVersion.id}/content`);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create version");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please enter a version title");
            return;
        }

        if (formData.price !== undefined && formData.price < 0) {
            toast.error("Price cannot be negative");
            return;
        }

        if (formData.durationDays && formData.durationDays <= 0) {
            toast.error("Duration must be greater than 0");
            return;
        }

        if (formData.passScore && (formData.passScore < 0 || formData.passScore > 10)) {
            toast.error("Pass score must be between 0 and 10");
            return;
        }

        await createMutation.mutateAsync(formData);
    };

    if (loadingCourse) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Course not found
                    </h1>
                    <Link
                        href="/teacher/courses"
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/teacher/courses/${slug}/versions`}
                        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to versions
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Create New Version
                    </h1>
                    <p className="text-gray-600 mt-2">
                        for course: <span className="font-semibold">{course.title}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Version Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Version Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="e.g., Version 2.0 - Updated Content"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Describe what's new in this version..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Course Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Giá khóa học (VND) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0"
                                    required
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Đặt giá 0 cho khóa học miễn phí
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Duration (days) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.durationDays}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            durationDays: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Điểm đạt (0-10) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={formData.passScore}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            passScore: parseFloat(e.target.value) || 8.0,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="8.0"
                                    required
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Ví dụ: 8.0 = điểm trung bình đạt
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Create Version
                                </>
                            )}
                        </button>
                        <Link
                            href={`/teacher/courses/${slug}/versions`}
                            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
