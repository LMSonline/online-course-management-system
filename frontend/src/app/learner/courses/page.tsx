"use client";

import { useEffect, useState } from "react";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import { getStudentCourses } from "@/features/learner/services/learner.service";
import { getCurrentUserInfo } from "@/features/auth/services/auth.service";
import type { CourseSummary } from "@/features/courses/types/catalog.types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const user = await getCurrentUserInfo();
        if (user.role !== "STUDENT") {
          setError("This page is only available for students");
          return;
        }
        const result = await getStudentCourses(user.accountId, 0, 50);
        setCourses(
          result.items.map((c) => ({
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
          }))
        );
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Failed to load courses:", err);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-white">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        {courses.length === 0 ? (
          <p className="text-white text-center py-12">No enrolled courses yet</p>
        ) : (
          <CourseGrid courses={courses} />
        )}
      </div>
    </main>
  );
}