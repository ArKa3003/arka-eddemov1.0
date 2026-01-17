"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ACRCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface ACRRatingBadgeProps {
  /** ACR rating (1-9) */
  rating: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show category label below */
  showLabel?: boolean;
  /** Show tooltip with explanation */
  showTooltip?: boolean;
  /** Animate on mount */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * ACR Rating Categories
 * - 1-3: Usually Not Appropriate (Rose)
 * - 4-6: May Be Appropriate (Amber)
 * - 7-9: Usually Appropriate (Emerald)
 */
const RATING_CONFIG = {
  "usually-not-appropriate": {
    min: 1,
    max: 3,
    label: "Usually Not Appropriate",
    shortLabel: "Not Appropriate",
    bgColor: "bg-rose-100",
    textColor: "text-rose-700",
    borderColor: "border-rose-300",
    ringColor: "ring-rose-500/30",
    description:
      "The imaging procedure is not likely to be useful for this clinical scenario. Consider alternative approaches.",
  },
  "may-be-appropriate": {
    min: 4,
    max: 6,
    label: "May Be Appropriate",
    shortLabel: "May Be Appropriate",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    ringColor: "ring-amber-500/30",
    description:
      "The imaging procedure may be useful depending on additional clinical factors. Clinical judgment is advised.",
  },
  "usually-appropriate": {
    min: 7,
    max: 9,
    label: "Usually Appropriate",
    shortLabel: "Appropriate",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
    ringColor: "ring-emerald-500/30",
    description:
      "The imaging procedure is considered appropriate for this clinical scenario based on evidence and expert consensus.",
  },
};

const SIZE_CONFIG = {
  sm: {
    badge: "w-7 h-7 text-xs",
    label: "text-[10px]",
  },
  md: {
    badge: "w-10 h-10 text-sm",
    label: "text-xs",
  },
  lg: {
    badge: "w-14 h-14 text-lg",
    label: "text-sm",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getACRCategory(rating: number): ACRCategory {
  if (rating <= 3) return "usually-not-appropriate";
  if (rating <= 6) return "may-be-appropriate";
  return "usually-appropriate";
}

export function getACRConfig(rating: number) {
  const category = getACRCategory(rating);
  return RATING_CONFIG[category];
}

// ============================================================================
// Component
// ============================================================================

/**
 * ACRRatingBadge - Circular badge displaying ACR appropriateness rating.
 */
export function ACRRatingBadge({
  rating,
  size = "md",
  showLabel = false,
  showTooltip = true,
  animate = true,
  className,
}: ACRRatingBadgeProps) {
  const config = getACRConfig(rating);
  const sizeConfig = SIZE_CONFIG[size];

  const badge = (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <motion.div
        initial={animate ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "rounded-full flex items-center justify-center font-bold border-2",
          config.bgColor,
          config.textColor,
          config.borderColor,
          sizeConfig.badge
        )}
      >
        {rating}
      </motion.div>
      {showLabel && (
        <span
          className={cn(
            "font-medium text-center leading-tight",
            config.textColor,
            sizeConfig.label
          )}
        >
          {config.shortLabel}
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">
              ACR Rating: {rating}/9 — {config.label}
            </p>
            <p className="text-xs text-slate-500">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Inline Variant
// ============================================================================

export interface ACRRatingInlineProps {
  rating: number;
  showLabel?: boolean;
  className?: string;
}

export function ACRRatingInline({
  rating,
  showLabel = true,
  className,
}: ACRRatingInlineProps) {
  const config = getACRConfig(rating);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span className="font-bold">{rating}</span>
      {showLabel && <span className="text-xs opacity-75">/ 9</span>}
    </span>
  );
}

// ============================================================================
// Large Display Variant
// ============================================================================

export interface ACRRatingLargeProps {
  rating: number;
  animate?: boolean;
  className?: string;
}

export function ACRRatingLarge({
  rating,
  animate = true,
  className,
}: ACRRatingLargeProps) {
  const config = getACRConfig(rating);

  return (
    <div className={cn("text-center", className)}>
      <motion.div
        initial={animate ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2",
          "border-4 shadow-lg",
          config.bgColor,
          config.borderColor
        )}
      >
        <span className={cn("text-3xl font-bold", config.textColor)}>
          {rating}
        </span>
      </motion.div>
      <p className={cn("font-semibold", config.textColor)}>{config.label}</p>
      <p className="text-sm text-slate-500">ACR Appropriateness Rating</p>
    </div>
  );
}
