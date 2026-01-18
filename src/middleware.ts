// @ts-nocheck
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Route configuration for ARKA-ED
 */
const ROUTE_CONFIG = {
  /**
   * Public routes - accessible to everyone
   */
  PUBLIC_ROUTES: [
    "/",
    "/pricing",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ],

  /**
   * Auth routes - redirect to /cases if already authenticated
   */
  AUTH_ROUTES: [
    "/login",
    "/register",
    "/forgot-password",
  ],

  /**
   * Protected routes - require authentication
   */
  PROTECTED_ROUTES: [
    "/cases",
    "/progress",
    "/assessments",
    "/specialty",
    "/achievements",
    "/settings",
    "/onboarding",
  ],

  /**
   * Admin routes - require admin role
   */
  ADMIN_ROUTES: [
    "/admin",
  ],
};

/**
 * Check if a pathname matches any route in a list (prefix match)
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match for root
    if (route === "/" && pathname === "/") return true;
    // Prefix match for other routes
    if (route !== "/" && pathname.startsWith(route)) return true;
    return false;
  });
}

/**
 * Middleware for comprehensive route protection and authentication handling.
 *
 * Flow:
 * 1. Update Supabase session (refresh tokens)
 * 2. Get current user
 * 3. Determine route type
 * 4. Apply appropriate redirects:
 *    - Unauthenticated users on protected routes → /login?redirect=path
 *    - Authenticated users on auth routes → /cases
 *    - Non-admin users on admin routes → /cases
 *    - Users without completed onboarding → /onboarding (except on onboarding itself)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Update Supabase session first - this handles cookie refresh
  const response = await updateSession(request);

  // Create Supabase client to check user
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Determine route type
  const isPublicRoute = matchesRoute(pathname, ROUTE_CONFIG.PUBLIC_ROUTES);
  const isAuthRoute = matchesRoute(pathname, ROUTE_CONFIG.AUTH_ROUTES);
  const isProtectedRoute = matchesRoute(pathname, ROUTE_CONFIG.PROTECTED_ROUTES);
  const isAdminRoute = matchesRoute(pathname, ROUTE_CONFIG.ADMIN_ROUTES);
  const isOnboardingRoute = pathname.startsWith("/onboarding");

  // Get user profile for role check and onboarding status
  let userProfile: { role?: string; onboarding_completed?: boolean } | null = null;
  if (user) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("id", user.id)
        .single();
      userProfile = data;
    } catch {
      // Fallback to user_metadata if profiles table doesn't exist
      userProfile = {
        role: user.user_metadata?.role,
        onboarding_completed: user.user_metadata?.onboarding_completed,
      };
    }
  }

  // === REDIRECT LOGIC ===

  // 1. Unauthenticated users trying to access protected or admin routes
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated users trying to access auth routes (login, register, etc.)
  if (user && isAuthRoute) {
    // Check if onboarding is completed
    if (userProfile?.onboarding_completed === false) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.redirect(new URL("/cases", request.url));
  }

  // 3. Admin route access - check for admin role
  if (isAdminRoute && user) {
    const isAdmin = userProfile?.role === "admin";
    if (!isAdmin) {
      // Non-admin users get redirected to cases
      return NextResponse.redirect(new URL("/cases", request.url));
    }
  }

  // 4. Check onboarding completion for protected routes (except onboarding itself)
  if (user && isProtectedRoute && !isOnboardingRoute) {
    if (userProfile?.onboarding_completed === false) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return response;
}

/**
 * Matcher configuration - run middleware on all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (svg, png, jpg, etc.)
     * - API routes are handled but can pass through
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
