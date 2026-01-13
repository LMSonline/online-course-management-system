// TagService for learner (student)
// API public: /api/v1/public/tags, /public/tags/all, /public/tags/search

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Tag, TagListResponse } from '@/lib/learner/tag/tags';

const TAG_PUBLIC_PREFIX = '/public/tags';

export const learnerTagService = {
  /**
   * Lấy danh sách tag public (có phân trang)
   */
  getTags: async (params?: Record<string, any>): Promise<TagListResponse> => {
    const response = await axiosClient.get(TAG_PUBLIC_PREFIX, { params });
    return unwrapResponse(response);
  },

  /**
   * Lấy toàn bộ tag public (không phân trang)
   */
  getAllTags: async (): Promise<Tag[]> => {
    const response = await axiosClient.get(`${TAG_PUBLIC_PREFIX}/all`);
    return unwrapResponse(response);
  },

  /**
   * Tìm kiếm tag theo tên
   */
  searchTags: async (query: string): Promise<Tag[]> => {
    const response = await axiosClient.get(`${TAG_PUBLIC_PREFIX}/search`, { params: { query } });
    return unwrapResponse(response);
  },
};
