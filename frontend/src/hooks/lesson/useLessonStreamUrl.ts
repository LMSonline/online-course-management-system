import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/courses/content/lesson.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch lesson video stream URL
 * Contract Key: LESSON_GET_VIDEO_STREAM_URL
 */
export function useLessonStreamUrl(lessonId: number | null | undefined) {
  return useQuery<string>({
    queryKey: [CONTRACT_KEYS.LESSON_GET_VIDEO_STREAM_URL, lessonId],
    queryFn: () => lessonService.getVideoStreamingUrl(lessonId!),
    enabled: !!lessonId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

