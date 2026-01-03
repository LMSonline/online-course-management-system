import { useQuery } from "@tanstack/react-query";
import { courseVersionService } from "@/services/courses/course-version.service";
import { CourseVersionResponse } from "@/services/courses/course.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch course versions
 * Contract Key: VERSION_GET_LIST
 */
export function useCourseVersionsQuery(courseId: number | null | undefined) {
  return useQuery<CourseVersionResponse[]>({
    queryKey: [CONTRACT_KEYS.VERSION_GET_LIST, { courseId }],
    queryFn: () => courseVersionService.getCourseVersions(courseId!),
    enabled: !!courseId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch version detail
 * Contract Key: VERSION_GET_DETAIL
 */
export function useVersionDetailQuery(
  courseId: number | null | undefined,
  versionId: number | null | undefined
) {
  return useQuery<CourseVersionResponse>({
    queryKey: [CONTRACT_KEYS.VERSION_GET_DETAIL, { courseId, versionId }],
    queryFn: () => courseVersionService.getCourseVersionById(courseId!, versionId!),
    enabled: !!courseId && !!versionId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

