"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckCircle,
  Gift,
  Zap,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinearProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DailyGoal {
  id: string;
  type: "cases" | "accuracy" | "time" | "streak";
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    type: "points" | "streak_freeze" | "badge";
    value: number | string;
  };
  completed: boolean;
}

export interface DailyGoalsProps {
  /** List of daily goals */
  goals: DailyGoal[];
  /** Total points earned today */
  pointsToday?: number;
  /** Callback when goal is claimed */
  onClaimReward?: (goalId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * DailyGoals - Shows daily goals with progress and rewards.
 */
export function DailyGoals({
  goals,
  pointsToday = 0,
  onClaimReward,
  className,
}: DailyGoalsProps) {
  const completedCount = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length;
  const allComplete = completedCount === totalGoals;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-500" />
            Daily Goals
          </CardTitle>
          <Badge
            variant={allComplete ? "success" : "secondary"}
            size="sm"
          >
            {completedCount}/{totalGoals} complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              index={index}
              onClaim={() => onClaimReward?.(goal.id)}
            />
          ))}
        </div>

        {/* All Goals Complete Bonus */}
        <AnimatePresence>
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-3xl"
                >
                  🎉
                </motion.div>
                <div>
                  <p className="font-semibold text-amber-800">
                    All goals complete!
                  </p>
                  <p className="text-sm text-amber-600">
                    +50 bonus points earned
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Points Summary */}
        {pointsToday > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-sm text-slate-500">Points earned today</span>
            <span className="font-semibold text-amber-600">
              +{pointsToday} ⭐
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Goal Item
// ============================================================================

interface GoalItemProps {
  goal: DailyGoal;
  index: number;
  onClaim: () => void;
}

function GoalItem({ goal, index, onClaim }: GoalItemProps) {
  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const isComplete = goal.current >= goal.target;

  const getIcon = () => {
    switch (goal.type) {
      case "cases":
        return "📚";
      case "accuracy":
        return "🎯";
      case "time":
        return "⏱️";
      case "streak":
        return "🔥";
      default:
        return "⭐";
    }
  };

  const getRewardIcon = () => {
    switch (goal.reward.type) {
      case "points":
        return "⭐";
      case "streak_freeze":
        return "🛡️";
      case "badge":
        return "🏆";
      default:
        return "🎁";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "rounded-xl p-4 transition-colors",
        isComplete
          ? "bg-emerald-50 border border-emerald-200"
          : "bg-slate-50 border border-slate-200"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            isComplete ? "bg-emerald-100" : "bg-white"
          )}
        >
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <span className="text-xl">{getIcon()}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p
                className={cn(
                  "font-medium",
                  isComplete ? "text-emerald-800" : "text-slate-900"
                )}
              >
                {goal.title}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isComplete ? "text-emerald-600" : "text-slate-500"
                )}
              >
                {goal.description}
              </p>
            </div>

            {/* Reward */}
            <div className="text-right flex-shrink-0">
              <span className="text-sm font-medium">
                {getRewardIcon()} {goal.reward.value}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className={cn(
                  isComplete ? "text-emerald-600" : "text-slate-500"
                )}
              >
                {goal.current}/{goal.target}
              </span>
              <span
                className={cn(
                  "font-medium",
                  isComplete ? "text-emerald-600" : "text-slate-700"
                )}
              >
                {progress}%
              </span>
            </div>
            <LinearProgress
              value={progress}
              color={isComplete ? "success" : "default"}
              size="sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Points Display
// ============================================================================

export interface PointsDisplayProps {
  totalPoints: number;
  todayPoints?: number;
  weekPoints?: number;
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
  className?: string;
}

