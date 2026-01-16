"use client";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Clock, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useCourseDetail } from "@/hooks/learner/useCourseDetail";
import { CourseReviews } from "./CourseReviews";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    courseDetail,
    courseId,
    ratingSummary,
    loading,
    error,
  } = useCourseDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !courseDetail) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-400">
            Course Not Found
          </h2>
          <p className="text-slate-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/learner/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-700 rounded-full font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, thumbnailUrl, price, currency, rating, ratingCount } = courseDetail;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/learner/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              
              {description && (
                <p className="text-lg text-slate-300 mb-6">{description}</p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-slate-400">
                      ({ratingCount} ratings)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Thumbnail & CTA */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
                {/* Thumbnail */}
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/50" />
                  </div>
                )}

                {/* Price & CTA */}
                <div className="p-6">
                  {price !== undefined && price > 0 ? (
                    <div className="mb-4">
                      <p className="text-3xl font-bold">
                        {currency}
                        {price.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-lime-500">Free</p>
                    </div>
                  )}

                  <button className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-6 rounded-full transition flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Course Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            {description && (
              <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">About this course</h2>
                <p className="text-slate-300 leading-relaxed">{description}</p>
              </section>
            )}

            {/* Reviews Section */}
            {courseId && (
              <CourseReviews courseId={courseId} ratingSummary={ratingSummary} />
            )}
          </div>

          {/* Right: Course Features */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Course Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Self-paced learning</p>
                    <p className="text-sm text-slate-400">
                      Learn at your own speed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Comprehensive content</p>
                    <p className="text-sm text-slate-400">
                      Structured learning path
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Certificate</p>
                    <p className="text-sm text-slate-400">
                      Earn upon completion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
