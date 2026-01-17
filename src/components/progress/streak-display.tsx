"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Shield, TrendingUp, Calendar, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export interface StreakDisplayProps {
  /** Current streak count */
  currentStreak: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Whether streak is active today */
  isActiveToday?: boolean;
  /** Whether user has streak freeze available */
  hasStreakFreeze?: boolean;
  /** Number of streak freezes remaining */
  freezesRemaining?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Variant style */
  variant?: "default" | "card" | "inline" | "hero";
  /** Show longest streak comparison */
  showLongest?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Size Configuration
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    container: "gap-1",
    icon: "w-4 h-4",
    number: "text-lg",
    label: "text-xs",
  },
  md: {
    container: "gap-2",
    icon: "w-5 h-5",
    number: "text-2xl",
    label: "text-sm",
  },
  lg: {
    container: "gap-3",
    icon: "w-8 h-8",
    number: "text-4xl",
    label: "text-base",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * StreakDisplay - Shows current streak with animated flame.
 */
export function StreakDisplay({
  currentStreak,
  longestStreak,
  isActiveToday = false,
  hasStreakFreeze = false,
  freezesRemaining = 0,
  size = "md",
  variant = "default",
  showLongest = true,
  className,
}: StreakDisplayProps) {
  const config = SIZE_CONFIG[size];
  const isNewRecord = currentStreak >= longestStreak && currentStreak > 0;

  // Render based on variant
  if (variant === "hero") {
    return (
      <StreakHero
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        isActiveToday={isActiveToday}
        hasStreakFreeze={hasStreakFreeze}
        freezesRemaining={freezesRemaining}
        className={className}
      />
    );
  }

  if (variant === "card") {
    return (
      <StreakCard
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        isActiveToday={isActiveToday}
        hasStreakFreeze={hasStreakFreeze}
        freezesRemaining={freezesRemaining}
        className={className}
      />
    );
  }

  if (variant === "inline") {
    return (
      <StreakInline
        currentStreak={currentStreak}
        isActiveToday={isActiveToday}
        size={size}
        className={className}
      />
    );
  }

  // Default variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center",
              config.container,
              className
            )}
          >
            {/* Animated Flame */}
            <AnimatedFlame
              isActive={isActiveToday || currentStreak > 0}
              size={size}
            />

            {/* Streak Number */}
            <div className="flex flex-col">
              <span className={cn("font-bold text-slate-900", config.number)}>
                {currentStreak}
              </span>
              {showLongest && (
                <span className={cn("text-slate-500", config.label)}>
                  {isNewRecord ? "🎉 New record!" : `Best: ${longestStreak}`}
                </span>
              )}
            </div>

            {/* Freeze Badge */}
            {hasStreakFreeze && freezesRemaining > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                {freezesRemaining}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{currentStreak} day streak</p>
          {!isActiveToday && currentStreak > 0 && (
            <p className="text-amber-500 text-xs">
              Complete a case to keep your streak!
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Animated Flame
// ============================================================================

interface AnimatedFlameProps {
  isActive: boolean;
  size?: "sm" | "md" | "lg";
}

function AnimatedFlame({ isActive, size = "md" }: AnimatedFlameProps) {
  const flameSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  if (!isActive) {
    return <span className={cn("opacity-30", flameSize[size])}>🔥</span>;
  }

  return (
    <motion.span
      animate={{
        scale: [1, 1.1, 1],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={flameSize[size]}
    >
      🔥
    </motion.span>
  );
}

// ============================================================================
// Streak Card Variant
// ============================================================================

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  hasStreakFreeze: boolean;
  freezesRemaining: number;
  className?: string;
}

function StreakCard({
  currentStreak,
  longestStreak,
  isActiveToday,
  hasStreakFreeze,
  freezesRemaining,
  className,
}: StreakCardProps) {
  const isNewRecord = currentStreak >= longestStreak && currentStreak > 0;

  return (
    <Card
      className={cn(
        "overflow-hidden",
        currentStreak > 0
          ? "bg-gradient-to-br from-amber-500 to-orange-500"
          : "bg-slate-100",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          {/* Flame & Count */}
          <div className="flex items-center gap-3">
            <AnimatedFlame isActive={currentStreak > 0} size="lg" />
            <div>
              <p
                className={cn(
                  "text-4xl font-bold",
                  currentStreak > 0 ? "text-white" : "text-slate-400"
                )}
              >
                {currentStreak}
              </p>
              <p
                className={cn(
                  "text-sm",
                  currentStreak > 0 ? "text-white/80" : "text-slate-500"
                )}
              >
                day streak
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            {isNewRecord && currentStreak > 0 ? (
              <Badge className="bg-white/20 text-white border-0 mb-1">
                🎉 New Record!
              </Badge>
            ) : (
              <p
                className={cn(
                  "text-sm",
                  currentStreak > 0 ? "text-white/80" : "text-slate-500"
                )}
              >
                Best: {longestStreak} days
              </p>
            )}

            {hasStreakFreeze && freezesRemaining > 0 && (
              <div
                className={cn(
                  "flex items-center justify-end gap-1 text-xs mt-1",
                  currentStreak > 0 ? "text-white/70" : "text-slate-400"
                )}
              >
                <Shield className="w-3 h-3" />
                {freezesRemaining} freeze{freezesRemaining !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {currentStreak > 0 && !isActiveToday && (
          <div className="mt-4 bg-white/10 rounded-lg px-3 py-2 text-sm text-white/90">
            ⚡ Complete a case today to keep your streak!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Streak Hero Variant
// ============================================================================

function StreakHero({
  currentStreak,
  longestStreak,
  isActiveToday,
  hasStreakFreeze,
  freezesRemaining,
  className,
}: StreakCardProps) {
  const isNewRecord = currentStreak >= longestStreak && currentStreak > 0;
  const milestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => m > currentStreak) || 100;
  const progressToNext = (currentStreak / nextMilestone) * 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-8 text-center",
        currentStreak > 0
          ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"
          : "bg-slate-200",
        className
      )}
    >
      {/* Background Pattern */}
      {currentStreak > 0 && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
        </div>
      )}

      <div className="relative z-10">
        {/* Animated Flame */}
        <motion.div
          animate={
            currentStreak > 0
              ? {
                  scale: [1, 1.05, 1],
                  rotate: [-3, 3, -3],
                }
              : {}
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-7xl mb-4"
        >
          {currentStreak > 0 ? "🔥" : "❄️"}
        </motion.div>

        {/* Streak Count */}
        <p
          className={cn(
            "text-6xl font-bold mb-2",
            currentStreak > 0 ? "text-white" : "text-slate-500"
          )}
        >
          {currentStreak}
        </p>
        <p
          className={cn(
            "text-xl",
            currentStreak > 0 ? "text-white/90" : "text-slate-500"
          )}
        >
          day streak
        </p>

        {/* Record Badge */}
        {isNewRecord && currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4"
          >
            <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-1">
              🎉 Personal Best!
            </Badge>
          </motion.div>
        )}

        {/* Progress to Next Milestone */}
        {currentStreak > 0 && currentStreak < 100 && (
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
              <span>Next milestone</span>
              <span>{nextMilestone} days</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}

        {/* Action Message */}
        {currentStreak > 0 && !isActiveToday && (
          <div className="mt-6 bg-white/10 rounded-lg px-4 py-3 text-white/90">
            <Zap className="w-5 h-5 inline mr-2" />
            Complete a case to keep your streak alive!
          </div>
        )}

        {currentStreak === 0 && (
          <div className="mt-6 text-slate-600">
            Start learning to begin your streak!
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Streak Inline Variant
// ============================================================================

interface StreakInlineProps {
  currentStreak: number;
  isActiveToday: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function StreakInline({
  currentStreak,
  isActiveToday,
  size = "md",
  className,
}: StreakInlineProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full",
        currentStreak > 0
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-100 text-slate-500",
        className
      )}
    >
      <AnimatedFlame isActive={currentStreak > 0} size="sm" />
      <span className="font-semibold">{currentStreak}</span>
    </div>
  );
}

// ============================================================================
// Streak Milestone Toast
// ============================================================================

export interface StreakMilestoneToastProps {
  milestone: number;
  onClose: () => void;
}

export function StreakMilestoneToast({
  milestone,
  onClose,
}: StreakMilestoneToastProps) {
  const getMessage = () => {
    switch (milestone) {
      case 3:
        return "Great start! Keep it up!";
      case 7:
        return "One week strong! 💪";
      case 14:
        return "Two weeks! You're on fire!";
      case 30:
        return "A whole month! Incredible!";
      case 60:
        return "60 days! You're unstoppable!";
      case 100:
        return "100 DAYS! LEGENDARY! 🏆";
      default:
        return "Amazing streak!";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-2xl p-4 flex items-center gap-4 max-w-sm z-50"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
        transition={{ duration: 0.5, repeat: 3 }}
        className="text-4xl"
      >
        🔥
      </motion.span>
      <div>
        <p className="font-bold text-lg">{milestone} Day Streak!</p>
        <p className="text-white/90 text-sm">{getMessage()}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}
