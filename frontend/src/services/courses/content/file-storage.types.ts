// Enums
export type StorageProvider =
  | "CLOUDINARY"
  | "MINIO"
  | "S3"
  | "GCS"
  | "AZURE_BLOB"
  | "LOCAL";

// ============== Response DTOs ==============

/** Backend: FileStorageResponse */
export interface FileStorageResponse {
  id: number;
  storageKey: string;
  storageProvider: StorageProvider;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  formattedSize: string;
  fileExtension: string;
  downloadUrl?: string;
  checksum?: string;
  isVideo?: boolean;
  isImage?: boolean;
  isDocument?: boolean;
  createdAt: string; // ISO datetime string
}
