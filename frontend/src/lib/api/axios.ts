import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/lib/env";
import { tokenStorage } from "./tokenStorage";
import { AppError } from "./api.error";

export const axiosClient = axios.create({
  baseURL: ENV.API.BASE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const refreshClient = axios.create({
  baseURL: ENV.API.BASE_API_URL,
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
        if (!refreshToken) {
          tokenStorage.clear();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(new Error("No refresh token"));
        }

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

    throw new AppError(
      error.response?.data?.message || "Request failed",
      error.response?.status || 500,
      error.response?.data?.code || "UNKNOWN_ERROR"
    );
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    //  Bypass for file download (blob)
    if (
      error.response?.request?.responseType === "blob" ||
      error.config?.responseType === "blob"
    ) {
      return Promise.reject(error);
    }

    throw new AppError(
      error.response?.data?.message || "Request failed",
      error.response?.status || 500,
      error.response?.data?.code || "UNKNOWN_ERROR"
    );
  }
);
