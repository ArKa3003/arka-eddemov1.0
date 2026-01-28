/**
 * Progress update utilities for tracking user stats after case submission
 */

import type { Case, CaseCategory, SpecialtyTrack } from '@/types/database'

// ============================================================================
// Types
// ============================================================================

export interface CaseSubmissionResult {
  caseId: string
  caseCategory: CaseCategory
  specialtyTags: SpecialtyTrack[]
  isCorrect: boolean
  score: number
  timeSpent: number
  hintsUsed: number
}

export interface ProgressUpdate {
  casesCompleted: number
  accuracy: number
  currentStreak: number
  categoryProgress: Record<CaseCategory, { attempted: number; correct: number; accuracy: number }>
  specialtyProgress: Record<SpecialtyTrack, { attempted: number; correct: number; accuracy: number }>
}

export interface PreviousProgress {
  casesCompleted: number
  totalCorrect: number
  currentStreak: number
  categoryProgress: Record<CaseCategory, { attempted: number; correct: number }>
  specialtyProgress: Record<SpecialtyTrack, { attempted: number; correct: number }>
}

// ============================================================================
// Progress Calculation
// ============================================================================

/**
 * Calculate progress update after case submission
 */
export function calculateProgressUpdate(
  result: CaseSubmissionResult,
  previousProgress: Partial<PreviousProgress> = {}
): ProgressUpdate {
  const prev = {
    casesCompleted: previousProgress.casesCompleted || 0,
    totalCorrect: previousProgress.totalCorrect || 0,
    currentStreak: previousProgress.currentStreak || 0,
    categoryProgress: previousProgress.categoryProgress || ({} as Record<CaseCategory, { attempted: number; correct: number }>),
    specialtyProgress: previousProgress.specialtyProgress || ({} as Record<SpecialtyTrack, { attempted: number; correct: number }>),
  }

  // Update cases completed
  const casesCompleted = prev.casesCompleted + 1
  const totalCorrect = prev.totalCorrect + (result.isCorrect ? 1 : 0)
  const accuracy = casesCompleted > 0 ? Math.round((totalCorrect / casesCompleted) * 100) : 0

  // Update streak (reset if wrong, increment if correct)
  const currentStreak = result.isCorrect ? prev.currentStreak + 1 : 0

  // Update category progress
  const categoryProgress: Record<CaseCategory, { attempted: number; correct: number; accuracy: number }> = {
    ...prev.categoryProgress,
  } as any

  const catData = categoryProgress[result.caseCategory] || { attempted: 0, correct: 0 }
  categoryProgress[result.caseCategory] = {
    attempted: catData.attempted + 1,
    correct: catData.correct + (result.isCorrect ? 1 : 0),
    accuracy:
      catData.attempted + 1 > 0
        ? Math.round(((catData.correct + (result.isCorrect ? 1 : 0)) / (catData.attempted + 1)) * 100)
        : 0,
  }

  // Update specialty progress
  const specialtyProgress: Record<SpecialtyTrack, { attempted: number; correct: number; accuracy: number }> = {
    ...prev.specialtyProgress,
  } as any

  result.specialtyTags.forEach((specialty) => {
    const specData = specialtyProgress[specialty] || { attempted: 0, correct: 0 }
    specialtyProgress[specialty] = {
      attempted: specData.attempted + 1,
      correct: specData.correct + (result.isCorrect ? 1 : 0),
      accuracy:
        specData.attempted + 1 > 0
          ? Math.round(((specData.correct + (result.isCorrect ? 1 : 0)) / (specData.attempted + 1)) * 100)
          : 0,
    }
  })

  return {
    casesCompleted,
    accuracy,
    currentStreak,
    categoryProgress,
    specialtyProgress,
  }
}

/**
 * Check if user achieved any milestones
 */
export function checkMilestones(progress: ProgressUpdate): {
  firstCase: boolean
  perfectScore: boolean
  streak5: boolean
  streak10: boolean
  categoryComplete: CaseCategory[]
} {
  return {
    firstCase: progress.casesCompleted === 1,
    perfectScore: false, // Would need score from result
    streak5: progress.currentStreak >= 5,
    streak10: progress.currentStreak >= 10,
    categoryComplete: Object.entries(progress.categoryProgress)
      .filter(([_, data]) => data.attempted >= 5 && data.accuracy >= 80)
      .map(([category]) => category as CaseCategory),
  }
}
