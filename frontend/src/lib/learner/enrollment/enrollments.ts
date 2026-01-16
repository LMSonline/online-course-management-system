// Chuẩn theo PageResponse<EnrollmentResponse> từ backend

export type EnrollmentStatus =
  | "ENROLLED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;

  courseId: number;
  courseTitle: string;

  courseVersionId: number;
  versionNumber: number;

  status: EnrollmentStatus;

  enrolledAt: string;
  startAt?: string;
  endAt?: string;

  completionPercentage?: number;
  averageScore?: number;

  certificateIssued?: boolean;
  completedAt?: string;

  remainingDays?: number;
  isActive?: boolean;
  canTakeFinalExam?: boolean;

  finalExamScore?: number;
  finalExamWeight?: number;
}

/**
 * Wrapper chuẩn theo PageResponse<T>
 */
// export interface EnrollmentListResponse {
//   items: Enrollment[];
//   page: number;
//   size: number;
//   totalItems: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrevious: boolean;
// }

export interface EnrollmentListResponse {
  content: Enrollment[];
  totalElements: number;
  page: number;
  size: number;
}

