/**
 * Token refresh mechanism with single-flight lock
 * Prevents multiple simultaneous refresh requests
 */

import { apiClient } from "./api";
import { getRefreshToken, setAccessToken, clearTokens } from "./token";
import { AuthError } from "./errors";
import type { ApiResponse } from "./api";

const REFRESH_ENDPOINT = "/auth/refresh";

let refreshPromise: Promise<string> | null = null;

/**
 * Attempts to refresh the access token using the refresh token
 * Uses a single-flight lock to prevent multiple simultaneous refresh requests
 */
export async function refreshAccessToken(): Promise<string> {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new AuthError("No refresh token available");
  }

  // Create the refresh promise
  refreshPromise = (async () => {
    try {
      const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
        REFRESH_ENDPOINT,
        { refreshToken }
      );

      const newAccessToken = response.data?.data?.accessToken;
      if (!newAccessToken) {
        throw new AuthError("Invalid refresh response");
      }

      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error: any) {
      // Refresh failed - clear tokens and redirect
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new AuthError("Token refresh failed");
    } finally {
      // Clear the promise so future requests can retry
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

