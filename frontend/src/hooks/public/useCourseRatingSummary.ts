import { useQuery } from "@tanstack/react-query";
import { courseReviewService } from "@/services/courses/course-review.service";
import { RatingSummaryResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch course rating summary
 * Contract Key: REVIEW_GET_RATING_SUMMARY
 * 
 * Note: Requires courseId (not slug). Use with useCourseDetail to get courseId first.
 */
export function useCourseRatingSummary(courseId: number | undefined) {
  return useQuery<RatingSummaryResponse>({
    queryKey: [CONTRACT_KEYS.REVIEW_GET_RATING_SUMMARY, courseId],
    queryFn: () => courseReviewService.getRatingSummary(courseId!),
    enabled: !!courseId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

