import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { CourseDetailResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch course detail by slug
 * Contract Key: COURSE_GET_DETAIL
 */
export function useCourseDetail(slug: string) {
  return useQuery<CourseDetailResponse>({
    queryKey: [CONTRACT_KEYS.COURSE_GET_DETAIL, slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

