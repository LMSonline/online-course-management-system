import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/community/comment";
import {
  CommentCreateRequest,
  CommentResponse,
  CommentStatisticsResponse,
} from "@/services/community/comment/comment.types";
import { toast } from "sonner";

// Get comments for a course
export function useCourseComments(courseId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["comments", "course", courseId],
    queryFn: () => commentService.getCourseComments(courseId!),
    enabled: enabled && courseId !== null,
  });
}

// Get comments for a lesson
export function useLessonComments(lessonId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["comments", "lesson", lessonId],
    queryFn: () => commentService.getLessonComments(lessonId!),
    enabled: enabled && lessonId !== null,
  });
}

// Get unanswered questions for a course
export function useUnansweredQuestions(
  courseId: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ["comments", "unanswered", courseId],
    queryFn: () => commentService.getUnansweredQuestions(courseId!),
    enabled: enabled && courseId !== null,
  });
}

// Get popular comments
export function usePopularComments(
  courseId: number | null,
  limit = 20,
  enabled = true
) {
  return useQuery({
    queryKey: ["comments", "popular", courseId, limit],
    queryFn: () => commentService.getPopularComments(courseId!, limit),
    enabled: enabled && courseId !== null,
  });
}

// Search comments
export function useSearchComments(
  courseId: number | null,
  keyword: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["comments", "search", courseId, keyword],
    queryFn: () => commentService.searchComments(courseId!, keyword),
    enabled: enabled && courseId !== null && keyword.length > 0,
  });
}

// Get replies for a comment
export function useCommentReplies(commentId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["comments", commentId, "replies"],
    queryFn: () => commentService.getCommentReplies(commentId!),
    enabled: enabled && commentId !== null,
  });
}

// Get comment statistics
export function useCommentStatistics(courseId: number | null, enabled = true) {
  return useQuery({
    queryKey: ["comments", "statistics", courseId],
    queryFn: () => commentService.getCommentStatistics(courseId!),
    enabled: enabled && courseId !== null,
  });
}

// Create comment mutation
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: number;
      data: CommentCreateRequest;
    }) => commentService.createLessonComment(lessonId, data),
    onSuccess: (_, variables) => {
      toast.success("Comment posted successfully");
      queryClient.invalidateQueries({
        queryKey: ["comments", "lesson", variables.lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["comments", "course"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to post comment");
    },
  });
}

// Reply to comment mutation
export function useReplyToComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: CommentCreateRequest;
    }) => commentService.replyToComment(commentId, data),
    onSuccess: (_, variables) => {
      toast.success("Reply posted successfully");
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId, "replies"],
      });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to post reply");
    },
  });
}

// Update comment mutation
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: CommentCreateRequest;
    }) => commentService.updateComment(commentId, data),
    onSuccess: (_, variables) => {
      toast.success("Comment updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId],
      });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update comment");
    },
  });
}

// Delete comment mutation
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });
}

// Toggle visibility mutation
export function useToggleCommentVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      commentService.toggleVisibility(commentId),
    onSuccess: (_, commentId) => {
      toast.success("Comment visibility updated");
      queryClient.invalidateQueries({ queryKey: ["comments", commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to toggle visibility"
      );
    },
  });
}

// Upvote comment mutation
export function useUpvoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.upvoteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: ["comments", commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upvote");
    },
  });
}
