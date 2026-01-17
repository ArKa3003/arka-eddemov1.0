"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  XCircle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  Dumbbell,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Lightbulb,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ACRRatingBadge } from "@/components/cases/acr-rating-badge";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface CategoryScore {
  category: CaseCategory;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

interface DifficultyScore {
  difficulty: DifficultyLevel;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

interface MissedQuestion {
  caseId: string;
  caseTitle: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  userAnswer: string;
  correctAnswer: string;
  userACR: number;
  optimalACR: number;
  explanation: string;
}

interface TimeAnalysis {
  averagePerCase: number;
  totalTime: number;
  fastestCase: number;
  slowestCase: number;
}

interface RecommendedCase {
  id: string;
  title: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
}

interface RelatedAssessment {
  id: string;
  title: string;
  caseCount: number;
  difficulty: DifficultyLevel;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_RESULTS = {
  assessmentId: "1",
  assessmentTitle: "Emergency Medicine Imaging Assessment",
  score: 72,
  totalCases: 10,
  correctCount: 7,
  passingScore: 70,
  passed: true,
  percentile: 68,
  completedAt: new Date().toISOString(),
  categoryScores: [
    { category: "chest-pain" as CaseCategory, label: "Chest Pain", correct: 3, total: 3, percentage: 100 },
    { category: "abdominal-pain" as CaseCategory, label: "Abdominal Pain", correct: 2, total: 3, percentage: 67 },
    { category: "headache" as CaseCategory, label: "Headache", correct: 1, total: 2, percentage: 50 },
    { category: "extremity-trauma" as CaseCategory, label: "Extremity Trauma", correct: 1, total: 2, percentage: 50 },
  ] as CategoryScore[],
  difficultyScores: [
    { difficulty: "beginner" as DifficultyLevel, label: "Beginner", correct: 3, total: 3, percentage: 100 },
    { difficulty: "intermediate" as DifficultyLevel, label: "Intermediate", correct: 3, total: 5, percentage: 60 },
    { difficulty: "advanced" as DifficultyLevel, label: "Advanced", correct: 1, total: 2, percentage: 50 },
  ] as DifficultyScore[],
  timeAnalysis: {
    averagePerCase: 145,
    totalTime: 1450,
    fastestCase: 78,
    slowestCase: 312,
  } as TimeAnalysis,
  missedQuestions: [
    {
      caseId: "case-3",
      caseTitle: "Acute Abdominal Pain in Young Female",
      category: "abdominal-pain" as CaseCategory,
      difficulty: "intermediate" as DifficultyLevel,
      userAnswer: "CT Abdomen with Contrast",
      correctAnswer: "Pelvic Ultrasound",
      userACR: 4,
      optimalACR: 9,
      explanation: "In reproductive-age females with lower abdominal pain, pelvic ultrasound is first-line to evaluate for ovarian pathology without radiation exposure.",
    },
    {
      caseId: "case-7",
      caseTitle: "Thunderclap Headache",
      category: "headache" as CaseCategory,
      difficulty: "advanced" as DifficultyLevel,
      userAnswer: "MRI Brain",
      correctAnswer: "CT Head Non-Contrast + CTA",
      userACR: 5,
      optimalACR: 9,
      explanation: "Thunderclap headache requires urgent evaluation for subarachnoid hemorrhage. Non-contrast CT is most sensitive within 6 hours, with CTA to evaluate for aneurysm.",
    },
    {
      caseId: "case-9",
      caseTitle: "Ankle Injury After Fall",
      category: "extremity-trauma" as CaseCategory,
      difficulty: "beginner" as DifficultyLevel,
      userAnswer: "MRI Ankle",
      correctAnswer: "X-ray Ankle",
      userACR: 3,
      optimalACR: 9,
      explanation: "Ottawa Ankle Rules guide imaging. X-ray is first-line for acute ankle trauma. MRI is reserved for suspected soft tissue injury when X-ray is negative.",
    },
  ] as MissedQuestion[],
  weakAreas: [
    "Gynecologic imaging in females of reproductive age",
    "Acute headache evaluation algorithms",
    "Application of clinical decision rules (Ottawa Rules)",
  ],
  recommendedCases: [
    { id: "c-1", title: "Ovarian Torsion Workup", category: "abdominal-pain" as CaseCategory, difficulty: "intermediate" as DifficultyLevel },
    { id: "c-2", title: "SAH Evaluation Protocol", category: "headache" as CaseCategory, difficulty: "advanced" as DifficultyLevel },
    { id: "c-3", title: "Ottawa Ankle Rules Application", category: "extremity-trauma" as CaseCategory, difficulty: "beginner" as DifficultyLevel },
  ] as RecommendedCase[],
  relatedAssessments: [
    { id: "a-1", title: "Abdominal Pain Deep Dive", caseCount: 15, difficulty: "intermediate" as DifficultyLevel },
    { id: "a-2", title: "Trauma Imaging Essentials", caseCount: 10, difficulty: "beginner" as DifficultyLevel },
  ] as RelatedAssessment[],
};

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentResultsPage({
  params,
}: {
  params: { assessmentId: string };
}) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["missed"])
  );

  const results = MOCK_RESULTS;

  // Animate score on mount
  React.useEffect(() => {
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
  }, [results.score]);

  // Confetti on mount if passed
  React.useEffect(() => {
    if (results.passed) {
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
  }, [results.passed]);

  /**
   * Toggle section expansion
   */
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

  /**
   * Copy share link
   */
  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Format time
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/assessments")}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          <Button variant="outline" onClick={handleShare}>
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
          percentile={results.percentile}
          correctCount={results.correctCount}
          totalCases={results.totalCases}
          passingScore={results.passingScore}
          assessmentTitle={results.assessmentTitle}
        />

        {/* Overall Stats */}
        <OverallStats
          score={results.score}
          correctCount={results.correctCount}
          totalCases={results.totalCases}
          percentile={results.percentile}
          timeAnalysis={results.timeAnalysis}
        />

        {/* Category Breakdown */}
        <CategoryBreakdown scores={results.categoryScores} />

        {/* Difficulty Breakdown */}
        <DifficultyBreakdown scores={results.difficultyScores} />

        {/* Time Analysis */}
        <TimeAnalysisCard timeAnalysis={results.timeAnalysis} />

        {/* Missed Questions */}
        <MissedQuestionsCard
          questions={results.missedQuestions}
          expanded={expandedSections.has("missed")}
          onToggle={() => toggleSection("missed")}
        />

        {/* Improvement Suggestions */}
        <ImprovementSuggestions
          weakAreas={results.weakAreas}
          recommendedCases={results.recommendedCases}
          relatedAssessments={results.relatedAssessments}
        />

        {/* Action Buttons */}
        <ActionButtons
          assessmentId={results.assessmentId}
          onRetake={() =>
            router.push(`/assessments/${results.assessmentId}`)
          }
          onPracticeWeak={() => router.push("/cases?difficulty=weak")}
          onBackToAssessments={() => router.push("/assessments")}
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
  percentile: number;
  correctCount: number;
  totalCases: number;
  passingScore: number;
  assessmentTitle: string;
}

