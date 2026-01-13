import { axiosClient } from "@/lib/api/axios";

import type {
  DashboardResponse,
  DashboardStatisticsResponse,
  RevenueReportResponse,
  UserReportResponse,
  CourseReportResponse,
} from "@/lib/admin/dashboard.types";

const PREFIX = "/admin";

export const adminDashboardService = {
  /* ================= DASHBOARD ================= */
  getDashboard: async (period: string): Promise<DashboardResponse> => {
    const res = await axiosClient.get(`${PREFIX}/dashboard`, {
      params: { period },
    });
    return res.data.data;
  },

  /* ================= STATISTICS ================= */
  getStatistics: async (
    period: string
  ): Promise<DashboardStatisticsResponse> => {
    const res = await axiosClient.get(`${PREFIX}/statistics`, {
      params: { period },
    });
    return res.data.data;
  },

  /* ================= REPORTS ================= */
  getRevenueReport: async (
    period: string
  ): Promise<RevenueReportResponse> => {
    const res = await axiosClient.get(`${PREFIX}/reports/revenue`, {
      params: { period },
    });
    return res.data.data;
  },

  getUserReport: async (
    period: string
  ): Promise<UserReportResponse> => {
    const res = await axiosClient.get(`${PREFIX}/reports/users`, {
      params: { period },
    });
    return res.data.data;
  },

  getCourseReport: async (
    period: string
  ): Promise<CourseReportResponse> => {
    const res = await axiosClient.get(`${PREFIX}/reports/courses`, {
      params: { period },
    });
    return res.data.data;
  },
};
