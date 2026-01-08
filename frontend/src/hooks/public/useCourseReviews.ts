import { useQuery } from "@tanstack/react-query";
import { courseReviewService } from "@/services/courses/course-review.service";
import { CourseReviewResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { PageResponse } from "@/lib/api/api.types";

/**
 * Hook to fetch course reviews
 * Contract Key: REVIEW_GET_COURSE_LIST
 * 
 * Note: Requires courseId (not slug). Use with useCourseDetail to get courseId first.
 */
export function useCourseReviews(
  courseId: number | undefined,
  page?: number,
  size?: number
) {
  return useQuery<PageResponse<CourseReviewResponse>>({
    queryKey: [CONTRACT_KEYS.REVIEW_GET_COURSE_LIST, courseId, page, size],
    queryFn: () => courseReviewService.getCourseReviews(courseId!, page, size),
    enabled: !!courseId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

