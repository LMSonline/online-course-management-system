import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/courses/content/lesson.service";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch lesson detail
 * Contract Key: LESSON_GET_BY_ID
 */
export function useLessonDetail(lessonId: number | null | undefined) {
  return useQuery<LessonResponse>({
    queryKey: [CONTRACT_KEYS.LESSON_GET_BY_ID, lessonId],
    queryFn: () => lessonService.getLessonById(lessonId!),
    enabled: !!lessonId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

