/**
 * Assessment data structures and utilities for ARKA-ED
 * Handles assessment types, attempts, and scoring logic
 */

import type {
  Assessment as DatabaseAssessment,
  UserAssessment,
  CaseCategory,
  SpecialtyTrack,
  DifficultyLevel,
  Case,
} from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type AssessmentType = "quick" | "specialty" | "full" | "custom";

export interface Assessment {
  id: string;
  type: AssessmentType;
  name: string;
  description: string;
  questionCount: number;
  timeLimit: number; // minutes
  categories?: CaseCategory[];
  specialty?: SpecialtyTrack;
  difficulty?: DifficultyLevel[];
  passingScore: number;
  caseIds?: string[]; // For custom assessments
}

export interface AssessmentAnswer {
  questionId: string;
  caseId: string;
  selectedOption: string[];
  correct: boolean;
  timeSpent: number; // seconds
  acrRating?: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: AssessmentAnswer[];
  score: number;
  timeUsed: number; // seconds
  passed: boolean;
}

export interface AssessmentResult {
  attemptId: string;
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  timeUsed: number;
  timeLimit: number;
  percentile?: number;
  categoryBreakdown: CategoryBreakdown[];
  difficultyBreakdown: DifficultyBreakdown[];
  missedQuestions: MissedQuestion[];
  weakAreas: string[];
  recommendations: CaseRecommendation[];
}

export interface CategoryBreakdown {
  category: CaseCategory;
  correct: number;
  total: number;
  percentage: number;
}

export interface DifficultyBreakdown {
  difficulty: DifficultyLevel;
  correct: number;
  total: number;
  percentage: number;
}

export interface MissedQuestion {
  caseId: string;
  caseTitle: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timeSpent: number;
}

export interface CaseRecommendation {
  caseId: string;
  title: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  reason: string;
}

// ============================================================================
// Pre-defined Assessments
// ============================================================================

export const QUICK_QUIZ: Assessment = {
  id: "quick-quiz",
  type: "quick",
  name: "Quick Quiz",
  description: "Random selection across all categories. Good for daily practice.",
  questionCount: 10,
  timeLimit: 15,
  passingScore: 70,
};

export const SPECIALTY_ASSESSMENTS: Record<SpecialtyTrack, Assessment> = {
  em: {
    id: "specialty-em",
    type: "specialty",
    name: "Emergency Medicine Assessment",
    description: "Comprehensive Emergency Medicine imaging scenarios covering trauma, chest pain, abdominal pain, and more.",
    questionCount: 20,
    timeLimit: 30,
    specialty: "em",
    passingScore: 75,
  },
  im: {
    id: "specialty-im",
    type: "specialty",
    name: "Internal Medicine Assessment",
    description: "Internal Medicine imaging appropriateness across multiple organ systems.",
    questionCount: 20,
    timeLimit: 30,
    specialty: "im",
    passingScore: 75,
  },
  fm: {
    id: "specialty-fm",
    type: "specialty",
    name: "Family Medicine Assessment",
    description: "Primary care imaging scenarios for common presentations.",
    questionCount: 20,
    timeLimit: 30,
    specialty: "fm",
    passingScore: 75,
  },
  surgery: {
    id: "specialty-surgery",
    type: "specialty",
    name: "Surgery Assessment",
    description: "Surgical imaging scenarios including pre-operative and post-operative evaluations.",
    questionCount: 20,
    timeLimit: 30,
    specialty: "surgery",
    passingScore: 75,
  },
  peds: {
    id: "specialty-peds",
    type: "specialty",
    name: "Pediatric Assessment",
    description: "Pediatric imaging appropriateness with radiation safety considerations.",
    questionCount: 20,
    timeLimit: 30,
    specialty: "peds",
    passingScore: 75,
  },
};

export const FULL_EXAM: Assessment = {
  id: "full-exam",
  type: "full",
  name: "Full Exam",
  description: "Simulates board-style questioning with all categories weighted appropriately.",
  questionCount: 50,
  timeLimit: 60,
  passingScore: 70,
};

// ============================================================================
// Assessment Rules
// ============================================================================

