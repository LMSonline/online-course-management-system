"use client";

import { useEffect, useState } from "react";
import HeroExplore from "@/core/components/public/explore/ExploreHero";
import ExploreCategoriesNew from "@/core/components/public/explore/ExploreCategories";
import TrendingTopics from "@/core/components/public/explore/ExploreTopics";
import FeaturedCollections from "@/core/components/public/explore/ExploreRecommended";
import PopularCoursesSection from "@/core/components/public/explore/ExplorePopular";
import { getCategoryTree } from "@/features/categories/services/categories.service";
import type { CategoryResponseDto } from "@/features/categories/types/categories.types";
import { listCourses } from "@/features/courses/services/courses.service";
import type { CourseSummary } from "@/features/courses/types/catalog.types";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ExplorePage() {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      console.log("[Explore] Fetching data...");

      const [catsResult, coursesResult] = await Promise.allSettled([
        getCategoryTree(),
        listCourses({ size: 20 }),
      ]);

      if (catsResult.status === "fulfilled") {
        setCategories(catsResult.value || []);
        console.log("[Explore] Categories response:", catsResult.value?.length || 0);
      } else {
        console.error("[Explore] Categories failed:", catsResult.reason);
        setCategories([]);
      }

      if (coursesResult.status === "fulfilled") {
        setCourses(coursesResult.value || []);
        console.log("[Explore] Courses response:", coursesResult.value?.length || 0);
      } else {
        console.error("[Explore] Courses failed:", coursesResult.reason);
        setCourses([]);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroExplore />
      <TrendingTopics />
      {hasCategories ? (
        <ExploreCategoriesNew categories={categories} />
      ) : (
        <section className="px-4 sm:px-6 md:px-10 xl:px-16">
          <EmptyState
            title="No categories yet"
            message="Categories have not been configured yet. Please check back later."
          />
        </section>
      )}
      <FeaturedCollections />
      <PopularCoursesSection />
    </div>
  );
}
