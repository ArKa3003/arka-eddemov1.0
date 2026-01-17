"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

export interface CostDisplayProps {
  /** Cost in USD */
  costUSD: number;
  /** Comparison cost for showing difference */
  comparison?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show icon */
  showIcon?: boolean;
  /** Show tooltip with details */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    text: "text-sm",
    icon: "w-3.5 h-3.5",
    arrow: "w-3 h-3",
  },
  md: {
    text: "text-base",
    icon: "w-4 h-4",
    arrow: "w-4 h-4",
  },
  lg: {
    text: "text-lg",
    icon: "w-5 h-5",
    arrow: "w-5 h-5",
  },
};

// Cost context data
const COST_CONTEXT = {
  cheap: { max: 200, label: "Low cost", color: "text-emerald-600" },
  moderate: { max: 1000, label: "Moderate cost", color: "text-amber-600" },
  expensive: { max: Infinity, label: "High cost", color: "text-rose-600" },
};

// ============================================================================
// Helper Functions
// ============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCostCategory(cost: number) {
  if (cost <= COST_CONTEXT.cheap.max) return COST_CONTEXT.cheap;
  if (cost <= COST_CONTEXT.moderate.max) return COST_CONTEXT.moderate;
  return COST_CONTEXT.expensive;
}

function getComparisonText(cost: number, comparison: number): string {
  const diff = cost - comparison;
  const percentDiff = Math.round((Math.abs(diff) / comparison) * 100);
  
  if (diff > 0) {
    return `${formatCurrency(Math.abs(diff))} more (${percentDiff}% higher)`;
  } else if (diff < 0) {
    return `${formatCurrency(Math.abs(diff))} less (${percentDiff}% lower)`;
  }
  return "Same cost";
}

// ============================================================================
// Component
// ============================================================================

/**
 * CostDisplay - Formatted currency display with optional comparison.
 */
export function CostDisplay({
  costUSD,
  comparison,
  size = "md",
  showIcon = true,
  showTooltip = true,
  className,
}: CostDisplayProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const costCategory = getCostCategory(costUSD);
  
  // Calculate difference if comparison provided
  const diff = comparison !== undefined ? costUSD - comparison : null;
  const isMore = diff !== null && diff > 0;
  const isLess = diff !== null && diff < 0;
  const isSame = diff !== null && diff === 0;

  const content = (
    <div className={cn("flex items-center gap-1", className)}>
      {showIcon && (
        <DollarSign className={cn("text-slate-400", sizeConfig.icon)} />
      )}
      <span className={cn("font-semibold", sizeConfig.text)}>
        {formatCurrency(costUSD)}
      </span>
      
      {/* Comparison Arrow */}
      {comparison !== undefined && (
        <span className="ml-1 flex items-center">
          {isMore && (
            <TrendingUp className={cn("text-rose-500", sizeConfig.arrow)} />
          )}
          {isLess && (
            <TrendingDown className={cn("text-emerald-500", sizeConfig.arrow)} />
          )}
          {isSame && (
            <Minus className={cn("text-slate-400", sizeConfig.arrow)} />
          )}
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className={cn("font-medium", costCategory.color)}>
              {costCategory.label}
            </p>
            {comparison !== undefined && (
              <p className="text-xs text-slate-500">
                {getComparisonText(costUSD, comparison)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Cost Comparison Component
// ============================================================================

export interface CostComparisonProps {
  /** User's selection cost */
  userCost: number;
  /** Optimal choice cost */
  optimalCost: number;
  /** Additional CSS classes */
  className?: string;
}

export function CostComparison({
  userCost,
  optimalCost,
  className,
}: CostComparisonProps) {
  const diff = userCost - optimalCost;
  const isMore = diff > 0;
  const isLess = diff < 0;
  const percentDiff =
    optimalCost > 0 ? Math.round((Math.abs(diff) / optimalCost) * 100) : 0;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-1">
        <p className="text-xs text-slate-500">Your Selection</p>
        <p className="font-semibold text-slate-900">{formatCurrency(userCost)}</p>
      </div>

      <div className="flex flex-col items-center px-4">
        {isMore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-rose-500"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              +{formatCurrency(diff)} ({percentDiff}%)
            </span>
          </motion.div>
        )}
        {isLess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-emerald-500"
          >
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">
              -{formatCurrency(Math.abs(diff))} ({percentDiff}%)
            </span>
          </motion.div>
        )}
        {diff === 0 && (
          <span className="text-sm text-slate-500">Same cost</span>
        )}
      </div>

      <div className="space-y-1 text-right">
        <p className="text-xs text-slate-500">Optimal Choice</p>
        <p className="font-semibold text-emerald-600">
          {formatCurrency(optimalCost)}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Cost Badge
// ============================================================================

export interface CostBadgeProps {
  cost: number;
  className?: string;
}

export function CostBadge({ cost, className }: CostBadgeProps) {
  const category = getCostCategory(cost);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        cost <= 200
          ? "bg-emerald-100 text-emerald-700"
          : cost <= 1000
          ? "bg-amber-100 text-amber-700"
          : "bg-rose-100 text-rose-700",
        className
      )}
    >
      <DollarSign className="w-3 h-3" />
      {formatCurrency(cost)}
    </span>
  );
}

// ============================================================================
// Cost Bar (Visual)
// ============================================================================

export interface CostBarProps {
  cost: number;
  maxCost?: number;
  showLabel?: boolean;
  className?: string;
}

export function CostBar({
  cost,
  maxCost = 5000,
  showLabel = true,
  className,
}: CostBarProps) {
  const percentage = Math.min((cost / maxCost) * 100, 100);
  const category = getCostCategory(cost);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Cost</span>
          <span className={cn("font-medium", category.color)}>
            {formatCurrency(cost)}
          </span>
        </div>
      )}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            cost <= 200
              ? "bg-emerald-500"
              : cost <= 1000
              ? "bg-amber-500"
              : "bg-rose-500"
          )}
        />
      </div>
    </div>
  );
}
