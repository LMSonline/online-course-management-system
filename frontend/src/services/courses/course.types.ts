// Enums
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ARCHIVED";

// ============== Request DTOs ==============

// Tag
/** Backend: TagRequest */
export interface TagRequest {
  name: string;
}

// Category
/** Backend: CategoryRequest */
export interface CategoryRequest {
  name: string;
  code?: string;
  description?: string;
  parentId?: number;
  visible?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
}

// Course
/** Backend: CourseRequest */
export interface  CourseRequest {
  title: string;
  shortDescription: string;
  categoryId: number;
  teacherId: number;
  isClosed?: boolean;
  difficulty?: Difficulty;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  thumbnailUrl?: string;
  isIndexed?: boolean;
  tags?: string[];
}

/** Backend: CourseUpdateRequest */
export interface CourseUpdateRequest {
  title?: string;
  shortDescription?: string;
  categoryId?: number;
  teacherId?: number;
  isClosed?: boolean;
  difficulty?: Difficulty;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  thumbnailUrl?: string;
  isIndexed?: boolean;
  tags?: string[];
}

// Course Version
/** Backend: CourseVersionRequest */
export interface CourseVersionRequest {
  title: string;
  description?: string;
  price?: number;
  durationDays?: number;
  passScore?: number;
  finalWeight?: number;
  minProgressPct?: number;
  notes?: string;
}

// Course Review
/** Backend: CourseReviewRequest */
export interface CourseReviewRequest {
  rating: number; // 1-5
  title?: string;
  content?: string;
}

// ============== Response DTOs ==============

// Tag
/** Backend: Tag entity */
export interface TagResponse {
  id: number;
  name: string;
  slug?: string;
  deletedAt?: string; // ISO datetime string
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

// Category
/** Backend: CategoryResponseDto */
export interface CategoryResponse {
  id: number;
  name: string;
  code?: string;
  description?: string;
  visible?: boolean;
  parentId?: number;
  deletedAt?: string; // ISO datetime string
  children?: CategoryResponse[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
}

// Course
/** Backend: CourseResponse */
export interface CourseResponse {
  id: number;
  title: string;
  shortDescription?: string;
  difficulty?: Difficulty;
  thumbnailUrl?: string;
  slug: string;
  isClosed?: boolean;
  categoryId?: number;
  categoryName?: string;
  teacherId?: number;
  teacherName?: string;
  publicVersionId?: number;
  tags?: string[];
}

/** Backend: CourseDetailResponse */
export interface CourseDetailResponse {
  id: number;
  title: string;
  shortDescription?: string;
  difficulty?: Difficulty;
  thumbnailUrl?: string;
  slug: string;
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  indexed: boolean;
  isClosed?: boolean;
  category?: CourseCategoryInfo;
  teacherId?: number;
  PublicVersionId?: number;
  tags?: string[];
}

/** Backend: CourseDetailResponse.CategoryDto */
export interface CourseCategoryInfo {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

// Course Version
/** Backend: CourseVersionResponse */
export interface CourseVersionResponse {
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
  createdAt?: string; // ISO date string from backend
}

/** Backend: CourseVersionAdminResponse */
// export interface AdminPendingCourseVersion {
//   versionId: number;
//   versionNumber: number;
//   versionTitle: string;
//   status: string;

//   courseId: number;
//   courseTitle: string;

//   teacherName: string;

//   createdAt: string;
// }
// /** Backend: AdminCourseResponse */

// export interface AdminCourseResponse {
//   id: number;
//   title: string;
//   shortDescription?: string;

//   isClosed: boolean;

//   teacherId: number;
//   teacherName: string;

//   pendingVersionCount: number; // 
// }

// Course Review
/** Backend: CourseReviewResponse */
export interface CourseReviewResponse {
  id: number;
  courseId: number;
  studentId: number;
  username?: string;
  avatarUrl?: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

/** Backend: RatingSummaryResponse */
export interface RatingSummaryResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // rating (1-5) -> count
}
