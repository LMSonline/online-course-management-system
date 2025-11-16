// src/components/learner/course/CourseHero.tsx
import { Star, Globe2, Users } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";

export function CourseHero({ course }: { course: CourseDetail }) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/90 pb-6 md:pb-8">
      <div className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 pt-4 md:pt-6 md:flex-row">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-200 max-w-2xl">
            {course.subtitle}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-[13px] text-slate-300">
            <span className="inline-flex items-center gap-1">
              <span className="text-amber-300 font-semibold">
                {course.rating.toFixed(1)}
              </span>
              <Star className="w-3.5 h-3.5 text-amber-300" />
              <span>({course.ratingCount.toLocaleString()} ratings)</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            <span>
              {course.studentsCount.toLocaleString()} students enrolled
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>Last updated {course.lastUpdated}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="inline-flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              {course.language}
            </span>
            {course.subtitles.length > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span>Subtitles: {course.subtitles.join(", ")}</span>
              </>
            )}
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
            <Users className="w-3.5 h-3.5 text-[var(--brand-400)]" />
            <span>{course.level} • Project-based</span>
          </div>
        </div>

        {/* Right: card */}
        <aside className="w-full md:w-80 lg:w-96">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
            {/* Preview thumbnail */}
            <div className="relative h-44 md:h-48 bg-gradient-to-br from-[var(--brand-600)]/40 via-slate-900 to-slate-950 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(132,204,22,0.35),_transparent)]" />
              <button className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg hover:scale-105 transition">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 7v10l8-5z" />
                </svg>
              </button>
            </div>

            {/* Pricing / CTA */}
            <div className="p-4 md:p-5 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">$19.99</span>
                <span className="text-xs text-slate-400 line-through">$79.99</span>
                <span className="text-xs text-emerald-300 font-semibold">
                  75% off
                </span>
              </div>
              <button className="w-full rounded-xl bg-[var(--brand-600)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-900)] transition">
                Add to cart
              </button>
              <button className="w-full rounded-xl border border-white/20 bg-slate-900/80 py-2.5 text-sm font-semibold text-slate-50 hover:bg-slate-800 transition">
                Buy now
              </button>
              <p className="text-[11px] text-slate-400">
                30-day money-back guarantee · Full lifetime access
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
