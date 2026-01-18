// @ts-nocheck
"use client";

import * as React from "react";
import { create } from "zustand";
import type { ToastProps, ToastVariant } from "@/components/ui/toast";

// ============================================================================
// Types
// ============================================================================

type ToastInput = Omit<ToastProps, "id" | "onDismiss">;

interface ToastState {
  toasts: ToastProps[];
  add: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, toast: Partial<ToastInput>) => void;
}

// ============================================================================
// Store
// ============================================================================

let toastCounter = 0;

/**
 * Zustand store for toast state management.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  add: (toast) => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    return id;
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  dismissAll: () => {
    set({ toasts: [] });
  },

  update: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },
}));

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for creating toast notifications.
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 *
 * // Simple usage
 * toast.success('Case submitted!', 'Your answer has been recorded');
 *
 * // With options
 * toast.error('Error', 'Failed to load case', { duration: 10000 });
 *
 * // Custom toast
 * toast({
 *   title: 'Custom',
 *   description: 'Custom toast',
 *   variant: 'info',
 * });
 * ```
 */
export function useToast() {
  const store = useToastStore();

  const toast = React.useCallback(
    (input: ToastInput | string, description?: string) => {
      if (typeof input === "string") {
        return store.add({ title: input, description });
      }
      return store.add(input);
    },
    [store]
  );

  // Variant shortcuts
  const success = React.useCallback(
    (
      title: string,
      description?: string,
      options?: Partial<ToastInput>
    ) => {
      return store.add({
        title,
        description,
        variant: "success",
        ...options,
      });
    },
    [store]
  );

  const error = React.useCallback(
    (
      title: string,
      description?: string,
      options?: Partial<ToastInput>
    ) => {
      return store.add({
        title,
        description,
        variant: "error",
        duration: 8000, // Longer for errors
        ...options,
      });
    },
    [store]
  );

  const warning = React.useCallback(
    (
      title: string,
      description?: string,
      options?: Partial<ToastInput>
    ) => {
      return store.add({
        title,
        description,
        variant: "warning",
        ...options,
      });
    },
    [store]
  );

  const info = React.useCallback(
    (
      title: string,
      description?: string,
      options?: Partial<ToastInput>
    ) => {
      return store.add({
        title,
        description,
        variant: "info",
        ...options,
      });
    },
    [store]
  );

  const loading = React.useCallback(
    (
      title: string,
      description?: string,
      options?: Partial<ToastInput>
    ) => {
      return store.add({
        title,
        description,
        variant: "loading",
        duration: 0, // Persistent until dismissed
        dismissible: false,
        ...options,
      });
    },
    [store]
  );

  const promise = React.useCallback(
    <T,>(
      promiseFn: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: Error) => string);
      }
    ) => {
      const id = store.add({
        title: messages.loading,
        variant: "loading",
        duration: 0,
        dismissible: false,
      });

      promiseFn
        .then((data) => {
          store.update(id, {
            title:
              typeof messages.success === "function"
                ? messages.success(data)
                : messages.success,
            variant: "success",
            duration: 5000,
            dismissible: true,
          });
        })
        .catch((err) => {
          store.update(id, {
            title:
              typeof messages.error === "function"
                ? messages.error(err)
                : messages.error,
            variant: "error",
            duration: 8000,
            dismissible: true,
          });
        });

      return id;
    },
    [store]
  );

  return {
    toast: Object.assign(toast, {
      success,
      error,
      warning,
      info,
      loading,
      promise,
    }),
    dismiss: store.dismiss,
    dismissAll: store.dismissAll,
    toasts: store.toasts,
  };
}

// ============================================================================
// Standalone toast function
// ============================================================================

/**
 * Standalone toast function for use outside of React components.
 *
 * @example
 * ```ts
 * import { toast } from '@/lib/hooks/use-toast';
 *
 * toast.success('Success!');
 * ```
 */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "success" }),

  error: (title: string, description?: string) =>
    useToastStore.getState().add({
      title,
      description,
      variant: "error",
      duration: 8000,
    }),

  warning: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "warning" }),

  info: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "info" }),

  loading: (title: string, description?: string) =>
    useToastStore.getState().add({
      title,
      description,
      variant: "loading",
      duration: 0,
      dismissible: false,
    }),

  dismiss: (id: string) => useToastStore.getState().dismiss(id),

  dismissAll: () => useToastStore.getState().dismissAll(),
};
