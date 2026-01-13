// CommentService for learner (student)
// API multi-role: /api/v1/courses/{courseId}/comments, /lessons/{lessonId}/comments, /comments/{id}/replies, /courses/{courseId}/comments/popular, /courses/{courseId}/comments/search
// API chỉ student/teacher: POST/PUT/DELETE /api/v1/courses/{courseId}/comments, /lessons/{lessonId}/comments, /comments/{id}/reply, /comments/{id}, /comments/{id}/upvote

import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { Comment, CommentListResponse } from '@/lib/learner/comment/comments';

export const learnerCommentService = {
  /**
   * Lấy tất cả comment của khoá học
   */
  getCourseComments: async (courseId: number): Promise<Comment[]> => {
    const response = await axiosClient.get(`/courses/${courseId}/comments`);
    return unwrapResponse(response);
  },

  /**
   * Lấy tất cả comment của bài học
   */
  getLessonComments: async (lessonId: number): Promise<Comment[]> => {
    const response = await axiosClient.get(`/lessons/${lessonId}/comments`);
    return unwrapResponse(response);
  },

  /**
   * Lấy replies cho một comment
   */
  getReplies: async (id: number): Promise<Comment[]> => {
    const response = await axiosClient.get(`/comments/${id}/replies`);
    return unwrapResponse(response);
  },

  /**
   * Lấy các comment phổ biến của khoá học
   */
  getPopularComments: async (courseId: number, limit: number = 10): Promise<Comment[]> => {
    const response = await axiosClient.get(`/courses/${courseId}/comments/popular`, { params: { limit } });
    return unwrapResponse(response);
  },

  /**
   * Tìm kiếm comment trong khoá học
   */
  searchComments: async (courseId: number, keyword: string): Promise<Comment[]> => {
    const response = await axiosClient.get(`/courses/${courseId}/comments/search`, { params: { keyword } });
    return unwrapResponse(response);
  },

  /**
   * Tạo comment mới cho khoá học
   */
  createCourseComment: async (courseId: number, payload: Partial<Comment>): Promise<Comment> => {
    const response = await axiosClient.post(`/courses/${courseId}/comments`, payload);
    return unwrapResponse(response);
  },

  /**
   * Tạo comment mới cho bài học
   */
  createLessonComment: async (lessonId: number, payload: Partial<Comment>): Promise<Comment> => {
    const response = await axiosClient.post(`/lessons/${lessonId}/comments`, payload);
    return unwrapResponse(response);
  },

  /**
   * Trả lời một comment
   */
  replyToComment: async (id: number, payload: Partial<Comment>): Promise<Comment> => {
    const response = await axiosClient.post(`/comments/${id}/reply`, payload);
    return unwrapResponse(response);
  },

  /**
   * Cập nhật comment
   */
  updateComment: async (id: number, payload: Partial<Comment>): Promise<Comment> => {
    const response = await axiosClient.put(`/comments/${id}`, payload);
    return unwrapResponse(response);
  },

  /**
   * Upvote một comment
   */
  upvoteComment: async (id: number): Promise<Comment> => {
    const response = await axiosClient.post(`/comments/${id}/upvote`);
    return unwrapResponse(response);
  },

  /**
   * Xoá comment
   */
  deleteComment: async (id: number): Promise<void> => {
    await axiosClient.delete(`/comments/${id}`);
  },
};
