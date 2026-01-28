"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ArrowLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle,
  Circle,
  XCircle,
  FileText,
  Target,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal";
import { ClinicalVignette } from "@/components/cases/clinical-vignette";
import { OrderingInterface } from "@/components/cases/ordering-interface";
import {
  QUICK_QUIZ,
  SPECIALTY_ASSESSMENTS,
  FULL_EXAM,
  formatTimeRemaining,
  type Assessment,
} from "@/lib/data/assessments";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Case, ImagingOption } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

type AssessmentState = "start" | "in_progress" | "completed";

interface CaseAnswer {
  caseId: string;
  selectedImaging: string[];
  timeSpent: number; // seconds
}

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentFlowPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;

  // State
  const [state, setState] = React.useState<AssessmentState>("start");
  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [cases, setCases] = React.useState<Case[]>([]);
  const [imagingOptions, setImagingOptions] = React.useState<ImagingOption[]>(
    []
  );
  const [currentCaseIndex, setCurrentCaseIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Map<string, CaseAnswer>>(
    new Map()
  );
  const [selectedImaging, setSelectedImaging] = React.useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [showEndConfirm, setShowEndConfirm] = React.useState(false);
  const [caseStartTime, setCaseStartTime] = React.useState(Date.now());
  const [isLoading, setIsLoading] = React.useState(true);

  // Load assessment data
  React.useEffect(() => {
    async function loadAssessment() {
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
        setTimeRemaining(assessmentConfig.timeLimit * 60);

        // Fetch cases from database
        const supabase = createClient();
        let query = supabase
          .from("cases")
          .select("*")
          .eq("is_published", true)
          .limit(assessmentConfig.questionCount);

        // Apply filters
        if (assessmentConfig.specialty) {
          query = query.contains("specialty_tags", [
            assessmentConfig.specialty,
          ]);
        }

        if (assessmentConfig.categories && assessmentConfig.categories.length > 0) {
          query = query.in("category", assessmentConfig.categories);
        }

        if (
          assessmentConfig.difficulty &&
          assessmentConfig.difficulty.length > 0
        ) {
          query = query.in("difficulty", assessmentConfig.difficulty);
        }

        // Randomize order
        query = query.order("created_at", { ascending: false });

        const { data: casesData, error: casesError } = await query;

        if (casesError) {
          console.error("Error fetching cases:", casesError);
          return;
        }

        if (!casesData || casesData.length === 0) {
          console.error("No cases found");
          return;
        }

        // Shuffle cases for randomization
        const shuffledCases = [...casesData].sort(() => Math.random() - 0.5);
        setCases(shuffledCases.slice(0, assessmentConfig.questionCount));

        // Fetch imaging options
        const { data: imagingData, error: imagingError } = await supabase
          .from("imaging_options")
          .select("*")
          .eq("is_active", true);

        if (imagingError) {
          console.error("Error fetching imaging options:", imagingError);
        } else {
          setImagingOptions(imagingData || []);
        }
      } catch (error) {
        console.error("Error loading assessment:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAssessment();
  }, [assessmentId, router]);

  // Timer effect
  React.useEffect(() => {
    if (!timerRunning || state !== "in_progress") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, state]);

  // Auto-save progress
  React.useEffect(() => {
    if (state === "in_progress" && answers.size > 0) {
      // Save to localStorage as backup
      const saveData = {
        assessmentId,
        answers: Array.from(answers.entries()),
        currentCaseIndex,
        timeRemaining,
        timestamp: Date.now(),
      };
      localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify(saveData));
    }
  }, [answers, currentCaseIndex, timeRemaining, assessmentId, state]);

  // Current case
  const currentCase = cases[currentCaseIndex];
  const totalCases = cases.length;
  const isLastCase = currentCaseIndex === totalCases - 1;
  const answeredCount = Array.from(answers.values()).filter(
    (a) => a.selectedImaging.length > 0
  ).length;

  // Load saved answer for current case
  React.useEffect(() => {
    if (currentCase) {
      const savedAnswer = answers.get(currentCase.id);
      setSelectedImaging(savedAnswer?.selectedImaging || []);
      setCaseStartTime(Date.now());
    }
  }, [currentCase, answers]);

  /**
   * Start assessment
   */
  const handleStart = () => {
    setState("in_progress");
    setTimerRunning(true);
    setCaseStartTime(Date.now());
  };

  /**
   * Save current answer
   */
  const saveCurrentAnswer = () => {
    if (!currentCase) return;

    const timeSpent = Math.floor((Date.now() - caseStartTime) / 1000);
    const existingAnswer = answers.get(currentCase.id);

    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentCase.id, {
        caseId: currentCase.id,
        selectedImaging,
        timeSpent: (existingAnswer?.timeSpent || 0) + timeSpent,
      });
      return newAnswers;
    });
  };

  /**
   * Go to next case
   */
  const handleNext = () => {
    if (currentCaseIndex < totalCases - 1) {
      saveCurrentAnswer();
      setCurrentCaseIndex((prev) => prev + 1);
    }
  };

  /**
   * Submit assessment
   */
  const handleSubmit = async () => {
    saveCurrentAnswer();
    setTimerRunning(false);

    // Calculate results
    const totalTimeUsed = assessment
      ? assessment.timeLimit * 60 - timeRemaining
      : 0;

    // Navigate to results page
    router.push(`/assessment/${assessmentId}/results`);
  };

  /**
   * Auto-submit when time expires
   */
  const handleAutoSubmit = () => {
    saveCurrentAnswer();
    handleSubmit();
  };

  /**
   * End assessment early
   */
  const handleEndAssessment = () => {
    setShowEndConfirm(true);
  };

  /**
   * Confirm end assessment
   */
  const handleConfirmEnd = () => {
    setShowEndConfirm(false);
    handleSubmit();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment || !currentCase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-600">Assessment not found</p>
          <Button onClick={() => router.push("/assessment")} className="mt-4">
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EndAssessmentDialog
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={handleConfirmEnd}
        answeredCount={answeredCount}
        totalCases={totalCases}
      />

      <AnimatePresence mode="wait">
        {state === "start" && (
          <StartScreen
            key="start"
            assessment={assessment}
            onStart={handleStart}
            onBack={() => router.push("/assessment")}
          />
        )}

        {state === "in_progress" && (
          <InProgressScreen
            key="in-progress"
            assessment={assessment}
            currentCase={currentCase}
            currentCaseIndex={currentCaseIndex}
            totalCases={totalCases}
            selectedImaging={selectedImaging}
            onSelectionChange={setSelectedImaging}
            imagingOptions={imagingOptions}
            timeRemaining={timeRemaining}
            answeredCount={answeredCount}
            onNext={handleNext}
            onSubmit={handleSubmit}
            onEndAssessment={handleEndAssessment}
            isLastCase={isLastCase}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Start Screen
// ============================================================================

interface StartScreenProps {
  assessment: Assessment;
  onStart: () => void;
  onBack: () => void;
}

function StartScreen({ assessment, onStart, onBack }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
    >
      <div className="max-w-lg w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-600 touch-target"
          aria-label="Go back to assessments"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Assessments
        </Button>

        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl sm:text-2xl">{assessment.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm sm:text-base text-slate-600 text-center">
              {assessment.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 mx-auto mb-1 text-slate-500" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.questionCount}
                </p>
                <p className="text-xs text-slate-500">Questions</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.timeLimit}
                </p>
                <p className="text-xs text-slate-500">Minutes</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-slate-500" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.passingScore}%
                </p>
                <p className="text-xs text-slate-500">To Pass</p>
              </div>
            </div>

            {/* Instructions */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Assessment Rules</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700" role="list">
                      <li>No hints available</li>
                      <li>Cannot go back to previous questions</li>
                      <li>Timer visible at all times</li>
                      <li>Auto-submit when time expires</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={onStart} className="w-full touch-target" size="lg" aria-label="Begin assessment">
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ============================================================================
// In Progress Screen
// ============================================================================

interface InProgressScreenProps {
  assessment: Assessment;
  currentCase: Case;
  currentCaseIndex: number;
  totalCases: number;
  selectedImaging: string[];
  onSelectionChange: (ids: string[]) => void;
  imagingOptions: ImagingOption[];
  timeRemaining: number;
  answeredCount: number;
  onNext: () => void;
  onSubmit: () => void;
  onEndAssessment: () => void;
  isLastCase: boolean;
}

function InProgressScreen({
  assessment,
  currentCase,
  currentCaseIndex,
  totalCases,
  selectedImaging,
  onSelectionChange,
  imagingOptions,
  timeRemaining,
  answeredCount,
  onNext,
  onSubmit,
  onEndAssessment,
  isLastCase,
}: InProgressScreenProps) {
  const progressPercent = ((currentCaseIndex + 1) / totalCases) * 100;
  const isLowTime = timeRemaining < 5 * 60; // Less than 5 minutes

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col bg-slate-50"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <h1 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-1">
              {assessment.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-slate-600">
                  Q{currentCaseIndex + 1}/{totalCases}
                </span>
                <Badge variant="default" size="sm" aria-label={`${answeredCount} of ${totalCases} answered`}>
                  {answeredCount}/{totalCases}
                </Badge>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono font-semibold text-xs sm:text-sm",
                  isLowTime
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-700"
                )}
                role="timer"
                aria-live="polite"
                aria-atomic="true"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>{formatTimeRemaining(timeRemaining)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onEndAssessment}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 touch-target text-xs sm:text-sm"
                aria-label="End assessment early"
              >
                End
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-1 sm:py-2">
        <div className="max-w-7xl mx-auto">
          <LinearProgress value={progressPercent} size="sm" aria-label={`Progress: ${Math.round(progressPercent)}%`} />
        </div>
      </div>

      {/* Content - Stack on mobile, side-by-side on desktop */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Case */}
        <div className="flex-1 lg:w-[60%] lg:border-r border-slate-200 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="default" aria-label={`Case ${currentCaseIndex + 1} of ${totalCases}`}>
                Case {currentCaseIndex + 1} of {totalCases}
              </Badge>
            </div>
            <ClinicalVignette caseData={currentCase} mode="quiz" />
          </div>
        </div>

        {/* Right Panel - Ordering */}
        <div className="flex-1 lg:w-[40%] flex flex-col bg-white border-t lg:border-t-0 border-slate-200">
          <div className="flex-1 overflow-y-auto">
            <OrderingInterface
              imagingOptions={imagingOptions}
              selectedImaging={selectedImaging}
              onSelectionChange={onSelectionChange}
              onSubmit={() => {}}
              mode="quiz"
              disabled={false}
            />
          </div>

          {/* Navigation - Sticky on mobile */}
          <div className="sticky bottom-0 border-t border-slate-200 p-3 sm:p-4 bg-slate-50 shadow-lg lg:shadow-none">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                {isLastCase ? "Final question" : "Continue to next question"}
              </div>
              {isLastCase ? (
                <Button onClick={onSubmit} size="lg" className="flex-1 touch-target" aria-label="Submit assessment">
                  <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  Submit Assessment
                </Button>
              ) : (
                <Button onClick={onNext} size="lg" className="flex-1 touch-target" aria-label="Go to next question">
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// End Assessment Dialog
// ============================================================================

interface EndAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalCases: number;
}

function EndAssessmentDialog({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalCases,
}: EndAssessmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Assessment?</DialogTitle>
          <DialogDescription>
            You have answered {answeredCount} out of {totalCases} questions.
            Are you sure you want to end the assessment now? You cannot resume
            once ended.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} className="bg-rose-600 hover:bg-rose-700">
            End Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
