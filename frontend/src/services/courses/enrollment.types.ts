// ===========================
// Enrollment Types
// ===========================

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED" | "PAUSED";

export interface CourseEnrollmentResponse {
  id: number;
  courseId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  enrolledAt: string; // ISO date string
  progress: number; // 0-100
  status: EnrollmentStatus;
  lastActivityAt?: string; // ISO date string
  completedLessons: number;
  totalLessons: number;
  quizScore?: number;
  certificateIssued: boolean;
}

export interface EnrollmentStatsResponse {
  total: number;
  active: number;
  completed: number;
  dropped: number;
  paused: number;
  averageProgress: number;
  averageCompletionTime?: number; // in days
}
