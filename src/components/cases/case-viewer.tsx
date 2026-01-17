"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Stethoscope,
  ArrowLeft,
  Timer,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicalVignette } from "./clinical-vignette";
import { OrderingInterface } from "./ordering-interface";
import { FeedbackPanel, type FeedbackData } from "./feedback-panel";
import { LearningModeToggle, type CaseMode } from "./learning-mode-toggle";
import { HintSystem, HintButton, HintProgress } from "./hint-system";
import { QuizTimer, TimerBadge, TimeUpModal } from "./quiz-timer";
import { useLearningMode } from "@/lib/hooks/use-learning-mode";
import { cn } from "@/lib/utils";
import type {
  Case,
  ImagingOption,
  CaseImagingRating,
  UserCaseAttempt,
} from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CaseViewerProps {
  /** Case data */
  caseData: Case;
  /** Available imaging options with ratings */
  imagingOptions: ImagingOption[];
  /** Imaging ratings for this case */
  imagingRatings: CaseImagingRating[];
  /** User's previous attempts */
  previousAttempts?: UserCaseAttempt[];
  /** User ID for tracking */
  userId?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const QUIZ_DURATION = 5 * 60; // 5 minutes in seconds
const MAX_HINTS = 3;

// ============================================================================
// Component
// ============================================================================

/**
 * CaseViewer - Main case presentation and interaction component.
 * Desktop: Split view (60% case, 40% ordering/feedback)
 * Mobile: Tabs (Case | Order)
 *
 * Learning Mode: Hints available, no timer, detailed feedback
 * Quiz Mode: No hints, 5-minute timer, score tracking
 */
export function CaseViewer({
  caseData,
  imagingOptions,
  imagingRatings,
  previousAttempts = [],
  userId,
  className,
}: CaseViewerProps) {
  const router = useRouter();

  // Learning mode hook
  const {
    mode,
    setMode,
    hintsUsed,
    revealHint,
    resetHints,
    timeSpent,
    startTimer,
    stopTimer,
    reset: resetLearningMode,
  } = useLearningMode({
    initialMode: "learning",
    maxHints: MAX_HINTS,
    quizDuration: QUIZ_DURATION,
    persistMode: true,
  });

  // State
  const [selectedImaging, setSelectedImaging] = React.useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [feedbackData, setFeedbackData] = React.useState<FeedbackData | null>(null);
  const [activeTab, setActiveTab] = React.useState("case");
  const [showHintPanel, setShowHintPanel] = React.useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = React.useState(false);

  // Quiz timer state
  const [quizTimeRemaining, setQuizTimeRemaining] = React.useState(QUIZ_DURATION);
  const [quizTimerRunning, setQuizTimerRunning] = React.useState(false);

  // Start tracking time on mount
  React.useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  // Start quiz timer when mode changes to quiz
  React.useEffect(() => {
    if (mode === "quiz" && !isSubmitted) {
      setQuizTimeRemaining(QUIZ_DURATION);
      setQuizTimerRunning(true);
    } else {
      setQuizTimerRunning(false);
    }
  }, [mode, isSubmitted]);

  // Quiz timer countdown
  React.useEffect(() => {
    if (!quizTimerRunning || isSubmitted) return;

    const interval = setInterval(() => {
      setQuizTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowTimeUpModal(true);
          setQuizTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimerRunning, isSubmitted]);

  /**
   * Handle imaging submission
   */
  const handleSubmit = () => {
    setQuizTimerRunning(false);
    setShowTimeUpModal(false);

    // Find the rating for selected imaging
    let bestRating: CaseImagingRating | null = null;
    let acrRating = 1;

    if (selectedImaging.includes("no-imaging")) {
      // Check if "no imaging" is optimal
      const optimalIsNone = caseData.optimal_imaging.length === 0;
      acrRating = optimalIsNone ? 9 : 1;
      bestRating = null;
    } else if (selectedImaging.length > 0) {
      // Find best rating among selected options
      const selectedRatings = imagingRatings.filter((r) =>
        selectedImaging.includes(r.imaging_option_id)
      );
      if (selectedRatings.length > 0) {
        bestRating = selectedRatings.reduce((best, curr) =>
          curr.acr_rating > best.acr_rating ? curr : best
        );
        acrRating = bestRating.acr_rating;
      }
    }

    // Calculate score (penalize for hints in learning mode)
    const baseScore = Math.round((acrRating / 9) * 100);
    const hintPenalty = mode === "learning" ? hintsUsed * 5 : 0;
    const score = Math.max(0, baseScore - hintPenalty);
    const isCorrect = acrRating >= 7;

    // Determine rating category
    let ratingCategory:
      | "usually-appropriate"
      | "may-be-appropriate"
      | "usually-not-appropriate"
      | null = null;
    if (acrRating >= 7) {
      ratingCategory = "usually-appropriate";
    } else if (acrRating >= 4) {
      ratingCategory = "may-be-appropriate";
    } else {
      ratingCategory = "usually-not-appropriate";
    }

    // Find optimal ACR rating
    let optimalAcrRating = 9;
    if (caseData.optimal_imaging.length > 0) {
      const optimalRatings = imagingRatings.filter((r) =>
        caseData.optimal_imaging.includes(r.imaging_option_id)
      );
      if (optimalRatings.length > 0) {
        optimalAcrRating = Math.max(...optimalRatings.map((r) => r.acr_rating));
      }
    }

    // Build feedback data
    const feedback: FeedbackData = {
      selectedImaging,
      imagingOptions,
      acrRating,
      ratingCategory,
      isCorrect,
      score,
      optimalImaging: caseData.optimal_imaging,
      optimalAcrRating,
      explanation: caseData.explanation,
      teachingPoints: caseData.teaching_points,
      clinicalPearls: caseData.clinical_pearls,
      references: caseData.references,
      rationale: bestRating?.rationale,
    };

    setFeedbackData(feedback);
    setIsSubmitted(true);
    setActiveTab("order"); // Switch to feedback on mobile

    // TODO: Save attempt to database via API
    // await saveAttempt({ userId, caseId: caseData.id, selectedImaging, acrRating, score, isCorrect, timeSpent, mode, hintsUsed });
  };

  /**
   * Reset for try again
   */
  const handleTryAgain = () => {
    setSelectedImaging([]);
    setIsSubmitted(false);
    setFeedbackData(null);
    resetHints();
    setActiveTab("order");

    // Reset quiz timer if in quiz mode
    if (mode === "quiz") {
      setQuizTimeRemaining(QUIZ_DURATION);
      setQuizTimerRunning(true);
    }
  };

  /**
   * Navigate to next case
   */
  const handleNextCase = () => {
    // TODO: Navigate to next case in sequence
    router.push("/cases");
  };

  /**
   * Review case (go back to case tab)
   */
  const handleReviewCase = () => {
    setActiveTab("case");
  };

  /**
   * Format timer display
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Hints available
  const hintsAvailable = caseData.hints?.length || 0;

  return (
    <>
      {/* Time's Up Modal */}
      <TimeUpModal
        isOpen={showTimeUpModal}
        onSubmit={handleSubmit}
      />

      <div className={cn("flex flex-col h-screen bg-slate-50", className)}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/cases")}
              className="text-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <h1 className="font-semibold text-slate-900 line-clamp-1 text-sm sm:text-base">
              {caseData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quiz Timer */}
            {mode === "quiz" && !isSubmitted && (
              <TimerBadge remaining={quizTimeRemaining} />
            )}

            {/* Hint Button (Learning Mode) */}
            {mode === "learning" && !isSubmitted && hintsAvailable > 0 && (
              <HintButton
                hintsAvailable={hintsAvailable}
                hintsUsed={hintsUsed}
                onClick={() => setShowHintPanel(!showHintPanel)}
                disabled={isSubmitted}
              />
            )}

            {/* Mode Toggle */}
            <LearningModeToggle
              mode={mode}
              onModeChange={setMode}
              disabled={isSubmitted}
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-1">
            {/* Left Panel - Clinical Case (60%) */}
            <div className="w-[60%] border-r border-slate-200 overflow-y-auto">
              <div className="p-6">
                <ClinicalVignette
                  caseData={caseData}
                  mode={mode}
                  hintsRevealed={hintsUsed}
                  onRevealHint={revealHint}
                />
              </div>
            </div>

            {/* Right Panel - Ordering/Feedback (40%) */}
            <div className="w-[40%] flex flex-col bg-white">
              {/* Hint Panel (Learning Mode) */}
              <AnimatePresence>
                {showHintPanel && mode === "learning" && !isSubmitted && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-slate-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <HintSystem
                        hints={caseData.hints || []}
                        maxHints={MAX_HINTS}
                        hintsRevealed={hintsUsed}
                        onRevealHint={revealHint}
                        disabled={mode === "quiz"}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isSubmitted && feedbackData ? (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <FeedbackPanel
                      feedback={feedbackData}
                      onTryAgain={mode === "learning" ? handleTryAgain : undefined}
                      onNextCase={handleNextCase}
                      onReviewCase={handleReviewCase}
                      canTryAgain={mode === "learning"}
                      showAllOptions={mode === "learning"}
                      allRatings={imagingRatings.map((r) => ({
                        imagingOptionId: r.imaging_option_id,
                        acrRating: r.acr_rating,
                        rationale: r.rationale,
                      }))}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ordering"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <OrderingInterface
                      imagingOptions={imagingOptions}
                      selectedImaging={selectedImaging}
                      onSelectionChange={setSelectedImaging}
                      onSubmit={handleSubmit}
                      mode={mode}
                      disabled={isSubmitted}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout - Tabs */}
          <div className="lg:hidden flex-1 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList variant="segmented" className="mx-4 mt-4">
                <TabsTrigger value="case" className="flex-1">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Case
                </TabsTrigger>
                <TabsTrigger value="order" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {isSubmitted ? "Feedback" : "Order"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="case" className="flex-1 overflow-y-auto p-4">
                {/* Hint System for Mobile */}
                {mode === "learning" && !isSubmitted && hintsAvailable > 0 && (
                  <div className="mb-4">
                    <HintSystem
                      hints={caseData.hints || []}
                      maxHints={MAX_HINTS}
                      hintsRevealed={hintsUsed}
                      onRevealHint={revealHint}
                      disabled={mode === "quiz"}
                    />
                  </div>
                )}

                <ClinicalVignette
                  caseData={caseData}
                  mode={mode}
                  hintsRevealed={hintsUsed}
                  onRevealHint={revealHint}
                />
              </TabsContent>

              <TabsContent
                value="order"
                className="flex-1 flex flex-col bg-white"
              >
                <AnimatePresence mode="wait">
                  {isSubmitted && feedbackData ? (
                    <FeedbackPanel
                      feedback={feedbackData}
                      onTryAgain={mode === "learning" ? handleTryAgain : undefined}
                      onNextCase={handleNextCase}
                      onReviewCase={handleReviewCase}
                      canTryAgain={mode === "learning"}
                      showAllOptions={mode === "learning"}
                      allRatings={imagingRatings.map((r) => ({
                        imagingOptionId: r.imaging_option_id,
                        acrRating: r.acr_rating,
                        rationale: r.rationale,
                      }))}
                    />
                  ) : (
                    <OrderingInterface
                      imagingOptions={imagingOptions}
                      selectedImaging={selectedImaging}
                      onSelectionChange={setSelectedImaging}
                      onSubmit={handleSubmit}
                      mode={mode}
                      disabled={isSubmitted}
                    />
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
