/**
 * Category types
 * Re-exported from courses service for consistency
 */

export interface CategoryResponseDto {
  id: number;
  name: string;
  code: string;
  description: string;
  visible: boolean;
  parentId: number | null;
  deletedAt: string | null;
  children: CategoryResponseDto[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  thumbnailUrl: string | null;
}

