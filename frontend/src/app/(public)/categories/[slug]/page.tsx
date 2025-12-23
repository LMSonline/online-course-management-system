"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategoryBySlug, listCourses } from "@/features/courses/services/courses.service";
import type { CategoryResponseDto } from "@/features/courses/services/courses.service";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import type { CourseSummary } from "@/features/courses/types/catalog.types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<CategoryResponseDto | null>(null);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategory() {
      try {
        setLoading(true);
        setError(null);
        const [catData, courseList] = await Promise.all([
          getCategoryBySlug(slug),
          listCourses({ category: slug, size: 50 }),
        ]);
        setCategory(catData);
        setCourses(courseList);
      } catch (err: any) {
        console.error("Failed to load category:", err);
        setError(err.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadCategory();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Category not found"}</p>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-slate-300 text-lg">{category.description}</p>
          )}
        </div>

        {courses.length === 0 ? (
          <p className="text-white text-center py-12">No courses found in this category.</p>
        ) : (
          <CourseGrid courses={courses} />
        )}
      </div>
    </main>
  );
}

