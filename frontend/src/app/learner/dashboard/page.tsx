// src/app/(learner)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/core/components/learner/dashboard/DashboardHeader";
import { DashboardStatsRow } from "@/core/components/learner/dashboard/DashboardStatsRow";
import { MyCoursesSection } from "@/core/components/learner/dashboard/MyCoursesSection";
import { RecommendedCarousel } from "@/core/components/learner/dashboard/RecommendedCarousel";
import { getStudentCourses } from "@/features/learner/services/learner.service";
import { getRecommendations } from "@/features/recommendation/services/recommendation.service";
import { getCurrentUserInfo } from "@/services/auth";
import type { CourseSummary } from "@/features/courses/types/catalog.types";

export default function LearnerDashboardPage() {
  const [courses, setCourses] = useState<StudentCourseResponse[]>([]);
  const [recommendations, setRecommendations] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const user = await getCurrentUserInfo();
        if (user.role === "STUDENT") {
          const [coursesData, recsData] = await Promise.all([
            getStudentCourses(user.accountId, 0, 10).catch(() => ({ items: [] })),
            getRecommendations(user.accountId).catch(() => []),
          ]);
          setCourses(coursesData.items || []);
          // Transform recommendations to CourseSummary format
          setRecommendations(
            recsData.map((r) => ({
              id: r.courseId.toString(),
              title: r.courseTitle,
              instructor: "",
              category: "",
              level: "Beginner" as const,
              rating: 4.5,
              ratingCount: 0,
              students: 0,
              duration: "0h 0m",
              lectures: 0,
              thumbColor: "from-blue-500 to-purple-600",
              priceLabel: "₫2,239,000",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <p className="text-white">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <DashboardHeader />
        <DashboardStatsRow />
        <MyCoursesSection courses={courses.map((c) => ({
          id: c.courseId.toString(),
          title: c.courseTitle,
          instructor: "",
          category: "",
          level: "Beginner" as const,
          rating: 4.5,
          ratingCount: 0,
          students: 0,
          duration: "0h 0m",
          lectures: 0,
          thumbColor: "from-blue-500 to-purple-600",
          priceLabel: "₫2,239,000",
        }))} />
        {recommendations.length > 0 && (
          <RecommendedCarousel courses={recommendations} />
        )}
      </section>
    </main>
  );
}