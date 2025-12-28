import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/services/courses/content/lesson.service";
import { LessonResponse } from "@/services/courses/content/lesson.types";
import { toast } from "sonner";
import axios from "axios";

interface VideoUploadState {
  isUploading: boolean;
  progress: number;
  status:
    | "idle"
    | "requesting"
    | "uploading"
    | "processing"
    | "success"
    | "error";
  error: string | null;
}

interface UseVideoUploadOptions {
  lessonId: number;
  onSuccess?: (lesson: LessonResponse) => void;
  onError?: (error: Error) => void;
}

export function useVideoUpload({
  lessonId,
  onSuccess,
  onError,
}: UseVideoUploadOptions) {
  const queryClient = useQueryClient();

  const [uploadState, setUploadState] = useState<VideoUploadState>({
    isUploading: false,
    progress: 0,
    status: "idle",
    error: null,
  });

  /**
   * Upload video directly to MinIO with presigned URL
   */
  const uploadVideoToMinIO = useCallback(
    async (file: File): Promise<{ objectKey: string; duration: number }> => {
      try {
        // Step 1: Request presigned URL from backend
        setUploadState({
          isUploading: true,
          progress: 0,
          status: "requesting",
          error: null,
        });

        toast.info("Đang chuẩn bị upload video...");

        const { uploadUrl, objectKey } = await lessonService.requestUploadUrl(
          lessonId
        );

        // Step 2: Upload directly to MinIO
        setUploadState((prev) => ({
          ...prev,
          status: "uploading",
          progress: 0,
        }));

        toast.info("Đang upload video lên server...");

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type || "video/mp4",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadState((prev) => ({
                ...prev,
                progress: percentCompleted,
              }));
            }
          },
        });

        // Step 3: Get video duration
        const duration = await getVideoDuration(file);

        toast.success("Upload thành công! Đang xử lý video...");

        return { objectKey, duration };
      } catch (error: any) {
        const errorMessage = error.message || "Failed to upload video";
        setUploadState({
          isUploading: false,
          progress: 0,
          status: "error",
          error: errorMessage,
        });
        toast.error(`Upload thất bại: ${errorMessage}`);
        throw error;
      }
    },
    [lessonId]
  );

  /**
   * Notify backend after successful upload
   */
  const notifyUploadComplete = useMutation({
    mutationFn: async ({
      objectKey,
      duration,
    }: {
      objectKey: string;
      duration: number;
    }) => {
      setUploadState((prev) => ({
        ...prev,
        status: "processing",
      }));

      return lessonService.uploadComplete(lessonId, {
        objectKey,
        durationSeconds: duration,
      });
    },
    onSuccess: (data) => {
      setUploadState({
        isUploading: false,
        progress: 100,
        status: "success",
        error: null,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });

      toast.success("Video đã được upload và đang được xử lý!");
      onSuccess?.(data);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to complete upload";
      setUploadState({
        isUploading: false,
        progress: 0,
        status: "error",
        error: errorMessage,
      });
      toast.error(`Lỗi xử lý video: ${errorMessage}`);
      onError?.(error);
    },
  });

  /**
   * Main upload function
   */
  const uploadVideo = useCallback(
    async (file: File) => {
      try {
        // Validate file
        if (!file.type.startsWith("video/")) {
          throw new Error("File phải là video");
        }

        // Check file size (max 500MB)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
          throw new Error("Video không được lớn hơn 500MB");
        }

        // Upload to MinIO
        const { objectKey, duration } = await uploadVideoToMinIO(file);

        // Notify backend
        await notifyUploadComplete.mutateAsync({ objectKey, duration });
      } catch (error: any) {
        console.error("Video upload error:", error);
        onError?.(error);
      }
    },
    [uploadVideoToMinIO, notifyUploadComplete, onError]
  );

  /**
   * Delete video
   */
  const deleteVideo = useMutation({
    mutationFn: () => lessonService.deleteVideo(lessonId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Video đã được xóa");
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete video");
      onError?.(error);
    },
  });

  /**
   * Reset upload state
   */
  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      status: "idle",
      error: null,
    });
  }, []);

  return {
    uploadVideo,
    deleteVideo: deleteVideo.mutate,
    uploadState,
    resetUploadState,
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    status: uploadState.status,
    error: uploadState.error,
  };
}

/**
 * Get video duration using HTML5 Video API
 */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      resolve(duration);
    };

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
}
