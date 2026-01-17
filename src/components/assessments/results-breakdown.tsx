"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  XCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinearProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CategoryScore {
  category: CaseCategory;
  correct: number;
  total: number;
  percentage: number;
}

export interface DifficultyScore {
  difficulty: DifficultyLevel;
  correct: number;
  total: number;
  percentage: number;
}

export interface CaseResult {
  caseId: string;
  caseTitle: string;
  category: CaseCategory;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: number;
  acrRating: number;
}

export interface ResultsBreakdownProps {
  /** Overall score percentage */
  score: number;
  /** Total cases in assessment */
  totalCases: number;
  /** Number of correct answers */
  correctCount: number;
  /** Passing score percentage */
  passingScore: number;
  /** Whether user passed */
  passed: boolean;
  /** Total time spent in seconds */
  totalTimeSpent: number;
  /** Scores by category */
  categoryScores: CategoryScore[];
  /** Scores by difficulty */
  difficultyScores: DifficultyScore[];
  /** Individual case results */
  caseResults: CaseResult[];
  /** Percentile rank (if available) */
  percentile?: number;
  /** Weak areas identified */
  weakAreas?: string[];
  /** Callback to review incorrect answers */
  onReviewIncorrect?: () => void;
  /** Callback to retake assessment */
  onRetake?: () => void;
  /** Callback to go back to assessments */
  onBackToAssessments?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const CATEGORY_LABELS: Record<CaseCategory, string> = {
  "low-back-pain": "Low Back Pain",
  headache: "Headache",
  "chest-pain": "Chest Pain",
  "abdominal-pain": "Abdominal Pain",
  "extremity-trauma": "Extremity Trauma",
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// ============================================================================
// Component
// ============================================================================

/**
 * ResultsBreakdown - Comprehensive assessment results display.
 */
export function ResultsBreakdown({
  score,
  totalCases,
  correctCount,
  passingScore,
  passed,
  totalTimeSpent,
  categoryScores,
  difficultyScores,
  caseResults,
  percentile,
  weakAreas,
  onReviewIncorrect,
  onRetake,
  onBackToAssessments,
  className,
}: ResultsBreakdownProps) {
  const [showIncorrect, setShowIncorrect] = React.useState(false);
  const [animatedScore, setAnimatedScore] = React.useState(0);

  // Animate score
  React.useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [score]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get incorrect cases
  const incorrectCases = caseResults.filter((c) => !c.isCorrect);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-2xl p-8 text-center",
          passed
            ? "bg-gradient-to-br from-emerald-500 to-teal-500"
            : "bg-gradient-to-br from-rose-500 to-pink-500"
        )}
      >
        {/* Pass/Fail Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-4"
        >
          {passed ? (
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">PASSED</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <XCircle className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">NOT PASSED</span>
            </div>
          )}
        </motion.div>

        {/* Animated Score */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-6xl font-bold text-white mb-1"
          >
            {animatedScore}%
          </motion.div>
          <p className="text-white/80">
            {correctCount} of {totalCases} correct
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>Pass: {passingScore}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(totalTimeSpent)}</span>
          </div>
          {percentile && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Top {100 - percentile}%</span>
            </div>
          )}
        </div>

        {/* Certificate Badge (if passed) */}
        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/30 px-4 py-2 rounded-lg">
              <Award className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                Achievement Unlocked!
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Category Scores */}
      {categoryScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              Performance by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryScores.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">
                    {CATEGORY_LABELS[cat.category]}
                  </span>
                  <span className="text-sm font-medium">
                    {cat.correct}/{cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <LinearProgress
                  value={cat.percentage}
                  color={cat.percentage >= 70 ? "success" : cat.percentage >= 50 ? "warning" : "danger"}
                  size="sm"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Difficulty Scores */}
      {difficultyScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-500" />
              Performance by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {difficultyScores.map((diff, index) => (
              <motion.div
                key={diff.difficulty}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">
                    {DIFFICULTY_LABELS[diff.difficulty]}
                  </span>
                  <span className="text-sm font-medium">
                    {diff.correct}/{diff.total} ({diff.percentage}%)
                  </span>
                </div>
                <LinearProgress
                  value={diff.percentage}
                  color={diff.percentage >= 70 ? "success" : diff.percentage >= 50 ? "warning" : "danger"}
                  size="sm"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weak Areas */}
      {weakAreas && weakAreas.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weakAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-amber-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Review Incorrect Answers */}
      {incorrectCases.length > 0 && (
        <Card>
          <button
            onClick={() => setShowIncorrect(!showIncorrect)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              Review Incorrect Answers ({incorrectCases.length})
            </span>
            {showIncorrect ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showIncorrect && (
            <CardContent className="pt-0 space-y-3">
              {incorrectCases.map((result, index) => (
                <div
                  key={result.caseId}
                  className="p-3 bg-rose-50 rounded-lg border border-rose-200"
                >
                  <p className="font-medium text-slate-900 mb-2">
                    {result.caseTitle}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Your answer:</span>
                      <p className="text-rose-600 font-medium">
                        {result.userAnswer}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Correct answer:</span>
                      <p className="text-emerald-600 font-medium">
                        {result.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onReviewIncorrect && incorrectCases.length > 0 && (
          <Button variant="outline" onClick={onReviewIncorrect} className="flex-1">
            Review Incorrect
          </Button>
        )}
        {onRetake && (
          <Button variant="outline" onClick={onRetake} className="flex-1">
            Retake Assessment
          </Button>
        )}
        {onBackToAssessments && (
          <Button onClick={onBackToAssessments} className="flex-1">
            Back to Assessments
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Score Summary Card (Compact)
// ============================================================================

export interface ScoreSummaryProps {
  score: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  className?: string;
}

export function ScoreSummary({
  score,
  passed,
  correctCount,
  totalCount,
  className,
}: ScoreSummaryProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl",
        passed ? "bg-emerald-50" : "bg-rose-50",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          passed ? "bg-emerald-500" : "bg-rose-500"
        )}
      >
        {passed ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : (
          <XCircle className="w-6 h-6 text-white" />
        )}
      </div>
      <div>
        <p
          className={cn(
            "text-2xl font-bold",
            passed ? "text-emerald-700" : "text-rose-700"
          )}
        >
          {score}%
        </p>
        <p className="text-sm text-slate-600">
          {correctCount}/{totalCount} correct
        </p>
      </div>
    </div>
  );
}
