"use client";

import { useEffect, useState } from "react";
import { getCategoryTree } from "../services/categories.service";
import type { CategoryResponseDto } from "../types/categories.types";

/**
 * Hook to fetch and cache category tree
 * Caches in component state to avoid refetching
 */
export function useCategoriesTree() {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryTree();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load categories");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}

