"use client";

import { create } from "zustand";
import { getCurrentUserInfo, type MeUser } from "@/services/auth";
import { getAccessToken, clearTokens } from "@/services/core/token";

interface AuthState {
  status: "unknown" | "authenticated" | "guest";
  user: MeUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  bootstrapFromTokens: () => Promise<void>;
  fetchMe: () => Promise<void>;
  login: (user: MeUser) => void;
  logout: () => void;
  setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  status: "unknown",
  user: null,
  loading: false,
  error: null,

  // Bootstrap: Check if user is authenticated from existing tokens
  bootstrapFromTokens: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ status: "guest", user: null, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const user = await getCurrentUserInfo();
      set({ status: "authenticated", user, loading: false, error: null });
    } catch (error) {
      // Token invalid or expired
      clearTokens();
      set({ status: "guest", user: null, loading: false, error: null });
    }
  },

  // Fetch current user info
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getCurrentUserInfo();
      set({ status: "authenticated", user, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch user";
      set({ status: "guest", user: null, loading: false, error: message });
      throw error;
    }
  },

  // Login: Set user after successful login
  login: (user: MeUser) => {
    set({ status: "authenticated", user, loading: false, error: null });
  },

  // Logout: Clear state
  logout: () => {
    clearTokens();
    // Clear auth cookie
    if (typeof document !== "undefined") {
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    set({ status: "guest", user: null, loading: false, error: null });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },
}));

