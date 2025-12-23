import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for server-side route protection
 * 
 * Strategy: Check for auth cookie (mirrored from localStorage on login)
 * If no cookie, redirect to login. If role mismatch, redirect to 403.
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/explore",
  "/search",
  "/categories",
  "/privacy",
  "/terms",
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/learner",
  "/instructor",
  "/admin",
  "/notifications",
  "/profile",
  "/cart",
  "/checkout",
];

// Role-based route prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  STUDENT: ["/learner"],
  TEACHER: ["/instructor"],
  ADMIN: ["/admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Check for auth cookie (mirrored from localStorage)
  const authCookie = request.cookies.get("auth-token");
  const userRole = request.cookies.get("user-role")?.value;

  // Protected routes require authentication
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!authCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (userRole) {
      const allowedRoutes = ROLE_ROUTES[userRole] || [];
      const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
      
      // If accessing a role-specific route but doesn't have access
      if (!hasAccess && (pathname.startsWith("/learner") || pathname.startsWith("/instructor") || pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  // Dynamic user routes ([username]/*) - allow if authenticated
  if (pathname.match(/^\/[^/]+\/(dashboard|profile)/)) {
    if (!authCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

