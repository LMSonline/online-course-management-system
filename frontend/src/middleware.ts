import { NextRequest, NextResponse } from "next/server";
import { decodeJWT, isTokenExpired } from "@/lib/utils/jwt";
import type { UserRole } from "@/services/auth/auth.types";
import { DEMO_MODE } from "@/lib/env";

// Route configuration
const PUBLIC_ROUTES = [
  "/",
  "/explore",
  "/privacy",
  "/terms",
  "/403",
  "/404",
  "/500",
  "/loading",
  "/search",
  "/categories",
  "/courses",
  "/tags",
  "/teachers",
  "/lessons",
];

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/register", // docs-standard route
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/password/reset",
];

const ROLE_ROUTES: Record<UserRole, string[]> = {
  ADMIN: ["/admin"],
  TEACHER: ["/teacher"],
  STUDENT: ["/learner"],
};

/**
 * Get access token from request cookies or headers
 */
function getAccessToken(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get("accessToken")?.value;
  if (cookieToken) return cookieToken;

  // Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

/**
 * Check if route is auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if user has access to route based on role
 */
function hasRoleAccess(pathname: string, userRole: UserRole): boolean {
  // Check if route requires specific role
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    const matchesRoute = routes.some((route) => pathname.startsWith(route));
    if (matchesRoute) {
      return role === userRole;
    }
  }

  // If route doesn't match any role-specific routes, allow access
  return true;
}

/**
 * Redirect old /learner/* routes to new docs-standard routes
 */
function getRedirectForOldRoute(pathname: string): string | null {
  // /learner/catalog -> /courses
  if (pathname === "/learner/catalog" || pathname.startsWith("/learner/catalog?")) {
    const searchParams = new URLSearchParams(pathname.split("?")[1] || "");
    const query = searchParams.toString();
    return `/courses${query ? `?${query}` : ""}`;
  }

  // /learner/courses/:slug -> /courses/:slug
  const coursesMatch = pathname.match(/^\/learner\/courses\/([^\/]+)$/);
  if (coursesMatch) {
    return `/courses/${coursesMatch[1]}`;
  }

  // /learner/courses/:slug/learn -> /learn/:slug
  const learnMatch = pathname.match(/^\/learner\/courses\/([^\/]+)\/learn$/);
  if (learnMatch) {
    return `/learn/${learnMatch[1]}`;
  }

  // /learner/dashboard -> /my-learning
  if (pathname === "/learner/dashboard" || pathname.startsWith("/learner/dashboard?")) {
    const searchParams = new URLSearchParams(pathname.split("?")[1] || "");
    const query = searchParams.toString();
    return `/my-learning${query ? `?${query}` : ""}`;
  }

  return null;
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEMO_MODE: Skip all auth checks
  if (DEMO_MODE) {
    return NextResponse.next();
  }

  // Check for old route redirects first
  const redirectPath = getRedirectForOldRoute(pathname);
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get and validate token
  const token = getAccessToken(request);
  const isAuthenticated = token && !isTokenExpired(token);

  // Handle auth routes (login, signup, etc.)
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const decoded = decodeJWT(token);
      if (decoded) {
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = getDashboardUrl(decoded.role);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
    // Allow access to auth routes for unauthenticated users
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const decoded = decodeJWT(token!);
  if (!decoded) {
    // Invalid token
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has access to this route
  if (!hasRoleAccess(pathname, decoded.role)) {
    console.log(
      `[Middleware] Access denied for ${decoded.role} to ${pathname}`
    );
    return NextResponse.redirect(new URL("/403", request.url));
  }

  // Add user info to headers for downstream use
  const response = NextResponse.next();
  response.headers.set("x-user-id", decoded.accountId.toString());
  response.headers.set("x-user-role", decoded.role);
  response.headers.set("x-user-email", decoded.email);

  return response;
}

/**
 * Get dashboard URL based on user role
 */
function getDashboardUrl(role: UserRole): string {
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

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
