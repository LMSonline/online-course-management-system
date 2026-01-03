import { useQuery } from "@tanstack/react-query";
import { chapterService } from "@/services/courses/content/chapter.service";
import { ChapterResponse } from "@/services/courses/content/chapter.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";

/**
 * Hook to fetch course curriculum (chapters) for public preview
 * Contract Key: CHAPTER_GET_LIST
 * 
 * Note: Requires courseId and versionId. Use with useCourseDetail to get PublicVersionId.
 * This may require authentication - if so, it will fail gracefully in DEMO_MODE.
 */
export function useCourseCurriculum(
  courseId: number | undefined,
  versionId: number | undefined
) {
  return useQuery<ChapterResponse[]>({
    queryKey: [CONTRACT_KEYS.CHAPTER_GET_LIST, courseId, versionId],
    queryFn: () => chapterService.getListChapters(courseId!, versionId!),
    enabled: !!courseId && !!versionId && !DEMO_MODE, // Disable in DEMO_MODE (may require auth)
    staleTime: 60_000, // 1 minute
    retry: 0, // Don't retry if it fails (likely auth required)
    refetchOnWindowFocus: false,
  });
}

