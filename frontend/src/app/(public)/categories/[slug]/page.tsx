"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCategoryBySlug } from "@/hooks/category/useCategoryBySlug";
import { useCourseList } from "@/hooks/course/useCourseList";
import { CourseList } from "@/core/components/course/CourseList";
import { CourseCardSkeletonGrid } from "@/core/components/ui/CourseCardSkeleton";
import { EmptyState } from "@/core/components/ui/EmptyState";
import { ErrorState } from "@/core/components/ui/ErrorState";

/**
 * CategoryDetailScreen
 * Route: /categories/:slug
 * Layout: PublicLayout
 * Guard: none
 * 
 * Contracts:
 * - CATEGORY_GET_BY_SLUG
 * - COURSE_GET_LIST with category filter
 */
export default function CategoryDetailScreen({
  params,
}: {
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "12", 10);
  const sort = searchParams.get("sort") || "newest";

  const {
    data: category,
    isLoading: isLoadingCategory,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategory,
  } = useCategoryBySlug(params.slug);

  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isError: isCoursesError,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourseList({
    category: params.slug,
    page,
    size,
    sort,
  });

  if (isLoadingCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-8" />
        <CourseCardSkeletonGrid count={8} />
      </div>
    );
  }

  if (isCategoryError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={categoryError?.message || "Failed to load category"}
          onRetry={() => refetchCategory()}
        />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Category not found"
          description="The category you're looking for doesn't exist."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-slate-600 dark:text-slate-400">
            {category.description}
          </p>
        )}
      </div>

      {/* Course List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Courses in {category.name}
        </h2>
        <CourseList
          courses={coursesData?.items}
          isLoading={isLoadingCourses}
          isError={isCoursesError}
          error={coursesError}
          onRetry={() => refetchCourses()}
        />
      </div>

      {/* Pagination */}
      {coursesData && coursesData.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(searchParams.toString());
              urlParams.set("page", String(Math.max(1, page - 1)));
              router.push(`/categories/${params.slug}?${urlParams.toString()}`);
            }}
            disabled={!coursesData.hasPrevious}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {coursesData.totalPages}
          </span>
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(searchParams.toString());
              urlParams.set("page", String(Math.min(coursesData.totalPages, page + 1)));
              router.push(`/categories/${params.slug}?${urlParams.toString()}`);
            }}
            disabled={!coursesData.hasNext}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
