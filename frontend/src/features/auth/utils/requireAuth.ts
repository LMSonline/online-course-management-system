/**
 * Client-side auth guard utility
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/services/core/token";

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

