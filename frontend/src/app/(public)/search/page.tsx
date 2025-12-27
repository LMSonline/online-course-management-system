"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCourseList } from "@/hooks/course/useCourseList";
import { CourseList } from "@/core/components/course/CourseList";
import { Search } from "lucide-react";

/**
 * SearchResultsScreen
 * Route: /search
 * Layout: PublicLayout
 * Guard: none
 * 
 * Contract: COURSE_GET_LIST with q param
 */
export default function SearchResultsScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const q = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "12", 10);
  const sort = searchParams.get("sort") || "newest";

  const { data, isLoading, isError, error, refetch } = useCourseList({
    q,
    page,
    size,
    sort,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Courses</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for courses..."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </form>

        {q && (
          <p className="text-slate-600 dark:text-slate-400">
            {data?.totalItems || 0} results for &quot;{q}&quot;
          </p>
        )}
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
              router.push(`/search?${params.toString()}`);
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
              router.push(`/search?${params.toString()}`);
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
