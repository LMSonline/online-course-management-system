"use client";

import { useEffect, useState } from "react";
import HeroExplore from "@/core/components/public/explore/ExploreHero";
import ExploreCategoriesNew from "@/core/components/public/explore/ExploreCategories";
import TrendingTopics from "@/core/components/public/explore/ExploreTopics";
import FeaturedCollections from "@/core/components/public/explore/ExploreRecommended";
import PopularCoursesSection from "@/core/components/public/explore/ExplorePopular";
import { getCategoryTree } from "@/features/courses/services/courses.service";
import { listCourses } from "@/features/courses/services/courses.service";
import type { CategoryResponseDto } from "@/features/courses/services/courses.service";

export default function ExplorePage() {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, courseList] = await Promise.all([
          getCategoryTree(),
          listCourses({ size: 20 }),
        ]);
        setCategories(cats);
        setCourses(courseList);
      } catch (error: unknown) {
        console.error("Failed to load explore data:", error);
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroExplore />
      <TrendingTopics />
      <ExploreCategoriesNew categories={categories} />
      <FeaturedCollections courses={courses.slice(0, 10)} />
      <PopularCoursesSection courses={courses.slice(0, 12)} />
    </div>
  );
}
