/**
 * Auth service - handles authentication API calls
 * Migrated from services/public/auth.services.ts
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { setAccessToken, setRefreshToken, clearTokens } from "@/services/core/token";
import { unwrapApiResponse } from "@/services/core/unwrap";

const AUTH_PREFIX = "/auth";

export interface MeUser {
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: MeUser;
}

/**
 * Register a new user
 */
export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  langKey: string;
}): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    `${AUTH_PREFIX}/register`,
    payload
  );
  return response.data;
}

/**
 * Login user
 */
export async function loginUser(payload: {
  login: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
}): Promise<ApiResponse<LoginResponse>> {
  const body = {
    login: payload.login,
    password: payload.password,
    deviceInfo: payload.deviceInfo ?? (typeof navigator !== "undefined" ? navigator.userAgent : "unknown"),
    ipAddress: payload.ipAddress ?? "127.0.0.1",
  };

  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    `${AUTH_PREFIX}/login`,
    body
  );


  if (response.data.data) {
    setAccessToken(response.data.data.accessToken);
    setRefreshToken(response.data.data.refreshToken);
    // Set user role cookie for middleware
    if (typeof document !== "undefined" && response.data.data.user?.role) {
      document.cookie = `user-role=${response.data.data.user.role}; path=/; max-age=86400; SameSite=Lax`;
    }
  }

  return response.data;
}


export async function getCurrentUserInfo(): Promise<MeUser> {
  const response = await apiClient.get<ApiResponse<MeUser>>(`${AUTH_PREFIX}/me`);
  return unwrapApiResponse<MeUser>(response.data);
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiClient.post(`${AUTH_PREFIX}/logout`, { refreshToken });
  } finally {
    clearTokens();
  }
}


export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    `${AUTH_PREFIX}/refresh`,
    { refreshToken }
  );
  
  if (response.data.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }
  
  return response.data;
}


export async function verifyEmail(token: string): Promise<ApiResponse<void>> {
  const response = await apiClient.get<ApiResponse<void>>(
    `${AUTH_PREFIX}/verify-email?token=${encodeURIComponent(token)}`
  );
  return response.data;
}


export async function resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/resend-verification`,
    { email }
  );
  return response.data;
}


export async function forgotPassword(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/password/forgot`,
    { email }
  );
  return response.data;
}


export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/password/reset?token=${encodeURIComponent(token)}`,
    { newPassword }
  );
  return response.data;
}


export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<void>> {
  const response = await apiClient.put<ApiResponse<void>>(
    `${AUTH_PREFIX}/change-password`,
    payload
  );
  return response.data;
}

