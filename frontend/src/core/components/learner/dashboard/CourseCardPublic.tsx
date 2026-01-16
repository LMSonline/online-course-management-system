"use client";

import Link from "next/link";
import { BookOpen, Clock3 } from "lucide-react";
import { useCourses } from "@/hooks/learner/useCourse";
import type {
  Course,
  CourseListResponse,
} from "@/lib/learner/course/courses";

/**
 * =========================
 * Course Card Component
 * =========================
 */
function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/learner/courses/${course.courseId}`}
      className="group block rounded-3xl border border-white/10 bg-slate-950/80
                 p-4 transition hover:border-[var(--brand-500)]/70
                 hover:shadow-[0_0_40px_rgba(22,163,74,0.35)]"
    >
      {/* Thumbnail */}
      <div className="relative mb-3 h-36 w-full overflow-hidden rounded-2xl bg-slate-800">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/50">
            No thumbnail
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1 line-clamp-2 text-base font-semibold text-white">
        {course.title}
      </h3>

      {/* Description */}
      {course.description && (
        <p className="mb-3 line-clamp-2 text-sm text-white/60">
          {course.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-white/70">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {course.chapterCount} chapters
        </span>

        {course.durationDays && (
          <span className="flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {course.durationDays} days
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-400">
          {course.price ? `$${course.price}` : "Free"}
        </span>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {course.status}
        </span>
      </div>
    </Link>
  );
}

/**
 * =========================
 * Learner Course List Page
 * =========================
 */
export default function LearnerCoursesPage() {
  const { data, isLoading, isError } = useCourses({
    page: 0,
    size: 12,
  });

  if (isLoading) {
    return <div className="text-white/70">Loading courses...</div>;
  }

  if (isError || !data) {
    return <div className="text-red-400">Failed to load courses</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">All Courses</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
