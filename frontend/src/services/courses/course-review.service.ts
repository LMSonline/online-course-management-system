import{  CourseReviewRequest,
  CourseReviewResponse,
  RatingSummaryResponse, } from "./course.types";
import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
export const courseReviewService = {
  /**
   * Create a new review (Student only)
   */
  createReview: async (
    courseId: number,
    payload: CourseReviewRequest
  ): Promise<CourseReviewResponse> => {
    const response = await axiosClient.post<ApiResponse<CourseReviewResponse>>(
      `/courses/${courseId}/reviews`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get course reviews
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
    });

    return unwrapResponse(response);
  },

  /**
   * Update a review (Student only)
   */
  updateReview: async (
    courseId: number,
    reviewId: number,
    payload: CourseReviewRequest
  ): Promise<CourseReviewResponse> => {
    const response = await axiosClient.put<ApiResponse<CourseReviewResponse>>(
      `/courses/${courseId}/reviews/${reviewId}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a review (Student only)
   */
  deleteReview: async (courseId: number, reviewId: number): Promise<void> => {
    await axiosClient.delete<void>(`/courses/${courseId}/reviews/${reviewId}`);
  },

  /**
   * Get course rating summary
   */
  getRatingSummary: async (
    courseId: number
  ): Promise<RatingSummaryResponse> => {
    const response = await axiosClient.get<ApiResponse<RatingSummaryResponse>>(
      `/courses/${courseId}/rating-summary`
    );

    return unwrapResponse(response);
  },
};