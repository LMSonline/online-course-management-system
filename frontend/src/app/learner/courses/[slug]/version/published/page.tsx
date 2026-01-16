"use client";

import { useParams } from "next/navigation";
import { Star, BookOpen, Users, Award, MessageSquare, Clock, DollarSign, Layers, Calendar, CheckCircle2 } from "lucide-react";

import { usePublishedCourseVersionBySlug } from "@/hooks/learner/useCourseVersionPublic";
import {
  usePublicReviews,
  usePublicRatingSummary,
} from "@/hooks/learner/useReview";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  /* =====================
   * COURSE VERSION (PUBLIC)
   * ===================== */
  const {
    data: version,
    isLoading,
    isError,
  } = usePublishedCourseVersionBySlug(slug);

  /* =====================
   * REVIEWS (PUBLIC)
   * ===================== */
  const courseId = version?.courseId;

  const { data: ratingSummary } = usePublicRatingSummary(courseId ?? 0);
  const { data: reviewsData } = usePublicReviews(courseId ?? 0, {
    page: 0,
    size: 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-lime-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-300">Loading course...</p>
        </div>
      </div>
    );
  }

  if (isError || !version) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Course Not Found</h2>
          <p className="text-slate-400">This course is not available or has not been published yet.</p>
        </div>
      </div>
    );
  }

  const averageRating = ratingSummary?.averageRating ?? 0;
  const totalReviews = ratingSummary?.totalReviews ?? 0;

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format relative time for reviews
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-lime-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          {/* Status & Version Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-lime-400" />
              <span className="text-sm text-lime-300">Version {version.versionNumber}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">{version.status}</span>
            </div>
            {version.publishedAt && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Published {formatDate(version.publishedAt)}</span>
              </div>
            )}
          </div>

          {/* Course Title */}
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight bg-gradient-to-r from-white via-lime-100 to-cyan-100 bg-clip-text text-transparent">
            {version.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {version.description || "No description available"}
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="h-10 w-10 rounded-lg bg-lime-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-lime-400 fill-lime-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
                <div className="text-xs text-slate-400">Rating</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalReviews}</div>
                <div className="text-xs text-slate-400">Reviews</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Layers className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{version.chapterCount}</div>
                <div className="text-xs text-slate-400">Chapters</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{version.durationDays || "N/A"}</div>
                <div className="text-xs text-slate-400">Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Course Details Card */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Course Information</h2>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/90 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {version.price !== undefined && version.price !== null && (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-lime-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Price</div>
                    <div className="text-2xl font-bold text-white">
                      ${version.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {version.passScore !== undefined && version.passScore !== null && (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Pass Score</div>
                    <div className="text-2xl font-bold text-white">
                      {version.passScore}%
                    </div>
                  </div>
                </div>
              )}

              {version.minProgressPct !== undefined && version.minProgressPct !== null && (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Min Progress Required</div>
                    <div className="text-2xl font-bold text-white">
                      {version.minProgressPct}%
                    </div>
                  </div>
                </div>
              )}

              {version.finalWeight !== undefined && version.finalWeight !== null && (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Layers className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Final Weight</div>
                    <div className="text-2xl font-bold text-white">
                      {version.finalWeight}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {version.notes && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-slate-400 mb-2">Additional Notes</div>
                <p className="text-slate-300 leading-relaxed">{version.notes}</p>
              </div>
            )}

            {version.approvedBy && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Approved by <span className="text-white font-medium">{version.approvedBy}</span></span>
                  {version.approvedAt && (
                    <span className="text-slate-500">• {formatDate(version.approvedAt)}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Rating Summary Card */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Student Ratings</h2>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/90 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Large Rating Display */}
              <div className="text-center md:text-left">
                <div className="text-7xl font-extrabold bg-gradient-to-br from-lime-400 to-lime-500 bg-clip-text text-transparent mb-3">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.round(averageRating)
                          ? "text-lime-400 fill-lime-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-400">
                  Based on <span className="font-semibold text-white">{totalReviews}</span> reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm text-slate-300">{star}</span>
                      <Star className="h-3.5 w-3.5 text-lime-400 fill-lime-400" />
                    </div>
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lime-500 to-lime-600 rounded-full"
                        style={{
                          width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 8 : 2}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400 w-12 text-right">
                      {star === 5 ? "70%" : star === 4 ? "20%" : star === 3 ? "8%" : "2%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Student Reviews</h2>
          </div>

          <div className="space-y-4">
            {reviewsData?.items?.length ? (
              reviewsData.items.map((review) => (
                <div
                  key={review.id}
                  className="group rounded-2xl bg-gradient-to-br from-slate-900/70 to-blue-950/70 border border-white/10 p-6 hover:border-lime-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-lime-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      {review.avatarUrl ? (
                        <img
                          src={review.avatarUrl}
                          alt={review.username || "User"}
                          className="h-12 w-12 rounded-full object-cover border-2 border-cyan-500/30"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {(review.username || "A").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {review.username || "Anonymous"}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {formatRelativeTime(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-lime-400 fill-lime-400"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="px-3 py-1 rounded-lg bg-lime-500/10 border border-lime-500/20 flex-shrink-0">
                      <span className="text-sm font-bold text-lime-400">{review.rating}.0</span>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold text-white mb-2">
                      {review.title}
                    </h4>
                  )}

                  {review.content && (
                    <p className="text-slate-300 leading-relaxed">
                      {review.content}
                    </p>
                  )}

                  {review.updatedAt !== review.createdAt && (
                    <div className="mt-3 text-xs text-slate-500">
                      Edited {formatRelativeTime(review.updatedAt)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-white/10 border-dashed">
                <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">No reviews yet</p>
                <p className="text-sm text-slate-500">Be the first to share your experience with this course!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
