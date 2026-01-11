// Type definitions for learner feedback APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Feedback {
  id: number;
  studentId: number;
  courseId?: number;
  content: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface FeedbackListResponse {
  feedbacks: Feedback[];
}

export interface FeedbackResponse {
  feedback: Feedback;
}
