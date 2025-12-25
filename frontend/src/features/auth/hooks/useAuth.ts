"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

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
    role: store.role,
    status: store.status,
    loading: store.loading,
    error: store.error,
    isAuthenticated: store.isAuthenticated,
    isGuest: store.status === "guest",
    fetchMe: store.fetchMe,
    login: store.login,
    logout: store.logout,
    setError: store.setError,
  };
}

/**
 * Lightweight hook to wait for auth bootstrap and access IDs
 */
export function useAuthBootstrap() {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.loaded && store.status === "unknown") {
      store.bootstrapFromTokens();
    }
  }, [store.loaded, store.status, store.bootstrapFromTokens]);

  return {
    loaded: store.loaded,
    isAuthenticated: store.isAuthenticated,
    role: store.role,
    userId: store.userId,
    studentId: store.studentId,
    teacherId: store.teacherId,
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

