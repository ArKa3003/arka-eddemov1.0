// @ts-nocheck
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Creates a server-side Supabase client for use in Server Components and Server Actions.
 * This client uses Next.js cookies() for session management.
 * 
 * @returns {Promise<ReturnType<typeof createServerClient<Database>>>} A Supabase client instance
 * 
 * @example
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('cases').select();
 *   return <div>{/* render data *\/}</div>;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server component - cookies can only be modified in Server Actions
          }
        },
      },
    }
  );
}

/**
 * Gets the current authenticated user from the server-side Supabase client.
 * 
 * @returns {Promise<{ user: User | null; error: AuthError | null }>} The authenticated user or null
 * 
 * @example
 * ```tsx
 * import { getUser } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const { user } = await getUser();
 *   if (!user) return <div>Not authenticated</div>;
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Gets the user profile from the database based on the authenticated user's ID.
 * 
 * @returns {Promise<{ profile: Database['public']['Tables']['users']['Row'] | null; error: PostgrestError | null }>} The user profile or null
 * 
 * @example
 * ```tsx
 * import { getProfile } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const { profile } = await getProfile();
 *   if (!profile) return <div>Profile not found</div>;
 *   return <div>Role: {profile.role}</div>;
 * }
 * ```
 */
export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, error: null };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile, error };
}