"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { getCategoryBySlug } from "@/features/categories/services/categories.service";
import { listCourses } from "@/features/courses/services/courses.service";
import type { CategoryResponseDto } from "@/features/categories/types/categories.types";
import type { CourseSummary } from "@/features/courses/types/catalog.types";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import { SafeImage } from "@/components/shared/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToastStore } from "@/lib/toast";

export default function TopicDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [category, setCategory] = useState<CategoryResponseDto | null>(null);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopicData() {
      try {
        setLoading(true);
        setError(null);

        const categoryData = await getCategoryBySlug(slug);
        
        if (!categoryData) {
          notFound();
          return;
        }

        // Fetch courses filtered by category
        // Note: Backend uses Spring Filter spec, so we pass category name or code
        // Adjust based on actual backend filter implementation
        const coursesData = await listCourses({ 
          category: categoryData.name, // Try category name first
          size: 50 
        });

        setCategory(categoryData);
        setCourses(coursesData || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load topic";
        setError(message);
        useToastStore.getState().error(message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadTopicData();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
          <EmptyState
            title="Failed to load topic"
            message={error}
            action={
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition"
              >
                Retry
              </button>
            }
          />
        </section>
      </main>
    );
  }

  if (!category) {
    return notFound();
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-6">
        {/* Topic Header */}
        <div className="flex items-center gap-4 mb-8">
          {category.thumbnailUrl && (
            <SafeImage
              src={category.thumbnailUrl}
              alt={category.name}
              width={80}
              height={80}
              className="rounded-xl object-cover flex-shrink-0"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-slate-300 text-sm md:text-base max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Courses in {category.name}</h2>
          {courses.length === 0 ? (
            <EmptyState
              title="No courses found"
              message={`There are no courses available in ${category.name} yet. Check back soon!`}
            />
          ) : (
            <CourseGrid courses={courses} />
          )}
        </div>
      </section>
    </main>
  );
}

