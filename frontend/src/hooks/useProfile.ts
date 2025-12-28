import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountService } from "@/services/account/account.service";
import {
  AccountProfileResponse,
  UpdateProfileRequest,
} from "@/services/account/account.types";
import { AppError } from "@/lib/api/api.error";

/**
 * Hook to get current user profile with full information
 * Including teacherId for teacher, studentId for student
 */
export const useProfile = () => {
  return useQuery<AccountProfileResponse, AppError>({
    queryKey: ["userProfile"],
    queryFn: accountService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to update current user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<AccountProfileResponse, AppError, UpdateProfileRequest>({
    mutationFn: accountService.updateProfile,
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(["userProfile"], data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });
};

/**
 * Hook to upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<{ avatarUrl: string }, AppError, File>({
    mutationFn: accountService.uploadAvatar,
    onSuccess: (data) => {
      // Update profile cache with new avatar
      queryClient.setQueryData(["userProfile"], (old: any) => {
        if (!old) return old;
        return { ...old, avatarUrl: data.avatarUrl };
      });

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success("Avatar uploaded successfully!");
    },
    onError: (error) => {
      console.error("Upload avatar error:", error);
      toast.error(error.message || "Failed to upload avatar");
    },
  });
};

/**
 * Helper hook to get teacherId from profile
 */
export const useTeacherId = () => {
  const { data: profile } = useProfile();
  return profile?.profile?.teacherId;
};

/**
 * Helper hook to get studentId from profile
 */
export const useStudentId = () => {
  const { data: profile } = useProfile();
  return profile?.profile?.studentId;
};

/**
 * Helper hook to check if user is approved teacher
 */
export const useIsApprovedTeacher = () => {
  const { data: profile } = useProfile();
  return profile?.role === "TEACHER" && profile?.profile?.approved === true;
};
