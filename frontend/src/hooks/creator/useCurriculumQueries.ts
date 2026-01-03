import { useQuery } from "@tanstack/react-query";
import { chapterService } from "@/services/courses/content/chapter.service";
import { lessonService } from "@/services/courses/content/lesson.service";
import { ChapterResponse } from "@/services/courses/content/chapter.types";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch chapters
 * Contract Key: CHAPTER_GET_LIST
 */
export function useChaptersQuery(
  courseId: number | null | undefined,
  versionId: number | null | undefined
) {
  return useQuery<ChapterResponse[]>({
    queryKey: [CONTRACT_KEYS.CHAPTER_GET_LIST, { courseId, versionId }],
    queryFn: () => chapterService.getListChapters(courseId!, versionId!),
    enabled: !!courseId && !!versionId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch lessons by chapter
 * Contract Key: LESSON_GET_BY_CHAPTER
 */
export function useLessonsQuery(chapterId: number | null | undefined) {
  return useQuery<LessonResponse[]>({
    queryKey: [CONTRACT_KEYS.LESSON_GET_BY_CHAPTER, { chapterId }],
    queryFn: () => lessonService.getLessonsByChapter(chapterId!),
    enabled: !!chapterId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

