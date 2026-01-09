import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseReviewService } from "@/services/courses/course-review.service";
import { CourseReviewRequest, CourseReviewResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to create review
 * Contract Key: REVIEW_CREATE
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<CourseReviewResponse, Error, { courseId: number; payload: CourseReviewRequest }>({
    mutationFn: ({ courseId, payload }) => courseReviewService.createReview(courseId, payload),
    onSuccess: (data, variables) => {
      // Invalidate rating summary and reviews list
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_RATING_SUMMARY, { courseId: variables.courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_COURSE_LIST, { courseId: variables.courseId }],
      });
      toast.success("Review posted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post review");
    },
  });
}

/**
 * Hook to update review
 * Contract Key: REVIEW_UPDATE
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation<
    CourseReviewResponse,
    Error,
    { courseId: number; reviewId: number; payload: CourseReviewRequest }
  >({
    mutationFn: ({ courseId, reviewId, payload }) =>
      courseReviewService.updateReview(courseId, reviewId, payload),
    onSuccess: (data, variables) => {
      // Invalidate rating summary and reviews list
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_RATING_SUMMARY, { courseId: variables.courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_COURSE_LIST, { courseId: variables.courseId }],
      });
      toast.success("Review updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

/**
 * Hook to delete review
 * Contract Key: REVIEW_DELETE
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { courseId: number; reviewId: number }>({
    mutationFn: ({ courseId, reviewId }) => courseReviewService.deleteReview(courseId, reviewId),
    onSuccess: (data, variables) => {
      // Invalidate rating summary and reviews list
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_RATING_SUMMARY, { courseId: variables.courseId }],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.REVIEW_GET_COURSE_LIST, { courseId: variables.courseId }],
      });
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}

