import { TagRequest,
  TagResponse } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

const TAG_PREFIX = "/tags";
const ADMIN_TAG_PREFIX = "/admin/tags";

export const tagService = {
  /**
   * Create a new tag (TAG_CREATE)
   * Contract Key: TAG_CREATE
   * Endpoint: POST /api/v1/admin/tags
   */
  createTag: async (payload: TagRequest): Promise<TagResponse> => {
    const response = await axiosClient.post<ApiResponse<TagResponse>>(
      ADMIN_TAG_PREFIX,
      payload,
      {
        contractKey: CONTRACT_KEYS.TAG_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get all active tags
   * Contract Key: TAG_GET_LIST
   */
  getTags: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<TagResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<TagResponse>>
    >(TAG_PREFIX, {
      params: { page, size },
      contractKey: CONTRACT_KEYS.TAG_GET_LIST,
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
   * Update a tag (TAG_UPDATE)
   * Contract Key: TAG_UPDATE
   * Endpoint: PUT /api/v1/admin/tags/{id}
   */
  updateTag: async (id: number, payload: TagRequest): Promise<TagResponse> => {
    const response = await axiosClient.put<ApiResponse<TagResponse>>(
      `${ADMIN_TAG_PREFIX}/${id}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.TAG_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a tag (TAG_DELETE)
   * Contract Key: TAG_DELETE
   * Endpoint: DELETE /api/v1/admin/tags/{id}
   */
  deleteTag: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${ADMIN_TAG_PREFIX}/${id}`, {
      contractKey: CONTRACT_KEYS.TAG_DELETE,
    });
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