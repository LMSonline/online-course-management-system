/**
 * Profile service - handles user profile API calls
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { USE_MOCK } from "@/config/runtime";
import { unwrapApiResponse } from "@/services/core/unwrap";

export interface AccountProfileDetails {
  studentId?: number;
  teacherId?: number;
  studentCode?: string;
  teacherCode?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  bio?: string;
  gender?: string;
}

export interface AccountProfileResponse {
  accountId: number;
  username: string;
  email: string;
  status: string;
  avatarUrl: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
  lastLoginAt?: string;
  // Flattened helpers for existing UI usage
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  // Nested profile coming from backend; includes studentId/teacherId, etc.
  profile?: AccountProfileDetails;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<AccountProfileResponse> {
  if (USE_MOCK) {
    const cached = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (cached) {
      return Promise.resolve(JSON.parse(cached));
    }
    return Promise.resolve({
      accountId: 1,
      username: "mockuser",
      email: "mock@example.com",
      status: "ACTIVE",
      avatarUrl: null,
      role: "STUDENT",
      profile: {
        studentId: 1,
        fullName: "Mock User",
      },
    });
  }

  const response = await apiClient.get<ApiResponse<AccountProfileResponse>>("/accounts/me");
  return unwrapApiResponse<AccountProfileResponse>(response.data);
}

/**
 * Update user profile
 */
export async function updateProfile(payload: UpdateProfileRequest): Promise<AccountProfileResponse> {
  if (USE_MOCK) {
    const current = await getProfile();
    return Promise.resolve({ ...current, ...payload });
  }

  const response = await apiClient.put<ApiResponse<AccountProfileResponse>>("/accounts/me", payload);
  return unwrapApiResponse<AccountProfileResponse>(response.data);
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      avatarUrl: "https://example.com/avatars/mock.jpg",
    });
  }

  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<ApiResponse<UploadAvatarResponse>>("/accounts/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapApiResponse<UploadAvatarResponse>(response.data);
}

