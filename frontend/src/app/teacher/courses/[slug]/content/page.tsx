"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus, AlertCircle } from "lucide-react";
import { courseService } from "@/services/courses/course.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CourseManagementLayout } from "@/core/components/teacher/courses/CourseManagementLayout";
import Link from "next/link";

export default function CourseContentPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Fetch course details
    const { data: course } = useQuery<CourseDetailResponse>({
        queryKey: ["course-detail", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
    });

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
                {/* Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                Content Management
                            </h3>
                            <p className="text-amber-700 dark:text-amber-300 mb-4">
                                To edit course content (chapters and lessons), you need to work with a specific version.
                                Please go to the Versions tab and select a version to edit its content.
                            </p>
                            <Link
                                href={`/teacher/courses/${slug}/versions`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                Go to Versions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Placeholder Content */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Version-Specific Content
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                        Course content is managed at the version level. Select a version from the Versions tab
                        to manage its chapters and lessons.
                    </p>
                </div>
            </div>
        </CourseManagementLayout>
    );
}
