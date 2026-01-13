// Type definitions for learner review APIs
// Chuẩn hóa theo backend

export interface Review {
  id: number;
  courseId: number;
  studentId: number;
  username?: string;
  avatarUrl?: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // rating (1-5) -> count
}

export interface ReviewListResponse {
  items: Review[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
