import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/community/comment";
import {
  CommentCreateRequest,
  CommentResponse,
  CommentStatisticsResponse,
} from "@/services/community/comment/comment.types";
import { toast } from "sonner";

// Get course comments
export function useCourseComments(courseId: number) {
  return useQuery({
    queryKey: ["course-comments", courseId],
    queryFn: () => commentService.getCourseComments(courseId),
    enabled: !!courseId,
  });
}

// Get lesson comments
export function useLessonComments(lessonId: number) {
  return useQuery({
    queryKey: ["lesson-comments", lessonId],
    queryFn: () => commentService.getLessonComments(lessonId),
    enabled: !!lessonId,
  });
}

// Get unanswered questions
export function useUnansweredQuestions(courseId: number | null) {
  return useQuery({
    queryKey: ["unanswered-questions", courseId],
    queryFn: () => commentService.getUnansweredQuestions(courseId!),
    enabled: !!courseId,
  });
}

// Get popular comments
export function usePopularComments(
  courseId: number | null,
  limit: number = 20
) {
  return useQuery({
    queryKey: ["popular-comments", courseId, limit],
    queryFn: () => commentService.getPopularComments(courseId!, limit),
    enabled: !!courseId,
  });
}

// Search comments
export function useSearchComments(courseId: number | null, keyword: string) {
  return useQuery({
    queryKey: ["search-comments", courseId, keyword],
    queryFn: () => commentService.searchComments(courseId!, keyword),
    enabled: !!courseId && keyword.length > 0,
  });
}

// Get comment replies
export function useCommentReplies(commentId: number | null) {
  return useQuery({
    queryKey: ["comment-replies", commentId],
    queryFn: () => commentService.getCommentReplies(commentId!),
    enabled: !!commentId,
  });
}

// Get comment statistics
export function useCommentStatistics(courseId: number | null) {
  return useQuery({
    queryKey: ["comment-statistics", courseId],
    queryFn: () => commentService.getCommentStatistics(courseId!),
    enabled: !!courseId,
  });
}

// Create course comment
export function useCreateCourseComment(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentService.createCourseComment(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["unanswered-questions"] });
      toast.success("Comment posted successfully");
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });
}

// Create lesson comment
export function useCreateLessonComment(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentService.createLessonComment(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-comments"] });
      queryClient.invalidateQueries({ queryKey: ["unanswered-questions"] });
      toast.success("Comment posted successfully");
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });
}

// Reply to comment
export function useReplyToComment(commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentService.replyToComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment-replies", commentId],
      });
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-comments"] });
      queryClient.invalidateQueries({ queryKey: ["unanswered-questions"] });
      toast.success("Reply posted successfully");
    },
    onError: () => {
      toast.error("Failed to post reply");
    },
  });
}

// Update comment
export function useUpdateComment(commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentService.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-comments"] });
      toast.success("Comment updated successfully");
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-comments"] });
      queryClient.invalidateQueries({ queryKey: ["unanswered-questions"] });
      toast.success("Comment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
}

// Toggle visibility
export function useToggleVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      commentService.toggleVisibility(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-comments"] });
      toast.success("Comment visibility updated");
    },
    onError: () => {
      toast.error("Failed to update visibility");
    },
  });
}

// Upvote comment
export function useUpvoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.upvoteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      queryClient.invalidateQueries({ queryKey: ["course-comments"] });
      queryClient.invalidateQueries({ queryKey: ["popular-comments"] });
    },
    onError: () => {
      toast.error("Failed to upvote comment");
    },
  });
}
