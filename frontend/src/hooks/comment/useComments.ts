import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communityService } from "@/services/community/community.service";
import { CommentResponse, CommentCreateRequest } from "@/services/community/community.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { toast } from "sonner";

/**
 * Hook to fetch course comments
 * Contract Key: COMMENT_GET_COURSE_LIST
 */
export function useCourseComments(courseId: number | null | undefined) {
  return useQuery<CommentResponse[]>({
    queryKey: [CONTRACT_KEYS.COMMENT_GET_COURSE_LIST, courseId],
    queryFn: () => communityService.getCourseComments(courseId!),
    enabled: !!courseId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch lesson comments
 * Contract Key: COMMENT_GET_LESSON_LIST
 */
export function useLessonComments(lessonId: number | null | undefined) {
  return useQuery<CommentResponse[]>({
    queryKey: [CONTRACT_KEYS.COMMENT_GET_LESSON_LIST, lessonId],
    queryFn: () => communityService.getLessonComments(lessonId!),
    enabled: !!lessonId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to create course comment
 * Contract Key: COMMENT_CREATE_COURSE
 */
export function useCreateCourseComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, { courseId: number; payload: CommentCreateRequest }>({
    mutationFn: ({ courseId, payload }) => communityService.createCourseComment(courseId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_COURSE_LIST, variables.courseId],
      });
      toast.success("Comment posted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post comment");
    },
  });
}

/**
 * Hook to create lesson comment
 * Contract Key: COMMENT_CREATE_LESSON
 */
export function useCreateLessonComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, { lessonId: number; payload: CommentCreateRequest }>({
    mutationFn: ({ lessonId, payload }) => communityService.createLessonComment(lessonId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_LESSON_LIST, variables.lessonId],
      });
      toast.success("Comment posted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post comment");
    },
  });
}

/**
 * Hook to update comment
 * Contract Key: COMMENT_UPDATE
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, { commentId: number; payload: CommentCreateRequest }>({
    mutationFn: ({ commentId, payload }) => communityService.updateComment(commentId, payload),
    onSuccess: (data, variables) => {
      // Invalidate both course and lesson comment lists (comment might be in either)
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_COURSE_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_LESSON_LIST],
      });
      toast.success("Comment updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update comment");
    },
  });
}

/**
 * Hook to delete comment
 * Contract Key: COMMENT_DELETE
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (commentId: number) => communityService.deleteComment(commentId),
    onSuccess: () => {
      // Invalidate both course and lesson comment lists
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_COURSE_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [CONTRACT_KEYS.COMMENT_GET_LESSON_LIST],
      });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });
}

