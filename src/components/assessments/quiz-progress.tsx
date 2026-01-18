// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export interface CaseStatus {
  /** Case index (0-based) */
  index: number;
  /** Whether case has been answered */
  answered: boolean;
  /** Whether case is flagged for review */
  flagged: boolean;
  /** Whether this is the current case */
  current: boolean;
}

export interface QuizProgressProps {
  /** Current case index (0-based) */
  currentIndex: number;
  /** Total number of cases */
  totalCases: number;
  /** Status of each case */
  caseStatuses: CaseStatus[];
  /** Whether navigation is allowed */
  allowNavigation?: boolean;
  /** Callback when clicking a case marker */
  onCaseClick?: (index: number) => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * QuizProgress - Horizontal progress bar with case markers.
 */
export function QuizProgress({
  currentIndex,
  totalCases,
  caseStatuses,
  allowNavigation = true,
  onCaseClick,
  className,
}: QuizProgressProps) {
  const progressPercent = ((currentIndex + 1) / totalCases) * 100;
  const answeredCount = caseStatuses.filter((c) => c.answered).length;
  const flaggedCount = caseStatuses.filter((c) => c.flagged).length;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 font-medium">
          Case {currentIndex + 1} of {totalCases}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            {answeredCount} answered
          </span>
          {flaggedCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600">
              <Flag className="w-3.5 h-3.5" />
              {flaggedCount} flagged
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
        />
      </div>

      {/* Case Markers */}
      <div className="flex items-center justify-between gap-1 py-2 overflow-x-auto scrollbar-hide">
        <TooltipProvider>
          {caseStatuses.map((status, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => allowNavigation && onCaseClick?.(index)}
                  disabled={!allowNavigation}
                  className={cn(
                    "relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    status.current
                      ? "bg-cyan-500 text-white ring-2 ring-cyan-500 ring-offset-2 scale-110"
                      : status.answered
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                    allowNavigation && !status.current && "hover:scale-110 cursor-pointer",
                    !allowNavigation && "cursor-default"
                  )}
                >
                  {status.answered ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}

                  {/* Flag indicator */}
                  {status.flagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                      <Flag className="w-2 h-2 text-white" />
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Case {index + 1}</p>
                <p className="text-xs text-slate-500">
                  {status.answered ? "Answered" : "Not answered"}
                  {status.flagged && " • Flagged"}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Progress (for header)
// ============================================================================

export interface QuizProgressCompactProps {
  currentIndex: number;
  totalCases: number;
  answeredCount: number;
  flaggedCount: number;
  className?: string;
}

export function QuizProgressCompact({
  currentIndex,
  totalCases,
  answeredCount,
  flaggedCount,
  className,
}: QuizProgressCompactProps) {
  const progressPercent = ((currentIndex + 1) / totalCases) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        {currentIndex + 1}/{totalCases}
      </span>
      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          className="h-full bg-cyan-500 rounded-full"
        />
      </div>
      {flaggedCount > 0 && (
        <span className="flex items-center gap-1 text-amber-600 text-sm">
          <Flag className="w-3.5 h-3.5" />
          {flaggedCount}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Navigation Controls
// ============================================================================

export interface QuizNavigationProps {
  currentIndex: number;
  totalCases: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLastCase: boolean;
  className?: string;
}

export function QuizNavigation({
  currentIndex,
  totalCases,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onSubmit,
  isLastCase,
  className,
}: QuizNavigationProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        variant="default"
        onClick={onPrevious}
        disabled={!canGoBack}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-slate-500">
        Case {currentIndex + 1} of {totalCases}
      </span>

      {isLastCase ? (
        <Button onClick={onSubmit}>
          Submit Assessment
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoForward}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Flag Toggle
// ============================================================================

export interface FlagToggleProps {
  isFlagged: boolean;
  onToggle: () => void;
  className?: string;
}

export function FlagToggle({ isFlagged, onToggle, className }: FlagToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
        isFlagged
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        className
      )}
    >
      <Flag className={cn("w-4 h-4", isFlagged && "fill-current")} />
      {isFlagged ? "Flagged" : "Flag for Review"}
    </button>
  );
}
