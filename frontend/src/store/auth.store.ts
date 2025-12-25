"use client";

import { create } from "zustand";
import { getCurrentUserInfo, type MeUser } from "@/services/auth";
import { getProfile, type AccountProfileResponse } from "@/features/profile/services/profile.service";
import { getAccessToken, getRefreshToken, clearTokens } from "@/services/core/token";

interface AuthState {
  status: "unknown" | "authenticated" | "guest";
  user: MeUser | null;
  role: MeUser["role"] | null;
  userId: number | null;
  studentId: number | null;
  teacherId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  bootstrapFromTokens: () => Promise<void>;
  fetchMe: () => Promise<void>;
  login: (
    user: MeUser,
    profile?: AccountProfileResponse | null,
    tokens?: { accessToken: string; refreshToken: string }
  ) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setUser: (user: MeUser | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  status: "unknown",
  user: null,
  role: null,
  userId: null,
  studentId: null,
  teacherId: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loaded: false,
  loading: false,
  error: null,

  // Bootstrap: Check if user is authenticated from existing tokens
  bootstrapFromTokens: async () => {
    const token = getAccessToken();
    if (!token) {
      set({
        status: "guest",
        user: null,
        role: null,
        userId: null,
        studentId: null,
        teacherId: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        loaded: true,
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      const [user, profile] = await Promise.all([getCurrentUserInfo(), getProfile()]);
      set({
        status: "authenticated",
        user,
        role: user.role,
        userId: user.accountId,
        studentId: profile.profile?.studentId ?? null,
        teacherId: profile.profile?.teacherId ?? null,
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken(),
        isAuthenticated: true,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      // Token invalid or expired
      clearTokens();
      set({
        status: "guest",
        user: null,
        role: null,
        userId: null,
        studentId: null,
        teacherId: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  },

  // Fetch current user info and profile
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const [user, profile] = await Promise.all([getCurrentUserInfo(), getProfile()]);
      set({
        status: "authenticated",
        user,
        role: user.role,
        userId: user.accountId,
        studentId: profile.profile?.studentId ?? null,
        teacherId: profile.profile?.teacherId ?? null,
        accessToken: getAccessToken(),
        refreshToken: getRefreshToken(),
        isAuthenticated: true,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch user";
      clearTokens();
      set({
        status: "guest",
        user: null,
        role: null,
        userId: null,
        studentId: null,
        teacherId: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        loaded: true,
        error: message,
      });
      throw error;
    }
  },

  // Login: Set user after successful login
  login: (user, profile, tokens) => {
    set({
      status: "authenticated",
      user,
      role: user.role,
      userId: user.accountId,
      studentId: profile?.profile?.studentId ?? null,
      teacherId: profile?.profile?.teacherId ?? null,
      accessToken: tokens?.accessToken ?? getAccessToken(),
      refreshToken: tokens?.refreshToken ?? getRefreshToken(),
      isAuthenticated: true,
      loading: false,
      loaded: true,
      error: null,
    });
  },

  // Logout: Clear state
  logout: () => {
    clearTokens();
    if (typeof document !== "undefined") {
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    set({
      status: "guest",
      user: null,
      role: null,
      userId: null,
      studentId: null,
      teacherId: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      loaded: true,
      error: null,
    });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Set user (for updating user data after profile changes)
  setUser: (user: MeUser | null) => {
    set({ user });
  },
}));
