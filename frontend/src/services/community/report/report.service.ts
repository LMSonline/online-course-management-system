import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  ViolationReportCreateRequest,
  ViolationReportResponse,
  ViolationReportDetailResponse,
} from "./report.types";

const REPORT_PREFIX = "/reports";
const ADMIN_REPORT_PREFIX = "/admin/reports";

export const reportService = {
  /**
   * Create a new violation report (User)
   */
  createReport: async (
    payload: ViolationReportCreateRequest
  ): Promise<ViolationReportDetailResponse> => {
    const response = await axiosClient.post<
      ApiResponse<ViolationReportDetailResponse>
    >(`${REPORT_PREFIX}`, payload);

    return unwrapResponse(response);
  },

  /**
   * Get current user's reports (User)
   */
  getMyReports: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<ViolationReportResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<ViolationReportResponse>>
    >(`${REPORT_PREFIX}`, {
      params: {
        page,
        size,
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Get all violation reports (Admin only)
   */
  getAllReports: async (
    page?: number,
    size?: number
  ): Promise<PageResponse<ViolationReportResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<ViolationReportResponse>>
    >(ADMIN_REPORT_PREFIX, {
      params: {
        page,
        size,
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Get report details by ID
   */
  getReportById: async (id: number): Promise<ViolationReportDetailResponse> => {
    const response = await axiosClient.get<
      ApiResponse<ViolationReportDetailResponse>
    >(`${REPORT_PREFIX}/${id}`);

    return unwrapResponse(response);
  },

  // Note: The following methods are commented out in backend but included for future use

  // /**
  //  * Review a violation report (Admin only)
  //  */
  // reviewReport: async (
  //   id: number,
  //   payload: ViolationReportReviewRequest
  // ): Promise<ViolationReportDetailResponse> => {
  //   const response = await axiosClient.post<
  //     ApiResponse<ViolationReportDetailResponse>
  //   >(`${ADMIN_REPORT_PREFIX}/${id}/review`, payload);
  //
  //   return unwrapResponse(response);
  // },

  // /**
  //  * Dismiss a violation report (Admin only)
  //  */
  // dismissReport: async (
  //   id: number,
  //   payload: ViolationReportDismissRequest
  // ): Promise<ViolationReportDetailResponse> => {
  //   const response = await axiosClient.post<
  //     ApiResponse<ViolationReportDetailResponse>
  //   >(`${ADMIN_REPORT_PREFIX}/${id}/dismiss`, payload);
  //
  //   return unwrapResponse(response);
  // },

  // /**
  //  * Take action on a violation report (Admin only)
  //  */
  // takeAction: async (
  //   id: number,
  //   payload: ViolationReportTakeActionRequest
  // ): Promise<ViolationReportDetailResponse> => {
  //   const response = await axiosClient.post<
  //     ApiResponse<ViolationReportDetailResponse>
  //   >(`${ADMIN_REPORT_PREFIX}/${id}/take-action`, payload);
  //
  //   return unwrapResponse(response);
  // },
};
