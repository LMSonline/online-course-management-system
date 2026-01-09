// src/components/learner/course/CourseHero.tsx
import { Star, Globe2, Users } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";

export function CourseHero({ course }: { course: CourseDetail }) {
  return (
    <section
      className="
        relative
        border-b border-white/10
        bg-[radial-gradient(1000px_circle_at_15%_-10%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(800px_circle_at_90%_20%,rgba(56,189,248,0.1),transparent_45%),linear-gradient(to_bottom,#020617,#020617)]
        pt-6 md:pt-8
        pb-8 md:pb-10
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl xl:max-w-7xl
          px-4 sm:px-6 lg:px-10 xl:px-0
          grid grid-cols-1
          gap-10
          md:grid-cols-12
        "
      >
        {/* ================= LEFT: HERO CONTENT ================= */}
        <div className="col-span-12 md:col-span-7 min-w-0">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            Advanced · Featured course
          </div>

          {/* Title */}
          <h1
            className="
              mt-4
              text-2xl md:text-3xl lg:text-4xl
              font-semibold
              tracking-tight
              leading-tight
              text-white
            "
          >
            {course.title}
          </h1>

          {/* Subtitle */}
          <p
            className="
              mt-3
              max-w-2xl
              text-sm md:text-base
              leading-relaxed
              text-slate-300
            "
          >
            {course.subtitle}
          </p>

          {/* Rating + Students */}
          <div
            className="
              mt-5
              flex flex-wrap items-center
              gap-x-4 gap-y-2
              text-sm
              text-slate-300
            "
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-amber-300 font-semibold">
                {course.rating.toFixed(1)}
              </span>
              <Star className="w-4 h-4 text-amber-300" />
              <span className="text-slate-400">
                ({course.ratingCount.toLocaleString()} ratings)
              </span>
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span className="text-slate-400">
              {course.studentsCount.toLocaleString()} students enrolled
            </span>
          </div>

          {/* Meta secondary */}
          <div
            className="
              mt-3
              flex flex-wrap items-center
              gap-x-4 gap-y-2
              text-xs
              text-slate-400
            "
          >
            <span>Last updated {course.lastUpdated}</span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 opacity-80" />
              {course.language}
            </span>

            {course.subtitles.length > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span>Subtitles: {course.subtitles.join(", ")}</span>
              </>
            )}
          </div>

          {/* Level pill */}
          <div
            className="
              mt-5
              inline-flex items-center gap-2
              rounded-full
              border border-white/10
              bg-slate-900/60
              px-4 py-1.5
              text-xs
              text-slate-300
              backdrop-blur
            "
          >
            <Users className="w-4 h-4 text-[var(--brand-400)]" />
            <span>{course.level} · Project-based</span>
          </div>
        </div>

        {/* ================= RIGHT: PRODUCT CARD ================= */}
        <aside className="col-span-12 md:col-span-5 flex md:justify-end">
          <div className="w-full max-w-md">
            <div
              className="
                overflow-hidden
                rounded-[26px]
                border border-white/10
                bg-slate-950/90
                shadow-[0_0_60px_rgba(2,6,23,0.85)]
              "
            >
              {/* Thumbnail color block */}
              <div
                className="
                  relative
                  h-40 md:h-44
                  bg-[linear-gradient(135deg,rgba(16,185,129,0.32),rgba(56,189,248,0.22),#020617)]
                "
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_55%)]" />

                <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Featured course
                </div>
              </div>

              {/* Price + CTA */}
              <div className="p-5 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white">
                    ${course.price?.toFixed(2) ?? "0.00"}
                  </span>

                  {course.originalPrice &&
                    course.price &&
                    course.price < course.originalPrice && (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          ${course.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs font-semibold text-emerald-300">
                          {course.discountPercent}% off
                        </span>
                      </>
                    )}
                </div>

                {course.isEnrolled ? (
                  <button
                    className="
                      w-full
                      rounded-xl
                      bg-slate-700
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-200
                      cursor-not-allowed
                    "
                    disabled
                  >
                    Enrolled
                  </button>
                ) : (
                  <>
                    <button
                      className="
                        w-full
                        rounded-xl
                        bg-[var(--brand-600)]
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-[0_6px_24px_rgba(16,185,129,0.35)]
                        transition
                        hover:bg-[var(--brand-900)]
                      "
                    >
                      Add to cart
                    </button>

                    <button
                      className="
                        w-full
                        rounded-xl
                        border border-white/15
                        bg-slate-900/80
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-50
                        transition
                        hover:bg-slate-800
                      "
                    >
                      Buy now
                    </button>
                  </>
                )}

                <p className="pt-1 text-[11px] text-slate-400">
                  30-day money-back guarantee · Full lifetime access
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}