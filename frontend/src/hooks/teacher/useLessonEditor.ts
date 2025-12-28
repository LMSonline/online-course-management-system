import { useState, useEffect, useCallback } from "react";
import { lessonService } from "@/services/courses/content/lesson.service";
import { lessonResourceService } from "@/services/courses/content/lesson-resource.service";
import { fileStorageService } from "@/services/courses/content/file-storage.service";
import {
  LessonResponse,
  UpdateLessonRequest,
} from "@/services/courses/content/lesson.types";
import {
  LessonResourceRequest,
  LessonResourceResponse,
} from "@/services/courses/content/lesson-resource.types";

interface UseLessonEditorOptions {
  lessonId: number | null;
  autoLoad?: boolean;
}

export function useLessonEditor({
  lessonId,
  autoLoad = true,
}: UseLessonEditorOptions) {
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [resources, setResources] = useState<LessonResourceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lesson details
  const loadLesson = useCallback(async () => {
    if (!lessonId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getLessonById(lessonId);
      setLesson(data);
    } catch (err: any) {
      setError(err.message || "Failed to load lesson");
      console.error("Failed to load lesson:", err);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  // Load lesson resources
  const loadResources = useCallback(async () => {
    if (!lessonId) return;

    try {
      const data = await lessonResourceService.getLessonResources(lessonId);
      setResources(data);
    } catch (err: any) {
      console.error("Failed to load resources:", err);
    }
  }, [lessonId]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && lessonId) {
      loadLesson();
      loadResources();
    }
  }, [autoLoad, lessonId, loadLesson, loadResources]);

  // Update lesson
  const updateLesson = useCallback(
    async (payload: UpdateLessonRequest) => {
      if (!lessonId) return;

      try {
        setSaving(true);
        setError(null);
        const updated = await lessonService.updateLesson(lessonId, payload);
        setLesson(updated);
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update lesson");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [lessonId]
  );

  // Resource operations
  const addResource = useCallback(
    async (payload: LessonResourceRequest) => {
      if (!lessonId) return;

      try {
        setSaving(true);
        setError(null);
        const newResource = await lessonResourceService.addLinkResource(
          lessonId,
          payload
        );
        setResources((prev) => [...prev, newResource]);
        return newResource;
      } catch (err: any) {
        setError(err.message || "Failed to add resource");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [lessonId]
  );

  const updateResource = useCallback(
    async (resourceId: number, payload: LessonResourceRequest) => {
      if (!lessonId) return;

      try {
        setSaving(true);
        setError(null);
        const updated = await lessonResourceService.updateResource(
          lessonId,
          resourceId,
          payload
        );
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === resourceId ? updated : resource
          )
        );
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update resource");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [lessonId]
  );

  const deleteResource = useCallback(
    async (resourceId: number) => {
      if (!lessonId) return;

      try {
        setSaving(true);
        setError(null);
        await lessonResourceService.deleteResource(lessonId, resourceId);
        setResources((prev) =>
          prev.filter((resource) => resource.id !== resourceId)
        );
      } catch (err: any) {
        setError(err.message || "Failed to delete resource");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [lessonId]
  );

  // File upload
  const uploadFile = useCallback(async (file: File) => {
    try {
      setSaving(true);
      setError(null);
      const uploaded = await fileStorageService.uploadFile(file);
      return uploaded;
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    lesson,
    resources,
    loading,
    saving,
    error,
    refresh: loadLesson,
    refreshResources: loadResources,
    updateLesson,
    addResource,
    updateResource,
    deleteResource,
    uploadFile,
  };
}
