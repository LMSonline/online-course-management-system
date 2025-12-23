import { describe, it, expect, vi, beforeEach } from "vitest";
import { refreshAccessToken } from "../auth-refresh";
import { apiClient } from "../api";
import { getRefreshToken, setAccessToken, clearTokens } from "../token";
import type { ApiResponse } from "../api";

// Mock dependencies
vi.mock("../api");
vi.mock("../token");

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should refresh token successfully", async () => {
    const mockRefreshToken = "refresh-token-123";
    const mockAccessToken = "new-access-token-456";

    vi.mocked(getRefreshToken).mockReturnValue(mockRefreshToken);
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: "OK",
        data: { accessToken: mockAccessToken },
      } as ApiResponse<{ accessToken: string }>,
    });

    const result = await refreshAccessToken();

    expect(result).toBe(mockAccessToken);
    expect(apiClient.post).toHaveBeenCalledWith("/auth/refresh", {
      refreshToken: mockRefreshToken,
    });
    expect(setAccessToken).toHaveBeenCalledWith(mockAccessToken);
  });

  it("should throw if no refresh token", async () => {
    vi.mocked(getRefreshToken).mockReturnValue(null);

    await expect(refreshAccessToken()).rejects.toThrow("No refresh token available");
    expect(clearTokens).toHaveBeenCalled();
  });

  it("should use single-flight lock", async () => {
    const mockRefreshToken = "refresh-token-123";
    const mockAccessToken = "new-access-token-456";

    vi.mocked(getRefreshToken).mockReturnValue(mockRefreshToken);
    vi.mocked(apiClient.post).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                data: {
                  success: true,
                  status: 200,
                  message: "OK",
                  data: { accessToken: mockAccessToken },
                } as ApiResponse<{ accessToken: string }>,
              }),
            100
          );
        })
    );

    // Call refresh twice simultaneously
    const promise1 = refreshAccessToken();
    const promise2 = refreshAccessToken();

    const [result1, result2] = await Promise.all([promise1, promise2]);

    // Both should resolve to the same token
    expect(result1).toBe(mockAccessToken);
    expect(result2).toBe(mockAccessToken);
    // But API should only be called once
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });
});

