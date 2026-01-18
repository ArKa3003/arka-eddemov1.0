// @ts-nocheck
"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  ACHIEVEMENTS,
  type AchievementSlug,
  type AchievementDefinition,
  type UserAchievementStatus,
  getAchievement,
  shouldUnlockAchievement,
  getAchievementProgress,
} from "@/data/achievements";
import type { CaseCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface UserStats {
  casesCompleted: number;
  perfectScores: number;
  categoryAccuracy: Record<CaseCategory, { correct: number; total: number }>;
  categoriesCompleted: CaseCategory[];
  fastestCaseTime: number | null;
  currentStreak: number;
  assessmentsPassed: number;
  perfectAssessments: number;
  feedbackSubmitted: number;
  weekendCases: number;
  nightCases: number;
}

export interface AchievementUnlock {
  achievement: AchievementDefinition;
  unlockedAt: string;
}

export interface UseAchievementsOptions {
  /** User's earned achievements */
  earnedAchievements?: Array<{ slug: AchievementSlug; earnedAt: string }>;
  /** User's current stats */
  userStats?: Partial<UserStats>;
  /** Callback when achievement is unlocked */
  onAchievementUnlock?: (achievement: AchievementDefinition) => void;
  /** Whether to show confetti on unlock */
  enableConfetti?: boolean;
}

export interface UseAchievementsReturn {
  /** All achievements with user status */
  achievements: UserAchievementStatus[];
  /** Earned achievements */
  earnedAchievements: AchievementSlug[];
  /** Total points earned */
  totalPoints: number;
  /** Check for new achievements */
  checkAchievements: (stats: Partial<UserStats>) => AchievementUnlock[];
  /** Get single achievement status */
  getAchievementStatus: (slug: AchievementSlug) => UserAchievementStatus | undefined;
  /** Recently unlocked achievements */
  recentUnlocks: AchievementUnlock[];
  /** Clear recent unlocks */
  clearRecentUnlocks: () => void;
}

// ============================================================================
// Default Stats
// ============================================================================

const DEFAULT_STATS: UserStats = {
  casesCompleted: 0,
  perfectScores: 0,
  categoryAccuracy: {
    "low-back-pain": { correct: 0, total: 0 },
    headache: { correct: 0, total: 0 },
    "chest-pain": { correct: 0, total: 0 },
    "abdominal-pain": { correct: 0, total: 0 },
    "extremity-trauma": { correct: 0, total: 0 },
  },
  categoriesCompleted: [],
  fastestCaseTime: null,
  currentStreak: 0,
  assessmentsPassed: 0,
  perfectAssessments: 0,
  feedbackSubmitted: 0,
  weekendCases: 0,
  nightCases: 0,
};

// ============================================================================
// Hook
// ============================================================================

/**
 * useAchievements - Manages achievement checking and unlocking.
 */
export function useAchievements(
  options: UseAchievementsOptions = {}
): UseAchievementsReturn {
  const {
    earnedAchievements: initialEarned = [],
    userStats: initialStats = {},
    onAchievementUnlock,
    enableConfetti = true,
  } = options;

  // State
  const [earnedSlugs, setEarnedSlugs] = React.useState<Set<AchievementSlug>>(
    () => new Set(initialEarned.map((a) => a.slug))
  );
  const [earnedDates, setEarnedDates] = React.useState<Map<AchievementSlug, string>>(
    () => new Map(initialEarned.map((a) => [a.slug, a.earnedAt]))
  );
  const [stats, setStats] = React.useState<UserStats>({
    ...DEFAULT_STATS,
    ...initialStats,
  });
  const [recentUnlocks, setRecentUnlocks] = React.useState<AchievementUnlock[]>([]);

  /**
   * Calculate achievement progress based on stats
   */
  const calculateProgress = React.useCallback(
    (achievement: AchievementDefinition): { progress: number; total: number } => {
      switch (achievement.requirementType) {
        case "cases_completed":
          return {
            progress: stats.casesCompleted,
            total: achievement.requirementValue,
          };

        case "perfect_scores":
          return {
            progress: stats.perfectScores,
            total: achievement.requirementValue,
          };

        case "category_accuracy":
          // Find best category accuracy
          let bestAccuracy = 0;
          Object.entries(stats.categoryAccuracy).forEach(([_, data]) => {
            if (data.total >= (achievement.requirementMeta?.minCases || 5)) {
              const accuracy = Math.round((data.correct / data.total) * 100);
              bestAccuracy = Math.max(bestAccuracy, accuracy);
            }
          });
          return {
            progress: bestAccuracy,
            total: achievement.requirementValue,
          };

        case "categories_completed":
          return {
            progress: stats.categoriesCompleted.length,
            total: achievement.requirementValue,
          };

        case "case_time":
          // For time-based, show as complete or not
          if (
            stats.fastestCaseTime !== null &&
            stats.fastestCaseTime <= achievement.requirementValue
          ) {
            return { progress: 1, total: 1 };
          }
          return { progress: 0, total: 1 };

        case "streak_days":
          return {
            progress: stats.currentStreak,
            total: achievement.requirementValue,
          };

        case "assessments_passed":
          const value = achievement.requirementMeta?.perfectScore
            ? stats.perfectAssessments
            : stats.assessmentsPassed;
          return {
            progress: value,
            total: achievement.requirementValue,
          };

        case "feedback_submitted":
          return {
            progress: stats.feedbackSubmitted,
            total: achievement.requirementValue,
          };

        case "special":
          // Special achievements have custom logic
          if (achievement.slug === "night-owl") {
            return { progress: stats.nightCases > 0 ? 1 : 0, total: 1 };
          }
          if (achievement.slug === "weekend-warrior") {
            return {
              progress: stats.weekendCases,
              total: achievement.requirementValue,
            };
          }
          return { progress: 0, total: 1 };

        default:
          return { progress: 0, total: 1 };
      }
    },
    [stats]
  );

  /**
   * Get all achievements with status
   */
  const achievements = React.useMemo((): UserAchievementStatus[] => {
    return ACHIEVEMENTS.map((achievement) => {
      const isEarned = earnedSlugs.has(achievement.slug);
      const { progress, total } = calculateProgress(achievement);

      return {
        slug: achievement.slug,
        isEarned,
        earnedAt: earnedDates.get(achievement.slug),
        progress,
        total,
      };
    });
  }, [earnedSlugs, earnedDates, calculateProgress]);

  /**
   * Calculate total points
   */
  const totalPoints = React.useMemo(() => {
    return Array.from(earnedSlugs).reduce((total, slug) => {
      const achievement = getAchievement(slug);
      return total + (achievement?.points || 0);
    }, 0);
  }, [earnedSlugs]);

  /**
   * Trigger confetti
   */
  const triggerConfetti = React.useCallback(() => {
    if (!enableConfetti) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#f59e0b", "#d97706", "#10b981", "#06b6d4"],
    });
  }, [enableConfetti]);

  /**
   * Check and unlock achievements
   */
  const checkAchievements = React.useCallback(
    (newStats: Partial<UserStats>): AchievementUnlock[] => {
      const mergedStats = { ...stats, ...newStats };
      setStats(mergedStats);

      const unlocked: AchievementUnlock[] = [];

      ACHIEVEMENTS.forEach((achievement) => {
        // Skip if already earned
        if (earnedSlugs.has(achievement.slug)) return;

        const { progress, total } = calculateProgress(achievement);

        // Check if should unlock based on merged stats
        let shouldUnlock = false;

        switch (achievement.requirementType) {
          case "cases_completed":
            shouldUnlock = mergedStats.casesCompleted >= achievement.requirementValue;
            break;
          case "perfect_scores":
            shouldUnlock = mergedStats.perfectScores >= achievement.requirementValue;
            break;
          case "category_accuracy":
            Object.entries(mergedStats.categoryAccuracy).forEach(([_, data]) => {
              if (data.total >= (achievement.requirementMeta?.minCases || 5)) {
                const accuracy = Math.round((data.correct / data.total) * 100);
                if (accuracy >= achievement.requirementValue) {
                  shouldUnlock = true;
                }
              }
            });
            break;
          case "categories_completed":
            shouldUnlock =
              mergedStats.categoriesCompleted.length >= achievement.requirementValue;
            break;
          case "case_time":
            shouldUnlock =
              mergedStats.fastestCaseTime !== null &&
              mergedStats.fastestCaseTime <= achievement.requirementValue;
            break;
          case "streak_days":
            shouldUnlock = mergedStats.currentStreak >= achievement.requirementValue;
            break;
          case "assessments_passed":
            const value = achievement.requirementMeta?.perfectScore
              ? mergedStats.perfectAssessments
              : mergedStats.assessmentsPassed;
            shouldUnlock = value >= achievement.requirementValue;
            break;
          case "feedback_submitted":
            shouldUnlock =
              mergedStats.feedbackSubmitted >= achievement.requirementValue;
            break;
          case "special":
            if (achievement.slug === "night-owl") {
              shouldUnlock = mergedStats.nightCases > 0;
            } else if (achievement.slug === "weekend-warrior") {
              shouldUnlock = mergedStats.weekendCases >= achievement.requirementValue;
            }
            break;
        }

        if (shouldUnlock) {
          const now = new Date().toISOString();
          unlocked.push({ achievement, unlockedAt: now });

          // Update state
          setEarnedSlugs((prev) => new Set([...prev, achievement.slug]));
          setEarnedDates((prev) => new Map([...prev, [achievement.slug, now]]));

          // Trigger confetti if enabled for this achievement
          if (achievement.confettiOnUnlock) {
            triggerConfetti();
          }

          // Callback
          onAchievementUnlock?.(achievement);
        }
      });

      if (unlocked.length > 0) {
        setRecentUnlocks((prev) => [...unlocked, ...prev]);
      }

      return unlocked;
    },
    [stats, earnedSlugs, calculateProgress, triggerConfetti, onAchievementUnlock]
  );

  /**
   * Get single achievement status
   */
  const getAchievementStatus = React.useCallback(
    (slug: AchievementSlug): UserAchievementStatus | undefined => {
      return achievements.find((a) => a.slug === slug);
    },
    [achievements]
  );

  /**
   * Clear recent unlocks
   */
  const clearRecentUnlocks = React.useCallback(() => {
    setRecentUnlocks([]);
  }, []);

  return {
    achievements,
    earnedAchievements: Array.from(earnedSlugs),
    totalPoints,
    checkAchievements,
    getAchievementStatus,
    recentUnlocks,
    clearRecentUnlocks,
  };
}

