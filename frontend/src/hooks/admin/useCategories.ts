import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/courses/category.service";
import { CategoryRequest, CategoryResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to fetch category tree (for admin)
 * Contract Key: CATEGORY_GET_TREE
 */
export function useAdminCategoriesQuery() {
  return useQuery<CategoryResponse[]>({
    queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE],
    queryFn: () => categoryService.getCategoryTree(),
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to create category
 * Contract Key: CATEGORY_CREATE
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponse, Error, CategoryRequest>({
    mutationFn: (payload) => categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

/**
 * Hook to update category
 * Contract Key: CATEGORY_UPDATE
 */
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CategoryResponse,
    Error,
    { id: number; payload: CategoryRequest }
  >({
    mutationFn: ({ id, payload }) => categoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE] });
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.CATEGORY_GET_BY_ID] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

/**
 * Hook to delete category
 * Contract Key: CATEGORY_DELETE
 */
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

