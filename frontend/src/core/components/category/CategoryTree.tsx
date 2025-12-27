"use client";

import Link from "next/link";
import { CategoryResponse } from "@/services/courses/course.types";
import { CourseCardSkeletonGrid } from "@/core/components/ui/CourseCardSkeleton";
import { EmptyState } from "@/core/components/ui/EmptyState";
import { ErrorState } from "@/core/components/ui/ErrorState";
import { FolderTree } from "lucide-react";

interface CategoryTreeProps {
  categories?: CategoryResponse[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * Category tree component
 * Renders categories in a tree/list structure
 */
export function CategoryTree({
  categories,
  isLoading,
  isError,
  error,
  onRetry,
}: CategoryTreeProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load categories"}
        onRetry={onRetry}
      />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="No categories"
        description="No categories available at the moment."
        icon={<FolderTree className="w-12 h-12 text-slate-400" />}
      />
    );
  }

  const renderCategory = (category: CategoryResponse, level = 0) => {
    return (
      <div key={category.id} className={level > 0 ? "ml-6 mt-2" : ""}>
        <Link
          href={`/categories/${category.slug || category.id}`}
          className="block p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {level > 0 && <span className="text-slate-400">└─</span>}
            <span className="font-medium">{category.name}</span>
            {category.description && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {category.description}
              </span>
            )}
          </div>
        </Link>
        {category.children && category.children.length > 0 && (
          <div className="mt-1">
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => renderCategory(category))}
    </div>
  );
}

