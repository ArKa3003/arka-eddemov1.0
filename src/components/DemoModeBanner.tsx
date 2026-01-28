'use client'

import { IS_SUPABASE_CONFIGURED } from '@/lib/supabase/client'

/**
 * Banner shown when running in demo mode (Supabase not configured).
 * Renders nothing when Supabase is configured.
 */
export function DemoModeBanner() {
  if (IS_SUPABASE_CONFIGURED) return null

  return (
    <div
      className="bg-amber-500 text-black text-center py-2 text-sm font-medium"
      role="status"
      aria-live="polite"
    >
      ⚠️ Demo Mode — Authentication disabled. Configure Supabase for full functionality.
    </div>
  )
}
