import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/courses/category.service";
import { CategoryResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch category tree
 * Contract Key: CATEGORY_GET_TREE
 */
export function useCategoryTree() {
  return useQuery<CategoryResponse[]>({
    queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE],
    queryFn: () => categoryService.getCategoryTree(),
    staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
  });
}

