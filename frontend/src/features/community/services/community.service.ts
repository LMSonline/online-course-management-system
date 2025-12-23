

import { apiClient } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import type { PageResponse } from "@/services/core/api";

export interface CommentResponse {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
  replies?: CommentResponse[];
}

export interface CommentCreateRequest {
  content: string;
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
}


export async function getCourseComments(courseId: number): Promise<CommentResponse[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<CommentResponse[]>(`/courses/${courseId}/comments`);
  return response.data;
}


export async function createCourseComment(
  courseId: number,
  content: string
): Promise<CommentResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: Date.now(),
      content,
      authorId: 1,
      authorName: "Mock User",
      authorAvatarUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  const response = await apiClient.post<CommentResponse>(`/courses/${courseId}/comments`, {
    content,
  });
  return response.data;
}


export async function getLessonComments(lessonId: number): Promise<CommentResponse[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<CommentResponse[]>(`/lessons/${lessonId}/comments`);
  return response.data;
}


export async function createLessonComment(
  lessonId: number,
  content: string
): Promise<CommentResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: Date.now(),
      content,
      authorId: 1,
      authorName: "Mock User",
      authorAvatarUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  const response = await apiClient.post<CommentResponse>(`/lessons/${lessonId}/comments`, {
    content,
  });
  return response.data;
}


export async function getCommentReplies(commentId: number): Promise<CommentResponse[]> {
  if (USE_MOCK) {
    return Promise.resolve([]);
  }

  const response = await apiClient.get<CommentResponse[]>(`/comments/${commentId}/replies`);
  return response.data;
}


export async function replyToComment(commentId: number, content: string): Promise<CommentResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: Date.now(),
      content,
      authorId: 1,
      authorName: "Mock User",
      authorAvatarUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  const response = await apiClient.post<CommentResponse>(`/comments/${commentId}/reply`, {
    content,
  });
  return response.data;
}


export async function updateComment(
  commentId: number,
  content: string
): Promise<CommentResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: commentId,
      content,
      authorId: 1,
      authorName: "Mock User",
      authorAvatarUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  const response = await apiClient.put<CommentResponse>(`/comments/${commentId}`, { content });
  return response.data;
}


export async function deleteComment(commentId: number): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.delete(`/comments/${commentId}`);
}


export async function getNotifications(
  page = 0,
  size = 10
): Promise<PageResponse<NotificationResponse>> {
  if (USE_MOCK) {
    return Promise.resolve({
      items: [],
      page: 0,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }

  const response = await apiClient.get<PageResponse<NotificationResponse>>("/notifications", {
    params: { page, size },
  });
  return response.data;
}


export async function getUnreadNotificationCount(): Promise<number> {
  if (USE_MOCK) {
    return Promise.resolve(0);
  }

  const response = await apiClient.get<{ count: number }>("/notifications/count-unread");
  return response.data.count;
}


export async function markNotificationRead(id: number): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.post(`/notifications/${id}/mark-read`);
}


export async function markAllNotificationsRead(): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.post("/notifications/mark-all-read");
}


export async function deleteNotification(id: number): Promise<void> {
  if (USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.delete(`/notifications/${id}`);
}

