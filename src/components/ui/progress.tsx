// @ts-nocheck
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linearProgressVariants = cva("relative w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
    color: {
      default: "bg-primary-900",
      success: "bg-appropriate-500",
      warning: "bg-maybe-500",
      danger: "bg-inappropriate-500",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export interface LinearProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof linearProgressVariants> {
  /**
   * Current progress value
   */
  value: number;
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  /**
   * Show percentage label
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: string;
}

/**
 * Linear progress bar component with animated fill.
 * Supports multiple sizes, colors, and label options.
 * 
 * @example
 * ```tsx
 * <LinearProgress value={75} size="lg" color="success" showLabel />
 * <LinearProgress value={50} label="Loading..." />
 * ```
 */
export function LinearProgress({
  value,
  max = 100,
  size,
  color,
  showLabel = false,
  label,
  className,
  ...props
}: LinearProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)} {...props}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label || "Progress"}</span>
          {showLabel && <span className="font-medium">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn(
          linearProgressVariants({ size, color }),
          color === "default" && "[&>div]:bg-primary-900",
          color === "success" && "[&>div]:bg-appropriate-500",
          color === "warning" && "[&>div]:bg-maybe-500",
          color === "danger" && "[&>div]:bg-inappropriate-500"
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            linearProgressVariants({ color })
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value
   */
  value: number;
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  /**
   * Size of the circular progress in pixels
   */
  size?: number;
  /**
   * Stroke width of the circle
   */
  strokeWidth?: number;
  /**
   * Show label in center
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: string;
  /**
   * Color variant
   */
  color?: "default" | "success" | "warning" | "danger";
}

/**
 * Circular progress component using SVG.
 * Supports center label and multiple colors.
 * 
 * @example
 * ```tsx
 * <CircularProgress value={75} size={64} showLabel color="success" />
 * ```
 */
export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
  showLabel = false,
  label,
  color = "default",
  className,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    default: "stroke-primary-900",
    success: "stroke-appropriate-500",
    warning: "stroke-maybe-500",
    danger: "stroke-inappropriate-500",
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(colorClasses[color], "transition-all duration-500 ease-out")}
        />
      </svg>
      {(showLabel || label) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
      <span className="sr-only" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        {Math.round(percentage)}% complete
      </span>
    </div>
  );
}

// Export both components
export { LinearProgress as Progress, LinearProgress as ProgressBar };