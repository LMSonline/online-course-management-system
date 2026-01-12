import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { revenueShareService } from "@/services/admin/revenue-share.service";

/* =========================================================
 * QUERY – LIST / DETAIL
 * ========================================================= */

/**
 * Get all revenue share configs (Admin)
 * GET /api/v1/admin/revenue-share
 */
export const useAdminRevenueShareConfigs = (params?: {
  isActive?: boolean;
  categoryId?: number;
  page?: number;
  size?: number;
}) =>
  useQuery({
    queryKey: ["admin-revenue-share", params],
    queryFn: () =>
      revenueShareService.getAllRevenueShareConfigs(params),
    placeholderData: keepPreviousData,
  });

/**
 * Get active revenue share configs (Admin)
 * GET /api/v1/admin/revenue-share/active
 */
export const useActiveRevenueShareConfigs = () =>
  useQuery({
    queryKey: ["admin-revenue-share", "active"],
    queryFn: () =>
      revenueShareService.getActiveRevenueShareConfigs(),
  });

/**
 * Get revenue share config detail (Admin)
 * GET /api/v1/admin/revenue-share/{id}
 */
export const useRevenueShareConfigDetail = (id?: number) =>
  useQuery({
    queryKey: ["admin-revenue-share", "detail", id],
    queryFn: () =>
      revenueShareService.getRevenueShareConfigById(id!),
    enabled: !!id,
  });

/**
 * Get active revenue share config for category
 * GET /api/v1/admin/revenue-share/category/{categoryId}
 */
export const useRevenueShareByCategory = (
  categoryId?: number,
  date?: string
) =>
  useQuery({
    queryKey: [
      "admin-revenue-share",
      "category",
      categoryId,
      date,
    ],
    queryFn: () =>
      revenueShareService.getActiveConfigForCategory(
        categoryId!,
        date
      ),
    enabled: !!categoryId,
  });

/**
 * Get default (global) revenue share config
 * GET /api/v1/admin/revenue-share/default
 */
export const useDefaultRevenueShareConfig = (date?: string) =>
  useQuery({
    queryKey: ["admin-revenue-share", "default", date],
    queryFn: () =>
      revenueShareService.getDefaultConfig(date),
  });

/* =========================================================
 * MUTATION – CREATE / UPDATE / DELETE
 * ========================================================= */

/**
 * Create revenue share config (Admin)
 * POST /api/v1/admin/revenue-share
 */
export const useCreateRevenueShareConfig = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: revenueShareService.createRevenueShareConfig,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};

/**
 * Update revenue share config (Admin)
 * PUT /api/v1/admin/revenue-share/{id}
 */
export const useUpdateRevenueShareConfig = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: any;
    }) =>
      revenueShareService.updateRevenueShareConfig(
        id,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};

/**
 * Deactivate revenue share config (Admin)
 * POST /api/v1/admin/revenue-share/{id}/deactivate
 */
export const useDeactivateRevenueShareConfig = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      revenueShareService.deactivateRevenueShareConfig(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};

/**
 * Delete revenue share config (Admin)
 * DELETE /api/v1/admin/revenue-share/{id}
 */
export const useDeleteRevenueShareConfig = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      revenueShareService.deleteRevenueShareConfig(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};
