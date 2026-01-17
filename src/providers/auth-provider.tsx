"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser, AuthError, Session } from "@supabase/supabase-js";

/**
 * User interface with extended properties from Supabase auth.
 */
export interface User {
  id: string;
  email: string;
  role?: string;
  metadata?: Record<string, any>;
}

/**
 * Authentication context type with all auth-related state and functions.
 */
export interface AuthContextType {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** Loading state for authentication operations */
  loading: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  /** Sign up with email and password */
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  /** Sign out the current user */
  signOut: () => Promise<{ error: AuthError | null }>;
  /** Reset password for a user */
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  /** Update user password */
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

/**
 * Creates the auth context with default undefined value.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Converts Supabase user to application User type.
 * 
 * @param {SupabaseUser | null} supabaseUser - The Supabase user object
 * @returns {User | null} The converted user or null
 */
function transformUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;

  // Fetch user profile role from database if available
  // This would typically be done via a separate API call or in getUser helper
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    role: supabaseUser.user_metadata?.role || undefined,
    metadata: supabaseUser.user_metadata,
  };
}

/**
 * AuthProvider component that provides authentication context to the application.
 * Manages user state, authentication operations, and session handling.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to auth context
 * 
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { AuthProvider } from '@/providers/auth-provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  /**
   * Fetches the current user and sets up auth state change listener.
   */
  useEffect(() => {
    let mounted = true;

    /**
     * Initial user fetch and session setup.
     */
    const initAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error && error.message !== "JWT expired") {
          console.error("Error fetching user:", error);
        }

        if (mounted) {
          setUser(transformUser(authUser));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    /**
     * Listen for auth state changes (sign in, sign out, token refresh, etc.)
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session: Session | null) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          const transformedUser = transformUser(session.user);
          setUser(transformedUser);

          // Handle different auth events
          switch (event) {
            case "SIGNED_IN":
              router.refresh();
              break;
            case "SIGNED_OUT":
              router.push("/login");
              router.refresh();
              break;
            case "TOKEN_REFRESHED":
              // Token refreshed, user still authenticated
              break;
            case "USER_UPDATED":
              // User metadata updated
              router.refresh();
              break;
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error handling auth state change:", error);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  /**
   * Sign in with email and password.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{ error: AuthError | null }>} Error object if sign in fails
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        // Redirect will be handled by auth state change listener
        return { error: null };
      } catch (error: any) {
        return { error: error as AuthError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  /**
   * Sign up with email and password.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {Record<string, any>} metadata - Optional user metadata
   * @returns {Promise<{ error: AuthError | null }>} Error object if sign up fails
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata?: Record<string, any>
    ): Promise<{ error: AuthError | null }> => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        });

        if (error) {
          return { error };
        }

        // Redirect will be handled by auth state change listener
        return { error: null };
      } catch (error: any) {
        return { error: error as AuthError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  /**
   * Sign out the current user.
   * 
   * @returns {Promise<{ error: AuthError | null }>} Error object if sign out fails
   */
  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      // Redirect will be handled by auth state change listener
      return { error: null };
    } catch (error: any) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Send password reset email.
   * 
   * @param {string} email - User's email address
   * @returns {Promise<{ error: AuthError | null }>} Error object if reset fails
   */
  const resetPassword = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (error: any) {
        return { error: error as AuthError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  /**
   * Update user password.
   * 
   * @param {string} newPassword - New password
   * @returns {Promise<{ error: AuthError | null }>} Error object if update fails
   */
  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: AuthError | null }> => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (error: any) {
        return { error: error as AuthError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the authentication context.
 * 
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { useAuthContext } from '@/providers/auth-provider';
 * 
 * export default function Component() {
 *   const { user, loading, signIn, signOut } = useAuthContext();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Not authenticated</div>;
 * 
 *   return (
 *     <div>
 *       <p>Welcome {user.email}</p>
 *       <button onClick={() => signOut()}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}