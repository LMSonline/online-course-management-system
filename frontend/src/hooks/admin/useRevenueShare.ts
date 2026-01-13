import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { revenueShareService } from "@/services/admin/revenue-share.service";
import type { PagedRevenueShareResponse } from "@/lib/admin/revenue-share.types";

/* ======================================================
 * REVENUE SHARE 
 * ====================================================== */

/**
 * POST /api/v1/admin/revenue-share
 */
export const useCreateRevenueShareConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      revenueShareService.createRevenueShareConfig(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};

/**
 * GET /api/v1/admin/revenue-share
 */
export const useRevenueShareConfigs = (params?: {
  isActive?: boolean;
  categoryId?: number;
  page?: number;
  size?: number;
}) =>
  useQuery<PagedRevenueShareResponse>({
    queryKey: ["admin-revenue-share", params],
    queryFn: () =>
      revenueShareService.getAllRevenueShareConfigs(params),
    placeholderData: keepPreviousData,
  });

/**
 * GET /api/v1/admin/revenue-share/active
 */
export const useActiveRevenueShareConfigs = () =>
  useQuery({
    queryKey: ["admin-revenue-share-active"],
    queryFn: () =>
      revenueShareService.getActiveRevenueShareConfigs(),
  });

/**
 * GET /api/v1/admin/revenue-share/{id}
 */
export const useRevenueShareConfigDetail = (id?: number) =>
  useQuery({
    queryKey: ["admin-revenue-share-detail", id],
    queryFn: () =>
      revenueShareService.getRevenueShareConfigById(id!),
    enabled: !!id,
  });

/**
 * GET /api/v1/admin/revenue-share/category/{categoryId}
 */
export const useRevenueShareByCategory = (
  categoryId?: number,
  date?: string
) =>
  useQuery({
    queryKey: ["admin-revenue-share-category", categoryId, date],
    queryFn: () =>
      revenueShareService.getActiveConfigForCategory(
        categoryId!,
        date
      ),
    enabled: !!categoryId,
  });

/**
 * GET /api/v1/admin/revenue-share/default
 */
export const useDefaultRevenueShareConfig = (date?: string) =>
  useQuery({
    queryKey: ["admin-revenue-share-default", date],
    queryFn: () =>
      revenueShareService.getDefaultConfig(date),
  });

/**
 * PUT /api/v1/admin/revenue-share/{id}
 */
export const useUpdateRevenueShareConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      revenueShareService.updateRevenueShareConfig(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-revenue-share"] });
    },
  });
};

/**
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
