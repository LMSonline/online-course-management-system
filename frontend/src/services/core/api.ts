/**
 * Axios-based API client with authentication and token refresh
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getAccessToken } from "./token";
import { refreshAccessToken } from "./auth-refresh";
import { ApiError, NetworkError } from "./errors";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await refreshAccessToken();

        // Retry original request with new token
        const newToken = getAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - error already handled in refreshAccessToken
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new NetworkError(error.message));
    }

    // Handle API errors
    return Promise.reject(
      ApiError.fromResponse(
        error.response.status,
        error.response.data
      )
    );
  }
);

// Export typed response helper
export type ApiResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  code?: string;
  data: T;
  timestamp?: string;
};

// Paginated response
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
