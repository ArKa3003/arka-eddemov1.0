// @ts-nocheck
"use client";

import * as React from "react";
import { Toaster } from "react-hot-toast";

// ============================================================================
// ToastProvider Component
// ============================================================================

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast notification provider using react-hot-toast with ARKA branding.
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
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#10b981',
              color: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10b981',
            },
            duration: 4000,
          },
          error: {
            style: {
              background: '#ef4444',
              color: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#ef4444',
            },
            duration: 5000,
          },
          loading: {
            style: {
              background: '#06b6d4',
              color: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#06b6d4',
            },
          },
          style: {
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            maxWidth: '420px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          duration: 4000,
        }}
      />
    </>
  );
}
