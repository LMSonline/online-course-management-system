// ===========================
// Comment Types
// ===========================

/** Backend: CommentCreateRequest */
export interface CommentCreateRequest {
  content: string;
}

/** Backend: CommentResponse.UserDto */
export interface CommentUser {
  id: number;
  username: string;
  avatarUrl?: string;
}

/** Backend: CommentResponse */
export interface CommentResponse {
  id: number;
  user: CommentUser;
  content: string;
  createdAt: string; // ISO datetime string
  replies?: CommentResponse[];
  upvotes?: number;
  isVisible?: boolean;
}

/** Backend: CommentStatisticsResponse */
export interface CommentStatisticsResponse {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  totalReplies: number;
  instructorReplies: number;
  responseRate: number; // Percentage as decimal
  averageResponseTimeHours?: number;
  totalUpvotes: number;
  averageUpvotesPerQuestion: number;
}
