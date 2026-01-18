// @ts-nocheck
"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  ChevronRight,
  AlertCircle,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface HintSystemProps {
  /** Array of hint strings */
  hints: string[];
  /** Maximum hints that can be revealed */
  maxHints?: number;
  /** Number of hints already revealed (controlled) */
  hintsRevealed?: number;
  /** Handler when hint is revealed */
  onRevealHint?: (hintIndex: number) => void;
  /** Points cost per hint (after first free hint) */
  pointsCostPerHint?: number;
  /** Current score/points (to show cost) */
  currentPoints?: number;
  /** Whether hints are disabled (quiz mode) */
  disabled?: boolean;
  /** Show analytics data */
  showAnalytics?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * HintSystem - Progressive hint reveal system for learning mode.
 * - First hint is free
 * - Subsequent hints cost points
 * - Tracks hints used for analytics
 */
export function HintSystem({
  hints,
  maxHints,
  hintsRevealed = 0,
  onRevealHint,
  pointsCostPerHint = 5,
  currentPoints = 100,
  disabled = false,
  showAnalytics = false,
  className,
}: HintSystemProps) {
  const [localRevealed, setLocalRevealed] = React.useState(hintsRevealed);

  // Use controlled or local state
  const revealed = hintsRevealed !== undefined ? hintsRevealed : localRevealed;

  // Calculate max hints
  const effectiveMaxHints = maxHints ?? hints.length;
  const hintsAvailable = Math.min(hints.length, effectiveMaxHints);
  const canRevealMore = revealed < hintsAvailable && !disabled;

  // Calculate point cost for next hint
  const nextHintCost = revealed === 0 ? 0 : pointsCostPerHint;
  const canAfford = currentPoints >= nextHintCost;

  /**
   * Reveal the next hint
   */
  const handleRevealHint = () => {
    if (!canRevealMore) return;
    if (revealed > 0 && !canAfford) return;

    const nextIndex = revealed;

    if (onRevealHint) {
      onRevealHint(nextIndex);
    } else {
      setLocalRevealed((prev) => prev + 1);
    }
  };

  if (hints.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h4 className="font-semibold text-slate-900">Hints</h4>
          <Badge variant="default" size="sm">
            {revealed}/{hintsAvailable}
          </Badge>
        </div>

        {showAnalytics && revealed > 0 && (
          <span className="text-xs text-slate-500">
            Used: {revealed} hint{revealed !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Revealed Hints */}
      <AnimatePresence>
        {hints.slice(0, revealed).map((hint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HintCard hint={hint} index={index} isFree={index === 0} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Reveal Button */}
      {canRevealMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="default"
            onClick={handleRevealHint}
            disabled={!canAfford || disabled}
            className={cn(
              "w-full justify-center gap-2",
              revealed === 0
                ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                : "border-slate-300"
            )}
          >
            <Lightbulb className="w-4 h-4" />
            {revealed === 0 ? (
              <>
                Need a hint?
                <Badge variant="success" size="sm" className="ml-1">
                  FREE
                </Badge>
              </>
            ) : (
              <>
                Reveal Hint {revealed + 1}
                <Badge
                  variant={canAfford ? "warning" : "error"}
                  size="sm"
                  className="ml-1"
                >
                  <Minus className="w-3 h-3 mr-0.5" />
                  {nextHintCost} pts
                </Badge>
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* All hints revealed message */}
      {revealed >= hintsAvailable && hintsAvailable > 0 && (
        <p className="text-xs text-slate-500 text-center">
          All hints revealed
        </p>
      )}

      {/* Disabled message (quiz mode) */}
      {disabled && (
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4" />
          Hints are not available in Quiz mode
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Hint Card Component
// ============================================================================

interface HintCardProps {
  hint: string;
  index: number;
  isFree?: boolean;
}

function HintCard({ hint, index, isFree = false }: HintCardProps) {
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-slate-700">{hint}</p>
            {isFree && (
              <span className="text-xs text-amber-600 mt-1 inline-block">
                Free hint
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Compact Hint Button
// ============================================================================

export interface HintButtonProps {
  hintsAvailable: number;
  hintsUsed: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function HintButton({
  hintsAvailable,
  hintsUsed,
  onClick,
  disabled = false,
  className,
}: HintButtonProps) {
  const remaining = hintsAvailable - hintsUsed;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled || remaining <= 0}
      className={cn("gap-1.5", className)}
    >
      <Lightbulb
        className={cn(
          "w-4 h-4",
          remaining > 0 ? "text-amber-500" : "text-slate-400"
        )}
      />
      {remaining > 0 ? (
        <>
          Hint
          <Badge variant="default" size="sm">
            {remaining}
          </Badge>
        </>
      ) : (
        "No hints left"
      )}
    </Button>
  );
}

// ============================================================================
// Hint Progress Indicator
// ============================================================================

export interface HintProgressProps {
  total: number;
  used: number;
  className?: string;
}

export function HintProgress({ total, used, className }: HintProgressProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(total)].map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            index < used ? "bg-amber-500" : "bg-slate-200"
          )}
        />
      ))}
    </div>
  );
}
