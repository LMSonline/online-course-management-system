"use client";

import { CourseResponse } from "@/services/courses/course.types";
import { CourseCardAdapter } from "./CourseCardAdapter";
import { CourseCardSkeletonGrid } from "@/core/components/ui/CourseCardSkeleton";
import { EmptyState, SearchEmptyState } from "@/core/components/ui/EmptyState";
import { ErrorState } from "@/core/components/ui/ErrorState";

interface CourseListProps {
  courses?: CourseResponse[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  searchQuery?: string;
  onRetry?: () => void;
}

/**
 * Reusable course list component
 * Handles loading, empty, and error states
 */
export function CourseList({
  courses,
  isLoading,
  isError,
  error,
  searchQuery,
  onRetry,
}: CourseListProps) {
  if (isLoading) {
    return <CourseCardSkeletonGrid count={8} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load courses"}
        onRetry={onRetry}
      />
    );
  }

  if (!courses || courses.length === 0) {
    if (searchQuery) {
      return <SearchEmptyState query={searchQuery} />;
    }
    return (
      <EmptyState
        title="No courses found"
        description="There are no courses available at the moment."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCardAdapter key={course.id} course={course} />
      ))}
    </div>
  );
}

