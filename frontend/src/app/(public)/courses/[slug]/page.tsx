"use client";

import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseCurriculum } from "@/hooks/public/useCourseCurriculum";
import { useCourseRatingSummary } from "@/hooks/public/useCourseRatingSummary";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, BookOpen, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

/**
 * CourseDetailScreen
 * Route: /courses/:slug
 * Layout: PublicLayout
 * Guard: none
 * 
 * Shows course landing page with:
 * - Hero section (title, instructor, rating, price)
 * - CTA: Enroll button
 * - Curriculum preview (chapters + first few lessons)
 * - Tags/categories
 */
export default function CourseDetailScreen({
  params,
}: {
  params: { slug: string };
}) {
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseDetail(params.slug);

  const courseId = course?.id;
  const versionId = course?.PublicVersionId;

  // Fetch curriculum preview (chapters)
  const {
    data: chapters = [],
    isLoading: isLoadingChapters,
  } = useCourseCurriculum(courseId, versionId);

  // Fetch rating summary
  const {
    data: ratingSummary,
  } = useCourseRatingSummary(courseId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || "The course you're looking for doesn't exist."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
            >
              Retry
            </button>
            <Link
              href="/courses"
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = ratingSummary?.averageRating || 0;
  const totalReviews = ratingSummary?.totalReviews || 0;
  const price = course.PublicVersionId ? undefined : 0; // Price would come from version if available

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-24 w-24 text-slate-400" />
            </div>
          )}
        </div>

        {/* Right: Course Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            {course.shortDescription && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {course.shortDescription}
              </p>
            )}
          </div>

          {/* Instructor */}
          {course.teacherId && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Instructor:</span>
              <Link
                href={`/teachers/${course.teacherId}`}
                className="text-[var(--brand-600)] hover:underline font-medium"
              >
                Teacher #{course.teacherId}
              </Link>
            </div>
          )}

          {/* Rating */}
          {(averageRating > 0 || totalReviews > 0) && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
              <Link
                href={`/courses/${params.slug}/reviews`}
                className="text-[var(--brand-600)] hover:underline text-sm"
              >
                View all reviews
              </Link>
            </div>
          )}

          {/* Price */}
          <div className="text-3xl font-bold">
            {price !== undefined && price > 0 ? (
              <>
                <span className="text-[var(--brand-600)]">${price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </div>

          {/* CTA Button */}
          <div>
            <Link
              href={`/login?redirect=/learn/${params.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition font-semibold text-lg"
            >
              Enroll Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Category */}
          {course.category && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Category: </span>
              <Link
                href={`/categories/${course.category.slug || course.category.id}`}
                className="text-[var(--brand-600)] hover:underline"
              >
                {course.category.name}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Preview */}
      {versionId && (
        <>
          {isLoadingChapters ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : chapters.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
              <div className="space-y-4">
                {chapters.slice(0, 5).map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-4 bg-slate-900/40 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--brand-600)] flex-shrink-0" />
                      <h3 className="font-semibold">{chapter.title}</h3>
                    </div>
                  </div>
                ))}
                {chapters.length > 5 && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                    + {chapters.length - 5} more chapters
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
