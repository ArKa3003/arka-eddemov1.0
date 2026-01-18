// @ts-nocheck
"use client";

import * as React from "react";
import { ToastContainer } from "./toast";
import { useToastStore } from "@/lib/hooks/use-toast";

// ============================================================================
// Toaster Component
// ============================================================================

/**
 * Global toaster component.
 * Place this in your root layout to enable toast notifications.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <ToastProvider>
 *   {children}
 *   <Toaster />
 * </ToastProvider>
 * ```
 */
export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <ToastContainer
      toasts={toasts}
      onDismiss={dismiss}
      position="top-right"
    />
  );
}
