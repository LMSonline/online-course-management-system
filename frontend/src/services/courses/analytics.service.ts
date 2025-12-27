import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CourseAnalyticsResponse, AnalyticsDateRange } from "./analytics.types";

const TEACHER_ANALYTICS_PREFIX = "/teacher/analytics";

export const analyticsService = {
  /**
   * Get course analytics (Teacher only)
   * TODO: Update endpoint when backend is ready
   */
  getCourseAnalytics: async (
    courseId: number,
    dateRange?: AnalyticsDateRange
  ): Promise<CourseAnalyticsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<CourseAnalyticsResponse>
    >(`${TEACHER_ANALYTICS_PREFIX}/course/${courseId}`, {
      params: dateRange,
    });
    return unwrapResponse(response);
  },

  /**
   * Export analytics report (Teacher only)
   * TODO: Update endpoint when backend is ready
   */
  exportAnalyticsReport: async (
    courseId: number,
    format: "PDF" | "CSV" = "PDF",
    dateRange?: AnalyticsDateRange
  ): Promise<Blob> => {
    const response = await axiosClient.get(
      `${TEACHER_ANALYTICS_PREFIX}/course/${courseId}/export`,
      {
        params: {
          format,
          ...dateRange,
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
};
