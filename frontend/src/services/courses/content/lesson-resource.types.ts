// Enums
export type ResourceType = "FILE" | "LINK" | "EMBED";

// ============== Request DTOs ==============

/** Backend: LessonResourceRequest */
export interface LessonResourceRequest {
  resourceType: ResourceType;
  title: string;
  description?: string;
  externalUrl?: string;
  isRequired?: boolean;
  fileStorageId?: number;
}

/** Backend: ReorderResourcesRequest */
export interface ReorderResourcesRequest {
  resourceIds: number[];
}

// ============== Response DTOs ==============

/** Backend: LessonResourceResponse */
export interface LessonResourceResponse {
  id: number;
  lessonId: number;
  resourceType: ResourceType;
  title: string;
  description?: string;
  externalUrl?: string;
  fileStorageId?: number;
  fileName?: string;
  fileSizeBytes?: number;
  formattedFileSize?: string;
  downloadUrl?: string;
  displayUrl?: string;
  orderIndex: number;
  isRequired?: boolean;
  isDownloadable?: boolean;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}
