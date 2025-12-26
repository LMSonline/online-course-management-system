import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  ChapterRequest,
  ChapterReorderRequest,
  ChapterResponse,
} from "./chapter.types";

export const chapterService = {
  /**
   * Create a new chapter (Teacher only)
   */
  createChapter: async (
    courseId: number,
    versionId: number,
    payload: ChapterRequest
  ): Promise<ChapterResponse> => {
    const response = await axiosClient.post<ApiResponse<ChapterResponse>>(
      `/courses/${courseId}/versions/${versionId}/chapters`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all chapters
   */
  getListChapters: async (
    courseId: number,
    versionId: number
  ): Promise<ChapterResponse[]> => {
    const response = await axiosClient.get<ApiResponse<ChapterResponse[]>>(
      `/courses/${courseId}/versions/${versionId}/chapters`
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
   * Update a chapter (Teacher only)
   */
  updateChapter: async (
    courseId: number,
    versionId: number,
    chapterId: number,
    payload: ChapterRequest
  ): Promise<ChapterResponse> => {
    const response = await axiosClient.put<ApiResponse<ChapterResponse>>(
      `/courses/${courseId}/versions/${versionId}/chapters/${chapterId}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a chapter (Teacher only)
   */
  deleteChapter: async (
    courseId: number,
    versionId: number,
    chapterId: number
  ): Promise<void> => {
    await axiosClient.delete<void>(
      `/courses/${courseId}/versions/${versionId}/chapters/${chapterId}`
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
