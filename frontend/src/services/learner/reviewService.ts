// ReviewService for learner (student)
// API public: /api/v1/public/courses/{courseId}/reviews, /public/courses/{courseId}/rating-summary
// API multi-role: /api/v1/courses/{courseId}/reviews, /courses/{courseId}/rating-summary
// API chỉ student: POST/PUT/DELETE /api/v1/courses/{courseId}/reviews

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Review, ReviewListResponse, RatingSummary } from '@/lib/learner/review/reviews';

export const learnerReviewService = {
  /**
   * Lấy danh sách review public cho khoá học
   */
  getPublicReviews: async (courseId: number, params?: Record<string, any>): Promise<ReviewListResponse> => {
    const response = await axiosClient.get(`/public/courses/${courseId}/reviews`, { params });
    return unwrapResponse(response);
  },

  /**
   * Lấy rating summary public cho khoá học
   */
  getPublicRatingSummary: async (courseId: number): Promise<RatingSummary> => {
    const response = await axiosClient.get(`/public/courses/${courseId}/rating-summary`);
    return unwrapResponse(response);
  },

  /**
   * Lấy danh sách review (multi-role, có phân trang)
   */
  getReviews: async (courseId: number, params?: Record<string, any>): Promise<ReviewListResponse> => {
    const response = await axiosClient.get(`/courses/${courseId}/reviews`, { params });
    return unwrapResponse(response);
  },

  /**
   * Lấy rating summary (multi-role)
   */
  getRatingSummary: async (courseId: number): Promise<RatingSummary> => {
    const response = await axiosClient.get(`/courses/${courseId}/rating-summary`);
    return unwrapResponse(response);
  },

  /**
   * Tạo review mới (chỉ student)
   */
  createReview: async (courseId: number, payload: Partial<Review>): Promise<Review> => {
    const response = await axiosClient.post(`/courses/${courseId}/reviews`, payload);
    return unwrapResponse(response);
  },

  /**
   * Cập nhật review (chỉ student)
   */
  updateReview: async (courseId: number, reviewId: number, payload: Partial<Review>): Promise<Review> => {
    const response = await axiosClient.put(`/courses/${courseId}/reviews/${reviewId}`, payload);
    return unwrapResponse(response);
  },

  /**
   * Xoá review (chỉ student)
   */
  deleteReview: async (courseId: number, reviewId: number): Promise<void> => {
    await axiosClient.delete(`/courses/${courseId}/reviews/${reviewId}`);
  },
};
