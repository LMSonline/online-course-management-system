import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "@/services/progress/progress.service";
import { LessonProgressResponse } from "@/services/progress/progress.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to mark lesson as viewed
 * Contract Key: PROGRESS_MARK_VIEWED_ACTION
 */
export function useMarkLessonViewed() {
  const queryClient = useQueryClient();

  return useMutation<LessonProgressResponse, Error, number>({
    mutationFn: (lessonId: number) => progressService.markLessonAsViewed(lessonId),
    onSuccess: (data, lessonId) => {
      // Invalidate progress queries for the course
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.PROGRESS_GET_COURSE],
      });
      toast.success("Lesson marked as viewed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark lesson as viewed");
    },
  });
}

/**
 * Hook to mark lesson as completed
 * Contract Key: PROGRESS_MARK_COMPLETED_ACTION
 */
export function useMarkLessonCompleted() {
  const queryClient = useQueryClient();

  return useMutation<LessonProgressResponse, Error, number>({
    mutationFn: (lessonId: number) => progressService.markLessonAsCompleted(lessonId),
    onSuccess: (data, lessonId) => {
      // Invalidate progress queries for the course
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.PROGRESS_GET_COURSE],
      });
      toast.success("Lesson marked as completed!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark lesson as completed");
    },
  });
}

