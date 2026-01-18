// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  Home,
  ArrowLeft,
  WifiOff,
  ServerCrash,
  ShieldAlert,
  FileX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type ErrorType =
  | "generic"
  | "network"
  | "server"
  | "not-found"
  | "unauthorized"
  | "forbidden";

export interface ErrorStateProps {
  /** Error object or message */
  error?: Error | string | null;
  /** Error type for preset styling */
  type?: ErrorType;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Show retry button */
  showRetry?: boolean;
  /** Show report issue link */
  showReport?: boolean;
  /** Show go back button */
  showBack?: boolean;
  /** Show home button */
  showHome?: boolean;
  /** Additional className */
  className?: string;
  /** Compact mode */
  compact?: boolean;
}

// ============================================================================
// Error Type Configs
// ============================================================================

const ERROR_CONFIGS: Record<
  ErrorType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  }
> = {
  generic: {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: "Something went wrong",
    description:
      "We encountered an unexpected error. Please try again or contact support if the problem persists.",
    color: "text-amber-500",
  },
  network: {
    icon: <WifiOff className="w-12 h-12" />,
    title: "Connection Error",
    description:
      "Unable to connect to the server. Please check your internet connection and try again.",
    color: "text-slate-500",
  },
  server: {
    icon: <ServerCrash className="w-12 h-12" />,
    title: "Server Error",
    description:
      "Our servers are experiencing issues. Please try again in a few moments.",
    color: "text-rose-500",
  },
  "not-found": {
    icon: <FileX className="w-12 h-12" />,
    title: "Not Found",
    description: "The requested resource could not be found.",
    color: "text-slate-500",
  },
  unauthorized: {
    icon: <ShieldAlert className="w-12 h-12" />,
    title: "Session Expired",
    description: "Your session has expired. Please sign in again to continue.",
    color: "text-amber-500",
  },
  forbidden: {
    icon: <ShieldAlert className="w-12 h-12" />,
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    color: "text-rose-500",
  },
};

// ============================================================================
// ErrorState Component
// ============================================================================

/**
 * Error state component for displaying errors with retry option.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   error={error}
 *   onRetry={() => refetch()}
 * />
 *
 * // With type preset
 * <ErrorState
 *   type="network"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorState({
  error,
  type = "generic",
  title,
  description,
  onRetry,
  showRetry = true,
  showReport = true,
  showBack = false,
  showHome = false,
  className,
  compact = false,
}: ErrorStateProps) {
  const config = ERROR_CONFIGS[type];

  const displayTitle = title || config.title;
  const displayDescription =
    description ||
    (typeof error === "string" ? error : error?.message) ||
    config.description;

  const handleReport = () => {
    // In production, this would open a support ticket or feedback form
    window.open(
      `mailto:support@arka-ed.com?subject=Error Report&body=${encodeURIComponent(
        `Error: ${displayTitle}\n\nDescription: ${displayDescription}\n\nURL: ${window.location.href}`
      )}`,
      "_blank"
    );
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={cn(
          "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800",
          config.color,
          compact ? "w-16 h-16 mb-4" : "w-24 h-24 mb-6"
        )}
      >
        {config.icon}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          "font-semibold text-slate-900 dark:text-white",
          compact ? "text-lg" : "text-xl"
        )}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className={cn(
          "mt-2 text-slate-500 dark:text-slate-400 max-w-md",
          compact ? "text-sm" : "text-base"
        )}
      >
        {displayDescription}
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={cn(
          "flex flex-wrap items-center justify-center gap-3",
          compact ? "mt-4" : "mt-6"
        )}
      >
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            size={compact ? "sm" : "default"}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {showBack && (
          <Button
            onClick={handleBack}
            variant="default"
            size={compact ? "sm" : "default"}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        )}
        {showHome && (
          <Button
            onClick={() => (window.location.href = "/cases")}
            variant="default"
            size={compact ? "sm" : "default"}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </motion.div>

      {/* Report link */}
      {showReport && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          onClick={handleReport}
          className={cn(
            "flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
            compact ? "mt-3 text-xs" : "mt-4 text-sm"
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Report this issue
        </motion.button>
      )}
    </motion.div>
  );
}

// ============================================================================
// Preset Error States
// ============================================================================

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="network" onRetry={onRetry} />;
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="server" onRetry={onRetry} />;
}

export function NotFoundError() {
  return <ErrorState type="not-found" showRetry={false} showBack showHome />;
}

export function UnauthorizedError() {
  return (
    <ErrorState
      type="unauthorized"
      showRetry={false}
      showReport={false}
      onRetry={() => (window.location.href = "/login")}
    />
  );
}

export function ForbiddenError() {
  return (
    <ErrorState type="forbidden" showRetry={false} showBack showHome />
  );
}
