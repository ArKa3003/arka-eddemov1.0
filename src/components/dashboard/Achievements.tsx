'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Award, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface AchievementStatus {
  slug: string
  name: string
  description: string
  icon: string
  isEarned: boolean
  earnedAt?: string
  progress: number
  total: number
}

export interface AchievementsProps {
  achievements: AchievementStatus[]
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export function Achievements({ achievements, className }: AchievementsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="w-5 h-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {achievements.map((achievement) => {
            const progressPercent = achievement.total > 0
              ? Math.round((achievement.progress / achievement.total) * 100)
              : 0

            return (
              <div
                key={achievement.slug}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors',
                  achievement.isEarned
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                {/* Badge Icon */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-3xl relative',
                    achievement.isEarned
                      ? 'bg-gradient-to-br from-amber-100 to-amber-200 ring-2 ring-amber-300'
                      : 'bg-slate-200 grayscale opacity-50'
                  )}
                >
                  <span>{achievement.icon}</span>

                  {/* Lock or Checkmark */}
                  {achievement.isEarned ? (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <span
                  className={cn(
                    'text-xs text-center font-medium',
                    achievement.isEarned ? 'text-slate-900' : 'text-slate-500'
                  )}
                >
                  {achievement.name}
                </span>

                {/* Progress */}
                {!achievement.isEarned && (
                  <div className="w-full space-y-1">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 text-center block">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                )}

                {/* Earned Date */}
                {achievement.isEarned && achievement.earnedAt && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
