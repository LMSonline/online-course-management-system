// Type definitions for learner discussion APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Discussion {
  id: number;
  courseId: number;
  studentId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  status: 'open' | 'closed';
}

export interface DiscussionComment {
  id: number;
  discussionId: number;
  studentId: number;
  content: string;
  createdAt: string;
}

export interface DiscussionListResponse {
  discussions: Discussion[];
}

export interface DiscussionDetailResponse {
  discussion: Discussion;
  comments: DiscussionComment[];
}

export interface DiscussionCommentResponse {
  comment: DiscussionComment;
}
