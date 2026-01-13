// Hooks cho profile APIs của learner
import { useQuery, useMutation } from '@tanstack/react-query';
import { learnerProfileService } from '../../services/learner/profileService';
import { StudentProfileResponse } from '../../lib/learner/profile/profiles';

/** Lấy thông tin profile của student */
export function useProfile(studentId: number) {
  return useQuery<StudentProfileResponse>({
    queryKey: ['learner-profile', studentId],
    queryFn: () => learnerProfileService.getProfile(studentId),
    enabled: !!studentId,
  });
}

/** Cập nhật thông tin profile của student */
export function useUpdateProfile(studentId: number) {
  return useMutation({
    mutationFn: (data: Partial<{ fullName: string; avatarUrl: string; phone: string; birthday: string; gender: string; address: string }>) =>
      learnerProfileService.updateProfile(studentId, data),
  });
}
