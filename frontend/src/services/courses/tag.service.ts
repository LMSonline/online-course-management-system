import {  TagRequest,
  TagResponse, } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";

const TAG_PREFIX = "/tags";
const ADMIN_TAG_PREFIX = "/admin/tags";

export const tagService = {
  /**
   * Create a new tag (Admin only)
   */
  createTag: async (payload: TagRequest): Promise<TagResponse> => {
    const response = await axiosClient.post<ApiResponse<TagResponse>>(
      ADMIN_TAG_PREFIX,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all active tags
   */
  getTags: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<TagResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<TagResponse>>
    >(TAG_PREFIX, {
      params: { page, size },
    });

    return unwrapResponse(response);
  },

  /**
   * Get all tags including deleted (Admin only)
   */
  getAllTags: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<TagResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<TagResponse>>
    >(ADMIN_TAG_PREFIX, {
      params: { page, size },
    });

    return unwrapResponse(response);
  },

  /**
   * Update a tag (Admin only)
   */
  updateTag: async (id: number, payload: TagRequest): Promise<TagResponse> => {
    const response = await axiosClient.put<ApiResponse<TagResponse>>(
      `${ADMIN_TAG_PREFIX}/${id}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a tag (Admin only)
   */
  deleteTag: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${ADMIN_TAG_PREFIX}/${id}`);
  },

  /**
   * Restore a deleted tag (Admin only)
   */
  restoreTag: async (id: number): Promise<TagResponse> => {
    const response = await axiosClient.patch<ApiResponse<TagResponse>>(
      `${ADMIN_TAG_PREFIX}/${id}/restore`
    );

    return unwrapResponse(response);
  },
};