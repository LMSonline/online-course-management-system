// CategoryService for learner (student)
// API public: /api/v1/public/categories, /public/categories/tree, /public/categories/{id}, /public/categories/slug/{slug}

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Category, CategoryListResponse, CategoryTree } from '@/lib/learner/category/categories';

const CATEGORY_PUBLIC_PREFIX = '/categories';

export const learnerCategoryService = {
  /**
   * Lấy danh sách category public (không cần đăng nhập)
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get(CATEGORY_PUBLIC_PREFIX);
    return unwrapResponse(response);
  },

  /**
   * Lấy cây category public
   */
  getCategoryTree: async (): Promise<CategoryTree> => {
    const response = await axiosClient.get(`${CATEGORY_PUBLIC_PREFIX}/tree`);
    return unwrapResponse(response);
  },

  /**
   * Lấy chi tiết category theo id
   */
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await axiosClient.get(`${CATEGORY_PUBLIC_PREFIX}/${id}`);
    return unwrapResponse(response);
  },

  /**
   * Lấy chi tiết category theo slug
   */
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await axiosClient.get(`${CATEGORY_PUBLIC_PREFIX}/slug/${slug}`);
    return unwrapResponse(response);
  },
};
