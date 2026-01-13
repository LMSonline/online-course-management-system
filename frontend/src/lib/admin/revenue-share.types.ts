/**
 * Match actual backend response
 * Backend returns:
 * - percentage (platform percentage)
 * Frontend calculates:
 * - teacherPercentage = 100 - percentage
 */
export interface RevenueShareConfigResponse {
  id: number;
  categoryId?: number | null;
  percentage: number; // ✅ Platform percentage (backend field name)
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  minimumPayoutAmount?: number | null;
  description?: string;
  versionNote?: string;
}

/**
 * Match backend DTO
 * Backend expects:
 * - percentage (platform percentage, required)
 * - description (optional)
 * - versionNote (optional)
 * - categoryId (optional)
 * - effectiveFrom (required)
 * - effectiveTo (optional)
 * - minimumPayoutAmount (optional)
 */
export interface CreateRevenueShareConfigRequest {
  categoryId?: number | null;
  percentage: number; // ✅ Platform percentage (backend will calculate teacher % = 100 - this)
  effectiveFrom: string;
  effectiveTo?: string | null;
  description?: string;
  versionNote?: string;
  minimumPayoutAmount?: number | null; //  Minimum payout threshold in VND
}

/**
 *  Match backend DTO for update
 */
export interface UpdateRevenueShareConfigRequest {
  percentage: number; //  Platform percentage
  effectiveFrom: string;
  effectiveTo?: string | null;
  description?: string;
  versionNote?: string;
  minimumPayoutAmount?: number | null; //  Minimum payout threshold in VND
}

/**
 * Match Spring Boot Page response structure
 * Backend returns Page<T> with field "content" not "items"
 */
export interface PagedRevenueShareResponse {
  content: RevenueShareConfigResponse[]; //  Changed from "items" to "content"
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}