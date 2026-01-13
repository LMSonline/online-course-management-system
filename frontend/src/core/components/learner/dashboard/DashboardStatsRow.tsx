"use client";

import { WeeklyStreakCard } from "./WeeklyStreakCard";
import { LearningTimeCard } from "./LearningTimeCard";
import { ContinueCourseCard } from "./ContinueCourseCard";
import { useEnrollments } from "@/hooks/learner/useEnrollment";

export function DashboardStatsRow() {
  // Lấy danh sách khoá học đã đăng ký của student từ hệ thống
  const { courses, isLoading } = useEnrollments(1, 100);
  // Tìm khoá học chưa hoàn thành (progress < 100)
  const continueCourse = courses.find((c) => (c.progress ?? 0) < 100);

  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-3 mb-6 md:mb-8">
      <WeeklyStreakCard />
      <LearningTimeCard />
        {isLoading ? (
          <div className="rounded-2xl bg-slate-900/40 h-[170px] flex items-center justify-center text-slate-400 text-sm">Loading...</div>
        ) : continueCourse ? (
          <ContinueCourseCard course={continueCourse} />
        ) : (
          <a
            href="/learner/courses"
            className="rounded-2xl bg-gradient-to-br from-lime-700/20 via-slate-950 to-slate-950 border border-lime-400/20 flex items-center justify-center min-h-[170px] text-lime-300 text-sm font-semibold hover:bg-lime-900/30 transition"
          >
            Explore courses to start learning!
          </a>
        )}
    </div>
  );
}
