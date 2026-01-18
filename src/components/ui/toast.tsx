"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastProps {
  /** Unique identifier */
  id: string;
  /** Toast variant */
  variant?: ToastVariant;
  /** Toast title */
  title: string;
  /** Toast description */
  description?: string;
  /** Duration in milliseconds (0 for persistent) */
  duration?: number;
  /** Whether the toast can be dismissed */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  loading: <Loader2 className="w-5 h-5 animate-spin" />,
};

const COLORS: Record<ToastVariant, string> = {
  success: "bg-emerald-500 text-white",
  error: "bg-rose-500 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-cyan-500 text-white",
  loading: "bg-slate-600 text-white",
};

const BORDER_COLORS: Record<ToastVariant, string> = {
  success: "border-emerald-400",
  error: "border-rose-400",
  warning: "border-amber-400",
  info: "border-cyan-400",
  loading: "border-slate-500",
};

// ============================================================================
// Toast Component
// ============================================================================

/**
 * Individual toast notification component.
 *
 * @example
 * ```tsx
 * <Toast
 *   id="1"
 *   variant="success"
 *   title="Case submitted!"
 *   description="Your answer has been recorded"
 *   onDismiss={(id) => removeToast(id)}
 * />
 * ```
 */
export function Toast({
  id,
  variant = "info",
  title,
  description,
  duration = 5000,
  dismissible = true,
  icon,
  action,
  onDismiss,
}: ToastProps) {
  const [progress, setProgress] = React.useState(100);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + duration * (progress / 100);

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;

      if (newProgress <= 0) {
        clearInterval(interval);
        onDismiss?.(id);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [id, duration, isPaused, progress, onDismiss]);

  const displayIcon = icon || ICONS[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-slate-900",
        "min-w-[320px] max-w-[420px]",
        BORDER_COLORS[variant]
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 p-1.5 rounded-full",
            COLORS[variant]
          )}
        >
          {displayIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 dark:text-white">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {dismissible && (
          <button
            onClick={() => onDismiss?.(id)}
            className="flex-shrink-0 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <motion.div
            className={cn(
              "h-full",
              variant === "success" && "bg-emerald-500",
              variant === "error" && "bg-rose-500",
              variant === "warning" && "bg-amber-500",
              variant === "info" && "bg-cyan-500",
              variant === "loading" && "bg-slate-500"
            )}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// ToastContainer Component
// ============================================================================

export interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

/**
 * Container for rendering multiple toasts.
 */
export function ToastContainer({
  toasts,
  onDismiss,
  position = "top-right",
}: ToastContainerProps) {
  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        "fixed z-[9999] flex flex-col gap-2 pointer-events-none",
        positions[position]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
