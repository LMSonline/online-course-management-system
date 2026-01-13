// Type definitions for learner course APIs
// Chuẩn hóa theo CourseVersionResponse từ backend

export type CourseStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ARCHIVED";

export interface Course {
  id: number;
  courseId: number;
  versionNumber: number;
  title: string;
  description?: string;
  price?: number;
  durationDays?: number;
  passScore?: number;
  finalWeight?: number;
  minProgressPct?: number;
  status: CourseStatus;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string; // ISO datetime string
  publishedAt?: string; // ISO datetime string
  chapterCount: number;
  thumbnail?: string;
}

export interface CourseListResponse {
  items: Course[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
