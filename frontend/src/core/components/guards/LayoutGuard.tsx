"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { Loader2 } from "lucide-react";
import { ProfileMissingError } from "./ProfileMissingError";
import type { InternalRole } from "@/lib/auth/roleMap";

interface GuardProps {
    children: React.ReactNode;
    /**
     * Allowed roles for this guard
     * Use InternalRole: "STUDENT" | "TEACHER" | "ADMIN"
     */
    allowedRoles: InternalRole[];
    /**
     * If true, requires domain ID (studentId for STUDENT, teacherId for TEACHER)
     * This enforces: accountId != studentId != teacherId
     */
    requireDomainId?: boolean;
    redirectTo?: string;
}

/**
 * Client-side layout guard component
 * 
 * IMPORTANT: accountId != studentId != teacherId
 * - accountId: from AUTH_ME (authentication)
 * - studentId: from STUDENT_GET_ME (domain profile)
 * - teacherId: from TEACHER_GET_ME (domain profile)
 * 
 * This guard:
 * 1. Waits for auth bootstrap to complete (2-step hydration)
 * 2. Checks role from authStore (not JWT token)
 * 3. Verifies domain IDs (studentId/teacherId) if requireDomainId=true
 * 4. Shows fallback UI if domain profile missing
 */
export function LayoutGuard({
    children,
    allowedRoles,
    requireDomainId = false,
    redirectTo = "/login",
}: GuardProps) {
    const router = useRouter();
    const { role, studentId, teacherId, isAuthenticated } = useAuthStore();
    const { isLoading: isBootstrapLoading, isReady: isBootstrapReady } = useAuthBootstrap();
    const hasToken = !!tokenStorage.getAccessToken();

    // Wait for bootstrap to complete before checking auth
    if (hasToken && isBootstrapLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
                </div>
            </div>
        );
    }

    // If no token and bootstrap is ready (or no token at all), redirect to login
    if (!hasToken || (isBootstrapReady && !isAuthenticated())) {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // If bootstrap not ready yet but we have a token, wait
    if (hasToken && !isBootstrapReady) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Check if user has required role
    if (!role || !allowedRoles.includes(role)) {
        router.replace("/403");
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Access denied...</p>
                </div>
            </div>
        );
    }

    // If requireDomainId is true, check domain IDs
    if (requireDomainId) {
        // Check STUDENT role requires studentId
        if (role === "STUDENT" && !studentId) {
            return <ProfileMissingError role="STUDENT" />;
        }

        // Check TEACHER role requires teacherId
        if (role === "TEACHER" && !teacherId) {
            return <ProfileMissingError role="TEACHER" />;
        }
    }

    // All checks passed - render children
    return <>{children}</>;
}

/**
 * Admin guard - only allows ADMIN role
 * ADMIN only needs accountId, no domain ID required
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["ADMIN"]} requireDomainId={false}>{children}</LayoutGuard>;
}

/**
 * Teacher/Creator guard - only allows TEACHER role
 * Requires teacherId (domain ID) from TEACHER_GET_ME
 * 
 * Enforces: accountId != teacherId
 */
export function TeacherGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["TEACHER"]} requireDomainId={true}>{children}</LayoutGuard>;
}

/**
 * Student/User guard - only allows STUDENT role
 * Requires studentId (domain ID) from STUDENT_GET_ME
 * 
 * Enforces: accountId != studentId
 */
export function LearnerGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["STUDENT"]} requireDomainId={true}>{children}</LayoutGuard>;
}

/**
 * Student guard (alias for LearnerGuard)
 * Requires studentId (domain ID) from STUDENT_GET_ME
 */
export function StudentGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["STUDENT"]} requireDomainId={true}>{children}</LayoutGuard>;
}

/**
 * Creator guard (alias for TeacherGuard)
 * Requires teacherId (domain ID) from TEACHER_GET_ME
 */
export function CreatorGuard({ children }: { children: React.ReactNode }) {
    return <LayoutGuard allowedRoles={["TEACHER"]} requireDomainId={true}>{children}</LayoutGuard>;
}

/**
 * Auth guard - requires any authenticated user
 * Does NOT require domain IDs (for routes like /me/profile)
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <LayoutGuard allowedRoles={["ADMIN", "TEACHER", "STUDENT"]} requireDomainId={false}>
            {children}
        </LayoutGuard>
    );
}

/**
 * Guest guard - only allows unauthenticated users
 * Redirects authenticated users to their dashboard
 * 
 * Uses authStore to check authentication status (waits for bootstrap)
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { role, isAuthenticated } = useAuthStore();
    const { isLoading: isBootstrapLoading, isReady: isBootstrapReady } = useAuthBootstrap();
    const hasToken = !!tokenStorage.getAccessToken();

    // Wait for bootstrap if token exists
    if (hasToken && isBootstrapLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    // If authenticated and bootstrap ready, redirect to dashboard
    if (hasToken && isBootstrapReady && isAuthenticated() && role) {
        const dashboardUrl = getDashboardUrl(role);
        router.replace(dashboardUrl);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    // User is guest - render children
    return <>{children}</>;
}

/**
 * Helper function to get dashboard URL based on role
 */
function getDashboardUrl(role: InternalRole): string {
    switch (role) {
        case "ADMIN":
            return "/admin";
        case "TEACHER":
            return "/teacher/courses";
        case "STUDENT":
            return "/my-learning";
        default:
            return "/";
    }
}
