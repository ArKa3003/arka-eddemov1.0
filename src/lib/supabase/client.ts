import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Creates a browser-side Supabase client for use in Client Components.
 * This client uses browser cookies for session management.
 * 
 * @returns {ReturnType<typeof createBrowserClient<Database>>} A Supabase client instance
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client';
 * 
 * export default function Component() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('cases').select();
 *   return <div>{/* render data *\/}</div>;
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
