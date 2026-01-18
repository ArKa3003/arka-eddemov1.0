// @ts-nocheck
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types/database";

/**
 * User profile data from the profiles table
 */
export interface UserProfile {
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
 * Auth state returned by useAuth hook
 */
export interface AuthState {
  /** The authenticated Supabase user */
  user: User | null;
  /** The user's profile from the profiles table */
  profile: UserProfile | null;
  /** Whether auth state is being loaded */
  loading: boolean;
  /** Whether the user is an admin */
  isAdmin: boolean;
  /** Whether onboarding is completed */
  isOnboarded: boolean;
}

/**
 * Auth actions returned by useAuth hook
 */
export interface AuthActions {
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign up with email and password */
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Sign in with Google OAuth */
  signInWithGoogle: () => Promise<void>;
  /** Sign in with Microsoft OAuth */
  signInWithMicrosoft: () => Promise<void>;
  /** Send password reset email */
  resetPassword: (email: string) => Promise<void>;
  /** Update user password */
  updatePassword: (newPassword: string) => Promise<void>;
  /** Update user profile */
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  /** Refresh the current user and profile */
  refresh: () => Promise<void>;
}

/**
 * Complete auth hook combining state and actions
 */
export function useAuth(): AuthState & AuthActions {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Computed values
  const isAdmin = profile?.role === "admin";
  const isOnboarded = profile?.onboarding_completed ?? false;

  /**
   * Fetch user profile from profiles table
   */
  const fetchProfile = React.useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
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
          .eq("id", userId)
          .single();

        if (error) throw error;
        return data as UserProfile;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    [supabase]
  );

  /**
   * Refresh user and profile data
   */
  const refresh = React.useCallback(async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (currentUser) {
      const userProfile = await fetchProfile(currentUser.id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
  }, [supabase, fetchProfile]);

  // Initial auth check and listener setup
  React.useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.id);
        setProfile(userProfile);
      }

      setLoading(false);
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      // Handle specific events
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, router]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Refresh to get latest profile
      await refresh();

      // Check onboarding status and redirect
      if (!profile?.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/cases");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: metadata,
        },
      });

      if (error) throw error;

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      router.push("/login");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sign in with Microsoft OAuth
   */
  const signInWithMicrosoft = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: "email profile",
        },
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update user password
   */
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      router.push("/cases");
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("Not authenticated");

    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile data
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    } catch (error) {
      throw error;
    }
  };

  return {
    // State
    user,
    profile,
    loading,
    isAdmin,
    isOnboarded,
    // Actions
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithMicrosoft,
    resetPassword,
    updatePassword,
    updateProfile,
    refresh,
  };
}

/**
 * Hook to get just the current user (lighter weight)
 */
export function useUser() {
  const supabase = createClient();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}
