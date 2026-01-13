// Type definitions for learner tag APIs
// Chuẩn hóa theo backend

export interface Tag {
  id: number;
  name: string;
  slug?: string;
  deletedAt?: string; // ISO datetime string
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

export interface TagListResponse {
  items: Tag[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
