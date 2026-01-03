"use client";

import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseComments } from "@/hooks/comment/useComments";
import { CommentThread } from "@/core/components/comments/CommentThread";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

/**
 * CourseCommentsPublicScreen
 * Route: /courses/:slug/comments
 * Layout: PublicLayout
 * Guard: none
 * 
 * Flow:
 * 1. Get course detail by slug (COURSE_GET_DETAIL) to extract courseId
 * 2. Call COMMENT_GET_COURSE_LIST with courseId
 */
export default function CourseCommentsPublicScreen({
  params,
}: {
  params: { slug: string };
}) {
  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = useCourseDetail(params.slug);

  const courseId = course?.id;

  // Fetch comments
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useCourseComments(courseId);

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {courseError?.message || "The course you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => refetchCourse()}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${params.slug}`}
          className="inline-flex items-center gap-2 text-[var(--brand-600)] hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
        <h1 className="text-3xl font-bold mb-2">Comments</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Course: {course.title}
        </p>
      </div>

      {/* Comments Section */}
      {isLoadingComments ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-600)]" />
        </div>
      ) : isCommentsError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load comments</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {commentsError?.message || "An error occurred while loading comments."}
          </p>
          <button
            onClick={() => refetchComments()}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <CommentThread
          resourceType="course"
          resourceId={courseId!}
          comments={comments}
        />
      )}
    </div>
  );
}
