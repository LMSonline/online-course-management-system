import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import {
  ChapterRequest,
  ChapterReorderRequest,
  ChapterResponse,
} from "./chapter.types";

export const chapterService = {
  /**
   * Create a new chapter (CHAPTER_CREATE)
   * Contract Key: CHAPTER_CREATE
   * Endpoint: POST /api/v1/courses/{courseId}/versions/{versionId}/chapters
   */
  createChapter: async (
    courseId: number,
    versionId: number,
    payload: ChapterRequest
  ): Promise<ChapterResponse> => {
    const response = await axiosClient.post<ApiResponse<ChapterResponse>>(
      `/courses/${courseId}/versions/${versionId}/chapters`,
      payload,
      {
        contractKey: CONTRACT_KEYS.CHAPTER_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get all chapters (CHAPTER_GET_LIST)
   * Contract Key: CHAPTER_GET_LIST
   * Endpoint: GET /api/v1/courses/{courseId}/versions/{versionId}/chapters
   */
  getListChapters: async (
    courseId: number,
    versionId: number
  ): Promise<ChapterResponse[]> => {
    const response = await axiosClient.get<ApiResponse<ChapterResponse[]>>(
      `/courses/${courseId}/versions/${versionId}/chapters`,
      {
        contractKey: CONTRACT_KEYS.CHAPTER_GET_LIST,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get chapter details
   */
  getDetailChapter: async (
    courseId: number,
    versionId: number,
    chapterId: number
  ): Promise<ChapterResponse> => {
    const response = await axiosClient.get<ApiResponse<ChapterResponse>>(
      `/courses/${courseId}/versions/${versionId}/chapters/${chapterId}`
    );

    return unwrapResponse(response);
  },

  /**
   * Update a chapter (CHAPTER_UPDATE)
   * Contract Key: CHAPTER_UPDATE
   * Endpoint: PUT /api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}
   */
  updateChapter: async (
    courseId: number,
    versionId: number,
    chapterId: number,
    payload: ChapterRequest
  ): Promise<ChapterResponse> => {
    const response = await axiosClient.put<ApiResponse<ChapterResponse>>(
      `/courses/${courseId}/versions/${versionId}/chapters/${chapterId}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.CHAPTER_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a chapter (CHAPTER_DELETE)
   * Contract Key: CHAPTER_DELETE
   * Endpoint: DELETE /api/v1/courses/{courseId}/versions/{versionId}/chapters/{chapterId}
   */
  deleteChapter: async (
    courseId: number,
    versionId: number,
    chapterId: number
  ): Promise<void> => {
    await axiosClient.delete<void>(
      `/courses/${courseId}/versions/${versionId}/chapters/${chapterId}`,
      {
        contractKey: CONTRACT_KEYS.CHAPTER_DELETE,
      }
    );
  },

  /**
   * Reorder chapters (Teacher only)
   */
  reorderChapters: async (
    courseId: number,
    versionId: number,
    payload: ChapterReorderRequest
  ): Promise<void> => {
    await axiosClient.post<void>(
      `/courses/${courseId}/versions/${versionId}/chapters/reorder`,
      payload
    );
  },
};
