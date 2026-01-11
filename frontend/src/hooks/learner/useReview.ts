// Hooks liên quan đến review cho learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerReviewService } from '../../services/learner/reviewService';
import { Review, ReviewListResponse, RatingSummary } from '../../lib/learner/review/reviews';

/**
 * Lấy danh sách review public cho khoá học
 */
export function usePublicReviews(courseId: number, params?: Record<string, any>) {
  return useQuery<ReviewListResponse>({
    queryKey: ['learner-public-reviews', courseId, params],
    queryFn: () => learnerReviewService.getPublicReviews(courseId, params),
    enabled: !!courseId,
  });
}

/**
 * Lấy rating summary public cho khoá học
 */
export function usePublicRatingSummary(courseId: number) {
  return useQuery<RatingSummary>({
    queryKey: ['learner-public-rating-summary', courseId],
    queryFn: () => learnerReviewService.getPublicRatingSummary(courseId),
    enabled: !!courseId,
  });
}

/**
 * Lấy danh sách review (multi-role)
 */
export function useReviews(courseId: number, params?: Record<string, any>) {
  return useQuery<ReviewListResponse>({
    queryKey: ['learner-reviews', courseId, params],
    queryFn: () => learnerReviewService.getReviews(courseId, params),
    enabled: !!courseId,
  });
}

/**
 * Lấy rating summary (multi-role)
 */
export function useRatingSummary(courseId: number) {
  return useQuery<RatingSummary>({
    queryKey: ['learner-rating-summary', courseId],
    queryFn: () => learnerReviewService.getRatingSummary(courseId),
    enabled: !!courseId,
  });
}

/**
 * Tạo review mới (chỉ student)
 */
export function useCreateReview(courseId: number) {
  return useMutation({
    mutationFn: (payload: Partial<Review>) => learnerReviewService.createReview(courseId, payload),
  });
}

/**
 * Cập nhật review (chỉ student)
 */
export function useUpdateReview(courseId: number, reviewId: number) {
  return useMutation({
    mutationFn: (payload: Partial<Review>) => learnerReviewService.updateReview(courseId, reviewId, payload),
  });
}

/**
 * Xoá review (chỉ student)
 */
export function useDeleteReview(courseId: number, reviewId: number) {
  return useMutation({
    mutationFn: () => learnerReviewService.deleteReview(courseId, reviewId),
  });
}
