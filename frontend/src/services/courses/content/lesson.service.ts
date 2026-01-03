import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
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
   * Create new lesson (LESSON_CREATE)
   * Contract Key: LESSON_CREATE
   * Endpoint: POST /api/v1/chapters/{chapterId}/lessons
   */
  createLesson: async (
    chapterId: number,
    payload: CreateLessonRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.post<ApiResponse<LessonResponse>>(
      `/chapters/${chapterId}/lessons`,
      payload,
      {
        contractKey: CONTRACT_KEYS.LESSON_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get all lessons of a chapter (LESSON_GET_BY_CHAPTER)
   * Contract Key: LESSON_GET_BY_CHAPTER
   * Endpoint: GET /api/v1/chapters/{chapterId}/lessons
   */
  getLessonsByChapter: async (chapterId: number): Promise<LessonResponse[]> => {
    const response = await axiosClient.get<ApiResponse<LessonResponse[]>>(
      `/chapters/${chapterId}/lessons`,
      {
        contractKey: CONTRACT_KEYS.LESSON_GET_BY_CHAPTER,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get lesson details (LESSON_GET_BY_ID)
   * Contract Key: LESSON_GET_BY_ID
   * Endpoint: GET /api/v1/lessons/{id}
   */
  getLessonById: async (id: number): Promise<LessonResponse> => {
    const response = await axiosClient.get<ApiResponse<LessonResponse>>(
      `/lessons/${id}`,
      {
        contractKey: CONTRACT_KEYS.LESSON_GET_BY_ID,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Update lesson (LESSON_UPDATE)
   * Contract Key: LESSON_UPDATE
   * Endpoint: PUT /api/v1/lessons/{id}
   */
  updateLesson: async (
    id: number,
    payload: UpdateLessonRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.put<ApiResponse<LessonResponse>>(
      `/lessons/${id}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.LESSON_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete lesson (LESSON_DELETE)
   * Contract Key: LESSON_DELETE
   * Endpoint: DELETE /api/v1/lessons/{id}
   */
  deleteLesson: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`/lessons/${id}`, {
      contractKey: CONTRACT_KEYS.LESSON_DELETE,
    });
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
   * Request video upload URL (LESSON_GET_VIDEO_UPLOAD_URL)
   * Contract Key: LESSON_GET_VIDEO_UPLOAD_URL
   * Endpoint: GET /api/v1/lessons/{lessonId}/video/upload-url
   */
  requestUploadUrl: async (
    lessonId: number
  ): Promise<RequestUploadUrlResponse> => {
    const response = await axiosClient.get<
      ApiResponse<RequestUploadUrlResponse>
    >(`/lessons/${lessonId}/video/upload-url`, {
      contractKey: CONTRACT_KEYS.LESSON_GET_VIDEO_UPLOAD_URL,
    });

    return unwrapResponse(response);
  },

  /**
   * Complete video upload (LESSON_VIDEO_UPLOAD_COMPLETE_ACTION)
   * Contract Key: LESSON_VIDEO_UPLOAD_COMPLETE_ACTION
   * Endpoint: POST /api/v1/lessons/{lessonId}/video/upload-complete
   */
  uploadComplete: async (
    lessonId: number,
    payload: UpdateVideoRequest
  ): Promise<LessonResponse> => {
    const response = await axiosClient.post<ApiResponse<LessonResponse>>(
      `/lessons/${lessonId}/video/upload-complete`,
      payload,
      {
        contractKey: CONTRACT_KEYS.LESSON_VIDEO_UPLOAD_COMPLETE_ACTION,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get video streaming URL (LESSON_GET_VIDEO_STREAM_URL)
   * Contract Key: LESSON_GET_VIDEO_STREAM_URL
   * Endpoint: GET /api/v1/lessons/{lessonId}/video/stream-url
   */
  getVideoStreamingUrl: async (lessonId: number): Promise<string> => {
    const response = await axiosClient.get<ApiResponse<{ streamUrl: string }>>(
      `/lessons/${lessonId}/video/stream-url`,
      {
        contractKey: CONTRACT_KEYS.LESSON_GET_VIDEO_STREAM_URL,
      }
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
