// Enums
export type LessonType =
  | "VIDEO"
  | "DOCUMENT"
  | "ASSIGNMENT"
  | "QUIZ"
  | "FINAL_EXAM";

export type VideoStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";

// ============== Request DTOs ==============

/** Backend: CreateLessonRequest */
export interface CreateLessonRequest {
  type: LessonType;
  title: string;
  shortDescription?: string;
}

/** Backend: UpdateLessonRequest */
export interface UpdateLessonRequest {
  type: LessonType;
  title: string;
  shortDescription?: string;
  isPreview?: boolean;
}

/** Backend: UpdateVideoRequest */
export interface UpdateVideoRequest {
  objectKey: string;
  durationSeconds: number;
}

/** Backend: ReorderLessonsRequest */
export interface ReorderLessonsRequest {
  lessonIds: number[];
}

// ============== Response DTOs ==============

/** Backend: LessonDTO */
export interface LessonResponse {
  id: number;
  chapterId: number;
  type: LessonType;
  title: string;
  shortDescription?: string;
  videoObjectKey?: string;
  videoStatus?: VideoStatus;
  isPreview?: boolean;
  durationSeconds?: number;
  orderIndex: number;
}

/** Backend: RequestUploadUrlResponse */
export interface RequestUploadUrlResponse {
  uploadUrl: string;
  objectKey: string;
  expiresInSeconds: number;
}
