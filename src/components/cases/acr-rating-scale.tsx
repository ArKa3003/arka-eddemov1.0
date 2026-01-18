// @ts-nocheck
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

// ============================================================================
// Types
// ============================================================================

export interface ACRRatingScaleProps {
  /** User's rating to display */
  userRating?: number;
  /** Optimal rating to show for comparison */
  optimalRating?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show section labels */
  showLabels?: boolean;
  /** Animate markers */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ACRRatingScale - Horizontal 1-9 scale with gradient and markers.
 */
export function ACRRatingScale({
  userRating,
  optimalRating,
  showLegend = true,
  showLabels = true,
  animate = true,
  className,
}: ACRRatingScaleProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Scale Container */}
      <div className="relative">
        {/* Background Gradient Bar */}
        <div className="h-8 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 relative overflow-hidden">
          {/* Section dividers */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 border-r border-white/30" />
            <div className="flex-1 border-r border-white/30" />
            <div className="flex-1" />
          </div>

          {/* Number markers */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TooltipProvider key={num}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-help transition-transform hover:scale-110",
                        num <= 3
                          ? "bg-rose-600/20 text-rose-900"
                          : num <= 6
                          ? "bg-amber-600/20 text-amber-900"
                          : "bg-emerald-600/20 text-emerald-900"
                      )}
                    >
                      {num}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Rating {num}</p>
                    <p className="text-xs text-slate-500">
                      {num <= 3
                        ? "Usually Not Appropriate"
                        : num <= 6
                        ? "May Be Appropriate"
                        : "Usually Appropriate"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* User Rating Marker */}
        {userRating && (
          <motion.div
            initial={animate ? { y: -20, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute -top-2"
            style={{
              left: `calc(${((userRating - 1) / 8) * 100}% - 12px)`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-slate-800" />
              <span className="mt-1 text-[10px] font-bold text-slate-700 bg-white px-1 rounded shadow-sm">
                You
              </span>
            </div>
          </motion.div>
        )}

        {/* Optimal Rating Marker */}
        {optimalRating && optimalRating !== userRating && (
          <motion.div
            initial={animate ? { y: 20, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="absolute -bottom-2"
            style={{
              left: `calc(${((optimalRating - 1) / 8) * 100}% - 12px)`,
            }}
          >
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                Best
              </span>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-emerald-600" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Section Labels */}
      {showLabels && (
        <div className="flex text-xs">
          <div className="flex-1 text-center text-rose-600 font-medium">
            Usually Not Appropriate
            <span className="block text-[10px] text-slate-500">(1-3)</span>
          </div>
          <div className="flex-1 text-center text-amber-600 font-medium">
            May Be Appropriate
            <span className="block text-[10px] text-slate-500">(4-6)</span>
          </div>
          <div className="flex-1 text-center text-emerald-600 font-medium">
            Usually Appropriate
            <span className="block text-[10px] text-slate-500">(7-9)</span>
          </div>
        </div>
      )}

      {/* Legend */}
      {showLegend && (userRating || optimalRating) && (
        <div className="flex items-center justify-center gap-4 text-xs">
          {userRating && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-800 rounded-sm" />
              <span className="text-slate-600">Your Choice: {userRating}</span>
            </div>
          )}
          {optimalRating && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-600 rounded-sm" />
              <span className="text-slate-600">
                Optimal: {optimalRating}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compact Scale (inline)
// ============================================================================

export interface ACRScaleCompactProps {
  rating: number;
  className?: string;
}

export function ACRScaleCompact({ rating, className }: ACRScaleCompactProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className={cn(
            "w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold",
            num <= 3
              ? "bg-rose-100 text-rose-700"
              : num <= 6
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700",
            num === rating && "ring-2 ring-offset-1 ring-slate-900 scale-125"
          )}
        >
          {num === rating ? num : ""}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Mini Scale (dots)
// ============================================================================

export interface ACRScaleMiniProps {
  rating: number;
  className?: string;
}

export function ACRScaleMini({ rating, className }: ACRScaleMiniProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            num <= 3
              ? "bg-rose-300"
              : num <= 6
              ? "bg-amber-300"
              : "bg-emerald-300",
            num === rating && "scale-150 ring-1 ring-slate-900"
          )}
        />
      ))}
    </div>
  );
}
