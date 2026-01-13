import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse , SpringPage} from "@/lib/api/api.types";
import {
  RevenueShareConfigResponse,
  CreateRevenueShareConfigRequest,
  UpdateRevenueShareConfigRequest,
} from "@/lib/admin/revenue-share.types";
/**
 * API prefix
 */
const ADMIN_REVENUE_SHARE_PREFIX = "/admin/revenue-share";

export const revenueShareService = {
  /**
   * Create revenue share configuration (Admin)
   * POST /api/v1/admin/revenue-share
   */
  createRevenueShareConfig: async (
    payload: CreateRevenueShareConfigRequest
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.post<
      ApiResponse<RevenueShareConfigResponse>
    >(ADMIN_REVENUE_SHARE_PREFIX, payload);

    return unwrapResponse(response);
  },

  /**
   * Get all revenue share configurations (Admin)
   * GET /api/v1/admin/revenue-share
   */
  getAllRevenueShareConfigs: async (params?: {
    isActive?: boolean;
    categoryId?: number;
    page?: number;
    size?: number;
  }): Promise<SpringPage<RevenueShareConfigResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<SpringPage<RevenueShareConfigResponse>>
    >(ADMIN_REVENUE_SHARE_PREFIX, {
      params,
    });

    return unwrapResponse(response);
  },

  /**
   * Get active revenue share configurations (Admin)
   * GET /api/v1/admin/revenue-share/active
   */
  getActiveRevenueShareConfigs: async (): Promise<
    RevenueShareConfigResponse[]
  > => {
    const response = await axiosClient.get<
      ApiResponse<RevenueShareConfigResponse[]>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/active`);

    return unwrapResponse(response);
  },

  /**
   * Get revenue share config by id (Admin)
   * GET /api/v1/admin/revenue-share/{id}
   */
  getRevenueShareConfigById: async (
    id: number
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.get<
      ApiResponse<RevenueShareConfigResponse>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/${id}`);

    return unwrapResponse(response);
  },

  /**
   * Get active config for category at date (Admin)
   * GET /api/v1/admin/revenue-share/category/{categoryId}
   */
  getActiveConfigForCategory: async (
    categoryId: number,
    date?: string
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.get<
      ApiResponse<RevenueShareConfigResponse>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/category/${categoryId}`, {
      params: { date },
    });

    return unwrapResponse(response);
  },

  /**
   * Get default (global) revenue share config (Admin)
   * GET /api/v1/admin/revenue-share/default
   */
  getDefaultConfig: async (
    date?: string
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.get<
      ApiResponse<RevenueShareConfigResponse>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/default`, {
      params: { date },
    });

    return unwrapResponse(response);
  },

  /**
   * Update revenue share configuration (Admin)
   * PUT /api/v1/admin/revenue-share/{id}
   */
  updateRevenueShareConfig: async (
    id: number,
    payload: UpdateRevenueShareConfigRequest
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.put<
      ApiResponse<RevenueShareConfigResponse>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/${id}`, payload);

    return unwrapResponse(response);
  },

  /**
   * Deactivate revenue share configuration (Admin)
   * POST /api/v1/admin/revenue-share/{id}/deactivate
   */
  deactivateRevenueShareConfig: async (
    id: number
  ): Promise<RevenueShareConfigResponse> => {
    const response = await axiosClient.post<
      ApiResponse<RevenueShareConfigResponse>
    >(`${ADMIN_REVENUE_SHARE_PREFIX}/${id}/deactivate`);

    return unwrapResponse(response);
  },

  /**
   * Delete inactive revenue share configuration (Admin)
   * DELETE /api/v1/admin/revenue-share/{id}
   */
  deleteRevenueShareConfig: async (id: number): Promise<void> => {
    await axiosClient.delete(`${ADMIN_REVENUE_SHARE_PREFIX}/${id}`);
  },
};
