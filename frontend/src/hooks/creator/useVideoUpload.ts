import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/services/courses/content/lesson.service";
import {
  RequestUploadUrlResponse,
  UpdateVideoRequest,
  LessonResponse,
} from "@/services/courses/content/lesson.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to get video upload URL
 * Contract Key: LESSON_GET_VIDEO_UPLOAD_URL
 */
export function useGetLessonUploadUrl() {
  return useMutation<RequestUploadUrlResponse, Error, number>({
    mutationFn: (lessonId: number) => lessonService.requestUploadUrl(lessonId),
    onError: (error) => {
      toast.error(error.message || "Failed to get upload URL");
    },
  });
}

/**
 * Hook to complete video upload
 * Contract Key: LESSON_VIDEO_UPLOAD_COMPLETE_ACTION
 */
export function useCompleteVideoUploadMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    LessonResponse,
    Error,
    { lessonId: number; payload: UpdateVideoRequest }
  >({
    mutationFn: ({ lessonId, payload }) =>
      lessonService.uploadComplete(lessonId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.LESSON_GET_BY_ID, variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.LESSON_GET_BY_CHAPTER],
      });
      toast.success("Video upload completed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to complete video upload");
    },
  });
}

