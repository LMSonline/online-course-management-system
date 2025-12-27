import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
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

/**
 * Get device info from browser
 */
const getDeviceInfo = (): string => {
  return typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
};

/**
 * Get default IP address placeholder
 */
const getDefaultIpAddress = (): string => {
  return "127.0.0.1";
};

/**
 * Enrich request payload with device info and IP address
 */
const enrichWithDeviceInfo = <T extends Partial<{ deviceInfo?: string; ipAddress?: string }>>(
  payload: T
): T => {
  return {
    ...payload,
    deviceInfo: payload.deviceInfo ?? getDeviceInfo(),
    ipAddress: payload.ipAddress ?? getDefaultIpAddress(),
  };
};

export const authService = {
  /**
   * Authenticate user with email and password
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const enrichedPayload = enrichWithDeviceInfo(payload);
    
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/login`,
      enrichedPayload,
      {
        contractKey: CONTRACT_KEYS.AUTH_LOGIN,
      }
    );
    
    return unwrapResponse(response);
  },

  /**
   * Register a new user account
   */
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<ApiResponse<RegisterResponse>>(
      `${AUTH_PREFIX}/register`,
      payload
    );
    
    return unwrapResponse(response);
  },

  /**
   * Verify user email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    const response = await axiosClient.get<ApiResponse<void>>(
      `${AUTH_PREFIX}/verify-email`,
      {
        params: { token }
      }
    );
    
    return unwrapResponse(response);
  },

  /**
   * Resend email verification link
   */
  resendVerificationEmail: async (
    payload: ResendVerifyEmailRequest
  ): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/resend-verification`,
      payload
    );
    
    return unwrapResponse(response);
  },

  /**
   * Logout user and invalidate refresh token
   */
  logout: async (refreshToken: string): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/logout`,
      { refreshToken }
    );
    
    return unwrapResponse(response);
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (payload: RefreshTokenRequest): Promise<LoginResponse> => {
    const enrichedPayload = enrichWithDeviceInfo(payload);
    
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_PREFIX}/refresh`,
      enrichedPayload
    );
    
    return unwrapResponse(response);
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/forgot`,
      payload
    );
    
    return unwrapResponse(response);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    payload: ResetPasswordRequest,
    token: string
  ): Promise<void> => {
    const response = await axiosClient.post<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/reset`,
      payload,
      {
        params: { token }
      }
    );
    
    return unwrapResponse(response);
  },

  /**
   * Get current authenticated user
   * Endpoint: GET /api/v1/accounts/me
   * Returns: accountId, role, profile.studentId (if STUDENT), profile.teacherId (if TEACHER)
   */
  getCurrentUser: async (): Promise<MeUser> => {
    const response = await axiosClient.get<ApiResponse<MeUser>>(
      "/accounts/me",
      {
        contractKey: CONTRACT_KEYS.AUTH_ME,
      }
    );
    
    return unwrapResponse(response);
  },

  /**
   * Change user password
   */
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    const response = await axiosClient.put<ApiResponse<void>>(
      `${AUTH_PREFIX}/password/change`,
      payload
    );
    
    return unwrapResponse(response);
  },
};