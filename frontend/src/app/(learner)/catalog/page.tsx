// src/app/(learner)/catalog/page.tsx
"use client";

import { useMemo, useState } from "react";
import { CatalogHeader } from "@/core/components/learner/catalog/CatalogHeader";
import { CategoryTabs } from "@/core/components/learner/catalog/CategoryTabs";
import { FilterBar } from "@/core/components/learner/catalog/FilterBar";
import { CourseGrid } from "@/core/components/learner/catalog/CourseGrid";
import {
  COURSE_CATALOG_MOCK,
  CategoryKey,
} from "@/lib/learner/catalog/types";

export default function LearnerCatalogPage() {
  const [category, setCategory] = useState<CategoryKey>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [level, setLevel] = useState("all");
  const [rating, setRating] = useState("all");

  const filtered = useMemo(() => {
    let result = COURSE_CATALOG_MOCK.slice();

    if (category !== "All") {
      result = result.filter((c) => c.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    if (level !== "all") {
      result = result.filter((c) => c.level === level);
    }

    if (rating !== "all") {
      const min = parseFloat(rating);
      result = result.filter((c) => c.rating >= min);
    }

    // sort
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id); // fake
      // popular = students desc
      return b.students - a.students;
    });

    return result;
  }, [category, search, sortBy, level, rating]);

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
        <CourseGrid courses={filtered} />
      </section>
    </main>
  );
}
