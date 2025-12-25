// src/app/(learner)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/core/components/learner/dashboard/DashboardHeader";
import { DashboardStatsRow } from "@/core/components/learner/dashboard/DashboardStatsRow";
import { MyCoursesSection } from "@/core/components/learner/dashboard/MyCoursesSection";
import { RecommendedCarousel } from "@/core/components/learner/dashboard/RecommendedCarousel";
import { getStudentCourses, type StudentCourseResponse } from "@/features/learner/services/learner.service";
import { getRecommendations } from "@/features/recommendation/services/recommendation.service";
import { getCurrentUserInfo } from "@/services/auth";
import { getProfile } from "@/features/profile/services/profile.service";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { ApiError } from "@/services/core/errors";

export default function LearnerDashboardPage() {
  const [courses, setCourses] = useState<StudentCourseResponse[]>([]);
  const [recommendations, setRecommendations] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUserInfo();
        if (user.role !== "STUDENT") {
          setError("Learner dashboard is only available for student accounts.");
          return;
        }

        const profile = await getProfile();
        const studentId = profile.profile?.studentId;
        if (!studentId) {
          setError("Student profile not found for current account.");
          return;
        }

        const [coursesData, recsData] = await Promise.all([
          getStudentCourses(studentId, 0, 10).catch((err) => {
            console.error("Failed to load student courses:", err);
            return { items: [] };
          }),
          getRecommendations(studentId).catch((err) => {
            console.error("Failed to load recommendations:", err);
            return [];
          }),
        ]);

        setCourses(coursesData.items || []);
        // Transform recommendations to MyCourse format for the carousel
        setRecommendations(
          recsData.map((r) => ({
            id: r.courseId.toString(),
            slug: r.courseSlug || r.courseId.toString(),
            title: r.courseTitle,
            instructor: "",
            thumbColor: "from-blue-500 to-purple-600",
            progress: 0,
            lastViewed: "Recommended for you",
            level: "Beginner" as const,
            category: "",
            rating: 4.5,
          }))
        );
      } catch (err) {
        if (err instanceof ApiError) {
          console.error("Dashboard API error:", err.status, err.message, err.details);
          setError(err.message || "Failed to load dashboard data.");
        } else {
          console.error("Failed to load dashboard data:", err);
          setError("Failed to load dashboard data.");
        }
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
        {error ? (
          <p className="text-red-400 mb-4">{error}</p>
        ) : null}
        <DashboardHeader />
        <DashboardStatsRow />
        <MyCoursesSection
          courses={courses.map((c) => ({
            id: c.courseId.toString(),
            slug: c.courseSlug || c.courseId.toString(),
            title: c.courseTitle,
            instructor: "",
            thumbColor: "from-blue-500 to-purple-600",
            progress: c.progress ?? 0,
            lastViewed: c.lastAccessedAt ? new Date(c.lastAccessedAt).toLocaleDateString() : "Recently enrolled",
            level: "Beginner" as const,
            category: "",
            rating: 4.5,
          }))}
        />
        {recommendations.length > 0 && (
          <RecommendedCarousel courses={recommendations} />
        )}
      </section>
    </main>
  );
}