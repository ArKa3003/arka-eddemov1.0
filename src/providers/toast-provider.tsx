// @ts-nocheck
"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/toaster";

// ============================================================================
// ToastProvider Component
// ============================================================================

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast notification provider.
 * Wraps your app to enable toast notifications.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ToastProvider>
 *           {children}
 *         </ToastProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
