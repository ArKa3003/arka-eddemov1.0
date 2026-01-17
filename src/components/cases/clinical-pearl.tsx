"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClinicalPearlCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface ClinicalPearlProps {
  /** Pearl content text */
  pearl: string;
  /** Pearl category */
  category: ClinicalPearlCategory;
  /** Animate on mount */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const PEARL_CONFIG: Record<
  ClinicalPearlCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    bgColor: string;
    borderColor: string;
    iconBgColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  "clinical-pearl": {
    icon: Lightbulb,
    label: "Clinical Pearl",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBgColor: "bg-amber-100",
    textColor: "text-amber-800",
    iconColor: "text-amber-600",
  },
  "high-yield": {
    icon: Sparkles,
    label: "High-Yield",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    iconBgColor: "bg-violet-100",
    textColor: "text-violet-800",
    iconColor: "text-violet-600",
  },
  "common-mistake": {
    icon: AlertTriangle,
    label: "Common Mistake",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconBgColor: "bg-rose-100",
    textColor: "text-rose-800",
    iconColor: "text-rose-600",
  },
  "board-favorite": {
    icon: GraduationCap,
    label: "Board Favorite",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    iconBgColor: "bg-cyan-100",
    textColor: "text-cyan-800",
    iconColor: "text-cyan-600",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * ClinicalPearl - Highlighted callout box for clinical pearls.
 * Supports different categories with distinct styling.
 */
export function ClinicalPearl({
  pearl,
  category,
  animate = true,
  className,
}: ClinicalPearlProps) {
  const config = PEARL_CONFIG[category] || PEARL_CONFIG["clinical-pearl"];
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        "rounded-xl border-2 p-4",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            config.iconBgColor
          )}
        >
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={cn("font-semibold text-sm mb-1", config.textColor)}>
            {config.label}
          </div>
          <p className="text-slate-700 leading-relaxed">{pearl}</p>
        </div>
      </div>
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}

// ============================================================================
// Clinical Pearl List
// ============================================================================

export interface ClinicalPearlListProps {
  pearls: Array<{ content: string; category: ClinicalPearlCategory }>;
  staggerDelay?: number;
  className?: string;
}

export function ClinicalPearlList({
  pearls,
  staggerDelay = 0.1,
  className,
}: ClinicalPearlListProps) {
  if (pearls.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {pearls.map((pearl, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * staggerDelay }}
        >
          <ClinicalPearl
            pearl={pearl.content}
            category={pearl.category}
            animate={false}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// Compact Pearl Badge
// ============================================================================

export interface PearlBadgeProps {
  category: ClinicalPearlCategory;
  className?: string;
}

export function PearlBadge({ category, className }: PearlBadgeProps) {
  const config = PEARL_CONFIG[category] || PEARL_CONFIG["clinical-pearl"];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// ============================================================================
// Pearl Card (Detailed)
// ============================================================================

export interface PearlCardProps {
  pearl: string;
  category: ClinicalPearlCategory;
  source?: string;
  animate?: boolean;
  className?: string;
}

export function PearlCard({
  pearl,
  category,
  source,
  animate = true,
  className,
}: PearlCardProps) {
  const config = PEARL_CONFIG[category] || PEARL_CONFIG["clinical-pearl"];
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className={cn("px-4 py-2 flex items-center gap-2", config.bgColor)}>
        <Icon className={cn("w-4 h-4", config.iconColor)} />
        <span className={cn("text-sm font-semibold", config.textColor)}>
          {config.label}
        </span>
        {category === "board-favorite" && (
          <Star className="w-3.5 h-3.5 text-cyan-500 fill-current" />
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 bg-white">
        <p className="text-slate-700">{pearl}</p>
        {source && (
          <p className="text-xs text-slate-500 mt-2 italic">Source: {source}</p>
        )}
      </div>
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}

// ============================================================================
// Pearl Inline
// ============================================================================

export interface PearlInlineProps {
  pearl: string;
  category?: ClinicalPearlCategory;
  className?: string;
}

export function PearlInline({
  pearl,
  category = "clinical-pearl",
  className,
}: PearlInlineProps) {
  const config = PEARL_CONFIG[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Lightbulb className="w-3.5 h-3.5" />
      {pearl}
    </span>
  );
}
