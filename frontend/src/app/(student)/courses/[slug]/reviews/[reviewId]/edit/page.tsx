"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUpdateReview } from "@/hooks/review/useReviews";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCourseReviews } from "@/hooks/public/useCourseReviews";
import { Star, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

/**
 * Edit Review Page
 * Route: /courses/:slug/reviews/:reviewId/edit
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Data:
 * - COURSE_GET_DETAIL (to get course info and courseId)
 * - REVIEW_GET_COURSE_LIST (to find existing review)
 * - REVIEW_UPDATE (mutation)
 */
export default function EditReviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const reviewId = parseInt(params.reviewId as string, 10);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);
  const courseId = course?.id;
  const { data: reviewsData, isLoading: isLoadingReviews } = useCourseReviews({ courseId });
  const { mutate: updateReview, isPending } = useUpdateReview();

  // Find the review to edit
  const review = reviewsData?.items.find((r) => r.id === reviewId);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title || "");
      setContent(review.content || "");
    }
  }, [review]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!courseId) {
      alert("Course ID not available");
      return;
    }

    updateReview(
      {
        courseId,
        reviewId,
        payload: {
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(`/courses/${slug}/reviews`);
        },
      }
    );
  };

  if (isLoadingCourse || isLoadingReviews) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (!course || !courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Course not found</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Review not found
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            The review you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Link
            href={`/courses/${slug}/reviews`}
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={`/courses/${slug}/reviews`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reviews
      </Link>

      <h1 className="text-3xl font-bold mb-2">Edit Review</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {course.title}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title (optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Review (optional)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts about this course..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending || rating === 0}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                Updating...
              </>
            ) : (
              "Update Review"
            )}
          </button>
          <Link
            href={`/courses/${slug}/reviews`}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

