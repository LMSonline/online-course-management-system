// ===========================
// Violation Report Types
// ===========================

/** Backend: ViolationReportStatus enum */
export type ViolationReportStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "DISMISSED";

/** Backend: ViolationReportType (from reportType field) */
export type ViolationReportType =
  | "SPAM"
  | "HARASSMENT"
  | "VIOLENCE"
  | "COPYRIGHT"
  | "INAPPROPRIATE_CONTENT"
  | "MISINFORMATION"
  | "OTHER";

/** Backend: ViolationReportCreateRequest */
export interface ViolationReportCreateRequest {
  targetAccountId?: number; // User being reported (optional if reporting content)
  courseId?: number;
  lessonId?: number;
  commentId?: number;
  reportType: string; // ViolationReportType as string
  description: string;
}

/** Backend: ViolationReportResponse.SimpleUserDto */
export interface SimpleUserDto {
  id: number;
  username: string;
  email: string;
}

/** Backend: ViolationReportResponse.SimpleCourseDto */
export interface SimpleCourseDto {
  id: number;
  title: string;
}

/** Backend: ViolationReportResponse.SimpleLessonDto */
export interface SimpleLessonDto {
  id: number;
  title: string;
}

/** Backend: ViolationReportResponse.SimpleCommentDto */
export interface SimpleCommentDto {
  id: number;
  content: string;
}

/** Backend: ViolationReportResponse */
export interface ViolationReportResponse {
  id: number;
  reportType: string;
  description: string;
  status: ViolationReportStatus;
  createdAt: string; // ISO datetime string
  reporter: SimpleUserDto;
  target?: SimpleUserDto;
  course?: SimpleCourseDto;
  lesson?: SimpleLessonDto;
  comment?: SimpleCommentDto;
}

/** Backend: ViolationReportDetailResponse */
export interface ViolationReportDetailResponse {
  id: number;
  reportType: string;
  description: string;
  status: ViolationReportStatus;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  reporter: SimpleUserDto;
  target?: SimpleUserDto;
  course?: SimpleCourseDto;
  lesson?: SimpleLessonDto;
  comment?: SimpleCommentDto;
}
