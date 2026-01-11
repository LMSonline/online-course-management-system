// Service cho profile APIs của learner
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { StudentProfileResponse } from '@/lib/learner/profile/profiles';

export const learnerProfileService = {
  /** Lấy thông tin profile của student */
  getProfile: async (studentId: number): Promise<StudentProfileResponse> => {
    const res = await axiosClient.get(`students/${studentId}/profile`);
    return unwrapResponse(res);
  },

  /** Cập nhật thông tin profile của student */
  updateProfile: async (studentId: number, data: Partial<{ fullName: string; avatarUrl: string; phone: string; birthday: string; gender: string; address: string }>): Promise<StudentProfileResponse> => {
    const res = await axiosClient.put(`/students/${studentId}/profile`, data);
    return unwrapResponse(res);
  },
};
