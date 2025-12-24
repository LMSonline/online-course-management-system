import { apiClient } from "@/lib/api/api";
import { MeUser } from "@/services/auth/auth.types";

const AUTH_PREFIX = `/auth`;

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  langKey: string;
}) {
  return apiClient(`${AUTH_PREFIX}/register`, {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function loginUser(payload: {
  login: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
}) {
  const body = {
    login: payload.login,
    password: payload.password,
    deviceInfo:
      payload.deviceInfo ??
      (typeof navigator !== "undefined" ? navigator.userAgent : "unknown"),
    ipAddress: payload.ipAddress ?? "127.0.0.1",
  };

  return apiClient(`${AUTH_PREFIX}/login`, {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
  });
}

export async function verifyEmail(token: string) {
  const url = `${AUTH_PREFIX}/verify-email?token=${encodeURIComponent(token)}`;
  return apiClient(url, { method: "GET" });
}

export async function resendVerificationEmail(email: string) {
  return apiClient(`${AUTH_PREFIX}/resend-verification-email`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function logout(refreshToken: string) {
  return apiClient(`${AUTH_PREFIX}/logout`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function refreshToken(refreshToken: string) {
  return apiClient(`${AUTH_PREFIX}/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function forgotPassword(email: string) {
  return apiClient(`${AUTH_PREFIX}/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  const url = `${AUTH_PREFIX}/reset-password?token=${encodeURIComponent(
    token
  )}`;
  return apiClient(url, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}

export async function getCurrentUserInfo(): Promise<MeUser> {
  const res = await apiClient(`${AUTH_PREFIX}/me`, { method: "GET" });
  return res.data as MeUser;
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  return apiClient(`${AUTH_PREFIX}/change-password`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function suspendAccount(id: number, reason?: string) {
  return apiClient(`/admin/accounts/${id}/suspend`, {
    method: "POST",
    body: JSON.stringify(reason ? { reason } : {}),
  });
}

export async function unlockAccount(id: number, reason?: string) {
  return apiClient(`/admin/accounts/${id}/unlock`, {
    method: "POST",
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
