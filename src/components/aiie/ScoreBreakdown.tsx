'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScoringResult, ShapFactor } from '@/lib/aiie/scoring-engine'
import { getScoreCategory } from '@/lib/constants/aiie'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface ScoreBreakdownProps {
  /** Scoring result with SHAP factors */
  result: ScoringResult
  /** Baseline score (default: 5.0) */
  baselineScore?: number
  /** Show waterfall visualization */
  showWaterfall?: boolean
  /** Whether breakdown is collapsible (for mobile) */
  collapsible?: boolean
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * AIIE Score Breakdown component showing SHAP explanation.
 * Displays visual SHAP explanation with clickable factors for evidence citations.
 */
export function ScoreBreakdown({
  result,
  baselineScore = 5.0,
  showWaterfall = true,
  collapsible = false,
  className,
}: ScoreBreakdownProps) {
  const [expandedFactors, setExpandedFactors] = React.useState<Set<string>>(new Set())
  const [isCollapsed, setIsCollapsed] = React.useState(collapsible)

  const baseline = baselineScore
  const maxContribution = result.shapFactors.length > 0
    ? Math.max(
        ...result.shapFactors.map((f) => Math.abs(f.contribution)),
        1
      )
    : 1

  const toggleFactor = (factor: string) => {
    const newExpanded = new Set(expandedFactors)
    if (newExpanded.has(factor)) {
      newExpanded.delete(factor)
    } else {
      newExpanded.add(factor)
    }
    setExpandedFactors(newExpanded)
  }

  const sortedFactors = result.shapFactors.length > 0
    ? [...result.shapFactors].sort(
        (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
      )
    : []

  const categoryData = getScoreCategory(result.finalScore)

  // Calculate waterfall steps
  const waterfallSteps = [{ label: 'Baseline', value: baseline, contribution: 0 }]

  let runningTotal = baseline
  sortedFactors.forEach((factor) => {
    runningTotal += factor.contribution
    waterfallSteps.push({
      label: factor.factor,
      value: runningTotal,
      contribution: factor.contribution,
    })
  })

  // If no factors, final score equals baseline
  if (sortedFactors.length === 0) {
    waterfallSteps.push({
      label: 'Final Score',
      value: result.finalScore,
      contribution: result.finalScore - baseline,
    })
  }

  const content = (
    <Card className={cn('w-full', className)} accent={result.category === 'uncertain' ? 'maybe' : result.category}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            AIIE Score Calculation (Baseline: {baseline.toFixed(1)})
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                categoryData.bgClass
              )}
            >
              {result.categoryLabel}
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {result.finalScore.toFixed(1)} → {Math.round(result.finalScore)}/9
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Waterfall Chart */}
        {showWaterfall && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Score Progression
            </h3>
            <div className="space-y-3">
              {waterfallSteps.map((step, index) => {
                const isLast = index === waterfallSteps.length - 1
                const prevValue = index > 0 ? waterfallSteps[index - 1].value : baseline
                const change = step.contribution

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 sm:w-40 text-xs text-slate-600 shrink-0">
                      {step.label}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      {/* Bar visualization */}
                      <div className="flex-1 relative h-8 bg-slate-100 rounded overflow-hidden">
                        {/* Previous value bar (gray background) */}
                        {index > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full bg-slate-200"
                            style={{
                              width: `${(prevValue / 9) * 100}%`,
                            }}
                          />
                        )}
                        {/* Current value bar */}
                        <div
                          className={cn(
                            'absolute left-0 top-0 h-full transition-all duration-500',
                            index === 0
                              ? 'bg-slate-500'
                              : change > 0
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          )}
                          style={{
                            width: `${(step.value / 9) * 100}%`,
                          }}
                        />
                        {/* Value label */}
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
                          {step.value.toFixed(1)}
                        </span>
                      </div>
                      {/* Contribution change */}
                      {index > 0 && (
                        <div
                          className={cn(
                            'text-xs font-medium w-16 text-right shrink-0',
                            change > 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {change > 0 ? '+' : ''}
                          {change.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Final score display */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Final Score:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    {result.finalScore.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-600">→</span>
                  <Badge
                    className={cn(
                      'font-semibold',
                      categoryData.bgClass,
                      'px-3 py-1'
                    )}
                  >
                    {Math.round(result.finalScore)}/9 ({result.categoryLabel})
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Factor Contributions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Clinical Factor Contributions
          </h3>

          <div className="space-y-3">
            {sortedFactors.length > 0 ? (
              sortedFactors.map((factor) => {
              const isExpanded = expandedFactors.has(factor.factor)
              const isPositive = factor.contribution > 0
              const barWidth = Math.abs((factor.contribution / maxContribution) * 100)

              return (
                <motion.div
                  key={factor.factor}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-3 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => toggleFactor(factor.factor)}
                >
                  <div className="flex items-start gap-3">
                    {/* Contribution Bar */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">
                          {factor.factor}
                        </span>
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            isPositive ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {isPositive ? '+' : ''}
                          {factor.contribution.toFixed(1)}
                        </span>
                      </div>

                      {/* Horizontal Bar */}
                      <div className="relative h-6 bg-slate-100 rounded overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-500 flex items-center',
                            isPositive ? 'bg-green-500' : 'bg-red-500'
                          )}
                          style={{
                            width: `${barWidth}%`,
                            marginLeft: isPositive ? '0' : 'auto',
                            marginRight: isPositive ? 'auto' : '0',
                          }}
                        >
                          {barWidth > 15 && (
                            <span className="text-xs font-medium text-white px-2">
                              {factor.value}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Value and Citation */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{factor.value}</span>
                        <span className="font-mono text-[10px]">{factor.evidenceCitation}</span>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFactor(factor.factor)
                      }}
                      className="shrink-0 h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200 space-y-2"
                    >
                      <p className="text-sm text-slate-700">{factor.explanation}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <ExternalLink className="h-3 w-3" />
                        <span className="font-mono">{factor.evidenceCitation}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })) : (
              <div className="text-sm text-slate-500 text-center py-4">
                No clinical factors available for this calculation.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (collapsible) {
    return (
      <Card className={cn('w-full', className)}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <CardTitle className="text-lg font-semibold">AIIE Score Breakdown</CardTitle>
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {!isCollapsed && <div className="px-4 pb-4">{content}</div>}
      </Card>
    )
  }

  return content
}
