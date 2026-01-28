// @ts-nocheck
"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Scan,
  Zap,
  Activity,
  Radio,
  Atom,
  CircleOff,
  DollarSign,
  Check,
} from "lucide-react";
import { RadiationIndicator } from "./radiation-indicator";
import { cn } from "@/lib/utils";
import type { Modality } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface ImagingOptionCardProps {
  /** Unique ID */
  id: string;
  /** Display name */
  name: string;
  /** Short name for compact display */
  shortName?: string;
  /** Modality type */
  modality: Modality | "none";
  /** Typical cost in USD */
  costUsd: number;
  /** Radiation dose in mSv */
  radiationMsv: number;
  /** Description text */
  description?: string;
  /** Whether this option is selected */
  isSelected: boolean;
  /** Selection change handler */
  onSelect: () => void;
  /** Whether selection is disabled */
  disabled?: boolean;
  /** Special variant for "No Imaging" */
  variant?: "default" | "special";
  /** Animation index for staggered entrance */
  index?: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const MODALITY_CONFIG: Record<
  Modality | "none",
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  xray: {
    icon: Zap,
    label: "X-ray",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  ct: {
    icon: Scan,
    label: "CT",
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  mri: {
    icon: Activity,
    label: "MRI",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  ultrasound: {
    icon: Radio,
    label: "Ultrasound",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  nuclear: {
    icon: Atom,
    label: "Nuclear",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  fluoroscopy: {
    icon: Scan,
    label: "Fluoro",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  mammography: {
    icon: Scan,
    label: "Mammo",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  pet: {
    icon: Atom,
    label: "PET",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  none: {
    icon: CircleOff,
    label: "None",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * ImagingOptionCard - Selectable imaging option with cost and radiation info.
 */
export function ImagingOptionCard({
  id,
  name,
  shortName,
  modality,
  costUsd,
  radiationMsv,
  description,
  isSelected,
  onSelect,
  disabled = false,
  variant = "default",
  index = 0,
  className,
}: ImagingOptionCardProps) {
  const config = MODALITY_CONFIG[modality] || MODALITY_CONFIG.xray;
  const Icon = config.icon;

  const isSpecial = variant === "special";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-xl border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/20",
        isSelected
          ? isSpecial
            ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10"
            : "border-cyan-500 bg-cyan-50 shadow-md shadow-cyan-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className={cn("p-4", isSpecial && "text-center py-6")}>
        {isSpecial ? (
          // Special "No Imaging" variant
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isSelected ? "bg-emerald-500" : "bg-slate-200"
              )}
            >
              <CircleOff
                className={cn(
                  "w-6 h-6",
                  isSelected ? "text-white" : "text-slate-500"
                )}
              />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{name}</div>
              <div className="text-sm text-slate-500">No radiation • No cost</div>
            </div>
          </div>
        ) : (
          // Default variant
          <div className="flex items-start gap-3">
            {/* Radio Button */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                isSelected
                  ? "bg-cyan-500 border-cyan-500"
                  : "border-slate-300"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-2.5 h-2.5 rounded-full bg-white"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Name + Modality */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 truncate">
                      {shortName || name}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                        config.bgColor,
                        config.color
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                      {description}
                    </p>
                  )}

                  {/* Cost + Radiation */}
                  <div className="flex items-center gap-4">
                    {/* Cost */}
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 font-medium">
                        ${costUsd.toLocaleString()}
                      </span>
                    </div>

                    {/* Radiation */}
                    <RadiationIndicator doseMsv={radiationMsv} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ============================================================================
// Skeleton
// ============================================================================

export function ImagingOptionCardSkeleton() {
  return (
    <div className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded bg-slate-200" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-32 h-5 bg-slate-200 rounded" />
            <div className="w-12 h-5 bg-slate-200 rounded" />
          </div>
          <div className="w-full h-3 bg-slate-200 rounded mb-2" />
          <div className="flex gap-4">
            <div className="w-16 h-4 bg-slate-200 rounded" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
