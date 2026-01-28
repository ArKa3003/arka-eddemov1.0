'use client'

import * as React from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShapFactor, ScoringResult } from '@/lib/aiie/scoring-engine'
import { getScoreCategory } from '@/lib/constants/aiie'
import { cn } from '@/lib/utils'

interface ShapExplanationProps {
  result: ScoringResult
  baselineScore?: number
  showWaterfall?: boolean
  className?: string
}

const MODALITY_BASELINES: Record<string, number> = {
  'X-ray': 5,
  'CT without contrast': 5,
  'CT with contrast': 5,
  'MRI without contrast': 5,
  'MRI with contrast': 5,
  'Ultrasound': 5,
  'Nuclear medicine': 5,
  'No imaging': 5
}

export function ShapExplanation({
  result,
  baselineScore,
  showWaterfall = true,
  className
}: ShapExplanationProps) {
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set())
  const [showAllCitations, setShowAllCitations] = useState(false)

  const baseline = baselineScore ?? MODALITY_BASELINES[result.modality] ?? 5
  const maxContribution = Math.max(
    ...result.shapFactors.map(f => Math.abs(f.contribution)),
    1
  )

  const toggleFactor = (factor: string) => {
    const newExpanded = new Set(expandedFactors)
    if (newExpanded.has(factor)) {
      newExpanded.delete(factor)
    } else {
      newExpanded.add(factor)
    }
    setExpandedFactors(newExpanded)
  }

  const positiveFactors = result.shapFactors.filter(f => f.contribution > 0)
  const negativeFactors = result.shapFactors.filter(f => f.contribution < 0)
  const sortedFactors = [...result.shapFactors].sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  )

  const categoryData = getScoreCategory(result.finalScore)

  // Calculate waterfall steps
  const waterfallSteps = [
    { label: 'Baseline', value: baseline, color: '#6b7280' }
  ]
  
  let runningTotal = baseline
  sortedFactors.forEach(factor => {
    runningTotal += factor.contribution
    waterfallSteps.push({
      label: factor.factor,
      value: runningTotal,
      color: factor.contribution > 0 ? '#22c55e' : '#ef4444'
    })
  })

  return (
    <Card className={cn('w-full', className)} accent={result.category}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            AIIE Score Explanation
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
            <span className="text-2xl font-bold text-primary-900">
              {result.finalScore.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {result.modality} • {result.radiationLevel} radiation • {result.estimatedCost}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Waterfall Chart */}
        {showWaterfall && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Score Progression
            </h3>
            <div className="space-y-3">
              {waterfallSteps.map((step, index) => {
                const isLast = index === waterfallSteps.length - 1
                const prevValue = index > 0 ? waterfallSteps[index - 1].value : baseline
                const change = step.value - prevValue
                const changePercent = ((change / baseline) * 100).toFixed(1)

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-xs text-muted-foreground shrink-0">
                      {step.label}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 relative h-8 bg-gray-100 rounded overflow-hidden">
                        {/* Previous value bar */}
                        {index > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full bg-gray-300"
                            style={{
                              width: `${(prevValue / 9) * 100}%`
                            }}
                          />
                        )}
                        {/* Current value bar */}
                        <div
                          className={cn(
                            'absolute left-0 top-0 h-full transition-all duration-500',
                            index === 0 ? 'bg-gray-500' : change > 0 ? 'bg-green-500' : 'bg-red-500'
                          )}
                          style={{
                            width: `${(step.value / 9) * 100}%`
                          }}
                        />
                        {/* Value label */}
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
                          {step.value.toFixed(1)}
                        </span>
                      </div>
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
          </div>
        )}

        {/* Factor Contributions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Clinical Factor Contributions
            </h3>
            {result.shapFactors.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCitations(!showAllCitations)}
                className="text-xs"
              >
                {showAllCitations ? 'Show Less' : 'Show All Citations'}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {sortedFactors.map((factor, index) => {
              const isExpanded = expandedFactors.has(factor.factor)
              const isPositive = factor.contribution > 0
              const barWidth = Math.abs((factor.contribution / maxContribution) * 100)

              return (
                <div
                  key={factor.factor}
                  className="border rounded-lg p-3 bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Contribution Bar */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
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
                      <div className="relative h-6 bg-gray-100 rounded overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-500 flex items-center',
                            isPositive ? 'bg-green-500' : 'bg-red-500'
                          )}
                          style={{
                            width: `${barWidth}%`,
                            marginLeft: isPositive ? '0' : 'auto',
                            marginRight: isPositive ? 'auto' : '0'
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
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{factor.value}</span>
                        <span className="font-mono text-[10px]">
                          {factor.evidenceCitation}
                        </span>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFactor(factor.factor)}
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
                    <div className="mt-3 pt-3 border-t space-y-2 animate-in slide-in-from-top-2">
                      <p className="text-sm text-foreground">{factor.explanation}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        <span className="font-mono">{factor.evidenceCitation}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Positive Factors</p>
            <p className="text-lg font-semibold text-green-600">
              +{positiveFactors.reduce((sum, f) => sum + f.contribution, 0).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">
              {positiveFactors.length} factor{positiveFactors.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Negative Factors</p>
            <p className="text-lg font-semibold text-red-600">
              {negativeFactors.reduce((sum, f) => sum + f.contribution, 0).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">
              {negativeFactors.length} factor{negativeFactors.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Alternative Recommendation */}
        {result.alternativeRecommendation && (
          <div className="pt-4 border-t">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                Alternative Recommendation
              </h4>
              <p className="text-sm text-yellow-800">
                {result.alternativeRecommendation}
              </p>
            </div>
          </div>
        )}

        {/* Evidence Citations Summary */}
        {showAllCitations && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Evidence Citations
            </h4>
            <div className="space-y-2">
              {Array.from(
                new Set(result.shapFactors.map(f => f.evidenceCitation))
              ).map((citation, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded"
                >
                  {citation}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for smaller spaces
export function ShapExplanationCompact({
  result,
  className
}: Omit<ShapExplanationProps, 'showWaterfall'>) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categoryData = getScoreCategory(result.finalScore)

  return (
    <Card className={cn('w-full', className)} accent={result.category}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {result.modality}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                categoryData.bgClass
              )}
            >
              {result.categoryLabel}
            </span>
            <span className="text-xl font-bold text-primary-900">
              {result.finalScore.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Top 3 Factors */}
        <div className="space-y-2 mb-4">
          {result.shapFactors
            .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
            .slice(0, isExpanded ? result.shapFactors.length : 3)
            .map((factor) => {
              const isPositive = factor.contribution > 0
              return (
                <div key={factor.factor} className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      'w-16 h-2 rounded',
                      isPositive ? 'bg-green-500' : 'bg-red-500'
                    )}
                    style={{
                      width: `${Math.abs((factor.contribution / 2) * 100)}%`
                    }}
                  />
                  <span className="text-muted-foreground flex-1 truncate">
                    {factor.factor}
                  </span>
                  <span
                    className={cn(
                      'font-semibold shrink-0',
                      isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {isPositive ? '+' : ''}
                    {factor.contribution.toFixed(1)}
                  </span>
                </div>
              )
            })}
        </div>

        {result.shapFactors.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-xs"
          >
            {isExpanded ? 'Show Less' : `Show ${result.shapFactors.length - 3} More Factors`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