export function PointsDisplay({
  totalPoints,
  todayPoints = 0,
  weekPoints = 0,
  size = "md",
  showBreakdown = false,
  className,
}: PointsDisplayProps) {
  const [animatedPoints, setAnimatedPoints] = React.useState(0);

  React.useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPoints(Math.round(totalPoints * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [totalPoints]);

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Star className="w-6 h-6 text-amber-500 fill-current" />
        <span className={cn("font-bold text-amber-600", sizeClasses[size])}>
          {animatedPoints.toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-slate-500">Total Points</p>

      {showBreakdown && (
        <div className="flex items-center justify-center gap-4 mt-3 text-sm">
          {todayPoints > 0 && (
            <span className="text-emerald-600">+{todayPoints} today</span>
          )}
          {weekPoints > 0 && (
            <span className="text-slate-500">+{weekPoints} this week</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Points Calculation
// ============================================================================

export interface PointsCalculation {
  base: number;
  streakBonus: number;
  speedBonus: number;
  noHintsBonus: number;
  total: number;
}

/**
 * Calculate points for a case completion
 */
export function calculateCasePoints(
  acrRating: number,
  currentStreak: number,
  timeSpentSeconds: number,
  hintsUsed: number
): PointsCalculation {
  // Base points from ACR rating (1-9 scale → 10-90 points)
  const base = acrRating * 10;

  // Streak bonus (1% per day, max 30%)
  const streakMultiplier = Math.min(0.3, currentStreak * 0.01);
  const streakBonus = Math.round(base * streakMultiplier);

  // Speed bonus (under 2 minutes)
  const speedBonus = timeSpentSeconds < 120 ? Math.round(base * 0.1) : 0;

  // No hints bonus
  const noHintsBonus = hintsUsed === 0 ? Math.round(base * 0.1) : 0;

  const total = base + streakBonus + speedBonus + noHintsBonus;

  return {
    base,
    streakBonus,
    speedBonus,
    noHintsBonus,
    total,
  };
}

// ============================================================================
// Points Breakdown Toast
// ============================================================================

export interface PointsBreakdownToastProps {
  calculation: PointsCalculation;
  onClose: () => void;
}

export function PointsBreakdownToast({
  calculation,
  onClose,
}: PointsBreakdownToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 min-w-[200px] z-50"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-slate-900">Points Earned</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Base</span>
          <span className="font-medium">+{calculation.base}</span>
        </div>

        {calculation.streakBonus > 0 && (
          <div className="flex justify-between text-amber-600">
            <span>🔥 Streak Bonus</span>
            <span className="font-medium">+{calculation.streakBonus}</span>
          </div>
        )}

        {calculation.speedBonus > 0 && (
          <div className="flex justify-between text-cyan-600">
            <span>⚡ Speed Bonus</span>
            <span className="font-medium">+{calculation.speedBonus}</span>
          </div>
        )}

        {calculation.noHintsBonus > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>💡 No Hints Bonus</span>
            <span className="font-medium">+{calculation.noHintsBonus}</span>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-slate-100 font-semibold">
          <span>Total</span>
          <span className="text-amber-600">
            +{calculation.total} ⭐
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Default Daily Goals Generator
// ============================================================================

export function generateDefaultDailyGoals(
  casesCompletedToday: number = 0,
  accuracyToday: number = 0,
  currentStreak: number = 0
): DailyGoal[] {
  return [
    {
      id: "daily-cases",
      type: "cases",
      title: "Complete 3 cases",
      description: "Practice makes perfect!",
      target: 3,
      current: casesCompletedToday,
      reward: { type: "points", value: 50 },
      completed: casesCompletedToday >= 3,
    },
    {
      id: "daily-accuracy",
      type: "accuracy",
      title: "Achieve 80% accuracy",
      description: "Aim for excellence",
      target: 80,
      current: accuracyToday,
      reward: { type: "points", value: 30 },
      completed: accuracyToday >= 80,
    },
    {
      id: "daily-streak",
      type: "streak",
      title: "Maintain your streak",
      description: "Don't break the chain!",
      target: 1,
      current: currentStreak > 0 ? 1 : 0,
      reward: { type: "streak_freeze", value: 1 },
      completed: currentStreak > 0,
    },
  ];
}
