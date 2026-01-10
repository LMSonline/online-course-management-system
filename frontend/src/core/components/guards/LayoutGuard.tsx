"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { decodeJWT, isTokenExpired } from "@/lib/utils/jwt";
import type { UserRole } from "@/services/auth/auth.types";
import { Loader2 } from "lucide-react";

interface GuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

/**
 * Client-side layout guard component
 * Protects routes by checking authentication and role-based access
 */
export function LayoutGuard({
    children,
    allowedRoles,
    redirectTo = "/login",
}: GuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = tokenStorage.getAccessToken();

                // No token - redirect to login
                if (!token) {
                    const currentPath = window.location.pathname;
                    router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
                    return;
                }

                // Token expired - redirect to login
                if (isTokenExpired(token)) {
                    tokenStorage.clear();
                    const currentPath = window.location.pathname;
                    router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
                    return;
                }

                // Decode token and check role
                const decoded = decodeJWT(token);
                if (!decoded) {
                    tokenStorage.clear();
                    const currentPath = window.location.pathname;
                    router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
                    return;
                }

                // Check if user has required role
                if (!allowedRoles.includes(decoded.role)) {
                    router.replace("/403");
                    return;
                }

                // All checks passed
                setIsAuthorized(true);
                setIsChecking(false);
            } catch (error) {
                console.error("Auth check error:", error);
                tokenStorage.clear();
                router.replace(redirectTo);
                setIsChecking(false);
            }
        };

        // Small delay to allow token to be set after login
        const timeoutId = setTimeout(checkAuth, 50);
        return () => clearTimeout(timeoutId);
    }, [router, allowedRoles, redirectTo]);

    // Show loading state while checking
    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authorized (redirect is in progress)
    if (!isAuthorized) {
        return null;
    }

    // Render children if authorized
    return <>{children}</>;
}

/**
 * Admin guard - only allows ADMIN role
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["ADMIN"]}>{children}</LayoutGuard>;
}

/**
 * Teacher guard - only allows TEACHER role
 */
export function TeacherGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["TEACHER"]}>{children}</LayoutGuard>;
}

/**
 * Learner guard - only allows STUDENT role
 */
export function LearnerGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["STUDENT"]}>{children}</LayoutGuard>;
}

/**
 * Auth guard - requires any authenticated user
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <LayoutGuard allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
            {children}
        </LayoutGuard>
    );
}

/**
 * Guest guard - only allows unauthenticated users
 * Redirects authenticated users to their dashboard
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isGuest, setIsGuest] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Small delay to allow login flow to complete first
        const checkGuest = () => {
            try {
                const token = tokenStorage.getAccessToken();

                // No token or expired - user is guest
                if (!token || isTokenExpired(token)) {
                    setIsGuest(true);
                    setIsChecking(false);
                    return;
                }

                // Valid token - redirect to dashboard
                const decoded = decodeJWT(token);
                if (decoded) {
                    const dashboardUrl = getDashboardUrl(decoded.role);
                    router.replace(dashboardUrl);
                    return;
                }

                setIsGuest(true);
            } catch {
                setIsGuest(true);
            } finally {
                setIsChecking(false);
            }
        };

        // Delay check to avoid race condition with login
        const timeoutId = setTimeout(checkGuest, 100);
        return () => clearTimeout(timeoutId);
    }, [router]);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isGuest) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Helper function to get dashboard URL based on role
 */
function getDashboardUrl(role: UserRole): string {
    switch (role) {
        case "ADMIN":
            return "/admin/dashboard";
        case "TEACHER":
            return "/teacher/dashboard";
        case "STUDENT":
            return "/learner/dashboard";
        default:
            return "/";
    }
}
