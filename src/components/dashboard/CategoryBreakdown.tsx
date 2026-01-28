'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CaseCategory } from '@/types/database'

// ============================================================================
// Types
// ============================================================================

export interface CategoryPerformance {
  category: CaseCategory | string // Allow string for specialty tracks
  label: string
  completed: number
  total: number
  accuracy: number
}

export interface CategoryBreakdownProps {
  categories: CategoryPerformance[]
  title?: string
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export function CategoryBreakdown({
  categories,
  title = 'Performance by Category',
  className,
}: CategoryBreakdownProps) {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-emerald-500'
    if (accuracy >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const getAccuracyTextColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-emerald-600'
    if (accuracy >= 60) return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {categories.map((category) => {
            const accuracyColor = getAccuracyColor(category.accuracy)
            const accuracyTextColor = getAccuracyTextColor(category.accuracy)
            const progressPercent = category.total > 0 
              ? (category.completed / category.total) * 100 
              : 0

            return (
              <div key={category.category} className="space-y-2">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{category.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      {category.completed}/{category.total}
                    </span>
                    <span className={cn('font-semibold text-sm', accuracyTextColor)}>
                      {category.accuracy}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', accuracyColor)}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Visual Accuracy Indicator */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const filled = i < Math.round(category.accuracy / 10)
                    return (
                      <div
                        key={i}
                        className={cn(
                          'h-2 flex-1 rounded',
                          filled ? accuracyColor : 'bg-slate-200'
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
