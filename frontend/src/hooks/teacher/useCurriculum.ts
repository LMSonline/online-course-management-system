import { useState, useEffect, useCallback } from "react";
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

interface ReorderChaptersRequest {
  chapterOrders: { chapterId: number; orderIndex: number }[];
}

interface ReorderLessonsRequest {
  lessonOrders: { lessonId: number; orderIndex: number }[];
}

interface UseCurriculumOptions {
  courseId: number;
  versionId: number;
  autoLoad?: boolean;
}

export function useCurriculum({
  courseId,
  versionId,
  autoLoad = true,
}: UseCurriculumOptions) {
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [lessons, setLessons] = useState<Record<number, LessonResponse[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Load chapters
  const loadChapters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chapterService.getListChapters(courseId, versionId);
      setChapters(data);
    } catch (err: any) {
      setError(err.message || "Failed to load chapters");
      console.error("Failed to load chapters:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId, versionId]);

  // Load chapters on mount
  useEffect(() => {
    if (autoLoad && versionId) {
      loadChapters();
    }
  }, [autoLoad, versionId, loadChapters]);

  // Load lessons for a chapter
  const loadLessonsByChapter = useCallback(async (chapterId: number) => {
    try {
      const data = await lessonService.getLessonsByChapter(chapterId);
      setLessons((prev) => ({ ...prev, [chapterId]: data }));
      return data;
    } catch (err: any) {
      console.error("Failed to load lessons:", err);
      return [];
    }
  }, []);

  // Chapter operations
  const createChapter = useCallback(
    async (payload: ChapterRequest) => {
      try {
        setLoading(true);
        setError(null);
        const newChapter = await chapterService.createChapter(
          courseId,
          versionId,
          payload
        );
        setChapters((prev) => [...prev, newChapter]);
        return newChapter;
      } catch (err: any) {
        setError(err.message || "Failed to create chapter");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [courseId, versionId]
  );

  const updateChapter = useCallback(
    async (id: number, payload: ChapterRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await chapterService.updateChapter(
          courseId,
          versionId,
          id,
          payload
        );
        setChapters((prev) =>
          prev.map((chapter) => (chapter.id === id ? updated : chapter))
        );
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update chapter");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [courseId, versionId]
  );

  const deleteChapter = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await chapterService.deleteChapter(courseId, versionId, id);
        setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
        if (selectedChapterId === id) {
          setSelectedChapterId(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete chapter");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [courseId, versionId, selectedChapterId]
  );

  const reorderChapters = useCallback(
    async (chapterOrders: ReorderChaptersRequest) => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implement reorder API
        // await chapterService.reorderChapters(versionId, chapterOrders);
        await loadChapters();
      } catch (err: any) {
        setError(err.message || "Failed to reorder chapters");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [versionId, loadChapters]
  );

  // Lesson operations
  const createLesson = useCallback(
    async (chapterId: number, payload: CreateLessonRequest) => {
      try {
        setLoading(true);
        setError(null);
        const newLesson = await lessonService.createLesson(chapterId, payload);
        await loadChapters(); // Reload to update lesson counts
        return newLesson;
      } catch (err: any) {
        setError(err.message || "Failed to create lesson");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadChapters]
  );

  const updateLesson = useCallback(
    async (id: number, payload: UpdateLessonRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await lessonService.updateLesson(id, payload);
        await loadChapters(); // Reload to reflect changes
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update lesson");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadChapters]
  );

  const deleteLesson = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await lessonService.deleteLesson(id);
        if (selectedLessonId === id) {
          setSelectedLessonId(null);
        }
        await loadChapters(); // Reload to update lesson counts
      } catch (err: any) {
        setError(err.message || "Failed to delete lesson");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedLessonId, loadChapters]
  );

  const reorderLessons = useCallback(
    async (chapterId: number, lessonOrders: ReorderLessonsRequest) => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implement reorder API
        // await lessonService.reorderLessons(chapterId, lessonOrders);
        await loadChapters();
      } catch (err: any) {
        setError(err.message || "Failed to reorder lessons");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadChapters]
  );

  return {
    chapters,
    lessons,
    loading,
    error,
    selectedChapterId,
    selectedLessonId,
    setSelectedChapterId,
    setSelectedLessonId,
    refresh: loadChapters,
    loadLessonsByChapter,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
  };
}
