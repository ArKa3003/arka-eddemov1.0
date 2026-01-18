// @ts-nocheck
"use client";

import * as React from "react";
import confetti from "canvas-confetti";

// ============================================================================
// Types
// ============================================================================

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
  streakFreezes: number;
}

export interface StreakMilestone {
  days: number;
  reached: boolean;
  reachedAt?: string;
}

export interface UseStreakOptions {
  /** Initial streak data */
  initialData?: Partial<StreakData>;
  /** Callback when streak changes */
  onStreakChange?: (data: StreakData) => void;
  /** Callback when milestone reached */
  onMilestoneReached?: (milestone: number) => void;
  /** Enable confetti on milestones */
  enableConfetti?: boolean;
  /** Custom milestones */
  milestones?: number[];
}

export interface UseStreakReturn {
  /** Current streak data */
  streak: StreakData;
  /** Record activity (call when completing a case) */
  recordActivity: () => StreakResult;
  /** Use a streak freeze */
  useStreakFreeze: () => boolean;
  /** Add streak freezes */
  addStreakFreezes: (count: number) => void;
  /** Check if streak is at risk */
  isStreakAtRisk: boolean;
  /** Hours until streak expires */
  hoursUntilExpiry: number | null;
  /** Milestone status */
  milestones: StreakMilestone[];
  /** Next milestone */
  nextMilestone: number | null;
  /** Progress to next milestone (0-100) */
  progressToNextMilestone: number;
}

export interface StreakResult {
  streakContinued: boolean;
  streakBroken: boolean;
  newStreak: number;
  milestoneReached: number | null;
  isNewRecord: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MILESTONES = [3, 7, 14, 30, 60, 100];
const STORAGE_KEY = "arka-ed-streak-data";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get start of day in local timezone
 */
function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return getStartOfDay(date1).getTime() === getStartOfDay(date2).getTime();
}

/**
 * Check if date is yesterday
 */
function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * Get hours until end of day
 */
function getHoursUntilEndOfDay(): number {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return Math.max(0, (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60));
}

/**
 * Load streak data from localStorage
 */
function loadStreakData(): Partial<StreakData> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save streak data to localStorage
 */
