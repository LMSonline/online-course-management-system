import { CategoryRequest, CategoryResponse } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
const CATEGORY_PREFIX = "/categories";
const ADMIN_CATEGORY_PREFIX = "/admin/categories";

export const categoryService = {
  /**
   * Create a new category (CATEGORY_CREATE)
   * Contract Key: CATEGORY_CREATE
   * Endpoint: POST /api/v1/admin/categories
   */
  createCategory: async (
    payload: CategoryRequest
  ): Promise<CategoryResponse> => {
    const response = await axiosClient.post<ApiResponse<CategoryResponse>>(
      ADMIN_CATEGORY_PREFIX,
      payload,
      {
        contractKey: CONTRACT_KEYS.CATEGORY_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number): Promise<CategoryResponse> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse>>(
      `${CATEGORY_PREFIX}/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Get category by ID (Admin only)
   */
  getCategoryByIdForAdmin: async (id: number): Promise<CategoryResponse> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse>>(
      `${ADMIN_CATEGORY_PREFIX}/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Get category tree
   * Contract Key: CATEGORY_GET_TREE
   */
  getCategoryTree: async (): Promise<CategoryResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>(
      `${CATEGORY_PREFIX}/tree`,
      {
        contractKey: CONTRACT_KEYS.CATEGORY_GET_TREE,
      }
    );

    return unwrapResponse(response, CONTRACT_KEYS.CATEGORY_GET_TREE);
  },

  /**
   * Get all deleted categories (Admin only)
   */
  getAllDeleted: async (): Promise<CategoryResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>(
      `${ADMIN_CATEGORY_PREFIX}/deleted`
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a category (CATEGORY_DELETE)
   * Contract Key: CATEGORY_DELETE
   * Endpoint: DELETE /api/v1/admin/categories/{id}
   */
  deleteCategory: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${ADMIN_CATEGORY_PREFIX}/${id}`, {
      contractKey: CONTRACT_KEYS.CATEGORY_DELETE,
    });
  },

  /**
   * Restore a deleted category (Admin only)
   */
  restoreCategory: async (id: number): Promise<CategoryResponse> => {
    const response = await axiosClient.patch<ApiResponse<CategoryResponse>>(
      `${ADMIN_CATEGORY_PREFIX}/${id}/restore`
    );

    return unwrapResponse(response);
  },

  /**
   * Update a category (CATEGORY_UPDATE)
   * Contract Key: CATEGORY_UPDATE
   * Endpoint: PUT /api/v1/admin/categories/{id}
   */
  updateCategory: async (
    id: number,
    payload: CategoryRequest
  ): Promise<CategoryResponse> => {
    const response = await axiosClient.put<ApiResponse<CategoryResponse>>(
      `${ADMIN_CATEGORY_PREFIX}/${id}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.CATEGORY_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get category by slug
   * Contract Key: CATEGORY_GET_BY_SLUG
   */
  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse>>(
      `${CATEGORY_PREFIX}/slug/${slug}`,
      {
        contractKey: CONTRACT_KEYS.CATEGORY_GET_BY_SLUG,
      }
    );

    return unwrapResponse(response, CONTRACT_KEYS.CATEGORY_GET_BY_SLUG);
  },
};