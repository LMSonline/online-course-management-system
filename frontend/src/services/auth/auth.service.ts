import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  MeUser,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerifyEmailRequest,
} from "./auth.types";

const AUTH_PREFIX = "/auth";

export const authService = {
  // Login
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const body: LoginRequest = {
      ...payload,
      deviceInfo:
        payload.deviceInfo ??
        (typeof navigator !== "undefined" ? navigator.userAgent : "unknown"),
      ipAddress: payload.ipAddress ?? "127.0.0.1",
    };

    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/login`,
      body
    );
    return unwrapResponse(response);
  },

  // Register
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<ApiResponse<RegisterResponse>>(
      `${AUTH_PREFIX}/register`,
      payload
    );
    return unwrapResponse(response);
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<void> => {
    const response = await axiosClient.get<ApiResponse<void>>(
      `${AUTH_PREFIX}/verify-email?token=${encodeURIComponent(token)}`
    );
    return unwrapResponse(response);
  },

  // Resend Verification Email
  resendVerificationEmail: async (
    payload: ResendVerifyEmailRequest
  ): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/resend-verification`,
      payload
    );
    return unwrapResponse(response);
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/logout`,
      { refreshToken }
    );
    return unwrapResponse(response);
  },

  // Refresh Token
  refreshToken: async (
    payload: RefreshTokenRequest
  ): Promise<LoginResponse> => {
    const body: RefreshTokenRequest = {
      ...payload,
      deviceInfo:
        payload.deviceInfo ??
        (typeof navigator !== "undefined" ? navigator.userAgent : "unknown"),
      ipAddress: payload.ipAddress ?? "127.0.0.1",
    };

    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/refresh`,
      body
    );
    return unwrapResponse(response);
  },

  // Forgot Password
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/forgot`,
      payload
    );
    return unwrapResponse(response);
  },

  // Reset Password
  resetPassword: async (
    payload: ResetPasswordRequest,
    token: string
  ): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/reset?token=${encodeURIComponent(token)}`,
      payload
    );
    return unwrapResponse(response);
  },

  // Get Current User
  getCurrentUser: async (): Promise<MeUser> => {
    const response = await axiosClient.get<ApiResponse<MeUser>>(
      `${AUTH_PREFIX}/me`
    );
    return unwrapResponse(response);
  },

  // Change Password
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    const response = await axiosClient.put<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/change`,
      payload
    );
    return unwrapResponse(response);
  },
};
