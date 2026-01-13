// Type definitions for learner assignment APIs
// Chuẩn hóa tuyệt đối theo backend

export interface Assignment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface AssignmentSubmission {
  assignmentId: number;
  studentId: number;
  submittedAt: string;
  content: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface AssignmentListResponse {
  assignments: Assignment[];
}

export interface AssignmentSubmissionResponse {
  submission: AssignmentSubmission;
}
