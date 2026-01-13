import { axiosClient } from "@/lib/api/axios";
import type {
  ViolationReportResponse,
  ViolationReportDetailResponse,
} from "@/lib/admin/violation-report.types";
import type { PageResponse } from "@/lib/api/api.types";

const PREFIX = "/admin/reports";

export const adminViolationReportService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<ViolationReportResponse>> => {
    const res = await axiosClient.get(PREFIX, { params });

    //  unwrap đúng tầng
    const page = res.data.data;

    return {
      items: page.items ?? [],
      page: page.page,
      size: page.size,
      totalItems: page.totalItems,
      totalPages: page.totalPages,
      hasNext: page.hasNext,
      hasPrevious: page.hasPrevious,
    };
  },

  getById: async (
    id: number
  ): Promise<ViolationReportDetailResponse> => {
    const res = await axiosClient.get(`/reports/${id}`);
    return res.data.data;
  },

  review: async (id: number, payload: { note?: string }) => {
    const res = await axiosClient.post(
      `/admin/reports/${id}/review`,
      payload
    );
    return res.data.data;
  },

  dismiss: async (id: number, payload: { reason: string }) => {
    const res = await axiosClient.post(
      `/admin/reports/${id}/dismiss`,
      payload
    );
    return res.data.data;
  },

  takeAction: async (
    id: number,
    payload: { action: string; note?: string }
  ) => {
    const res = await axiosClient.post(
      `/admin/reports/${id}/take-action`,
      payload
    );
    return res.data.data;
  },
};
