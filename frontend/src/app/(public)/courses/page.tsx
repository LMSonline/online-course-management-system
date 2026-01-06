"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCourseList } from "@/hooks/course/useCourseList";
import { CourseList } from "@/core/components/course/CourseList";
import { useCategoryTree } from "@/hooks/category/useCategoryTree";
import { CategoryTree } from "@/core/components/category/CategoryTree";

/**
 * CourseListScreen
 * Route: /courses
 * Layout: PublicLayout
 * Guard: none
 * 
 * Contract: COURSE_GET_LIST with params: page, size, sort, category, q
 */
export default function CourseListScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "12", 10);
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;

  // Map UI sort value to backend sort param
  let backendSort = sort;
  if (sort === "all") backendSort = "";
  else if (sort === "newest") backendSort = "createdAt,desc";
  else if (sort === "rating") backendSort = "averageRating,desc";
  else if (sort === "popular") backendSort = "enrollmentCount,desc";
  // Add more mappings as needed

  const { data, isLoading, isError, error, refetch } = useCourseList({
    page,
    size,
    sort: backendSort,
    category,
    q,
  });

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Courses</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm"
            >
              <option value="all">All</option>
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
              <option value="popular">Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      <CourseList
        courses={data?.items}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchQuery={q}
        onRetry={() => refetch()}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(Math.max(1, page - 1)));
              router.push(`/courses?${params.toString()}`);
            }}
            disabled={!data.hasPrevious}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(Math.min(data.totalPages, page + 1)));
              router.push(`/courses?${params.toString()}`);
            }}
            disabled={!data.hasNext}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
