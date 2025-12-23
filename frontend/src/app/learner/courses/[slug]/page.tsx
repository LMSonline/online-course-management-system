// src/app/(learner)/courses/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { CourseHero } from "@/core/components/learner/course/CourseHero";
import { CourseWhatYouWillLearn } from "@/core/components/learner/course/CourseWhatYouWillLearn";
import { CourseIncludes } from "@/core/components/learner/course/CourseIncludes";
import { CourseContentOutline } from "@/core/components/learner/course/CourseContentOutline";
import { CourseInstructorCard } from "@/core/components/learner/course/CourseInstructorCard";
import { CourseStudentFeedback } from "@/core/components/learner/course/CourseStudentFeedback";
import {
  getCourseBySlug,
  getCourseReviews,
  getCourseRatingSummary,
  createCourseReview,
  type CourseReviewResponse,
  type RatingSummaryResponse,
} from "@/features/courses/services/courses.service";
import { getCourseComments, createCourseComment, type CommentResponse } from "@/features/community/services/community.service";
import { getCurrentUserInfo } from "@/features/auth/services/auth.service";
import type { CourseDetail } from "@/features/courses/types/course-detail.types";
import { Star, MessageSquare, Send } from "lucide-react";

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [reviews, setReviews] = useState<CourseReviewResponse[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummaryResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [commentForm, setCommentForm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [courseData, userData] = await Promise.all([
          getCourseBySlug(params.slug),
          getCurrentUserInfo().catch(() => null),
        ]);
        setCourse(courseData);
        setUser(userData);

        if (courseData.id) {
          const courseId = parseInt(courseData.id);
          const [reviewsData, ratingData, commentsData] = await Promise.all([
            getCourseReviews(courseId, 0, 10).catch(() => ({ items: [] })),
            getCourseRatingSummary(courseId).catch(() => null),
            getCourseComments(courseId).catch(() => []),
          ]);
          setReviews(reviewsData.items || []);
          setRatingSummary(ratingData);
          setComments(commentsData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.slug]);

  const handleSubmitReview = async () => {
    if (!course || !user || user.role !== "STUDENT") return;
    try {
      const newReview = await createCourseReview(parseInt(course.id), reviewForm);
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
      // Reload rating summary
      const summary = await getCourseRatingSummary(parseInt(course.id));
      setRatingSummary(summary);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    }
  };

  const handleSubmitComment = async () => {
    if (!course || !commentForm.trim()) return;
    try {
      const newComment = await createCourseComment(parseInt(course.id), commentForm);
      setComments([newComment, ...comments]);
      setCommentForm("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Loading course...</p>;
  }

  if (error || !course) {
    return notFound();
  }

  return (
    <div className="bg-slate-950 text-slate-50">
      <CourseHero course={course} />

      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-5">
          <CourseWhatYouWillLearn course={course} />
          <CourseContentOutline course={course} />

          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Description</h2>
            <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">
              {course.description}
            </p>
          </section>

          {/* Reviews Section */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Reviews</h2>
              {user?.role === "STUDENT" && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition"
                >
                  Write a Review
                </button>
              )}
            </div>

            {ratingSummary && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">{ratingSummary.averageRating.toFixed(1)}</div>
                  <div>
                    <div className="flex gap-1 text-amber-300">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(ratingSummary.averageRating) ? "fill-amber-300" : ""}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {ratingSummary.totalRatings} ratings
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingSummary.ratingDistribution[rating] || 0;
                    const percentage = ratingSummary.totalRatings > 0
                      ? (count / ratingSummary.totalRatings) * 100
                      : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-right">{rating}</span>
                        <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-slate-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showReviewForm && user?.role === "STUDENT" && (
              <div className="mb-6 p-4 bg-slate-900 rounded-lg">
                <h3 className="font-semibold mb-3">Write a Review</h3>
                <div className="mb-3">
                  <label className="block text-sm mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                        className="text-2xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            r <= reviewForm.rating ? "fill-amber-300 text-amber-300" : "text-slate-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitReview}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({ rating: 5, comment: "" });
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-t border-white/10 pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.studentName}</p>
                        <div className="flex gap-1 text-amber-300 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-amber-300" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Comments Section */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussion ({comments.length})
            </h2>

            {user && (
              <div className="mb-4">
                <textarea
                  value={commentForm}
                  onChange={(e) => setCommentForm(e.target.value)}
                  placeholder="Ask a question or share your thoughts..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white mb-2"
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentForm.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg text-white text-sm transition"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.authorAvatarUrl || "/images/default-avatar.png"}
                        alt={comment.authorName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{comment.authorName}</p>
                          <span className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <CourseStudentFeedback course={course} />
        </div>

        {/* Right column */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-5">
          <CourseIncludes course={course} />
          <CourseInstructorCard course={course} />
        </aside>
      </main>
    </div>
  );
}
