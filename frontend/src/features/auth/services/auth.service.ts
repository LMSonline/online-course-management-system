/**
 * Auth service - handles authentication API calls
 * Migrated from services/public/auth.services.ts
 */

import { apiClient, type ApiResponse } from "@/services/core/api";
import { setAccessToken, setRefreshToken, clearTokens } from "@/services/core/token";

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

  // Store tokens
  if (response.data.data) {
    setAccessToken(response.data.data.accessToken);
    setRefreshToken(response.data.data.refreshToken);
  }

  return response.data;
}

/**
 * Get current user info
 */
export async function getCurrentUserInfo(): Promise<MeUser> {
  const response = await apiClient.get<ApiResponse<MeUser>>(`${AUTH_PREFIX}/me`);
  return response.data.data;
}

/**
 * Logout user
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiClient.post(`${AUTH_PREFIX}/logout`, { refreshToken });
  } finally {
    clearTokens();
  }
}

/**
 * Refresh access token
 */
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

/**
 * Verify email
 */
export async function verifyEmail(token: string): Promise<ApiResponse<void>> {
  const response = await apiClient.get<ApiResponse<void>>(
    `${AUTH_PREFIX}/verify-email?token=${encodeURIComponent(token)}`
  );
  return response.data;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/resend-verification`,
    { email }
  );
  return response.data;
}

/**
 * Forgot password
 */
export async function forgotPassword(email: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/password/forgot`,
    { email }
  );
  return response.data;
}

/**
 * Reset password
 */
export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  const response = await apiClient.post<ApiResponse<void>>(
    `${AUTH_PREFIX}/password/reset?token=${encodeURIComponent(token)}`,
    { newPassword }
  );
  return response.data;
}

/**
 * Change password
 */
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

