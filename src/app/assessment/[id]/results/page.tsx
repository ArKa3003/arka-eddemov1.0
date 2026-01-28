"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  XCircle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import { ACRRatingBadge } from "@/components/cases/acr-rating-badge";
import {
  QUICK_QUIZ,
  SPECIALTY_ASSESSMENTS,
  FULL_EXAM,
  calculateScore,
  checkPassed,
  calculateCategoryBreakdown,
  calculateDifficultyBreakdown,
  getMissedQuestions,
  identifyWeakAreas,
  generateRecommendations,
  formatTimeUsed,
  getLetterGrade,
  type Assessment,
} from "@/lib/data/assessments";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Case, ImagingOption } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface QuestionResult {
  caseId: string;
  caseTitle: string;
  category: string;
  difficulty: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timeSpent: number;
}

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentResultsPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [cases, setCases] = React.useState<Case[]>([]);
  const [imagingOptions, setImagingOptions] = React.useState<ImagingOption[]>(
    []
  );
  const [answers, setAnswers] = React.useState<Map<string, any>>(new Map());
  const [results, setResults] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["missed"])
  );
  const [copied, setCopied] = React.useState(false);

  // Load assessment and results
  React.useEffect(() => {
    async function loadResults() {
      setIsLoading(true);
      try {
        // Get assessment config
        let assessmentConfig: Assessment | null = null;
        if (assessmentId === QUICK_QUIZ.id) {
          assessmentConfig = QUICK_QUIZ;
        } else if (assessmentId === FULL_EXAM.id) {
          assessmentConfig = FULL_EXAM;
        } else {
          const specialtyAssessment = Object.values(SPECIALTY_ASSESSMENTS).find(
            (a) => a.id === assessmentId
          );
          if (specialtyAssessment) {
            assessmentConfig = specialtyAssessment;
          }
        }

        if (!assessmentConfig) {
          router.push("/assessment");
          return;
        }

        setAssessment(assessmentConfig);

        // Load saved answers from localStorage
        const savedData = localStorage.getItem(`assessment_${assessmentId}`);
        if (!savedData) {
          router.push(`/assessment/${assessmentId}`);
          return;
        }

        const parsed = JSON.parse(savedData);
        const answersMap = new Map<string, any>(parsed.answers);
        setAnswers(answersMap);

        // Fetch cases
        const supabase = createClient();
        const caseIds = Array.from(answersMap.keys());
        const { data: casesData } = await supabase
          .from("cases")
          .select("*")
          .in("id", caseIds);

        if (!casesData) {
          router.push("/assessment");
          return;
        }

        setCases(casesData);

        // Fetch imaging options
        const { data: imagingData } = await supabase
          .from("imaging_options")
          .select("*")
          .eq("is_active", true);

        setImagingOptions(imagingData || []);

        // Calculate results
        const assessmentAnswers = Array.from(answersMap.entries()).map(
          ([caseId, answer]: [string, any]) => {
            const caseData = casesData.find((c) => c.id === caseId);
            if (!caseData) return null;

            // Check if answer is correct
            const userSelected = answer.selectedImaging || [];
            const correctAnswers = caseData.optimal_imaging || [];
            const isCorrect =
              userSelected.length === correctAnswers.length &&
              userSelected.every((id: string) => correctAnswers.includes(id));

            return {
              questionId: caseId,
              caseId,
              selectedOption: userSelected,
              correct: isCorrect,
              timeSpent: answer.timeSpent || 0,
            };
          }
        ).filter(Boolean);

        const totalQuestions = assessmentAnswers.length;
        const correctCount = assessmentAnswers.filter((a: any) => a.correct)
          .length;
        const score = calculateScore(assessmentAnswers, totalQuestions);
        const passed = checkPassed(score, assessmentConfig.passingScore);
        const timeUsed = parsed.timeRemaining
          ? assessmentConfig.timeLimit * 60 - parsed.timeRemaining
          : assessmentConfig.timeLimit * 60;

        const categoryBreakdown = calculateCategoryBreakdown(
          assessmentAnswers,
          casesData
        );
        const difficultyBreakdown = calculateDifficultyBreakdown(
          assessmentAnswers,
          casesData
        );
        const missedQuestions = getMissedQuestions(
          assessmentAnswers,
          casesData,
          imagingData || []
        );
        const weakAreas = identifyWeakAreas(
          categoryBreakdown,
          difficultyBreakdown
        );
        const recommendations = generateRecommendations(
          missedQuestions,
          casesData
        );

        setResults({
          score,
          totalQuestions,
          correctCount,
          passed,
          timeUsed,
          timeLimit: assessmentConfig.timeLimit * 60,
          categoryBreakdown,
          difficultyBreakdown,
          missedQuestions,
          weakAreas,
          recommendations,
          answers: assessmentAnswers,
        });
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResults();
  }, [assessmentId, router]);

  // Animate score
  React.useEffect(() => {
    if (results) {
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.floor(eased * results.score));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [results]);

  // Confetti on pass
  React.useEffect(() => {
    if (results?.passed) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 },
          colors: ["#10b981", "#06b6d4", "#8b5cf6"],
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [results?.passed]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !results || !assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4" />
          <p className="text-slate-600">Calculating results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/assessment")}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          <Button variant="default" onClick={handleShare}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Score Hero */}
        <ScoreHero
          score={animatedScore}
          passed={results.passed}
          correctCount={results.correctCount}
          totalQuestions={results.totalQuestions}
          passingScore={assessment.passingScore}
          assessmentName={assessment.name}
          letterGrade={getLetterGrade(results.score)}
        />

        {/* Overall Stats */}
        <OverallStats
          score={results.score}
          correctCount={results.correctCount}
          totalQuestions={results.totalQuestions}
          timeUsed={results.timeUsed}
          timeLimit={results.timeLimit}
        />

        {/* Category Breakdown */}
        <CategoryBreakdown scores={results.categoryBreakdown} />

        {/* Difficulty Breakdown */}
        <DifficultyBreakdown scores={results.difficultyBreakdown} />

        {/* Missed Questions */}
        <MissedQuestionsCard
          questions={results.missedQuestions}
          expanded={expandedSections.has("missed")}
          onToggle={() => toggleSection("missed")}
          cases={cases}
        />

        {/* Improvement Suggestions */}
        <ImprovementSuggestions
          weakAreas={results.weakAreas}
          recommendations={results.recommendations}
        />

        {/* Action Buttons */}
        <ActionButtons
          assessmentId={assessmentId}
          onRetake={() => router.push(`/assessment/${assessmentId}`)}
          onBackToAssessments={() => router.push("/assessment")}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Score Hero Component
// ============================================================================

interface ScoreHeroProps {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  assessmentName: string;
  letterGrade: string;
}

function ScoreHero({
  score,
  passed,
  correctCount,
  totalQuestions,
  passingScore,
  assessmentName,
  letterGrade,
}: ScoreHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-8 text-center overflow-hidden relative",
        passed
          ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
          : "bg-gradient-to-br from-rose-500 via-pink-500 to-red-500"
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <p className="text-white/80 text-sm mb-2">{assessmentName}</p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-4"
        >
          {passed ? (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold text-lg">PASSED!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2 rounded-full">
              <XCircle className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg">NOT PASSED</span>
            </div>
          )}
        </motion.div>

        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-7xl font-bold text-white mb-1"
          >
            {score}%
          </motion.div>
          <p className="text-white/80 mb-2">
            Grade: <span className="font-bold">{letterGrade}</span>
          </p>
          <p className="text-white/80">
            {correctCount} of {totalQuestions} correct • Needed {passingScore}% to pass
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Overall Stats Component
// ============================================================================

interface OverallStatsProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeUsed: number;
  timeLimit: number;
}

function OverallStats({
  score,
  correctCount,
  totalQuestions,
  timeUsed,
  timeLimit,
}: OverallStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Target className="w-5 h-5" />}
        label="Final Score"
        value={`${score}%`}
        color="cyan"
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5" />}
        label="Correct"
        value={`${correctCount}/${totalQuestions}`}
        color="emerald"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        label="Time Used"
        value={formatTimeUsed(timeUsed)}
        color="amber"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Time Limit"
        value={formatTimeUsed(timeLimit)}
        color="violet"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "cyan" | "emerald" | "amber" | "violet";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    cyan: "bg-cyan-50 text-cyan-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", colors[color])}>{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Category Breakdown Component
// ============================================================================

interface CategoryBreakdownProps {
  scores: Array<{
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
}

function CategoryBreakdown({ scores }: CategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-500" />
          Performance by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scores.map((cat, index) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-700 font-medium">
                {cat.category.replace("-", " ")}
              </span>
              <span className="text-sm font-semibold">
                {cat.correct}/{cat.total} ({cat.percentage}%)
              </span>
            </div>
            <LinearProgress
              value={cat.percentage}
              color={
                cat.percentage >= 80
                  ? "success"
                  : cat.percentage >= 60
                  ? "warning"
                  : "danger"
              }
              size="md"
            />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Difficulty Breakdown Component
// ============================================================================

interface DifficultyBreakdownProps {
  scores: Array<{
    difficulty: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
}

function DifficultyBreakdown({ scores }: DifficultyBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-500" />
          Performance by Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scores.map((diff, index) => (
          <motion.div
            key={diff.difficulty}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <Badge
                size="sm"
                className={cn(
                  diff.difficulty === "beginner" &&
                    "bg-emerald-100 text-emerald-700",
                  diff.difficulty === "intermediate" &&
                    "bg-amber-100 text-amber-700",
                  diff.difficulty === "advanced" && "bg-rose-100 text-rose-700"
                )}
              >
                {diff.difficulty}
              </Badge>
              <span className="text-sm font-semibold">
                {diff.correct}/{diff.total} ({diff.percentage}%)
              </span>
            </div>
            <LinearProgress
              value={diff.percentage}
              color={
                diff.percentage >= 80
                  ? "success"
                  : diff.percentage >= 60
                  ? "warning"
                  : "danger"
              }
              size="md"
            />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Missed Questions Component
// ============================================================================

interface MissedQuestionsCardProps {
  questions: Array<{
    caseId: string;
    caseTitle: string;
    category: string;
    difficulty: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    timeSpent: number;
  }>;
  expanded: boolean;
  onToggle: () => void;
  cases: Case[];
}

function MissedQuestionsCard({
  questions,
  expanded,
  onToggle,
  cases,
}: MissedQuestionsCardProps) {
  if (questions.length === 0) return null;

  return (
    <Card>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-t-xl"
      >
        <span className="font-semibold text-slate-900 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-500" />
          Missed Questions ({questions.length})
        </span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="pt-0 space-y-4">
              {questions.map((q, index) => {
                const caseData = cases.find((c) => c.id === q.caseId);
                return (
                  <motion.div
                    key={q.caseId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-rose-50 rounded-lg border border-rose-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-1">
                          {q.caseTitle}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge size="sm" variant="default">
                            {q.category.replace("-", " ")}
                          </Badge>
                          <Badge
                            size="sm"
                            className={cn(
                              q.difficulty === "beginner" &&
                                "bg-emerald-100 text-emerald-700",
                              q.difficulty === "intermediate" &&
                                "bg-amber-100 text-amber-700",
                              q.difficulty === "advanced" &&
                                "bg-rose-100 text-rose-700"
                            )}
                          >
                            {q.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          window.open(`/cases/${caseData?.slug}`, "_blank")
                        }
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Review Case
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Your Answer</p>
                        <p className="font-medium text-rose-600">{q.userAnswer}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Correct Answer</p>
                        <p className="font-medium text-emerald-600">
                          {q.correctAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Explanation
                      </p>
                      <p className="text-sm text-slate-700">{q.explanation}</p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ============================================================================
// Improvement Suggestions Component
// ============================================================================

interface ImprovementSuggestionsProps {
  weakAreas: string[];
  recommendations: Array<{
    caseId: string;
    title: string;
    category: string;
    difficulty: string;
    reason: string;
  }>;
}

function ImprovementSuggestions({
  weakAreas,
  recommendations,
}: ImprovementSuggestionsProps) {
  return (
    <div className="space-y-4">
      {weakAreas.length > 0 && (
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
                  className="flex items-start gap-2 text-amber-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              Recommended Practice Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendations.map((rec) => (
              <a
                key={rec.caseId}
                href={`/cases/${rec.caseId}`}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{rec.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{rec.reason}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Action Buttons Component
// ============================================================================

interface ActionButtonsProps {
  assessmentId: string;
  onRetake: () => void;
  onBackToAssessments: () => void;
}

function ActionButtons({
  assessmentId,
  onRetake,
  onBackToAssessments,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button variant="default" onClick={onRetake} className="flex-1">
        <RotateCcw className="w-4 h-4 mr-2" />
        Retake Assessment
      </Button>
      <Button onClick={onBackToAssessments} className="flex-1">
        Back to Assessments
      </Button>
    </div>
  );
}
