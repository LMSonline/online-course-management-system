import { useQuery } from "@tanstack/react-query";
import { progressService } from "@/services/progress/progress.service";
import { CourseProgressResponse } from "@/services/progress/progress.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

interface UseCourseProgressQueryProps {
  studentId: number | null | undefined;
  courseId: number | null | undefined;
}

/**
 * Hook to fetch course progress for a student
 * Contract Key: PROGRESS_GET_COURSE
 * 
 * Requires studentId from authStore (hydrated via bootstrap)
 * Requires courseId from course detail
 */
export function useCourseProgress({
  studentId,
  courseId,
}: UseCourseProgressQueryProps) {
  return useQuery<CourseProgressResponse>({
    queryKey: [CONTRACT_KEYS.PROGRESS_GET_COURSE, { studentId, courseId }],
    queryFn: () => progressService.getCourseProgress(studentId!, courseId!),
    enabled: !!studentId && !!courseId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

