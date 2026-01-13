// Type definitions for learner comment APIs
// Chuẩn hóa theo backend

export interface Comment {
  id: number;
  courseId?: number;
  lessonId?: number;
  parentId?: number;
  studentId?: number;
  username?: string;
  avatarUrl?: string;
  content: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  replies?: Comment[];
}

export interface CommentListResponse {
  items: Comment[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
