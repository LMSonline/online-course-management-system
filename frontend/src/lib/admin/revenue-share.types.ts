export interface RevenueShareConfigResponse {
  id: number;
  categoryId?: number | null;
  teacherPercentage: number;
  platformPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRevenueShareConfigRequest {
  categoryId?: number | null;
  teacherPercentage: number;
  platformPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface UpdateRevenueShareConfigRequest {
  teacherPercentage: number;
  platformPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}
