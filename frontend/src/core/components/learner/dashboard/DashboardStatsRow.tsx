// src/components/learner/dashboard/DashboardStatsRow.tsx
import { WeeklyStreakCard } from "./WeeklyStreakCard";
import { LearningTimeCard } from "./LearningTimeCard";
import { ContinueCourseCard } from "./ContinueCourseCard";

export function DashboardStatsRow() {
  return (
    <div className="grid gap-4 md:gap-5 md:grid-cols-3 mb-6 md:mb-8">
      <WeeklyStreakCard />
      <LearningTimeCard />
      <ContinueCourseCard />
    </div>
  );
}
