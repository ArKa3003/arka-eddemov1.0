"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  Star,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  DollarSign,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACRRatingBadge, ACRRatingLarge, getACRConfig } from "./acr-rating-badge";
import { ACRRatingScale } from "./acr-rating-scale";
import { RadiationIndicator, RadiationBadge } from "./radiation-indicator";
import { CostDisplay, CostBadge } from "./cost-display";
import { cn } from "@/lib/utils";
import type {
  ACRCategory,
  ClinicalPearl,
  Reference,
  ImagingOption,
} from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface FeedbackData {
  /** User's selected imaging IDs */
  selectedImaging: string[];
  /** Imaging options data */
  imagingOptions: ImagingOption[];
  /** ACR rating received (1-9) */
  acrRating: number | null;
  /** ACR rating category */
  ratingCategory: ACRCategory | null;
  /** Whether answer was correct */
  isCorrect: boolean;
  /** Score received (0-100) */
  score: number;
  /** Optimal imaging IDs for this case */
  optimalImaging: string[];
  /** Optimal ACR rating */
  optimalAcrRating?: number;
  /** Explanation text */
  explanation: string;
  /** Teaching points */
  teachingPoints: string[];
  /** Clinical pearls */
  clinicalPearls?: ClinicalPearl[] | null;
  /** References */
  references?: Reference[];
  /** Rationale for the rating */
  rationale?: string;
}

