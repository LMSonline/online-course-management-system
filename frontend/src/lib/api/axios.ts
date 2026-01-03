import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import { ENV, DEMO_MODE } from "@/lib/env";
import { tokenStorage } from "./tokenStorage";
import { AppError } from "./api.error";
import type { ContractKey } from "./contractKeys";

// Extend AxiosRequestConfig to support contractKey
declare module "axios" {
  export interface AxiosRequestConfig {
    contractKey?: ContractKey;
  }
}

// Get baseURL from ENV (already handles /api/v1 correctly)
const getBaseURL = () => {
  return ENV.API.BASE_API_URL;
};

export const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}


// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // DEMO_MODE: Skip Authorization header and contract key
    if (!DEMO_MODE) {
      const token = tokenStorage.getAccessToken();
      const hasAuthHeader = !!(token && config.headers);
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Attach contractKey to header if provided
      if (config.contractKey && config.headers) {
        config.headers["X-Contract-Key"] = config.contractKey;
      }
    }
    
    // DEV: Log every request
    if (process.env.NODE_ENV === "development") {
      const method = config.method?.toUpperCase() || "GET";
      const url = config.url || "";
      const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;
      console.log(`[Axios] ${method} ${fullUrl}`, {
        hasAuthHeader,
        contractKey: config.contractKey,
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    // DEMO_MODE: Skip token refresh logic
    if (DEMO_MODE) {
      const contractKey = (error.config as AxiosRequestConfig)?.contractKey;
      throw new AppError(
        error.response?.data?.message || "Request failed",
        error.response?.status || 500,
        error.response?.data?.code || "UNKNOWN_ERROR",
        contractKey
      );
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        // Get device info and IP address (same as auth.service)
        const getDeviceInfo = (): string => {
          return typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
        };

        const getDefaultIpAddress = (): string => {
          return "127.0.0.1";
        };

        // Refresh token payload with deviceInfo and ipAddress
        const refreshPayload = {
          refreshToken,
          deviceInfo: getDeviceInfo(),
          ipAddress: getDefaultIpAddress(),
        };

        // Use /auth/refresh (baseURL already includes /api/v1)
        const res = await refreshClient.post("/auth/refresh", refreshPayload);

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        tokenStorage.setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenStorage.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract contractKey from request config if available
    const contractKey = (originalRequest as AxiosRequestConfig)?.contractKey;

    throw new AppError(
      error.response?.data?.message || "Request failed",
      error.response?.status || 500,
      error.response?.data?.code || "UNKNOWN_ERROR",
      contractKey
    );
  }
);

