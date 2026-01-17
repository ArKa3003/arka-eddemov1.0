import type { AchievementCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type AchievementSlug =
  // Progress
  | "first-case"
  | "ten-cases"
  | "twenty-five-cases"
  | "fifty-cases"
  | "hundred-cases"
  // Mastery
  | "perfect-score"
  | "three-perfects"
  | "category-expert"
  | "all-categories"
  | "speedster"
  | "lightning-fast"
  // Streak
  | "three-day-streak"
  | "week-streak"
  | "two-week-streak"
  | "month-streak"
  // Special
  | "early-adopter"
  | "feedback-hero"
  | "quiz-master"
  | "assessment-ace"
  | "night-owl"
  | "weekend-warrior";

export type RequirementType =
  | "cases_completed"
  | "perfect_scores"
  | "category_accuracy"
  | "categories_completed"
  | "case_time"
  | "streak_days"
  | "assessments_passed"
  | "feedback_submitted"
  | "special";

export interface AchievementDefinition {
  slug: AchievementSlug;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirementType: RequirementType;
  requirementValue: number;
  requirementMeta?: Record<string, any>;
  points: number;
  isSecret?: boolean;
  confettiOnUnlock?: boolean;
}

export interface UserAchievementStatus {
  slug: AchievementSlug;
  isEarned: boolean;
  earnedAt?: string;
  progress: number;
  total: number;
}

// ============================================================================
// Achievement Definitions
// ============================================================================

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // -------------------------------------------------------------------------
  // Progress Achievements
  // -------------------------------------------------------------------------
  {
    slug: "first-case",
    name: "First Steps",
    description: "Complete your first case",
    icon: "👣",
    category: "progress",
    requirementType: "cases_completed",
    requirementValue: 1,
    points: 10,
    confettiOnUnlock: true,
  },
  {
    slug: "ten-cases",
    name: "Getting Started",
    description: "Complete 10 cases",
    icon: "📚",
    category: "progress",
    requirementType: "cases_completed",
    requirementValue: 10,
    points: 25,
  },
  {
    slug: "twenty-five-cases",
    name: "Dedicated Learner",
    description: "Complete 25 cases",
    icon: "🎓",
    category: "progress",
    requirementType: "cases_completed",
    requirementValue: 25,
    points: 50,
  },
  {
    slug: "fifty-cases",
    name: "Halfway Hero",
    description: "Complete 50 cases",
    icon: "⭐",
    category: "progress",
    requirementType: "cases_completed",
    requirementValue: 50,
    points: 100,
    confettiOnUnlock: true,
  },
  {
    slug: "hundred-cases",
    name: "Century Club",
    description: "Complete 100 cases",
    icon: "💯",
    category: "progress",
    requirementType: "cases_completed",
    requirementValue: 100,
    points: 250,
    confettiOnUnlock: true,
  },

  // -------------------------------------------------------------------------
  // Mastery Achievements
  // -------------------------------------------------------------------------
  {
    slug: "perfect-score",
    name: "Perfectionist",
    description: "Get 100% on a case",
    icon: "🎯",
    category: "mastery",
    requirementType: "perfect_scores",
    requirementValue: 1,
    points: 25,
    confettiOnUnlock: true,
  },
  {
    slug: "three-perfects",
    name: "Triple Perfect",
    description: "Get 100% on 3 different cases",
    icon: "✨",
    category: "mastery",
    requirementType: "perfect_scores",
    requirementValue: 3,
    points: 75,
  },
  {
    slug: "category-expert",
    name: "Category Expert",
    description: "Achieve 90%+ accuracy in any category (min 5 cases)",
    icon: "🏆",
    category: "mastery",
    requirementType: "category_accuracy",
    requirementValue: 90,
    requirementMeta: { minCases: 5 },
    points: 100,
    confettiOnUnlock: true,
  },
  {
    slug: "all-categories",
    name: "Well Rounded",
    description: "Complete at least one case in every category",
    icon: "🌟",
    category: "mastery",
    requirementType: "categories_completed",
    requirementValue: 5,
    points: 75,
  },
  {
    slug: "speedster",
    name: "Speedster",
    description: "Complete a case correctly in under 2 minutes",
    icon: "⚡",
    category: "mastery",
    requirementType: "case_time",
    requirementValue: 120,
    requirementMeta: { mustBeCorrect: true },
    points: 50,
  },
  {
    slug: "lightning-fast",
    name: "Lightning Fast",
    description: "Complete a case correctly in under 1 minute",
    icon: "🚀",
    category: "mastery",
    requirementType: "case_time",
    requirementValue: 60,
    requirementMeta: { mustBeCorrect: true },
    points: 100,
    isSecret: true,
  },

  // -------------------------------------------------------------------------
  // Streak Achievements
  // -------------------------------------------------------------------------
  {
    slug: "three-day-streak",
    name: "Streak Starter",
    description: "Maintain a 3-day study streak",
    icon: "🔥",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 3,
    points: 25,
  },
  {
    slug: "week-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day study streak",
    icon: "🔥",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 7,
    points: 75,
    confettiOnUnlock: true,
  },
  {
    slug: "two-week-streak",
    name: "Fortnight Focus",
    description: "Maintain a 14-day study streak",
    icon: "🔥",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 14,
    points: 150,
  },
  {
    slug: "month-streak",
    name: "Monthly Master",
    description: "Maintain a 30-day study streak",
    icon: "🔥",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 30,
    points: 500,
    confettiOnUnlock: true,
  },

  // -------------------------------------------------------------------------
  // Special Achievements
  // -------------------------------------------------------------------------
  {
    slug: "early-adopter",
    name: "Early Adopter",
    description: "Join ARKA-ED during the beta period",
    icon: "🌱",
    category: "special",
    requirementType: "special",
    requirementValue: 1,
    points: 100,
    isSecret: true,
  },
  {
    slug: "feedback-hero",
    name: "Feedback Hero",
    description: "Submit 5 helpful feedback reports",
    icon: "💬",
    category: "special",
    requirementType: "feedback_submitted",
    requirementValue: 5,
    points: 50,
  },
  {
    slug: "quiz-master",
    name: "Quiz Master",
    description: "Pass an assessment with 100%",
    icon: "🎖️",
    category: "special",
    requirementType: "assessments_passed",
    requirementValue: 1,
    requirementMeta: { perfectScore: true },
    points: 150,
    confettiOnUnlock: true,
  },
  {
    slug: "assessment-ace",
    name: "Assessment Ace",
    description: "Pass 5 different assessments",
    icon: "🏅",
    category: "special",
    requirementType: "assessments_passed",
    requirementValue: 5,
    points: 200,
  },
  {
    slug: "night-owl",
    name: "Night Owl",
    description: "Complete a case after midnight",
    icon: "🦉",
    category: "special",
    requirementType: "special",
    requirementValue: 1,
    isSecret: true,
    points: 25,
  },
  {
    slug: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Complete 10 cases on weekends",
    icon: "🎮",
    category: "special",
    requirementType: "special",
    requirementValue: 10,
    isSecret: true,
    points: 50,
  },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get achievement by slug
 */
export function getAchievement(slug: AchievementSlug): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.slug === slug);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(
  category: AchievementCategory
): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Get visible achievements (excludes secret until earned)
 */
export function getVisibleAchievements(
  earnedSlugs: AchievementSlug[] = []
): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => !a.isSecret || earnedSlugs.includes(a.slug));
}

/**
 * Calculate total points from achievements
 */
export function calculateTotalPoints(earnedSlugs: AchievementSlug[]): number {
  return earnedSlugs.reduce((total, slug) => {
    const achievement = getAchievement(slug);
    return total + (achievement?.points || 0);
  }, 0);
}

/**
 * Get achievement progress percentage
 */
export function getAchievementProgress(
  achievement: AchievementDefinition,
  currentValue: number
): number {
  return Math.min(100, Math.round((currentValue / achievement.requirementValue) * 100));
}

/**
 * Check if achievement should be unlocked
 */
export function shouldUnlockAchievement(
  achievement: AchievementDefinition,
  currentValue: number
): boolean {
  return currentValue >= achievement.requirementValue;
}

// ============================================================================
// Category Labels
// ============================================================================

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  progress: "Progress",
  mastery: "Mastery",
  streak: "Streak",
  special: "Special",
};

export const ACHIEVEMENT_CATEGORY_ICONS: Record<AchievementCategory, string> = {
  progress: "📈",
  mastery: "🎯",
  streak: "🔥",
  special: "✨",
};
