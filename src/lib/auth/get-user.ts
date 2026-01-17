import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/**
 * User object returned from auth helpers
 */
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}

/**
 * Profile data returned from auth helpers
 */
export interface AuthProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  institution: string | null;
  specialty_track: string | null;
  training_year: number | null;
  streak_count: number;
  onboarding_completed: boolean;
}

/**
 * Get the current authenticated user.
 * Returns null if not authenticated.
 *
 * @example
 * ```ts
 * const user = await getUser();
 * if (user) {
 *   console.log('Logged in as:', user.email);
 * }
 * ```
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || "",
    user_metadata: user.user_metadata || {},
  };
}

/**
 * Get the current user's profile with role and preferences.
 * Returns null if not authenticated or profile doesn't exist.
 *
 * @example
 * ```ts
 * const profile = await getProfile();
 * if (profile?.role === 'admin') {
 *   // Show admin features
 * }
 * ```
 */
export async function getProfile(): Promise<AuthProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      avatar_url,
      role,
      institution,
      specialty_track,
      training_year,
      streak_count,
      onboarding_completed
    `
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Return basic profile from user data if profiles table query fails
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "User",
      avatar_url: user.user_metadata?.avatar_url || null,
      role: (user.user_metadata?.role as UserRole) || "student",
      institution: user.user_metadata?.institution || null,
      specialty_track: user.user_metadata?.specialty_track || null,
      training_year: user.user_metadata?.training_year || null,
      streak_count: 0,
      onboarding_completed: user.user_metadata?.onboarding_completed || false,
    };
  }

  return profile as AuthProfile;
}

/**
 * Require authentication - redirects to login if not authenticated.
 * Use this in Server Components that require a logged-in user.
 *
 * @param redirectTo - Custom redirect path after login (default: current path)
 * @returns The authenticated user
 *
 * @example
 * ```ts
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const user = await requireAuth();
 *   return <div>Hello, {user.email}</div>;
 * }
 * ```
 */
export async function requireAuth(redirectTo?: string): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    const loginUrl = redirectTo
      ? `/login?redirect=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(loginUrl);
  }

  return user;
}

/**
 * Require admin role - redirects if not an admin.
 * Use this in Server Components that require admin access.
 *
 * @param fallbackUrl - URL to redirect non-admins to (default: /cases)
 * @returns The admin user's profile
 *
 * @example
 * ```ts
 * // In a Server Component
 * export default async function AdminPage() {
 *   const profile = await requireAdmin();
 *   return <div>Welcome, Admin {profile.full_name}</div>;
 * }
 * ```
 */
export async function requireAdmin(
  fallbackUrl: string = "/cases"
): Promise<AuthProfile> {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect(fallbackUrl);
  }

  return profile;
}

/**
 * Require completed onboarding - redirects to onboarding if not complete.
 * Use this in Server Components that require onboarding completion.
 *
 * @returns The user's profile
 *
 * @example
 * ```ts
 * export default async function CasesPage() {
 *   const profile = await requireOnboarding();
 *   return <CasesList specialty={profile.specialty_track} />;
 * }
 * ```
 */
export async function requireOnboarding(): Promise<AuthProfile> {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return profile;
}

/**
 * Check if the current user has a specific role.
 *
 * @param role - The role to check for
 * @returns True if the user has the specified role
 *
 * @example
 * ```ts
 * const canManageCases = await hasRole('admin');
 * ```
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === role;
}

/**
 * Check if the current user is an admin.
 *
 * @returns True if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}
