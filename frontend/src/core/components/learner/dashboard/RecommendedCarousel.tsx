// src/components/learner/dashboard/RecommendedCarousel.tsx
"use client";


import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { MyCourseRow } from "./MyCourseRow";
import { useCourses } from "@/hooks/learner/useCourse";
import { useStudentEnrollmentsWithCourses } from "@/hooks/learner/useStudentEnrollmentsWithCourses";


export function RecommendedCarousel() {
  const [index, setIndex] = useState(0);
  // Lấy toàn bộ khoá học public
  const { data: allCourses, isLoading } = useCourses({ size: 30 });
  // Lấy danh sách khoá học đã đăng ký (chỉ lấy id)
  const { courses: enrolledCourses } = useStudentEnrollmentsWithCourses(1, 1000);
  const enrolledIds = new Set((enrolledCourses || []).map((c) => c.id));
  // Lọc ra các khoá học chưa đăng ký
  const recommended: MyCourse[] = (allCourses?.items || [])
    .filter((c: any) => !enrolledIds.has(c.id))
    .slice(0, 12)
    .map((course: any) => ({
      id: course.id,
      slug: course.slug || "",
      title: course.title,
      instructor: course.teacherName || "Unknown",
      thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
      thumbnailUrl: course.thumbnailUrl,
      progress: 0,
      lastViewed: "-",
      level: course.difficulty || "Beginner",
      category: course.categoryName || "",
      rating: course.rating || 0,
    }));

  // 1 slide = 3 course
  const perSlide = 3;
  const slides = useMemo(() => {
    const result: MyCourse[][] = [];
    for (let i = 0; i < recommended.length; i += perSlide) {
      result.push(recommended.slice(i, i + perSlide));
    }
    return result;
  }, [recommended]);
  const total = slides.length;

  function go(delta: number) {
    setIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return total - 1;
      if (next >= total) return 0;
      return next;
    });
  }

  if (isLoading || !recommended.length) return null;

  return (
    <section className="mt-10 md:mt-12">
      {/* Header */}
      <div className="mb-4 md:mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-300)]">
            Recommended
          </p>
          <h2 className="mt-1 text-xl md:text-2xl font-extrabold tracking-tight">
            Recommended for you
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Courses picked based on your interests, wishlist, and learning activity.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 hover:bg-slate-800 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 hover:bg-slate-800 transition"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 px-3 py-4 md:px-4 md:py-5">
        {/* arrows on mobile (nổi) */}
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2 md:hidden">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 shadow"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 md:hidden">
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 shadow"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full">
              <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                {slide.map((course) => (
                  <MyCourseRow key={course.id} course={course} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index
                  ? "bg-[var(--brand-500)] shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                  : "bg-slate-600 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}