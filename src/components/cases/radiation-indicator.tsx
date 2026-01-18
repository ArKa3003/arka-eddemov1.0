// @ts-nocheck
"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type RadiationLevel = "none" | "minimal" | "low" | "moderate" | "high";

export interface RadiationIndicatorProps {
  /** Radiation dose in mSv */
  doseMsv: number;
  /** Show the numeric value */
  showValue?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Radiation level configuration
 * - None (green): 0
 * - Minimal: <0.1
 * - Low: 0.1-1
 * - Moderate: 1-10
 * - High: >10
 */
const RADIATION_LEVELS: {
  level: RadiationLevel;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  barColor: string;
}[] = [
  {
    level: "none",
    max: 0,
    label: "None",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    barColor: "bg-emerald-500",
  },
  {
    level: "minimal",
    max: 0.1,
    label: "Minimal",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    barColor: "bg-emerald-500",
  },
  {
    level: "low",
    max: 1,
    label: "Low",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    barColor: "bg-cyan-500",
  },
  {
    level: "moderate",
    max: 10,
    label: "Moderate",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    barColor: "bg-amber-500",
  },
  {
    level: "high",
    max: Infinity,
    label: "High",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    barColor: "bg-rose-500",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getRadiationLevel(doseMsv: number): RadiationLevel {
  if (doseMsv === 0) return "none";
  if (doseMsv < 0.1) return "minimal";
  if (doseMsv <= 1) return "low";
  if (doseMsv <= 10) return "moderate";
  return "high";
}

export function getRadiationConfig(doseMsv: number) {
  const level = getRadiationLevel(doseMsv);
  return RADIATION_LEVELS.find((l) => l.level === level) || RADIATION_LEVELS[0];
}

/**
 * Calculate bar width percentage (max at 20 mSv)
 */
function getBarWidth(doseMsv: number): number {
  if (doseMsv === 0) return 0;
  const maxDose = 20;
  return Math.min((doseMsv / maxDose) * 100, 100);
}

// ============================================================================
// Component
// ============================================================================

/**
 * RadiationIndicator - Visual radiation dose display with level indicator.
 */
export function RadiationIndicator({
  doseMsv,
  showValue = true,
  size = "md",
  className,
}: RadiationIndicatorProps) {
  const config = getRadiationConfig(doseMsv);
  const barWidth = getBarWidth(doseMsv);

  const sizeConfig = {
    sm: { bar: "h-1", text: "text-xs", width: "w-16" },
    md: { bar: "h-1.5", text: "text-sm", width: "w-20" },
    lg: { bar: "h-2", text: "text-base", width: "w-24" },
  };

  const sizes = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Radiation bar */}
      <div className={cn("rounded-full bg-slate-200 overflow-hidden", sizes.bar, sizes.width)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", config.barColor)}
        />
      </div>

      {/* Value and label */}
      {showValue && (
        <span className={cn("font-medium", sizes.text, config.color)}>
          {doseMsv === 0 ? "0" : doseMsv < 0.1 ? "<0.1" : doseMsv.toFixed(1)} mSv
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Badge Variant
// ============================================================================

export interface RadiationBadgeProps {
  doseMsv: number;
  className?: string;
}

export function RadiationBadge({ doseMsv, className }: RadiationBadgeProps) {
  const config = getRadiationConfig(doseMsv);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.barColor)} />
      {config.label}
    </span>
  );
}
