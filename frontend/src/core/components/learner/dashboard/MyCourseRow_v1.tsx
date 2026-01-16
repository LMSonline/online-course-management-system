"use client";
//COURSE CARD
import Link from "next/link";
import { Play, Clock3 } from "lucide-react";
import type { Course } from "@/lib/learner/course/courses";

/** random ổn định từ string */
function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface MyCourseProps {
  course: Course;
  progress?: number;
}

export function MyCourseRow({ course, progress = 0 }: MyCourseProps) {
  /* =========================
   * STATUS BADGE
   * ========================= */
  const getStatusBadge = () => {
    switch (course.status) {
      case "PUBLISHED":
        return "Published";
      case "APPROVED":
        return "Approved";
      case "DRAFT":
        return "Draft";
      default:
        return course.status;
    }
  };

  /* =========================
   * GRADIENT COLOR
   * ========================= */
  const getGradientColor = (id: number) => {
    const colors = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-indigo-400",
      "from-gray-700 to-gray-900",
      "from-yellow-400 to-green-400",
      "from-pink-400 to-red-400",
      "from-green-400 to-blue-400",
    ];
    return colors[id % colors.length];
  };

  const thumbColor = getGradientColor(course.id);

  /* =========================
   * THUMBNAIL LOGIC  PHẦN CẦN)
   * ========================= */
  const thumbnail =
    course.thumbnail ||
    (course.title
      ? `https://picsum.photos/800/450?random=${hashStringToNumber(course.title)}`
      : undefined);

  return (
    <Link
      href={`/learner/courses/${course.slug}/version/published`}
      prefetch={false}
      className="block group flex flex-col rounded-3xl border border-white/10 bg-slate-950/80 p-3 md:p-4 hover:border-[var(--brand-500)]/70 hover:shadow-[0_0_40px_rgba(22,163,74,0.35)] transition"
    >
      {/* =========================
       * THUMBNAIL
       * ========================= */}
      <div
        className={`relative mb-3 h-32 md:h-36 w-full overflow-hidden rounded-2xl ${
          thumbnail ? "" : `bg-gradient-to-br ${thumbColor}`
        }`}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
        )}

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute left-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-slate-100 backdrop-blur">
          {getStatusBadge()}
        </div>

        <span className="absolute right-3 bottom-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm">
          <Play className="mr-1 h-3.5 w-3.5" />
          Resume
        </span>
      </div>

      {/* =========================
       * TITLE
       * ========================= */}
      <h3 className="text-sm md:text-[15px] font-semibold line-clamp-2">
        {course.title}
      </h3>

      {/* =========================
       * DESCRIPTION
       * ========================= */}
      {course.description && (
        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
          {course.description}
        </p>
      )}

      {/* =========================
       * META
       * ========================= */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
        <span>Version {course.versionNumber}</span>

        {course.durationDays && (
          <>
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {course.durationDays} days
            </span>
          </>
        )}

        {course.chapterCount > 0 && (
          <>
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            <span>{course.chapterCount} chapters</span>
          </>
        )}
      </div>

      {/* =========================
       * PROGRESS
       * ========================= */}
      {progress > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-600)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-300">{progress}%</span>
        </div>
      )}
    </Link>
  );
}
