import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse, PageResponse } from "@/lib/api/api.types";
import {
  UpdateProfileRequest,
  AccountActionRequest,
  UpdateStatusRequest,
  RejectRequest,
  AccountResponse,
  AccountProfileResponse,
  UploadAvatarResponse,
  AccountActionLogResponse,
  AccountActionType,
} from "./account.types";

const ACCOUNT_PREFIX = "/accounts";
const ADMIN_ACCOUNT_PREFIX = "/admin/accounts";

export const accountService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<AccountProfileResponse> => {
    const response = await axiosClient.get<ApiResponse<AccountProfileResponse>>(
      `${ACCOUNT_PREFIX}/me`
    );

    return unwrapResponse(response);
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResponse<UploadAvatarResponse>>(
      `${ACCOUNT_PREFIX}/me/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    payload: UpdateProfileRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.put<ApiResponse<AccountProfileResponse>>(
      `${ACCOUNT_PREFIX}/me`,
      payload
    );

    return unwrapResponse(response);
  },

  /**
   * Get all accounts (Admin only)
   */
  getAllAccounts: async (
    page?: number,
    size?: number,
    filter?: string
  ): Promise<PageResponse<AccountResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<AccountResponse>>
    >(ADMIN_ACCOUNT_PREFIX, {
      params: {
        page,
        size,
        filter,
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Get account by ID (Admin only)
   */
  getAccountById: async (id: number): Promise<AccountProfileResponse> => {
    const response = await axiosClient.get<ApiResponse<AccountProfileResponse>>(
      `${ADMIN_ACCOUNT_PREFIX}/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Approve teacher account (Admin only)
   */
  approveTeacherAccount: async (
    id: number
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.patch<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/approve`);

    return unwrapResponse(response);
  },

  /**
   * Reject teacher account (Admin only)
   */
  rejectTeacherAccount: async (
    id: number,
    payload: RejectRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.patch<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/reject`, payload);

    return unwrapResponse(response);
  },

  /**
   * Change account status (Admin only)
   */
  changeAccountStatus: async (
    id: number,
    payload: UpdateStatusRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.patch<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/status`, payload);

    return unwrapResponse(response);
  },

  /**
   * Suspend account (Admin only)
   */
  suspendAccount: async (
    id: number,
    payload?: AccountActionRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.post<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/suspend`, payload || {});

    return unwrapResponse(response);
  },

  /**
   * Unlock suspended account (Admin only)
   */
  unlockAccount: async (
    id: number,
    payload?: AccountActionRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.post<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/unlock`, payload || {});

    return unwrapResponse(response);
  },

  /**
   * Deactivate account (Admin only)
   */
  deactivateAccount: async (
    id: number,
    payload?: AccountActionRequest
  ): Promise<AccountProfileResponse> => {
    const response = await axiosClient.post<
      ApiResponse<AccountProfileResponse>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/deactivate`, payload || {});

    return unwrapResponse(response);
  },

  /**
   * Get account activity logs (Admin only)
   */
  getAccountActivityLogs: async (
    id: number,
    actionType?: AccountActionType,
    page?: number,
    size?: number
  ): Promise<PageResponse<AccountActionLogResponse>> => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<AccountActionLogResponse>>
    >(`${ADMIN_ACCOUNT_PREFIX}/${id}/logs`, {
      params: {
        actionType,
        page,
        size,
      },
    });

    return unwrapResponse(response);
  },

  /**
   * Delete account by ID (Admin only)
   */
  deleteAccountById: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`${ADMIN_ACCOUNT_PREFIX}/${id}`);
  },
};
