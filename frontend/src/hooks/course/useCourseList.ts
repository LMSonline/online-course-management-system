import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { PageResponse, CourseResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { stableParams } from "@/lib/react-query/stableParams";

export interface CourseListParams {
  page?: number;
  size?: number;
  q?: string;
  sort?: string;
  category?: string;
  filter?: string;
}

/**
 * Hook to fetch course list
 * Contract Key: COURSE_GET_LIST
 */
export function useCourseList(params?: CourseListParams) {
  const stable = stableParams(params || {});
  
  return useQuery<PageResponse<CourseResponse>>({
    queryKey: [CONTRACT_KEYS.COURSE_GET_LIST, stable],
    queryFn: () => courseService.getCoursesActive(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

