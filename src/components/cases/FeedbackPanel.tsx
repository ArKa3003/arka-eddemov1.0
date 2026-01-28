'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Bookmark,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBreakdown } from '@/components/aiie/ScoreBreakdown'
import { OptionsComparison } from '@/components/cases/OptionsComparison'
import { cn } from '@/lib/utils'
import type { Case, ImagingOption, ACRCategory } from '@/types/database'
import { getScoreCategory } from '@/lib/constants/aiie'
import { ScoringResult } from '@/lib/aiie/scoring-engine'

// ============================================================================
// Types
// ============================================================================

export interface FeedbackPanelProps {
  /** Whether the answer was correct */
  isCorrect: boolean
  /** Score earned (0-100) */
  score: number
  /** Time taken in seconds */
  timeSpent: number
  /** Number of hints used */
  hintsUsed: number
  /** Total hints available */
  totalHints: number
  /** User's selected imaging option */
  selectedOption: ImagingOption | null
  /** Best/optimal imaging option */
  optimalOption: ImagingOption | null
  /** AIIE score for selected option */
  selectedAIIEScore?: ScoringResult | null
  /** AIIE score for optimal option */
  optimalAIIEScore?: ScoringResult | null
  /** All imaging options for comparison */
  allOptions: ImagingOption[]
  /** All AIIE scores for all options */
  allAIIEScores?: Map<string, ScoringResult>
  /** Case data */
  caseData: Case
  /** Handler for next case */
  onNextCase?: () => void
  /** Handler to review all options */
  onReviewAllOptions?: () => void
  /** Handler to save to study list */
  onSaveToStudyList?: () => void
  /** Handler to go back to library */
  onBackToLibrary?: () => void
  /** Whether case is bookmarked */
  isBookmarked?: boolean
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Confetti Effect
// ============================================================================

function Confetti() {
  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
  const confettiCount = 50

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(confettiCount)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 2 + Math.random() * 2
        const size = 8 + Math.random() * 8

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
              top: '110%',
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0,
            }}
            transition={{
              duration,
              delay,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// Format Time Helper
// ============================================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ============================================================================
// Component
// ============================================================================

/**
 * Comprehensive feedback panel displayed after case submission.
 * Shows result header, score breakdown, comparison, teaching points, and next actions.
 */
export function FeedbackPanel({
  isCorrect,
  score,
  timeSpent,
  hintsUsed,
  totalHints,
  selectedOption,
  optimalOption,
  selectedAIIEScore,
  optimalAIIEScore,
  allOptions,
  allAIIEScores,
  caseData,
  onNextCase,
  onReviewAllOptions,
  onSaveToStudyList,
  onBackToLibrary,
  isBookmarked = false,
  className,
}: FeedbackPanelProps) {
  const [showAllOptions, setShowAllOptions] = React.useState(false)
  const [animatedScore, setAnimatedScore] = React.useState(0)
  const [showConfetti, setShowConfetti] = React.useState(false)

  // Animate score counter
  React.useEffect(() => {
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.floor(eased * score))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    // Show confetti for high scores
    if (score >= 90) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [score])

  // Get result message and icon
  const ResultIcon = isCorrect ? CheckCircle : AlertTriangle
  const resultMessage = isCorrect ? 'Correct!' : 'Incorrect'
  const resultColor = isCorrect
    ? 'from-emerald-500 to-teal-500'
    : 'from-amber-500 to-orange-500'

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      {/* Confetti for high scores */}
      {showConfetti && <Confetti />}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn('flex flex-col h-full', className)}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Result Header */}
          <motion.div
            variants={itemVariants}
            className={cn(
              'rounded-xl p-6 sm:p-8 text-center relative overflow-hidden',
              `bg-gradient-to-br ${resultColor}`
            )}
          >
            {/* Sparkle decoration for high scores */}
            {score >= 90 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-8 h-8 text-white/50" />
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
            >
              <ResultIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {resultMessage}
            </h2>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-2 text-white/90 mb-4">
              <span className="text-4xl sm:text-5xl font-bold">{animatedScore}</span>
              <span className="text-xl sm:text-2xl">/100 points</span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/90 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Time: {formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  Hints: {hintsUsed}/{totalHints}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Your Answer vs Best Answer Comparison */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Answer vs Best Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Your Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">Your Selection</h3>
                      {selectedOption && (
                        <Badge variant="info" size="sm">
                          Your Pick
                        </Badge>
                      )}
                    </div>
                    {selectedOption ? (
                      <>
                        <p className="text-lg font-medium text-slate-900">
                          {selectedOption.short_name || selectedOption.name}
                        </p>
                        {selectedAIIEScore && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">AIIE Score:</span>
                              <Badge
                                className={cn(
                                  'font-semibold',
                                  selectedAIIEScore.finalScore >= 7
                                    ? 'bg-green-100 text-green-800'
                                    : selectedAIIEScore.finalScore >= 4
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                )}
                              >
                                {selectedAIIEScore.finalScore.toFixed(1)}/9
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              {selectedAIIEScore.categoryLabel}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-slate-500">No selection made</p>
                    )}
                  </div>

                  {/* Best Choice */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">Best Choice</h3>
                      {optimalOption && (
                        <Badge variant="success" size="sm">
                          Optimal
                        </Badge>
                      )}
                    </div>
                    {optimalOption ? (
                      <>
                        <p className="text-lg font-medium text-emerald-700">
                          {optimalOption.short_name || optimalOption.name}
                        </p>
                        {optimalAIIEScore && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">AIIE Score:</span>
                              <Badge
                                className={cn(
                                  'font-semibold',
                                  optimalAIIEScore.finalScore >= 7
                                    ? 'bg-green-100 text-green-800'
                                    : optimalAIIEScore.finalScore >= 4
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                )}
                              >
                                {optimalAIIEScore.finalScore.toFixed(1)}/9
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              {optimalAIIEScore.categoryLabel}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-slate-500">No optimal option available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AIIE Score Breakdown */}
          {selectedAIIEScore && (
            <motion.div variants={itemVariants} className="overflow-x-auto">
              <div className="min-w-[300px]">
                <ScoreBreakdown
                  result={selectedAIIEScore}
                  baselineScore={5.0}
                  showWaterfall={true}
                />
              </div>
            </motion.div>
          )}

          {/* Radiation & Cost Comparison */}
          {selectedOption && optimalOption && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Radiation & Cost Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Radiation Comparison */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Radiation Levels</h4>
                    <div className="space-y-2">
                      {[selectedOption, optimalOption].map((option, idx) => {
                        const isSelected = idx === 0
                        const radiationLevel =
                          option.radiation_msv === 0
                            ? 'None'
                            : option.radiation_msv < 0.1
                            ? 'Minimal'
                            : option.radiation_msv <= 1
                            ? 'Low'
                            : option.radiation_msv <= 10
                            ? 'Medium'
                            : 'High'
                        const barWidth = Math.min((option.radiation_msv / 10) * 100, 100)

                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  'font-medium',
                                  isSelected ? 'text-cyan-700' : 'text-emerald-700'
                                )}
                              >
                                {option.short_name || option.name}
                                {isSelected && (
                                  <Badge variant="info" size="sm" className="ml-2">
                                    Your Pick
                                  </Badge>
                                )}
                              </span>
                              <span className="text-slate-600">
                                {option.radiation_msv.toFixed(2)} mSv ({radiationLevel})
                              </span>
                            </div>
                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'absolute left-0 top-0 h-full transition-all duration-500',
                                  isSelected ? 'bg-cyan-500' : 'bg-emerald-500'
                                )}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Cost Comparison */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Cost Range</h4>
                    <div className="space-y-2">
                      {[selectedOption, optimalOption].map((option, idx) => {
                        const isSelected = idx === 0
                        return (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg border',
                              isSelected
                                ? 'bg-cyan-50 border-cyan-200'
                                : 'bg-emerald-50 border-emerald-200'
                            )}
                          >
                            <span
                              className={cn(
                                'font-medium',
                                isSelected ? 'text-cyan-700' : 'text-emerald-700'
                              )}
                            >
                              {option.short_name || option.name}
                            </span>
                            <span className="text-slate-900 font-semibold">
                              ${option.typical_cost_usd.toLocaleString()}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Teaching Points Panel */}
          {caseData.teaching_points && caseData.teaching_points.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-amber-200 bg-amber-50/30">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    Teaching Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3" role="list">
                    {caseData.teaching_points.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 text-slate-700"
                        role="listitem"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" aria-hidden="true">
                          {index + 1}
                        </span>
                        <span className="flex-1">{point}</span>
                      </motion.li>
                    ))}
                  </ol>

                  {/* Why This Matters */}
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-900 mb-2">
                      Why this matters clinically
                    </h4>
                    <p className="text-sm text-amber-800">
                      Understanding appropriate imaging selection improves patient outcomes,
                      reduces unnecessary radiation exposure, and optimizes healthcare resource
                      utilization.
                    </p>
                  </div>

                  {/* Common Mistakes */}
                  {!isCorrect && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <h4 className="text-sm font-semibold text-amber-900 mb-2">
                        Common mistakes
                      </h4>
                      <p className="text-sm text-amber-800">
                        Many learners initially select imaging based on availability or habit rather
                        than clinical appropriateness. Always consider the clinical question being
                        asked and the diagnostic value of each modality.
                      </p>
                    </div>
                  )}

                  {/* Guidelines Reference */}
                  {caseData.references && caseData.references.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <h4 className="text-sm font-semibold text-amber-900 mb-2">
                        Evidence-based guidelines
                      </h4>
                      <ul className="space-y-1 text-sm text-amber-800">
                        {caseData.references.slice(0, 3).map((ref, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ExternalLink className="w-3 h-3 flex-shrink-0 mt-1" />
                            <span>
                              {ref.title}. {ref.source}, {ref.year}.
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* All Options Comparison - Expandable */}
          {allOptions.length > 0 && (
            <motion.div variants={itemVariants}>
              <OptionsComparison
                options={allOptions}
                allAIIEScores={allAIIEScores}
                selectedOptionId={selectedOption?.id}
                optimalOptionIds={caseData.optimal_imaging}
              />
            </motion.div>
          )}
        </div>

        {/* Next Actions */}
        <motion.div
          variants={itemVariants}
          className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {onNextCase && (
              <Button onClick={onNextCase} className="flex-1" size="lg">
                Next Case
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {onReviewAllOptions && (
              <Button
                onClick={() => setShowAllOptions(!showAllOptions)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Review All Options
                {showAllOptions ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
            )}
            {onSaveToStudyList && (
              <Button
                onClick={onSaveToStudyList}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Bookmark
                  className={cn('w-4 h-4 mr-2', isBookmarked && 'fill-current')}
                />
                {isBookmarked ? 'Saved' : 'Save to Study List'}
              </Button>
            )}
            {onBackToLibrary && (
              <Button onClick={onBackToLibrary} variant="ghost" className="flex-1" size="lg">
                Back to Library
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
