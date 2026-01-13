import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import {
  AccountProfileResponse,
  UploadAvatarResponse,
  UpdateProfileRequest
} from './account.types';

const ACCOUNT_PREFIX = '/accounts';

export const accountProfileService = {
  /** Lấy thông tin profile user hiện tại */
  getProfile: async (): Promise<AccountProfileResponse> => {
    const res = await axiosClient.get(`${ACCOUNT_PREFIX}/me`);
    return unwrapResponse(res);
  },

  /** Cập nhật thông tin profile user hiện tại */
  updateProfile: async (payload: UpdateProfileRequest): Promise<AccountProfileResponse> => {
    const res = await axiosClient.put(`${ACCOUNT_PREFIX}/me`, payload);
    return unwrapResponse(res);
  },

  /** Upload avatar user hiện tại */
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post(`${ACCOUNT_PREFIX}/me/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapResponse(res);
  },
};
