"use client";

import { useCategoryTree } from "@/hooks/category/useCategoryTree";
import { CategoryTree } from "@/core/components/category/CategoryTree";

/**
 * CategoryTreeScreen
 * Route: /categories
 * Layout: PublicLayout
 * Guard: none
 * 
 * Contract: CATEGORY_GET_TREE
 */
export default function CategoryTreeScreen() {
  const { data, isLoading, isError, error, refetch } = useCategoryTree();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>
      <CategoryTree
        categories={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
