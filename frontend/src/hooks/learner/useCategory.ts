// Hooks liên quan đến category cho learner
import { useQuery } from '@tanstack/react-query';
import { learnerCategoryService } from '../../services/learner/categoryService';
import { Category, CategoryTree } from '../../lib/learner/category/categories';

/**
 * Lấy danh sách category public cho learner
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['learner-categories'],
    queryFn: () => learnerCategoryService.getCategories(),
  });
}

/**
 * Lấy cây category public cho learner
 */
export function useCategoryTree() {
  return useQuery<CategoryTree>({
    queryKey: ['learner-category-tree'],
    queryFn: () => learnerCategoryService.getCategoryTree(),
  });
}

/**
 * Lấy chi tiết category theo id cho learner
 */
export function useCategoryById(id: number) {
  return useQuery<Category>({
    queryKey: ['learner-category-id', id],
    queryFn: () => learnerCategoryService.getCategoryById(id),
    enabled: !!id,
  });
}

/**
 * Lấy chi tiết category theo slug cho learner
 */
export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['learner-category-slug', slug],
    queryFn: () => learnerCategoryService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}
