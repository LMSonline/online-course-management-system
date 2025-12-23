"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listCourses } from "@/features/courses/services/courses.service";
import { CatalogHeader } from "@/core/components/learner/catalog/CatalogHeader";
import { FilterBar } from "@/core/components/learner/catalog/FilterBar";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import type { CourseSummary } from "@/features/courses/types/catalog.types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(query);
  const [sortBy, setSortBy] = useState("popular");
  const [level, setLevel] = useState("all");
  const [rating, setRating] = useState("all");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await listCourses({
          search: query,
          level: level !== "all" ? level : undefined,
        });
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [query, level]);

  const handleSearch = () => {
    if (search.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(search)}`;
    }
  };

  const filtered = courses.filter((c) => {
    if (rating !== "all") {
      const min = parseFloat(rating);
      return c.rating >= min;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    return b.students - a.students;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <CatalogHeader />
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
        {query && (
          <p className="text-slate-300 mb-4">
            Search results for: <span className="font-semibold">"{query}"</span>
          </p>
        )}
        {loading ? (
          <p className="text-white p-6">Loading courses...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white p-6 text-center">No courses found.</p>
        ) : (
          <CourseGrid courses={filtered} />
        )}
      </div>
    </main>
  );
}