export interface FeedbackPanelProps {
  /** Feedback data */
  feedback: FeedbackData;
  /** Handler to try again */
  onTryAgain?: () => void;
  /** Handler to go to next case */
  onNextCase?: () => void;
  /** Handler to review case */
  onReviewCase?: () => void;
  /** Handler to bookmark */
  onBookmark?: () => void;
  /** Whether bookmarked */
  isBookmarked?: boolean;
  /** Whether try again is available (learning mode) */
  canTryAgain?: boolean;
  /** Show all options comparison (learning mode) */
  showAllOptions?: boolean;
  /** All imaging ratings for comparison */
  allRatings?: Array<{
    imagingOptionId: string;
    acrRating: number;
    rationale: string;
  }>;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Confetti Effect
// ============================================================================

function Confetti() {
  const colors = ["#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(confettiCount)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const size = 8 + Math.random() * 8;

        return (
          <motion.div
            key={i}
            initial={{
              top: -20,
              left: `${left}%`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              top: "110%",
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0,
            }}
            transition={{
              duration,
              delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * FeedbackPanel - Comprehensive feedback display with animations and confetti.
 */
export function FeedbackPanel({
  feedback,
  onTryAgain,
  onNextCase,
  onReviewCase,
  onBookmark,
  isBookmarked = false,
  canTryAgain = true,
  showAllOptions = false,
  allRatings = [],
  className,
}: FeedbackPanelProps) {
  const [showReferences, setShowReferences] = React.useState(false);
  const [showAllComparison, setShowAllComparison] = React.useState(false);
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Get rating config
  const ratingConfig = feedback.ratingCategory
    ? getACRConfig(feedback.acrRating || 5)
    : null;

  // Get selected and optimal options
  const selectedOptions = feedback.imagingOptions.filter((opt) =>
    feedback.selectedImaging.includes(opt.id)
  );
  const optimalOptions = feedback.imagingOptions.filter((opt) =>
    feedback.optimalImaging.includes(opt.id)
  );

  // Calculate totals
  const selectedCost = selectedOptions.reduce(
    (sum, opt) => sum + opt.typical_cost_usd,
    0
  );
  const selectedRadiation = selectedOptions.reduce(
    (sum, opt) => sum + opt.radiation_msv,
    0
  );
  const optimalCost = optimalOptions.reduce(
    (sum, opt) => sum + opt.typical_cost_usd,
    0
  );

  // Animate score counter
  React.useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * feedback.score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    // Show confetti for high scores
    if (feedback.score >= 90) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [feedback.score]);

  // Get result message
  const getResultMessage = () => {
    if (feedback.score >= 90) return "Excellent!";
    if (feedback.score >= 70) return "Good Thinking!";
    if (feedback.score >= 50) return "Getting There";
    return "Let's Review";
  };

  // Get result icon
  const ResultIcon = feedback.isCorrect
    ? CheckCircle
    : feedback.ratingCategory === "may-be-appropriate"
    ? AlertTriangle
    : XCircle;

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Confetti for high scores */}
      {showConfetti && <Confetti />}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn("flex flex-col h-full", className)}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Result Header */}
          <motion.div
            variants={itemVariants}
            className={cn(
              "rounded-xl p-6 text-center relative overflow-hidden",
              feedback.isCorrect
                ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                : feedback.ratingCategory === "may-be-appropriate"
                ? "bg-gradient-to-br from-amber-500 to-orange-500"
                : "bg-gradient-to-br from-rose-500 to-pink-500"
            )}
          >
            {/* Sparkle decoration for high scores */}
            {feedback.score >= 90 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-8 h-8 text-white/50" />
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3"
            >
              <ResultIcon className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-1">
              {getResultMessage()}
            </h3>

            {/* Animated Score */}
            <div className="flex items-center justify-center gap-3 text-white/90">
              <span className="text-3xl font-bold">{animatedScore}</span>
              <span className="text-lg">/100</span>
            </div>
          </motion.div>

          {/* ACR Rating Scale Visualization */}
          {feedback.acrRating && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    ACR Appropriateness Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ACRRatingScale
                    userRating={feedback.acrRating}
                    optimalRating={feedback.optimalAcrRating || 9}
                    showLegend={true}
                    showLabels={true}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Your Selection Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Your Selection</span>
                  {feedback.acrRating && (
                    <ACRRatingBadge
                      rating={feedback.acrRating}
                      size="sm"
                      showTooltip={false}
                    />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedOptions.length > 0 ? (
                  <>
                    {selectedOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-medium text-slate-900">
                          {opt.short_name}
                        </span>
                        <div className="flex items-center gap-3">
                          <CostBadge cost={opt.typical_cost_usd} />
                          <RadiationBadge doseMsv={opt.radiation_msv} />
                        </div>
                      </div>
                    ))}
                    {/* Totals */}
                    <div className="pt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total</span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          ${selectedCost.toLocaleString()}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="font-medium">
                          {selectedRadiation.toFixed(1)} mSv
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500">No Imaging Selected</p>
                )}

                {/* Rationale */}
                {feedback.rationale && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm text-slate-600 italic">
                      &ldquo;{feedback.rationale}&rdquo;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Better Choice Card (if not correct) */}
          {!feedback.isCorrect && optimalOptions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                    <Star className="w-4 h-4" />
                    Better Choice
                    {feedback.optimalAcrRating && (
                      <ACRRatingBadge
                        rating={feedback.optimalAcrRating}
                        size="sm"
                        showTooltip={false}
                      />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {optimalOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-emerald-800">
                          {opt.short_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CostBadge cost={opt.typical_cost_usd} />
                        <RadiationBadge doseMsv={opt.radiation_msv} />
                      </div>
                    </div>
                  ))}

                  {/* Why it's better */}
                  <div className="pt-2 border-t border-emerald-200">
                    <p className="text-sm text-emerald-700">
                      This imaging has a higher ACR rating and provides better
                      diagnostic value for this clinical scenario.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Explanation */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  Why?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  {feedback.explanation}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teaching Points */}
          {feedback.teachingPoints.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Key Teaching Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {feedback.teachingPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* All Options Comparison (Learning Mode) */}
          {showAllOptions && allRatings.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <button
                  onClick={() => setShowAllComparison(!showAllComparison)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">
                    All Options Comparison
                  </span>
                  {showAllComparison ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {showAllComparison && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardContent className="pt-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="text-left py-2 px-2 font-medium text-slate-600">
                                  Option
                                </th>
                                <th className="text-center py-2 px-2 font-medium text-slate-600">
                                  ACR
                                </th>
                                <th className="text-right py-2 px-2 font-medium text-slate-600">
                                  Cost
                                </th>
                                <th className="text-right py-2 px-2 font-medium text-slate-600">
                                  Radiation
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {allRatings
                                .sort((a, b) => b.acrRating - a.acrRating)
                                .map((rating) => {
                                  const opt = feedback.imagingOptions.find(
                                    (o) => o.id === rating.imagingOptionId
                                  );
                                  if (!opt) return null;
                                  const isUserChoice =
                                    feedback.selectedImaging.includes(opt.id);
                                  return (
                                    <tr
                                      key={opt.id}
                                      className={cn(
                                        "border-b border-slate-100",
                                        isUserChoice && "bg-cyan-50"
                                      )}
                                    >
                                      <td className="py-2 px-2">
                                        <span
                                          className={cn(
                                            isUserChoice && "font-medium"
                                          )}
                                        >
                                          {opt.short_name}
                                          {isUserChoice && (
                                            <Badge
                                              variant="primary"
                                              size="sm"
                                              className="ml-2"
                                            >
                                              You
                                            </Badge>
                                          )}
                                        </span>
                                      </td>
                                      <td className="py-2 px-2 text-center">
                                        <ACRRatingBadge
                                          rating={rating.acrRating}
                                          size="sm"
                                          showTooltip={false}
                                        />
                                      </td>
                                      <td className="py-2 px-2 text-right">
                                        ${opt.typical_cost_usd.toLocaleString()}
                                      </td>
                                      <td className="py-2 px-2 text-right">
                                        {opt.radiation_msv} mSv
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Clinical Pearls */}
          {feedback.clinicalPearls && feedback.clinicalPearls.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-violet-200 bg-violet-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-violet-700">
                    <Star className="w-4 h-4" />
                    Clinical Pearls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feedback.clinicalPearls.map((pearl, index) => (
                      <li key={index}>
                        <Badge
                          variant={getPearlVariant(pearl.category)}
                          size="sm"
                          className="mb-1"
                        >
                          {formatPearlCategory(pearl.category)}
                        </Badge>
                        <p className="text-slate-700">{pearl.content}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* References */}
          {feedback.references && feedback.references.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <button
                  onClick={() => setShowReferences(!showReferences)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">
                    References ({feedback.references.length})
                  </span>
                  {showReferences ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {showReferences && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardContent className="pt-0">
                        <ul className="space-y-2 text-sm">
                          {feedback.references.map((ref, index) => (
                            <li key={index} className="text-slate-600">
                              {ref.url ? (
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-cyan-600 hover:underline flex items-start gap-1"
                                >
                                  {ref.title}. {ref.source}, {ref.year}.
                                  <ExternalLink className="w-3 h-3 flex-shrink-0 mt-1" />
                                </a>
                              ) : (
                                <span>
                                  {ref.title}. {ref.source}, {ref.year}.
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="border-t border-slate-200 p-4 bg-slate-50 space-y-2"
        >
          <div className="flex gap-2">
            {/* Review Case */}
            {onReviewCase && (
              <Button
                variant="outline"
                onClick={onReviewCase}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Review
              </Button>
            )}

            {/* Bookmark */}
            {onBookmark && (
              <Button
                variant="outline"
                onClick={onBookmark}
                className={cn(
                  "w-10 p-0",
                  isBookmarked && "text-amber-500 border-amber-500"
                )}
              >
                <Bookmark
                  className={cn("w-4 h-4", isBookmarked && "fill-current")}
                />
              </Button>
            )}
          </div>

          {/* Try Again */}
          {canTryAgain && !feedback.isCorrect && onTryAgain && (
            <Button variant="outline" onClick={onTryAgain} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}

          {/* Next Case */}
          {onNextCase && (
            <Button onClick={onNextCase} className="w-full">
              Next Case
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getPearlVariant(category: string) {
  switch (category) {
    case "high-yield":
      return "warning";
    case "common-mistake":
      return "error";
    case "board-favorite":
      return "primary";
    default:
      return "secondary";
  }
}

function formatPearlCategory(category: string) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
