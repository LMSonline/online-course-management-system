"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { MeUser } from "@/services/auth";

/**
 * Hook to access auth state and actions
 * 
 * Usage:
 *   const { user, role, status, loading, error, fetchMe, logout } = useAuth();
 */
export function useAuth() {
  const store = useAuthStore();

  // Bootstrap on mount if status is unknown
  useEffect(() => {
    if (store.status === "unknown") {
      store.bootstrapFromTokens();
    }
  }, [store.status, store.bootstrapFromTokens]);

  return {
    user: store.user,
    role: store.user?.role || null,
    status: store.status,
    loading: store.loading,
    error: store.error,
    isAuthenticated: store.status === "authenticated",
    isGuest: store.status === "guest",
    fetchMe: store.fetchMe,
    login: store.login,
    logout: store.logout,
    setError: store.setError,
  };
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, loading, status } = useAuth();

  useEffect(() => {
    if (!loading && status === "guest") {
      // Redirect handled by middleware, but this provides client-side guard
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, [isAuthenticated, loading, status]);

  return { isAuthenticated, loading };
}

