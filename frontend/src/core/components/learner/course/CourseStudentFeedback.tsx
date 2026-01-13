// src/components/learner/course/CourseStudentFeedback.tsx
"use client";

import { Star, Sparkles } from "lucide-react";

export function CourseStudentFeedback() {
  // Demo data
  const rating = 4.2;
  const ratingCount = 47;
  const starDist = [
    { star: 5, count: 33, percent: 70 },
    { star: 4, count: 9, percent: 19 },
    { star: 3, count: 3, percent: 6 },
    { star: 2, count: 1, percent: 3 },
    { star: 1, count: 1, percent: 2 },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* subtle accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.10),transparent_60%)]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-base md:text-lg font-semibold text-white">
            Student feedback
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Rating summary */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-5 md:w-56">
            <div className="text-4xl font-bold text-amber-300">
              {rating.toFixed(1)}
            </div>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(rating)
                      ? "fill-amber-300 text-amber-300"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {ratingCount.toLocaleString()} ratings
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-3 text-xs md:text-sm text-slate-300">
            {starDist.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-10 justify-end text-slate-400">
                  <span>{star}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="relative h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-amber-400/80"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="w-10 text-right text-slate-400">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
