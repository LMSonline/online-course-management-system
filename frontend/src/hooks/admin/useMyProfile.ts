"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/account/account.service";
import type {
  AccountProfile,
  UpdateProfilePayload,
} from "@/lib/admin/account-profile.types";

/* ======================================================
 * GET: My Profile
 * ====================================================== */
export const useMyProfile = (enabled = true) => {
  return useQuery<AccountProfile>({
    queryKey: ["account", "me"],
    queryFn: () => accountService.getProfile(),
    enabled,
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};
/* ======================================================
 * PUT: Update My Profile
 * ====================================================== */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      accountService.updateProfile(payload),

    onSuccess: () => {
      // refetch profile sau khi update
      queryClient.invalidateQueries({
        queryKey: ["account", "me"],
      });
    },
  });
};

/* ======================================================
 * POST: Upload Avatar
 * ====================================================== */
export const useUploadMyAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => accountService.uploadAvatar(file),

    onSuccess: () => {
      // avatar thay đổi → reload profile
      queryClient.invalidateQueries({
        queryKey: ["account", "me"],
      });
    },
  });
};
