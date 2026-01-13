// Type definitions for learner category APIs
// Chuẩn hóa theo CategoryResponseDto từ backend

export interface Category {
  id: number;
  name: string;
  code?: string;
  description?: string;
  visible?: boolean;
  parentId?: number;
  deletedAt?: string; // ISO datetime string
  children?: Category[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
}

export type CategoryTree = Category[];

export interface CategoryListResponse {
  items: Category[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
