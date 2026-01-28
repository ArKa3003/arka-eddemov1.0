'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ImagingOption } from '@/types/database'
import { ScoringResult } from '@/lib/aiie/scoring-engine'
import { getScoreCategory } from '@/lib/constants/aiie'

// ============================================================================
// Types
// ============================================================================

export interface OptionsComparisonProps {
  /** All imaging options to compare */
  options: ImagingOption[]
  /** Map of option IDs to their AIIE scores */
  allAIIEScores?: Map<string, ScoringResult>
  /** ID of user's selected option */
  selectedOptionId?: string | null
  /** IDs of optimal options */
  optimalOptionIds?: string[]
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Expandable table showing ALL imaging options with AIIE scores, categories,
 * radiation levels, costs, and user selection indicator.
 */
export function OptionsComparison({
  options,
  allAIIEScores,
  selectedOptionId,
  optimalOptionIds = [],
  className,
}: OptionsComparisonProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  // Sort options by AIIE score (highest first)
  const sortedOptions = React.useMemo(() => {
    return [...options].sort((a, b) => {
      const scoreA = allAIIEScores?.get(a.id)?.finalScore ?? 0
      const scoreB = allAIIEScores?.get(b.id)?.finalScore ?? 0
      return scoreB - scoreA
    })
  }, [options, allAIIEScores])

  const getRadiationLevel = (msv: number): string => {
    if (msv === 0) return 'None'
    if (msv < 0.1) return 'Minimal'
    if (msv <= 1) return 'Low'
    if (msv <= 10) return 'Medium'
    return 'High'
  }

  const getRadiationColor = (msv: number): string => {
    if (msv === 0) return 'text-green-600'
    if (msv < 0.1) return 'text-green-500'
    if (msv <= 1) return 'text-yellow-600'
    if (msv <= 10) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Card className={cn('w-full', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <CardTitle className="text-lg sm:text-xl">All Options Comparison</CardTitle>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        Modality
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        AIIE Score
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        Category
                      </th>
                      <th className="text-right py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        Radiation
                      </th>
                      <th className="text-right py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        Cost
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 font-semibold text-slate-700">
                        Your Pick
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOptions.map((option) => {
                      const score = allAIIEScores?.get(option.id)
                      const categoryData = score ? getScoreCategory(score.finalScore) : null
                      const isSelected = option.id === selectedOptionId
                      const isOptimal = optimalOptionIds.includes(option.id)

                      return (
                        <motion.tr
                          key={option.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'border-b border-slate-100 transition-colors',
                            isSelected && 'bg-cyan-50',
                            isOptimal && !isSelected && 'bg-emerald-50'
                          )}
                        >
                          {/* Modality */}
                          <td className="py-3 px-2 sm:px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'font-medium',
                                  isSelected && 'text-cyan-700',
                                  isOptimal && !isSelected && 'text-emerald-700'
                                )}
                              >
                                {option.short_name || option.name}
                              </span>
                              {isOptimal && (
                                <Badge variant="success" size="sm">
                                  Optimal
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* AIIE Score */}
                          <td className="py-3 px-2 sm:px-4 text-center">
                            {score ? (
                              <Badge
                                className={cn(
                                  'font-semibold',
                                  score.finalScore >= 7
                                    ? 'bg-green-100 text-green-800'
                                    : score.finalScore >= 4
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                )}
                              >
                                {score.finalScore.toFixed(1)}/9
                              </Badge>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-2 sm:px-4 text-center">
                            {categoryData ? (
                              <Badge
                                className={cn(
                                  'text-xs',
                                  categoryData.bgClass
                                )}
                              >
                                {categoryData.label}
                              </Badge>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Radiation */}
                          <td className="py-3 px-2 sm:px-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className={cn('font-medium', getRadiationColor(option.radiation_msv))}>
                                {getRadiationLevel(option.radiation_msv)}
                              </span>
                              <span className="text-xs text-slate-500">
                                {option.radiation_msv.toFixed(2)} mSv
                              </span>
                            </div>
                          </td>

                          {/* Cost */}
                          <td className="py-3 px-2 sm:px-4 text-right">
                            <span className="font-medium text-slate-900">
                              ${option.typical_cost_usd.toLocaleString()}
                            </span>
                          </td>

                          {/* Your Pick */}
                          <td className="py-3 px-2 sm:px-4 text-center">
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-cyan-600 mx-auto" />
                            )}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
