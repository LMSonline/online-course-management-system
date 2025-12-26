import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  CreateLessonRequest,
  UpdateLessonRequest,
  UpdateVideoRequest,
  ReorderLessonsRequest,
  LessonResponse,
  RequestUploadUrlResponse,
} from "./lesson.types";

export const lessonService = {
  /**
   * Create new lesson (Teacher only)
   */
  createLesson: async (
    chapterId: number,
    payload: CreateLessonRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.post<ApiResponse<LessonResponse>>(
      `/chapters/${chapterId}/lessons`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all lessons of a chapter
   */
  getLessonsByChapter: async (chapterId: number): Promise<LessonResponse[]> => {
    const response = await axiosClient.get<ApiResponse<LessonResponse[]>>(
      `/chapters/${chapterId}/lessons`
    );

    return unwrapResponse(response);
  },

  /**
   * Get lesson details
   */
  getLessonById: async (id: number): Promise<LessonResponse> => {
    const response = await axiosClient.get<ApiResponse<LessonResponse>>(
      `/lessons/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Update lesson (Teacher only)
   */
  updateLesson: async (
    id: number,
    payload: UpdateLessonRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.put<ApiResponse<LessonResponse>>(
      `/lessons/${id}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Delete lesson (Teacher only)
   */
  deleteLesson: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`/lessons/${id}`);
  },

  /**
   * Reorder lessons (Teacher only)
   */
  reorderLessons: async (
    chapterId: number,
    payload: ReorderLessonsRequest
  ): Promise<void> => {
    await axiosClient.post<void>(
      `/chapters/${chapterId}/lessons/reorder`,
      payload
    );
  },

  /**
   * Request video upload URL (Teacher only)
   */
  requestUploadUrl: async (
    lessonId: number
  ): Promise<RequestUploadUrlResponse> => {
    const response = await axiosClient.get<
      ApiResponse<RequestUploadUrlResponse>
    >(`/lessons/${lessonId}/video/upload-url`);

    return unwrapResponse(response);
  },

  /**
   * Complete video upload (Teacher only)
   */
  uploadComplete: async (
    lessonId: number,
    payload: UpdateVideoRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.post<ApiResponse<LessonResponse>>(
      `/lessons/${lessonId}/video/upload-complete`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get video streaming URL
   */
  getVideoStreamingUrl: async (lessonId: number): Promise<string> => {
    const response = await axiosClient.get<ApiResponse<{ streamUrl: string }>>(
      `/lessons/${lessonId}/video/stream-url`
    );

    const data = unwrapResponse(response);
    return data.streamUrl;
  },

  /**
   * Delete lesson video (Teacher only)
   */
  deleteVideo: async (lessonId: number): Promise<LessonResponse> => {
    const response = await axiosClient.delete<ApiResponse<LessonResponse>>(
      `/lessons/${lessonId}/video`
    );

    return unwrapResponse(response);
  },
};
