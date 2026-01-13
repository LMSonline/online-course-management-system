import { useQuery, useMutation } from '@tanstack/react-query';
import { accountProfileService } from '@/services/account/accountProfile.service';
import {
  AccountProfileResponse,
  UpdateProfileRequest,
  UploadAvatarResponse
} from '@/services/account/accountProfile.types';

export function useAccountProfile() {
  return useQuery<AccountProfileResponse>({
    queryKey: ['account-profile'],
    queryFn: () => accountProfileService.getProfile(),
  });
}

export function useUpdateAccountProfile() {
  return useMutation<AccountProfileResponse, unknown, UpdateProfileRequest>({
    mutationFn: (payload) => accountProfileService.updateProfile(payload),
  });
}

export function useUploadAvatar() {
  return useMutation<UploadAvatarResponse, unknown, File>({
    mutationFn: (file) => accountProfileService.uploadAvatar(file),
  });
}