function ScoreHero({
  score,
  passed,
  percentile,
  correctCount,
  totalCases,
  passingScore,
  assessmentTitle,
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
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Assessment Title */}
        <p className="text-white/80 text-sm mb-2">{assessmentTitle}</p>

        {/* Pass/Fail Badge */}
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

        {/* Animated Score */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-7xl font-bold text-white mb-1"
          >
            {score}%
          </motion.div>
          <p className="text-white/80">
            {correctCount} of {totalCases} correct • Needed {passingScore}% to pass
          </p>
        </div>

        {/* Percentile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-lg"
        >
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-white font-medium">
            Better than {percentile}% of learners
          </span>
        </motion.div>
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
  totalCases: number;
  percentile: number;
  timeAnalysis: TimeAnalysis;
}

function OverallStats({
  score,
  correctCount,
  totalCases,
  percentile,
  timeAnalysis,
}: OverallStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Target className="w-5 h-5" />}
        label="Accuracy"
        value={`${score}%`}
        color="cyan"
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5" />}
        label="Correct"
        value={`${correctCount}/${totalCases}`}
        color="emerald"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        label="Total Time"
        value={formatTime(timeAnalysis.totalTime)}
        color="amber"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Percentile"
        value={`Top ${100 - percentile}%`}
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
  scores: CategoryScore[];
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
                {cat.label}
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
  scores: DifficultyScore[];
}

function DifficultyBreakdown({ scores }: DifficultyBreakdownProps) {
  const difficultyColors = {
    beginner: "emerald",
    intermediate: "amber",
    advanced: "rose",
  } as const;

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
              <div className="flex items-center gap-2">
                <Badge
                  size="sm"
                  className={cn(
                    diff.difficulty === "beginner" && "bg-emerald-100 text-emerald-700",
                    diff.difficulty === "intermediate" && "bg-amber-100 text-amber-700",
                    diff.difficulty === "advanced" && "bg-rose-100 text-rose-700"
                  )}
                >
                  {diff.label}
                </Badge>
              </div>
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
// Time Analysis Component
// ============================================================================

interface TimeAnalysisCardProps {
  timeAnalysis: TimeAnalysis;
}

function TimeAnalysisCard({ timeAnalysis }: TimeAnalysisCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Time Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">
              {formatTime(timeAnalysis.totalTime)}
            </p>
            <p className="text-xs text-slate-500">Total Time</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">
              {formatTime(timeAnalysis.averagePerCase)}
            </p>
            <p className="text-xs text-slate-500">Avg. Per Case</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-700">
              {formatTime(timeAnalysis.fastestCase)}
            </p>
            <p className="text-xs text-emerald-600">Fastest</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-700">
              {formatTime(timeAnalysis.slowestCase)}
            </p>
            <p className="text-xs text-amber-600">Slowest</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Missed Questions Component
// ============================================================================

interface MissedQuestionsCardProps {
  questions: MissedQuestion[];
  expanded: boolean;
  onToggle: () => void;
}

function MissedQuestionsCard({
  questions,
  expanded,
  onToggle,
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
              {questions.map((q, index) => (
                <motion.div
                  key={q.caseId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-rose-50 rounded-lg border border-rose-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">
                        {q.caseTitle}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge size="sm" variant="secondary">
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
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/cases/${q.caseId}`, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                  </div>

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Your Answer</p>
                      <p className="font-medium text-rose-600">{q.userAnswer}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">ACR:</span>
                        <ACRRatingBadge rating={q.userACR} size="sm" />
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Correct Answer
                      </p>
                      <p className="font-medium text-emerald-600">
                        {q.correctAnswer}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">ACR:</span>
                        <ACRRatingBadge rating={q.optimalACR} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      Explanation
                    </p>
                    <p className="text-sm text-slate-700">{q.explanation}</p>
                  </div>
                </motion.div>
              ))}
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
  recommendedCases: RecommendedCase[];
  relatedAssessments: RelatedAssessment[];
}

function ImprovementSuggestions({
  weakAreas,
  recommendedCases,
  relatedAssessments,
}: ImprovementSuggestionsProps) {
  return (
    <div className="space-y-4">
      {/* Weak Areas */}
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

      {/* Recommended Cases */}
      {recommendedCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              Recommended Practice Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendedCases.map((c) => (
              <a
                key={c.id}
                href={`/cases/${c.id}`}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge size="sm" variant="secondary">
                      {c.category.replace("-", " ")}
                    </Badge>
                    <Badge
                      size="sm"
                      className={cn(
                        c.difficulty === "beginner" &&
                          "bg-emerald-100 text-emerald-700",
                        c.difficulty === "intermediate" &&
                          "bg-amber-100 text-amber-700",
                        c.difficulty === "advanced" &&
                          "bg-rose-100 text-rose-700"
                      )}
                    >
                      {c.difficulty}
                    </Badge>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Related Assessments */}
      {relatedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Related Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {relatedAssessments.map((a) => (
              <a
                key={a.id}
                href={`/assessments/${a.id}`}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {a.caseCount} cases
                  </p>
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
  onPracticeWeak: () => void;
  onBackToAssessments: () => void;
}

function ActionButtons({
  assessmentId,
  onRetake,
  onPracticeWeak,
  onBackToAssessments,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button variant="outline" onClick={onRetake} className="flex-1">
        <RotateCcw className="w-4 h-4 mr-2" />
        Retake Assessment
      </Button>
      <Button variant="outline" onClick={onPracticeWeak} className="flex-1">
        <Dumbbell className="w-4 h-4 mr-2" />
        Practice Weak Areas
      </Button>
      <Button onClick={onBackToAssessments} className="flex-1">
        Back to Assessments
      </Button>
    </div>
  );
}