function saveStreakData(data: StreakData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useStreak - Manages streak logic and persistence.
 */
export function useStreak(options: UseStreakOptions = {}): UseStreakReturn {
  const {
    initialData = {},
    onStreakChange,
    onMilestoneReached,
    enableConfetti = true,
    milestones = DEFAULT_MILESTONES,
  } = options;

  // Initialize from localStorage or props
  const [streak, setStreak] = React.useState<StreakData>(() => {
    const stored = loadStreakData();
    return {
      currentStreak: stored.currentStreak ?? initialData.currentStreak ?? 0,
      longestStreak: stored.longestStreak ?? initialData.longestStreak ?? 0,
      lastActivityDate: stored.lastActivityDate ?? initialData.lastActivityDate ?? null,
      isActiveToday: false,
      streakFreezes: stored.streakFreezes ?? initialData.streakFreezes ?? 0,
    };
  });

  // Check streak status on mount and when date changes
  React.useEffect(() => {
    const checkStreak = () => {
      const today = new Date();
      const lastActivity = streak.lastActivityDate
        ? new Date(streak.lastActivityDate)
        : null;

      let updatedStreak = { ...streak };
      let changed = false;

      // Check if active today
      if (lastActivity && isSameDay(lastActivity, today)) {
        if (!streak.isActiveToday) {
          updatedStreak.isActiveToday = true;
          changed = true;
        }
      } else {
        if (streak.isActiveToday) {
          updatedStreak.isActiveToday = false;
          changed = true;
        }

        // Check if streak should be broken
        if (lastActivity && !isYesterday(lastActivity) && !isSameDay(lastActivity, today)) {
          // Streak is broken unless we have a freeze
          if (streak.currentStreak > 0) {
            // More than 1 day gap - streak broken
            updatedStreak.currentStreak = 0;
            changed = true;
          }
        }
      }

      if (changed) {
        setStreak(updatedStreak);
        saveStreakData(updatedStreak);
        onStreakChange?.(updatedStreak);
      }
    };

    checkStreak();

    // Check every minute
    const interval = setInterval(checkStreak, 60000);
    return () => clearInterval(interval);
  }, [streak.lastActivityDate]);

  /**
   * Record activity (case completion)
   */
  const recordActivity = React.useCallback((): StreakResult => {
    const today = new Date();
    const todayStr = today.toISOString();
    const lastActivity = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null;

    let newStreak = streak.currentStreak;
    let streakContinued = false;
    let streakBroken = false;
    let milestoneReached: number | null = null;

    if (!lastActivity) {
      // First activity ever
      newStreak = 1;
      streakContinued = true;
    } else if (isSameDay(lastActivity, today)) {
      // Already active today - no change
      streakContinued = true;
    } else if (isYesterday(lastActivity)) {
      // Perfect - continue streak
      newStreak = streak.currentStreak + 1;
      streakContinued = true;
    } else {
      // Gap in activity - streak broken, start new
      streakBroken = streak.currentStreak > 0;
      newStreak = 1;
    }

    // Check for milestone
    const previousStreak = streak.currentStreak;
    for (const milestone of milestones) {
      if (newStreak >= milestone && previousStreak < milestone) {
        milestoneReached = milestone;
        break;
      }
    }

    // Update longest streak
    const newLongest = Math.max(streak.longestStreak, newStreak);
    const isNewRecord = newStreak > streak.longestStreak;

    // Update state
    const updatedStreak: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: todayStr,
      isActiveToday: true,
      streakFreezes: streak.streakFreezes,
    };

    setStreak(updatedStreak);
    saveStreakData(updatedStreak);
    onStreakChange?.(updatedStreak);

    // Trigger milestone callback and confetti
    if (milestoneReached !== null) {
      onMilestoneReached?.(milestoneReached);
      if (enableConfetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#d97706", "#b45309", "#ef4444", "#10b981"],
        });
      }
    }

    return {
      streakContinued,
      streakBroken,
      newStreak,
      milestoneReached,
      isNewRecord,
    };
  }, [streak, milestones, enableConfetti, onStreakChange, onMilestoneReached]);

  /**
   * Use a streak freeze
   */
  const useStreakFreeze = React.useCallback((): boolean => {
    if (streak.streakFreezes <= 0) return false;

    const updatedStreak = {
      ...streak,
      streakFreezes: streak.streakFreezes - 1,
      lastActivityDate: new Date().toISOString(),
    };

    setStreak(updatedStreak);
    saveStreakData(updatedStreak);
    onStreakChange?.(updatedStreak);

    return true;
  }, [streak, onStreakChange]);

  /**
   * Add streak freezes
   */
  const addStreakFreezes = React.useCallback(
    (count: number) => {
      const updatedStreak = {
        ...streak,
        streakFreezes: streak.streakFreezes + count,
      };

      setStreak(updatedStreak);
      saveStreakData(updatedStreak);
      onStreakChange?.(updatedStreak);
    },
    [streak, onStreakChange]
  );

  // Calculate derived values
  const isStreakAtRisk = !streak.isActiveToday && streak.currentStreak > 0;
  const hoursUntilExpiry = isStreakAtRisk ? getHoursUntilEndOfDay() : null;

  const milestoneStatus: StreakMilestone[] = milestones.map((days) => ({
    days,
    reached: streak.currentStreak >= days,
  }));

  const nextMilestone =
    milestones.find((m) => m > streak.currentStreak) ?? null;

  const progressToNextMilestone = nextMilestone
    ? Math.round((streak.currentStreak / nextMilestone) * 100)
    : 100;

  return {
    streak,
    recordActivity,
    useStreakFreeze,
    addStreakFreezes,
    isStreakAtRisk,
    hoursUntilExpiry,
    milestones: milestoneStatus,
    nextMilestone,
    progressToNextMilestone,
  };
}

// ============================================================================
// Streak Warning Component Helper
// ============================================================================

export function getStreakWarningMessage(hoursRemaining: number): string {
  if (hoursRemaining <= 1) {
    return "⚠️ Your streak expires in less than an hour!";
  }
  if (hoursRemaining <= 3) {
    return `⚡ Only ${Math.round(hoursRemaining)} hours left to keep your streak!`;
  }
  if (hoursRemaining <= 6) {
    return `🔥 Complete a case in the next ${Math.round(hoursRemaining)} hours!`;
  }
  return "📚 Complete a case today to maintain your streak!";
}
