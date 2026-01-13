import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CourseVersionResponse } from "@/services/courses/course.types";

export const learnerCourseVersionService = {
  /**
   * Get published version of a course by slug (Public)
   */
  getPublishedVersionBySlug: async (courseSlug: string): Promise<CourseVersionResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseVersionResponse>>(
      `/public/courses/${courseSlug}/version/published`
    );
    return unwrapResponse(response);
  },

  /**
   * Get published version details by courseId & versionId (Public)
   */
  getPublicCourseVersionById: async (
    courseId: number,
    versionId: number
  ): Promise<CourseVersionResponse> => {
    const response = await axiosClient.get<ApiResponse<CourseVersionResponse>>(
      `/public/courses/${courseId}/versions/${versionId}`
    );
    return unwrapResponse(response);
  },
};
