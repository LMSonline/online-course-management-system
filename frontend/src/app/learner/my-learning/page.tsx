"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentCourses } from "@/features/learner/services/learner.service";
import { getCurrentUserInfo } from "@/services/auth";
import { getProfile } from "@/features/profile/services/profile.service";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import type { CourseSummary } from "@/features/courses/types/catalog.types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MyLearningPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUserInfo();
        if (user.role !== "STUDENT") {
          setError("My learning is only available for student accounts.");
          return;
        }

        const profile = await getProfile();
        const studentId = profile.profile?.studentId;
        if (!studentId) {
          setError("Student profile not found for current account.");
          return;
        }

        const page = await getStudentCourses(studentId, 0, 20);
        const items = page.items ?? [];

        setCourses(
          items.map((c) => ({
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
      } catch (err) {
        console.error("[MyLearning] Failed to load courses:", err);
        const msg = err instanceof Error ? err.message : "Failed to load courses.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">My learning</h1>
        {error ? (
          <EmptyState
            title="Unable to load your courses"
            message={error}
            action={
              <button
                onClick={() => router.refresh()}
                className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition"
              >
                Retry
              </button>
            }
          />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No enrolled courses yet"
            message="Browse the catalog and start learning."
          />
        ) : (
          <CourseGrid courses={courses} />
        )}
      </section>
    </main>
  );
}


