// src/services/account/account.service.ts

import { axiosClient } from "@/lib/api/axios";

import type {
    AccountProfile, UpdateProfilePayload,
    UploadAvatarResponse,
} from "@/lib/admin/account-profile.types";
import type { ApiResponse } from "@/lib/api/api.types";

const PREFIX = "/accounts/me";

export const accountService = {
    /* =======================
     * Get current profile
     * ======================= */
    async getMyProfile(): Promise<AccountProfile> {
  const res = await axiosClient.get<ApiResponse<AccountProfile>>(PREFIX);

  if (!res.data.data) {
    throw new Error("Profile not found");
  }

  return res.data.data;
}
,

    /* =======================
     * Update profile
     * ======================= */
    async updateMyProfile(
        payload: UpdateProfilePayload
    ): Promise<AccountProfile> {
        const res = await axiosClient.put<AccountProfile>(PREFIX, payload);
        return res.data;
    },

    /* =======================
     * Upload avatar
     * ======================= */
    async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosClient.post<UploadAvatarResponse>(
            `${PREFIX}/avatar`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data;
    },
};
