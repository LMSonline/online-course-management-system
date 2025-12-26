import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  LessonResourceRequest,
  ReorderResourcesRequest,
  LessonResourceResponse,
} from "./lesson-resource.types";

export const lessonResourceService = {
  /**
   * Add file resource to lesson (Teacher only)
   */
  addFileResource: async (
    lessonId: number,
    file: File,
    title?: string,
    description?: string,
    isRequired?: boolean
  ): Promise<LessonResourceResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (isRequired !== undefined)
      formData.append("isRequired", String(isRequired));

    const response = await axiosClient.post<
      ApiResponse<LessonResourceResponse>
    >(`/lessons/${lessonId}/resources/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Add link/embed resource to lesson (Teacher only)
   */
  addLinkResource: async (
    lessonId: number,
    payload: LessonResourceRequest
  ): Promise<LessonResourceResponse> => {
    const response = await axiosClient.post<
      ApiResponse<LessonResourceResponse>
    >(`/lessons/${lessonId}/resources`, payload);

    return unwrapResponse(response);
  },

  /**
   * Get all resources for a lesson
   */
  getLessonResources: async (
    lessonId: number
  ): Promise<LessonResourceResponse[]> => {
    const response = await axiosClient.get<
      ApiResponse<LessonResourceResponse[]>
    >(`/lessons/${lessonId}/resources`);

    return unwrapResponse(response);
  },

  /**
   * Get resource details
   */
  getResourceById: async (
    lessonId: number,
    resourceId: number
  ): Promise<LessonResourceResponse> => {
    const response = await axiosClient.get<ApiResponse<LessonResourceResponse>>(
      `/lessons/${lessonId}/resources/${resourceId}`
    );

    return unwrapResponse(response);
  },

  /**
   * Update resource (Teacher only)
   */
  updateResource: async (
    lessonId: number,
    resourceId: number,
    payload: LessonResourceRequest
  ): Promise<LessonResourceResponse> => {
    const response = await axiosClient.put<ApiResponse<LessonResourceResponse>>(
      `/lessons/${lessonId}/resources/${resourceId}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Replace resource file (Teacher only)
   */
  replaceResourceFile: async (
    lessonId: number,
    resourceId: number,
    file: File
  ): Promise<LessonResourceResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.put<ApiResponse<LessonResourceResponse>>(
      `/lessons/${lessonId}/resources/${resourceId}/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete resource (Teacher only)
   */
  deleteResource: async (
    lessonId: number,
    resourceId: number
  ): Promise<void> => {
    await axiosClient.delete<void>(
      `/lessons/${lessonId}/resources/${resourceId}`
    );
  },

  /**
   * Reorder resources (Teacher only)
   */
  reorderResources: async (
    lessonId: number,
    payload: ReorderResourcesRequest
  ): Promise<void> => {
    await axiosClient.post<void>(
      `/lessons/${lessonId}/resources/reorder`,
      payload
    );
  },
};
