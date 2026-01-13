// ===========================
// Assignment Types
// ===========================

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AssignmentRequest {
  title: string;
  description?: string;
  instructions?: string;
  dueDate?: string; // ISO 8601 Instant format: "2026-01-13T10:09:00Z"
  maxScore?: number;
  allowLateSubmission?: boolean;
  // Note: status is managed by the backend, not sent in requests
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

// ===========================
// Assignment Eligibility & Statistics Types
// ===========================

export interface AssignmentEligibilityResponse {
  eligible: boolean;
  reason?: string;
  dueDate?: string;
  isLate?: boolean;
  canSubmit?: boolean;
}

export interface AssignmentStatisticsResponse {
  assignmentId: number;
  assignmentTitle: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  submissionRate: number;
}

export interface StudentProgressResponse {
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  studentCode?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  isLate: boolean;
  feedback?: string;
  filesCount?: number;
}

// ===========================
// Additional Response Types
// ===========================

export interface FileCountResponse {
  count: number;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
}

export interface AverageScoreResponse {
  averageScore: number;
}

export interface PassingRateResponse {
  passingRate: number;
}

export type AssignmentType = "HOMEWORK" | "PROJECT" | "LAB" | "EXAM" | "OTHER";
