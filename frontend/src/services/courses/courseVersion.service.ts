import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import type { CourseVersionResponse } from "./course.types";

const COURSE_PREFIX = "/courses";

export const courseVersionService = {
  /**
   * Get all versions of a course
   * Endpoint: GET /api/v1/courses/{courseId}/versions
   */
  getCourseVersions: async (courseId: number): Promise<CourseVersionResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CourseVersionResponse[]>>(
      `${COURSE_PREFIX}/${courseId}/versions`,
      // No contractKey needed for this endpoint, remove contractKey
    );
    return unwrapResponse(response);
  },
};
