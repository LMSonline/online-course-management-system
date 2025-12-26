import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chapterService } from "@/services/courses/content/chapter.service";
import { lessonService } from "@/services/courses/content/lesson.service";
import { lessonResourceService } from "@/services/courses/content/lesson-resource.service";
import {
  ChapterRequest,
  ChapterReorderRequest,
  ChapterResponse,
} from "@/services/courses/content/chapter.types";
import {
  CreateLessonRequest,
  UpdateLessonRequest,
  UpdateVideoRequest,
  ReorderLessonsRequest,
  LessonResponse,
} from "@/services/courses/content/lesson.types";
import {
  LessonResourceRequest,
  ReorderResourcesRequest,
  LessonResourceResponse,
} from "@/services/courses/content/lesson-resource.types";

// ============== Chapter Hooks ==============

export const useChapters = (courseId: number, versionId: number) => {
  const queryClient = useQueryClient();

  const {
    data: chapters,
    isLoading,
    error,
    refetch,
  } = useQuery<ChapterResponse[]>({
    queryKey: ["chapters", courseId, versionId],
    queryFn: () => chapterService.getListChapters(courseId, versionId),
    enabled: !!courseId && !!versionId,
  });

  const createChapter = useMutation({
    mutationFn: (payload: ChapterRequest) =>
      chapterService.createChapter(courseId, versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, versionId],
      });
      toast.success("Chapter created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create chapter");
    },
  });

  const updateChapter = useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: number;
      payload: ChapterRequest;
    }) => chapterService.updateChapter(courseId, versionId, chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, versionId],
      });
      toast.success("Chapter updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update chapter");
    },
  });

  const deleteChapter = useMutation({
    mutationFn: (chapterId: number) =>
      chapterService.deleteChapter(courseId, versionId, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, versionId],
      });
      toast.success("Chapter deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete chapter");
    },
  });

  const reorderChapters = useMutation({
    mutationFn: (payload: ChapterReorderRequest) =>
      chapterService.reorderChapters(courseId, versionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, versionId],
      });
      toast.success("Chapters reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reorder chapters");
    },
  });

  return {
    chapters: chapters || [],
    isLoading,
    error,
    refetch,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
  };
};

// ============== Lesson Hooks ==============

export const useLessons = (chapterId: number) => {
  const queryClient = useQueryClient();

  const {
    data: lessons,
    isLoading,
    error,
    refetch,
  } = useQuery<LessonResponse[]>({
    queryKey: ["lessons", chapterId],
    queryFn: () => lessonService.getLessonsByChapter(chapterId),
    enabled: !!chapterId,
    refetchInterval: (query) => {
      // Auto-refresh every 5 seconds if there are lessons with UPLOADED or PROCESSING status
      const lessonData = query.state.data;
      const hasProcessingVideos = lessonData?.some(
        (lesson: LessonResponse) =>
          lesson.videoStatus === "UPLOADED" ||
          lesson.videoStatus === "PROCESSING"
      );
      return hasProcessingVideos ? 5000 : false;
    },
  });

  const createLesson = useMutation({
    mutationFn: (payload: CreateLessonRequest) =>
      lessonService.createLesson(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Lesson created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create lesson");
    },
  });

  const updateLesson = useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: number;
      payload: UpdateLessonRequest;
    }) => lessonService.updateLesson(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Lesson updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update lesson");
    },
  });

  const deleteLesson = useMutation({
    mutationFn: (lessonId: number) => lessonService.deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Lesson deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete lesson");
    },
  });

  const reorderLessons = useMutation({
    mutationFn: (payload: ReorderLessonsRequest) =>
      lessonService.reorderLessons(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Lessons reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reorder lessons");
    },
  });

  const uploadVideo = useMutation({
    mutationFn: async ({
      lessonId,
      file,
      onProgress,
    }: {
      lessonId: number;
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      // Step 1: Request presigned upload URL from backend
      toast.info("Requesting upload URL...");
      const { uploadUrl, objectKey } = await lessonService.requestUploadUrl(
        lessonId
      );

      // Step 2: Get video duration before upload
      const video = document.createElement("video");
      video.preload = "metadata";
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;

      const durationSeconds = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(videoUrl);
          resolve(Math.floor(video.duration));
        };
        video.onerror = () => {
          URL.revokeObjectURL(videoUrl);
          resolve(0);
        };
      });

      // Step 3: Upload video directly to MinIO using presigned URL
      toast.info("Uploading video to storage...");
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () =>
          reject(new Error("Network error during upload"))
        );
        xhr.addEventListener("abort", () =>
          reject(new Error("Upload cancelled"))
        );

        xhr.send(file);
      });

      // Step 4: Notify backend that upload is complete (triggers video processing)
      toast.info("Processing video...");
      return lessonService.uploadComplete(lessonId, {
        objectKey,
        durationSeconds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success(
        "Video uploaded successfully! Processing will complete shortly."
      );
    },
    onError: (error: any) => {
      console.error("Video upload error:", error);
      toast.error(error?.message || "Failed to upload video");
    },
  });

  const deleteVideo = useMutation({
    mutationFn: (lessonId: number) => lessonService.deleteVideo(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
      toast.success("Video deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete video");
    },
  });

  return {
    lessons: lessons || [],
    isLoading,
    error,
    refetch,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    uploadVideo,
    deleteVideo,
  };
};

// ============== Resource Hooks ==============

export const useResources = (lessonId: number) => {
  const queryClient = useQueryClient();

  const {
    data: resources,
    isLoading,
    error,
    refetch,
  } = useQuery<LessonResourceResponse[]>({
    queryKey: ["resources", lessonId],
    queryFn: () => lessonResourceService.getLessonResources(lessonId),
    enabled: !!lessonId,
  });

  const addFileResource = useMutation({
    mutationFn: ({
      file,
      title,
      description,
      isRequired,
    }: {
      file: File;
      title?: string;
      description?: string;
      isRequired?: boolean;
    }) =>
      lessonResourceService.addFileResource(
        lessonId,
        file,
        title,
        description,
        isRequired
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", lessonId] });
      toast.success("Resource added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add resource");
    },
  });

  const addLinkResource = useMutation({
    mutationFn: (payload: LessonResourceRequest) =>
      lessonResourceService.addLinkResource(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", lessonId] });
      toast.success("Resource added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add resource");
    },
  });

  const updateResource = useMutation({
    mutationFn: ({
      resourceId,
      payload,
    }: {
      resourceId: number;
      payload: LessonResourceRequest;
    }) => lessonResourceService.updateResource(lessonId, resourceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", lessonId] });
      toast.success("Resource updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update resource");
    },
  });

  const deleteResource = useMutation({
    mutationFn: (resourceId: number) =>
      lessonResourceService.deleteResource(lessonId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", lessonId] });
      toast.success("Resource deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete resource");
    },
  });

  const reorderResources = useMutation({
    mutationFn: (payload: ReorderResourcesRequest) =>
      lessonResourceService.reorderResources(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", lessonId] });
      toast.success("Resources reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reorder resources");
    },
  });

  return {
    resources: resources || [],
    isLoading,
    error,
    refetch,
    addFileResource,
    addLinkResource,
    updateResource,
    deleteResource,
    reorderResources,
  };
};
