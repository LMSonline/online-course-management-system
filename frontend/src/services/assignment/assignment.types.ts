// ===========================
// Assignment Types
// ===========================

/**
 * Types of assignments in the LMS
 * Backend: AssignmentType enum
 */
export type AssignmentType =
  | "PRACTICE"
  | "HOMEWORK"
  | "PROJECT"
  | "FINAL_REPORT";

/**
 * Request DTO for creating or updating an assignment
 * Backend: AssignmentRequest
 */
export interface AssignmentRequest {
  title: string;
  assignmentType: AssignmentType;
  description?: string | null;
  totalPoints?: number | null;
  timeLimitMinutes?: number | null;
  maxAttempts?: number | null;
  dueDate?: string | null; // ISO 8601 Instant format: "2026-01-13T10:09:00Z"
}

/**
 * Response DTO for assignment details
 * Backend: AssignmentResponse
 */
export interface AssignmentResponse {
  id: number;
  lessonId?: number | null;
  assignmentType: AssignmentType;
  title: string;
  description?: string | null;
  totalPoints?: number | null;
  timeLimitMinutes?: number | null;
  maxAttempts?: number | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===========================
// Submission Types
// ===========================

/**
 * Status of assignment submissions
 * Backend: SubmissionStatus enum
 */
export type SubmissionStatus = "PENDING" | "GRADED" | "REJECTED";

/**
 * Response DTO for assignment submission details
 * Backend: SubmissionResponse
 */
export interface SubmissionResponse {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName?: string | null;
  submittedAt: string;
  content?: string | null;
  score?: number | null;
  gradedBy?: number | null;
  gradedAt?: string | null;
  feedback?: string | null;
  attemptNumber: number;
  status: SubmissionStatus;
  files?: SubmissionFileResponse[];
}

/**
 * Request DTO for grading a submission
 * Backend: GradeSubmissionRequest
 */
export interface GradeSubmissionRequest {
  grade: number; // 0-10 scale
  feedback?: string | null;
}

/**
 * Request DTO for providing feedback on a submission
 * Backend: FeedbackSubmissionRequest
 */
export interface FeedbackSubmissionRequest {
  feedback: string;
}

// ===========================
// Submission File Types
// ===========================

/**
 * Response DTO for submission file
 * Backend: SubmissionFileResponse
 */
export interface SubmissionFileResponse {
  id: number;
  fileName: string;
  fileUrl: string;
}

// ===========================
// Assignment Eligibility & Statistics Types
// ===========================

/**
 * Response DTO for assignment eligibility check (for students)
 * Backend: AssignmentEligibilityResponse
 */
export interface AssignmentEligibilityResponse {
  assignmentId: number;
  assignmentTitle: string;
  canSubmit: boolean;
  currentAttempts: number;
  maxAttempts?: number | null;
  remainingAttempts?: number | null;
  isPastDue: boolean;
  reason?: string | null;
}

/**
 * Response DTO for assignment statistics (for teachers)
 * Backend: AssignmentStatisticsResponse
 */
export interface AssignmentStatisticsResponse {
  assignmentId: number;
  assignmentTitle: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  pendingCount: number;
  averageScore?: number | null;
  highestScore?: number | null;
  lowestScore?: number | null;
  submissionRate: number;
}

/**
 * Response DTO for student assignment progress
 * Backend: StudentAssignmentProgressResponse
 */
export interface StudentAssignmentProgressResponse {
  assignmentId: number;
  assignmentTitle: string;
  totalPoints?: number | null;
  dueDate?: string | null;
  hasSubmitted: boolean;
  attemptCount: number;
  latestSubmissionId?: number | null;
  latestSubmissionStatus?: string | null;
  latestScore?: number | null;
  bestScore?: number | null;
  isPassing?: boolean | null;
}
