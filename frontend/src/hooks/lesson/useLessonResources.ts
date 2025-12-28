import { useQuery } from "@tanstack/react-query";
import { lessonResourceService } from "@/services/courses/content/lesson-resource.service";
import { LessonResourceResponse } from "@/services/courses/content/lesson-resource.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch lesson resources
 * Contract Key: RESOURCE_GET_BY_LESSON
 */
export function useLessonResources(lessonId: number | null | undefined) {
  return useQuery<LessonResourceResponse[]>({
    queryKey: [CONTRACT_KEYS.RESOURCE_GET_BY_LESSON, lessonId],
    queryFn: () => lessonResourceService.getLessonResources(lessonId!),
    enabled: !!lessonId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