export const ASSESSMENT_RULES = {
  noHints: true,
  noBackNavigation: true,
  timerVisible: true,
  autoSubmitOnTimeExpiry: true,
  saveProgressOnAnswer: true,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate score from answers
 */
export function calculateScore(
  answers: AssessmentAnswer[],
  totalQuestions: number
): number {
  const correctCount = answers.filter((a) => a.correct).length;
  return Math.round((correctCount / totalQuestions) * 100);
}

/**
 * Check if assessment passed
 */
export function checkPassed(score: number, passingScore: number): boolean {
  return score >= passingScore;
}

/**
 * Calculate category breakdown
 */
export function calculateCategoryBreakdown(
  answers: AssessmentAnswer[],
  cases: Case[]
): CategoryBreakdown[] {
  const categoryMap = new Map<CaseCategory, { correct: number; total: number }>();

  answers.forEach((answer) => {
    const caseData = cases.find((c) => c.id === answer.caseId);
    if (!caseData) return;

    const category = caseData.category;
    const current = categoryMap.get(category) || { correct: 0, total: 0 };

    categoryMap.set(category, {
      correct: current.correct + (answer.correct ? 1 : 0),
      total: current.total + 1,
    });
  });

  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    correct: stats.correct,
    total: stats.total,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));
}

/**
 * Calculate difficulty breakdown
 */
export function calculateDifficultyBreakdown(
  answers: AssessmentAnswer[],
  cases: Case[]
): DifficultyBreakdown[] {
  const difficultyMap = new Map<
    DifficultyLevel,
    { correct: number; total: number }
  >();

  answers.forEach((answer) => {
    const caseData = cases.find((c) => c.id === answer.caseId);
    if (!caseData) return;

    const difficulty = caseData.difficulty;
    const current = difficultyMap.get(difficulty) || { correct: 0, total: 0 };

    difficultyMap.set(difficulty, {
      correct: current.correct + (answer.correct ? 1 : 0),
      total: current.total + 1,
    });
  });

  return Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
    difficulty,
    correct: stats.correct,
    total: stats.total,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));
}

/**
 * Get missed questions
 */
export function getMissedQuestions(
  answers: AssessmentAnswer[],
  cases: Case[],
  imagingOptions?: Array<{ id: string; name: string }>
): MissedQuestion[] {
  return answers
    .filter((answer) => !answer.correct)
    .map((answer) => {
      const caseData = cases.find((c) => c.id === answer.caseId);
      if (!caseData) {
        throw new Error(`Case not found: ${answer.caseId}`);
      }

      // Get correct answer (optimal imaging)
      const correctAnswer = caseData.optimal_imaging
        .map((imgId) => {
          if (imagingOptions) {
            const option = imagingOptions.find((opt) => opt.id === imgId);
            return option ? option.name : imgId;
          }
          return imgId;
        })
        .join(", ");

      const userAnswer = answer.selectedOption
        .map((imgId) => {
          if (imagingOptions) {
            const option = imagingOptions.find((opt) => opt.id === imgId);
            return option ? option.name : imgId;
          }
          return imgId;
        })
        .join(", ") || "No answer selected";

      return {
        caseId: answer.caseId,
        caseTitle: caseData.title,
        category: caseData.category,
        difficulty: caseData.difficulty,
        userAnswer,
        correctAnswer,
        explanation: caseData.explanation,
        timeSpent: answer.timeSpent,
      };
    });
}

/**
 * Identify weak areas from results
 */
export function identifyWeakAreas(
  categoryBreakdown: CategoryBreakdown[],
  difficultyBreakdown: DifficultyBreakdown[]
): string[] {
  const weakAreas: string[] = [];

  // Categories below 60%
  categoryBreakdown
    .filter((cat) => cat.percentage < 60)
    .forEach((cat) => {
      weakAreas.push(`${cat.category.replace("-", " ")} imaging`);
    });

  // Difficulties below 60%
  difficultyBreakdown
    .filter((diff) => diff.percentage < 60)
    .forEach((diff) => {
      weakAreas.push(`${diff.difficulty} difficulty cases`);
    });

  return weakAreas;
}

/**
 * Generate recommendations based on missed questions
 */
export function generateRecommendations(
  missedQuestions: MissedQuestion[],
  allCases: Case[]
): CaseRecommendation[] {
  // Group by category
  const categoryCounts = new Map<CaseCategory, number>();
  missedQuestions.forEach((q) => {
    categoryCounts.set(q.category, (categoryCounts.get(q.category) || 0) + 1);
  });

  // Find most common missed category
  let maxCount = 0;
  let mostCommonCategory: CaseCategory | null = null;
  categoryCounts.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCategory = category;
    }
  });

  // Get cases in that category
  const recommendations: CaseRecommendation[] = [];
  if (mostCommonCategory) {
    const relevantCases = allCases
      .filter((c) => c.category === mostCommonCategory)
      .slice(0, 3);

    relevantCases.forEach((c) => {
      recommendations.push({
        caseId: c.id,
        title: c.title,
        category: c.category,
        difficulty: c.difficulty,
        reason: `Practice more ${mostCommonCategory.replace("-", " ")} cases`,
      });
    });
  }

  return recommendations;
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format time used
 */
export function formatTimeUsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get letter grade from score
 */
export function getLetterGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
