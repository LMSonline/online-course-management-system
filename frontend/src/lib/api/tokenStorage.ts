export const tokenStorage = {
  getAccessToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  },

  getRefreshToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null;
  },

  setTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === "undefined") return;

    // Store in localStorage
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // Also store in cookies for middleware access
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
    }
  },

  clear() {
    if (typeof window === "undefined") return;

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};
