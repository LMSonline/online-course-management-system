import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/courses/category.service";
import { CategoryResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch category by slug
 * Contract Key: CATEGORY_GET_BY_SLUG
 */
export function useCategoryBySlug(slug: string) {
  return useQuery<CategoryResponse>({
    queryKey: [CONTRACT_KEYS.CATEGORY_GET_BY_SLUG, slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

