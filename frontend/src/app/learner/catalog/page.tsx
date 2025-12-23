// src/app/(learner)/catalog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { CatalogHeader } from "@/core/components/learner/catalog/CatalogHeader";
import { CategoryTabs } from "@/core/components/learner/catalog/CategoryTabs";
import { FilterBar } from "@/core/components/learner/catalog/FilterBar";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import { listCourses } from "@/features/courses/services/courses.service";
import { CategoryKey, COURSE_CATEGORIES } from "@/features/courses/types/catalog.types";
import type { CourseSummary } from "@/features/courses/types/catalog.types";

export default function LearnerCatalogPage() {
  const [category, setCategory] = useState<CategoryKey>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [level, setLevel] = useState("all");
  const [rating, setRating] = useState("all");
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await listCourses({
          category: category !== "All" ? category : undefined,
          level: level !== "all" ? level : undefined,
          search: search.trim() || undefined,
        });
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [category, level, search]);

  const filtered = useMemo(() => {
    let result = [...courses];

    if (rating !== "all") {
      const min = parseFloat(rating);
      result = result.filter((c) => c.rating >= min);
    }

    // sort
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      // popular = students desc
      return b.students - a.students;
    });

    return result;
  }, [courses, sortBy, rating]);

  if (loading) {
    return <p className="text-white p-6">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-6">Error: {error}</p>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <CatalogHeader />
        <CategoryTabs active={category} onChange={setCategory} />
        <FilterBar
          total={filtered.length}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          level={level}
          onLevelChange={setLevel}
          rating={rating}
          onRatingChange={setRating}
        />
        {filtered.length === 0 ? (
          <p className="text-white p-6 text-center">No courses found</p>
        ) : (
          <CourseGrid courses={filtered} />
        )}
      </section>
    </main>
  );
}
