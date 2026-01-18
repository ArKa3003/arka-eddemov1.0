// @ts-nocheck
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldX, Loader2 } from "lucide-react";
import type { UserRole } from "@/types/database";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} RoleGuardProps
 * @property {React.ReactNode} children - Content to render when authorized
 * @property {UserRole | UserRole[]} allowedRoles - Role(s) that can access this content
 * @property {React.ReactNode} [fallback] - Content to show when not authorized
 * @property {string} [redirectTo] - Where to redirect unauthorized users
 * @property {boolean} [showAccessDenied] - Show access denied message instead of redirecting
 */
export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
  showAccessDenied?: boolean;
}

/**
 * Client-side role-based access guard.
 * Restricts content to users with specific roles.
 *
 * @example
 * ```tsx
 * <RoleGuard allowedRoles="admin">
 *   <AdminDashboard />
 * </RoleGuard>
 *
 * <RoleGuard allowedRoles={["admin", "attending"]}>
 *   <AdvancedFeatures />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo = "/cases",
  showAccessDenied = false,
}: RoleGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  React.useEffect(() => {
    const supabase = createClient();

    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // Get user profile with role
      let role: UserRole | null = null;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        role = (profile as any)?.role as UserRole;
      } catch {
        // Fallback to user_metadata
        role = user.user_metadata?.role as UserRole;
      }

      setUserRole(role);

      if (role && roles.includes(role)) {
        setIsAuthorized(true);
      } else if (!showAccessDenied) {
        router.replace(redirectTo);
      }

      setIsLoading(false);
    };

    checkRole();
  }, [router, roles, redirectTo, showAccessDenied]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  // Show access denied message
  if (!isAuthorized && showAccessDenied) {
    return (
      fallback || (
        <AccessDenied
          userRole={userRole}
          requiredRoles={roles}
          redirectTo={redirectTo}
        />
      )
    );
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Access denied component
 */
interface AccessDeniedProps {
  userRole: UserRole | null;
  requiredRoles: UserRole[];
  redirectTo?: string;
  className?: string;
}

export function AccessDenied({
  userRole,
  requiredRoles,
  redirectTo = "/cases",
  className,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "min-h-[400px] flex flex-col items-center justify-center text-center p-8",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-rose-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
      <p className="text-slate-600 mb-6 max-w-md">
        You don&apos;t have permission to access this page.
        {userRole && (
          <span className="block mt-2 text-sm">
            Your role: <span className="font-medium capitalize">{userRole}</span>
          </span>
        )}
        {requiredRoles.length > 0 && (
          <span className="block text-sm">
            Required role:{" "}
            <span className="font-medium capitalize">
              {requiredRoles.join(" or ")}
            </span>
          </span>
        )}
      </p>
      <button
        onClick={() => router.push(redirectTo)}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

/**
 * HOC for role-based route protection
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole | UserRole[],
  options?: Omit<RoleGuardProps, "children" | "allowedRoles">
) {
  return function WrappedComponent(props: P) {
    return (
      <RoleGuard allowedRoles={allowedRoles} {...options}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
