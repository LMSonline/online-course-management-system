// ===============================
// ENUMS
// ===============================

export type ViolationReportStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "DISMISSED"
  | "ACTION_TAKEN";

export type ViolationActionType =
  | "DELETE_COMMENT"
  | "BAN_USER"
  | "HIDE_COURSE"
  | "HIDE_LESSON"
  | "WARNING";

// ===============================
// SIMPLE DTOs
// ===============================

export interface SimpleUserDto {
  id: number;
  username: string;
  email: string;
}

export interface SimpleCourseDto {
  id: number;
  title: string;
}

export interface SimpleLessonDto {
  id: number;
  title: string;
}

export interface SimpleCommentDto {
  id: number;
  content: string;
}

// ===============================
// RESPONSE DTOs
// ===============================

export interface ViolationReportResponse {
  id: number;
  reportType: string;
  description: string;
  status: ViolationReportStatus;
  createdAt: string;

  reporter: SimpleUserDto;
  target?: SimpleUserDto;

  course?: SimpleCourseDto;
  lesson?: SimpleLessonDto;
  comment?: SimpleCommentDto;
}

export interface ViolationReportDetailResponse {
  id: number;
  reportType: string;
  description: string;
  status: ViolationReportStatus;

  createdAt: string;
  updatedAt: string;

  reporter: SimpleUserDto;
  target?: SimpleUserDto;

  course?: SimpleCourseDto;
  lesson?: SimpleLessonDto;
  comment?: SimpleCommentDto;
}

// ===============================
// REQUEST DTOs
// ===============================

export interface ViolationReportReviewRequest {
  note?: string;
}

export interface ViolationReportDismissRequest {
  reason: string;
}

export interface ViolationReportTakeActionRequest {
  action: ViolationActionType;
  note?: string;
}
