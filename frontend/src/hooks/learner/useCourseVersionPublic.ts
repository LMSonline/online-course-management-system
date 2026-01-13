import { useQuery } from "@tanstack/react-query";
import { learnerCourseVersionService } from "@/services/learner/course-version.service";
import { CourseVersionResponse } from "@/services/courses/course.types";

/**
 * Hook: Lấy version đã publish của course theo slug (public)
 */
export function usePublishedCourseVersionBySlug(courseSlug: string, options?: any) {
  return useQuery<CourseVersionResponse>({
    queryKey: ["published-course-version", courseSlug],
    queryFn: () => learnerCourseVersionService.getPublishedVersionBySlug(courseSlug),
    ...options,
    enabled: !!courseSlug && (options?.enabled ?? true),
  });
}

/**
 * Hook: Lấy version đã publish của course theo courseId & versionId (public)
 */
export function usePublicCourseVersionById(courseId: number, versionId: number, options?: any) {
  return useQuery<CourseVersionResponse>({
    queryKey: ["public-course-version", courseId, versionId],
    queryFn: () => learnerCourseVersionService.getPublicCourseVersionById(courseId, versionId),
    ...options,
    enabled: !!courseId && !!versionId && (options?.enabled ?? true),
  });
}
