"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Folder, Star, Trash2, Eye, Edit, RefreshCw, EyeOff, Lock, Unlock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { courseReviewService } from "@/services/courses/course-review.service";
import { courseService } from "@/services/courses/course.service";
import { CourseResponse } from "@/services/courses/course.types";
import { toast } from "sonner";

interface ImprovedCourseCardProps {
    course: CourseResponse;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
    refetch: () => void;
}

export function ImprovedCourseCard({
    course,
    onDelete,
    onRestore,
    refetch
}: ImprovedCourseCardProps) {
    const [rating, setRating] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);

    // Fetch rating
    useQuery({
        queryKey: ["course-rating", course.id],
        queryFn: async () => {
            try {
                const summary = await courseReviewService.getRatingSummary(course.id);
                setRating(summary.averageRating);
                setTotalReviews(summary.totalReviews);
                return summary;
            } catch (error) {
                return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
            }
        },
    });

    // Toggle course status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async () => {
            if (course.isClosed) {
                return courseService.openCourse(course.id);
            } else {
                return courseService.closeCourse(course.id);
            }
        },
        onSuccess: () => {
            toast.success(course.isClosed ? "Course opened successfully" : "Course closed successfully");
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update course status");
        },
    });

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 overflow-hidden">
                {course.thumbnailUrl ? (
                    <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Folder className="w-16 h-16 text-indigo-300 dark:text-indigo-700" />
                    </div>
                )}
                {course.isClosed && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Closed
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <Link href={`/teacher/courses/${course.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                        {course.title}
                    </h3>
                </Link>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {course.shortDescription}
                </p>

                {/* Meta Info */}
                <div className="space-y-3 mb-4">
                    {/* Category */}
                    {course.categoryName && (
                        <div className="flex items-center gap-2 text-sm">
                            <Folder className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">{course.categoryName}</span>
                        </div>
                    )}

                    {/* Rating */}
                    {totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                ({totalReviews} reviews)
                            </span>
                        </div>
                    )}

                    {/* Tags */}
                    {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {course.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-lg"
                                >
                                    {tag}
                                </span>
                            ))}
                            {course.tags.length > 3 && (
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg">
                                    +{course.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/teacher/courses/${course.slug}`}
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors text-center"
                        >
                            Manage
                        </Link>
                        <button
                            onClick={() => toggleStatusMutation.mutate()}
                            disabled={toggleStatusMutation.isPending}
                            className={`px-3 py-2 rounded-xl transition-colors ${course.isClosed
                                ? "bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                                }`}
                            title={course.isClosed ? "Open Course" : "Close Course"}
                        >
                            {course.isClosed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                        <Link
                            href={`/teacher/courses/${course.slug}/edit`}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => onDelete(course.id)}
                            className="px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/teacher/courses/${course.slug}/analytics`}
                            className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors text-center"
                        >
                            Stats
                        </Link>
                        <Link
                            href={`/teacher/courses/${course.slug}/students`}
                            className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors text-center"
                        >
                            Students
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
