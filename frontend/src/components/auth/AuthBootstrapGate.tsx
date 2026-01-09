"use client";

import { usePathname } from "next/navigation";
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { DEMO_MODE } from "@/lib/env";

/**
 * Public routes that don't require auth
 */
const PUBLIC_ROUTES = [
  "/",
  "/explore",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/403",
  "/500",
  "/loading",
];

/**
 * Auth routes (guest only)
 */
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

interface AuthBootstrapGateProps {
  children: React.ReactNode;
}

/**
 * AuthBootstrapGate Component
 * 
 * Handles auth bootstrap flow:
 * - For public routes: render children immediately
 * - For protected routes: wait for auth bootstrap to complete
 * - Shows loading state while bootstrap is in progress
 */
export function AuthBootstrapGate({ children }: AuthBootstrapGateProps) {
  const pathname = usePathname();
  const hasToken = !!tokenStorage.getAccessToken();
  const isPublic = isPublicRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  // For protected routes, bootstrap auth (always call hook, conditionally use result)
  const { isLoading, isReady, error } = useAuthBootstrap();

  // DEMO_MODE: Always render children, skip all auth checks
  if (DEMO_MODE) {
    return <>{children}</>;
  }

  // For public routes, render immediately
  if (isPublic) {
    return <>{children}</>;
  }

  // If no token and not on auth route, redirect will be handled by middleware
  if (!hasToken && !isAuth) {
    return <>{children}</>;
  }

  // Show loading state while bootstrap is in progress
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If bootstrap failed and we have an error, still render children
  // (error handling will be done by individual pages/guards)
  if (error && !isReady) {
    return <>{children}</>;
  }

  // Render children when ready (or if public route)
  return <>{children}</>;
}

