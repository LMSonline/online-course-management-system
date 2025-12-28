import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chapterService } from "@/services/courses/content/chapter.service";
import { lessonService } from "@/services/courses/content/lesson.service";
import {
  ChapterRequest,
  ChapterResponse,
} from "@/services/courses/content/chapter.types";
import {
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonResponse,
} from "@/services/courses/content/lesson.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to create chapter
 * Contract Key: CHAPTER_CREATE
 */
export function useCreateChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ChapterResponse,
    Error,
    { courseId: number; versionId: number; payload: ChapterRequest }
  >({
    mutationFn: ({ courseId, versionId, payload }) =>
      chapterService.createChapter(courseId, versionId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.CHAPTER_GET_LIST, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      toast.success("Chapter created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create chapter");
    },
  });
}

/**
 * Hook to update chapter
 * Contract Key: CHAPTER_UPDATE
 */
export function useUpdateChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ChapterResponse,
    Error,
    { courseId: number; versionId: number; chapterId: number; payload: ChapterRequest }
  >({
    mutationFn: ({ courseId, versionId, chapterId, payload }) =>
      chapterService.updateChapter(courseId, versionId, chapterId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.CHAPTER_GET_LIST, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      toast.success("Chapter updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update chapter");
    },
  });
}

/**
 * Hook to delete chapter
 * Contract Key: CHAPTER_DELETE
 */
export function useDeleteChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { courseId: number; versionId: number; chapterId: number }
  >({
    mutationFn: ({ courseId, versionId, chapterId }) =>
      chapterService.deleteChapter(courseId, versionId, chapterId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.CHAPTER_GET_LIST, { courseId: variables.courseId, versionId: variables.versionId }],
      });
      toast.success("Chapter deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete chapter");
    },
  });
}

/**
 * Hook to create lesson
 * Contract Key: LESSON_CREATE
 */
export function useCreateLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation<LessonResponse, Error, { chapterId: number; payload: CreateLessonRequest }>({
    mutationFn: ({ chapterId, payload }) => lessonService.createLesson(chapterId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.LESSON_GET_BY_CHAPTER, { chapterId: variables.chapterId }],
      });
      toast.success("Lesson created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lesson");
    },
  });
}

/**
 * Hook to update lesson
 * Contract Key: LESSON_UPDATE
 */
export function useUpdateLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    LessonResponse,
    Error,
    { lessonId: number; payload: UpdateLessonRequest }
  >({
    mutationFn: ({ lessonId, payload }) => lessonService.updateLesson(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.LESSON_GET_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.LESSON_GET_BY_CHAPTER] });
      toast.success("Lesson updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });
}

/**
 * Hook to delete lesson
 * Contract Key: LESSON_DELETE
 */
export function useDeleteLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (lessonId: number) => lessonService.deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.LESSON_GET_BY_CHAPTER] });
      toast.success("Lesson deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });
}

