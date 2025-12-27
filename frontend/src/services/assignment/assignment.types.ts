// ===========================
// Assignment Types
// ===========================

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AssignmentRequest {
  title: string;
  description?: string;
  instructions?: string;
  dueDate?: string; // ISO datetime string
  maxScore?: number;
  allowLateSubmission?: boolean;
  status?: AssignmentStatus;
}

export interface AssignmentResponse {
  id: number;
  title: string;
  description?: string;
  instructions?: string;
  lessonId: number;
  lessonTitle?: string;
  courseId?: number;
  courseTitle?: string;
  teacherId?: number;
  teacherName?: string;
  dueDate?: string;
  maxScore?: number;
  allowLateSubmission: boolean;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  totalSubmissions?: number;
  gradedSubmissions?: number;
}

// ===========================
// Submission Types
// ===========================

export type SubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "GRADED"
  | "RETURNED"
  | "LATE";

export interface SubmissionResponse {
  id: number;
  assignmentId: number;
  assignmentTitle?: string;
  studentId: number;
  studentName?: string;
  studentCode?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: number;
  graderName?: string;
  isLate: boolean;
  createdAt: string;
  updatedAt: string;
  files?: SubmissionFileResponse[];
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
}

export interface FeedbackSubmissionRequest {
  feedback: string;
}

// ===========================
// Submission File Types
// ===========================

export interface SubmissionFileResponse {
  id: number;
  submissionId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType?: string;
  uploadedAt: string;
}

export interface UploadSubmissionFileRequest {
  file: File;
}
