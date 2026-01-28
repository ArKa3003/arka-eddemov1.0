import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/** Whether Supabase env vars are set. When false, app runs in demo-only mode. */
export const IS_SUPABASE_CONFIGURED = !!(
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Creates a browser-side Supabase client for use in Client Components.
 * This client uses browser cookies for session management.
 * Only call when IS_SUPABASE_CONFIGURED is true.
 *
 * @returns {ReturnType<typeof createBrowserClient<Database>>} A Supabase client instance
 *
 * @example
 * ```tsx
 * 'use client'
 * import { createClient, IS_SUPABASE_CONFIGURED } from '@/lib/supabase/client';
 *
 * export default function Component() {
 *   const supabase = IS_SUPABASE_CONFIGURED ? createClient() : null;
 *   // ...
 * }
 * ```
 */
export function createClient() {
  if (!IS_SUPABASE_CONFIGURED) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
