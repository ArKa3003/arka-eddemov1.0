"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} AuthGuardProps
 * @property {React.ReactNode} children - Content to render when authenticated
 * @property {React.ReactNode} [fallback] - Content to show while loading
 * @property {string} [redirectTo] - Where to redirect unauthenticated users (default: /login)
 * @property {boolean} [requireOnboarding] - Require completed onboarding
 */
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireOnboarding?: boolean;
}

/**
 * Client-side authentication guard.
 * Wraps content that should only be visible to authenticated users.
 * Handles loading state and redirects unauthenticated users.
 *
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
  requireOnboarding = false,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login with current path as redirect target
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
        return;
      }

      // Check onboarding if required
      if (requireOnboarding) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single();

          if (!profile?.onboarding_completed) {
            router.replace("/onboarding");
            return;
          }
        } catch {
          // If profile check fails, allow access
        }
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAuthenticated(false);
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      } else if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, redirectTo, requireOnboarding]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Default loading fallback component
 */
export function AuthLoadingFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-slate-50",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
