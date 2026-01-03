import { CourseReviewRequest,
  CourseReviewResponse,
  RatingSummaryResponse } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

export const courseReviewService = {
  /**
   * Create a new review (REVIEW_CREATE)
   * Contract Key: REVIEW_CREATE
   * Endpoint: POST /api/v1/courses/{courseId}/reviews
   */
  createReview: async (
    courseId: number,
    payload: CourseReviewRequest
  ): Promise<CourseReviewResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseReviewResponse>>(
      `/courses/${courseId}/reviews`,
      payload,
      {
        contractKey: CONTRACT_KEYS.REVIEW_CREATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get course reviews
   * Contract Key: REVIEW_GET_COURSE_LIST
   */
  getCourseReviews: async (
    courseId: number,
    page?: number,
    size?: number
  ): Promise<PageResponse<CourseReviewResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<CourseReviewResponse>>
    >(`/courses/${courseId}/reviews`, {
      params: { page, size },
      contractKey: CONTRACT_KEYS.REVIEW_GET_COURSE_LIST,
    });

    return unwrapResponse(response);
  },

  /**
   * Update a review (REVIEW_UPDATE)
   * Contract Key: REVIEW_UPDATE
   * Endpoint: PUT /api/v1/courses/{courseId}/reviews/{reviewId}
   */
  updateReview: async (
    courseId: number,
    reviewId: number,
    payload: CourseReviewRequest
  ): Promise<CourseReviewResponse> => {
    const response = await axiosClient.put<ApiResponse<CourseReviewResponse>>(
      `/courses/${courseId}/reviews/${reviewId}`,
      payload,
      {
        contractKey: CONTRACT_KEYS.REVIEW_UPDATE,
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a review (REVIEW_DELETE)
   * Contract Key: REVIEW_DELETE
   * Endpoint: DELETE /api/v1/courses/{courseId}/reviews/{reviewId}
   */
  deleteReview: async (courseId: number, reviewId: number): Promise<void> => {
    await axiosClient.delete<void>(`/courses/${courseId}/reviews/${reviewId}`, {
      contractKey: CONTRACT_KEYS.REVIEW_DELETE,
    });
  },

  /**
   * Get course rating summary
   * Contract Key: REVIEW_GET_RATING_SUMMARY
   */
  getRatingSummary: async (
    courseId: number
  ): Promise<RatingSummaryResponse> => {
    const response = await axiosClient.get<ApiResponse<RatingSummaryResponse>>(
      `/courses/${courseId}/rating-summary`,
      {
        contractKey: CONTRACT_KEYS.REVIEW_GET_RATING_SUMMARY,
      }
    );

    return unwrapResponse(response);
  },
};