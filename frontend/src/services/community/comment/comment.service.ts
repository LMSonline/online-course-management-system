import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  CommentCreateRequest,
  CommentResponse,
  CommentStatisticsResponse,
} from "./comment.types";

const COMMENT_PREFIX = "";

export const commentService = {
  /**
   * Create a comment on a course
   */
  createCourseComment: async (
    courseId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Create a comment on a lesson
   */
  createLessonComment: async (
    lessonId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Reply to a comment
   */
  replyToComment: async (
    commentId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}/reply`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all comments for a course
   */
  getCourseComments: async (courseId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments`
    );

    return unwrapResponse(response);
  },

  /**
   * Get all comments for a lesson
   */
  getLessonComments: async (lessonId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/lessons/${lessonId}/comments`
    );

    return unwrapResponse(response);
  },

  /**
   * Get replies for a specific comment
   */
  getCommentReplies: async (commentId: number): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/comments/${commentId}/replies`
    );

    return unwrapResponse(response);
  },

  /**
   * Get unanswered questions for a course (Teacher only)
   */
  getUnansweredQuestions: async (
    courseId: number
  ): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments/unanswered`
    );

    return unwrapResponse(response);
  },

  /**
   * Get popular/trending comments by upvotes
   */
  getPopularComments: async (
    courseId: number,
    limit: number = 10
  ): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments/popular`,
      {
        params: { limit },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Search comments in a course by keyword
   */
  searchComments: async (
    courseId: number,
    keyword: string
  ): Promise<CommentResponse[]> => {
    const response = await axiosClient.get<ApiResponse<CommentResponse[]>>(
      `${COMMENT_PREFIX}/courses/${courseId}/comments/search`,
      {
        params: { keyword },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get Q&A statistics for a course (Teacher only)
   */
  getCommentStatistics: async (
    courseId: number
  ): Promise<CommentStatisticsResponse> => {
    const response = await axiosClient.get<
      ApiResponse<CommentStatisticsResponse>
    >(`${COMMENT_PREFIX}/courses/${courseId}/comments/statistics`);

    return unwrapResponse(response);
  },

  /**
   * Update a comment
   */
  updateComment: async (
    commentId: number,
    payload: CommentCreateRequest
  ): Promise<CommentResponse> => {
    const response = await axiosClient.put<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Upvote a comment/question
   */
  upvoteComment: async (commentId: number): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}/upvote`
    );

    return unwrapResponse(response);
  },

  /**
   * Toggle comment visibility (Teacher only - moderation)
   */
  toggleVisibility: async (commentId: number): Promise<CommentResponse> => {
    const response = await axiosClient.post<ApiResponse<CommentResponse>>(
      `${COMMENT_PREFIX}/comments/${commentId}/toggle-visibility`
    );

    return unwrapResponse(response);
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: number): Promise<void> => {
    await axiosClient.delete<void>(`${COMMENT_PREFIX}/comments/${commentId}`);
  },
};
