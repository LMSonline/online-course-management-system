import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import { ENV } from "@/lib/env";
import { tokenStorage } from "./tokenStorage";
import { AppError } from "./api.error";
import type { ContractKey } from "./contractKeys";

// Extend AxiosRequestConfig to support contractKey
declare module "axios" {
  export interface AxiosRequestConfig {
    contractKey?: ContractKey;
  }
}

// Ensure baseURL includes /api/v1
const getBaseURL = () => {
  const baseURL = ENV.API.BASE_API_URL;
  // If baseURL doesn't end with /api/v1, ensure it does
  if (!baseURL.endsWith("/api/v1")) {
    // If it ends with /api, add /v1, otherwise add /api/v1
    if (baseURL.endsWith("/api")) {
      return `${baseURL}/v1`;
    }
    return baseURL.endsWith("/") ? `${baseURL}api/v1` : `${baseURL}/api/v1`;
  }
  return baseURL;
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
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Attach contractKey to header if provided
    if (config.contractKey && config.headers) {
      config.headers["X-Contract-Key"] = config.contractKey;
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

        // Use full path /api/v1/auth/refresh (baseURL already includes /api/v1)
        const res = await refreshClient.post("/auth/refresh", {
          refreshToken,
        });

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

