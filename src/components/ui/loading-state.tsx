"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// Types
// ============================================================================

export type LoadingVariant =
  | "spinner"
  | "logo"
  | "dots"
  | "pulse"
  | "skeleton";

export interface LoadingStateProps {
  /** Loading variant */
  variant?: LoadingVariant;
  /** Loading text */
  text?: string;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Additional className */
  className?: string;
  /** Number of skeleton items (for skeleton variant) */
  skeletonCount?: number;
}

// ============================================================================
// LoadingState Component
// ============================================================================

/**
 * Loading state component with multiple variants.
 *
 * @example
 * ```tsx
 * <LoadingState variant="logo" text="Loading cases..." />
 *
 * <LoadingState variant="skeleton" skeletonCount={3} />
 * ```
 */
export function LoadingState({
  variant = "spinner",
  text,
  size = "md",
  fullScreen = false,
  className,
  skeletonCount = 3,
}: LoadingStateProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-sm", container: "gap-2" },
    md: { icon: "w-8 h-8", text: "text-base", container: "gap-3" },
    lg: { icon: "w-12 h-12", text: "text-lg", container: "gap-4" },
  };

  const sizeConfig = sizes[size];

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        sizeConfig.container,
        fullScreen ? "min-h-screen" : "py-12",
        className
      )}
    >
      {variant === "spinner" && (
        <Loader2 className={cn(sizeConfig.icon, "animate-spin text-cyan-500")} />
      )}

      {variant === "logo" && <LogoSpinner size={size} />}

      {variant === "dots" && <DotsLoader size={size} />}

      {variant === "pulse" && <PulseLoader size={size} />}

      {variant === "skeleton" && (
        <div className="w-full max-w-md space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {text && variant !== "skeleton" && (
        <p
          className={cn(
            "text-slate-500 dark:text-slate-400",
            sizeConfig.text
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// ============================================================================
// Logo Spinner
// ============================================================================

function LogoSpinner({ size }: { size: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn("relative", sizes[size])}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Progress arc */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-cyan-500"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 0.7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            strokeDasharray: "283",
            strokeDashoffset: "0",
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>

      {/* Logo text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-cyan-500">A</span>
      </div>
    </div>
  );
}

// ============================================================================
// Dots Loader
// ============================================================================

function DotsLoader({ size }: { size: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const gaps = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  return (
    <div className={cn("flex items-center", gaps[size])}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(sizes[size], "rounded-full bg-cyan-500")}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Pulse Loader
// ============================================================================

function PulseLoader({ size }: { size: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizes[size])}>
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-500/30"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-500/50"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.2,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-cyan-500" />
    </div>
  );
}

// ============================================================================
// Page Loading
// ============================================================================

export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return <LoadingState variant="logo" text={text} size="lg" fullScreen />;
}

// ============================================================================
// Section Loading
// ============================================================================

export function SectionLoading({ text }: { text?: string }) {
  return <LoadingState variant="spinner" text={text} size="md" />;
}

// ============================================================================
// Inline Loading
// ============================================================================

export function InlineLoading() {
  return (
    <span className="inline-flex items-center gap-1">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Loading...</span>
    </span>
  );
}

// ============================================================================
// Card Skeleton
// ============================================================================

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Table Skeleton
// ============================================================================

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-3 border-b border-slate-100 dark:border-slate-800"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