// ============================================================================
// Achievement Checker for Case Completion
// ============================================================================

export interface CaseCompletionData {
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  category: CaseCategory;
}

/**
 * Process case completion and return stats updates
 */
export function processCaseCompletion(
  data: CaseCompletionData,
  currentStats: Partial<UserStats>
): Partial<UserStats> {
  const stats = { ...DEFAULT_STATS, ...currentStats };
  const updates: Partial<UserStats> = {};

  // Increment cases completed
  updates.casesCompleted = stats.casesCompleted + 1;

  // Check for perfect score
  if (data.score === 100) {
    updates.perfectScores = stats.perfectScores + 1;
  }

  // Update category accuracy
  const categoryData = stats.categoryAccuracy[data.category] || { correct: 0, total: 0 };
  updates.categoryAccuracy = {
    ...stats.categoryAccuracy,
    [data.category]: {
      correct: categoryData.correct + (data.isCorrect ? 1 : 0),
      total: categoryData.total + 1,
    },
  };

  // Update categories completed
  if (!stats.categoriesCompleted.includes(data.category)) {
    updates.categoriesCompleted = [...stats.categoriesCompleted, data.category];
  }

  // Update fastest time if correct
  if (data.isCorrect) {
    if (stats.fastestCaseTime === null || data.timeSpent < stats.fastestCaseTime) {
      updates.fastestCaseTime = data.timeSpent;
    }
  }

  // Check for night owl (after midnight, before 5am)
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    updates.nightCases = stats.nightCases + 1;
  }

  // Check for weekend
  const day = new Date().getDay();
  if (day === 0 || day === 6) {
    updates.weekendCases = stats.weekendCases + 1;
  }

  return updates;
}
