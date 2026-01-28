'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface ActivityItem {
  id: string
  caseName: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number // seconds
  timestamp: string
  caseId: string
}

export interface ActivityFeedProps {
  activities: ActivityItem[]
  maxItems?: number
  className?: string
}

// ============================================================================
// Helpers
// ============================================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// ============================================================================
// Component
// ============================================================================

export function ActivityFeed({
  activities,
  maxItems = 10,
  className,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No recent activity. Start your first case!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayActivities.map((activity) => (
              <Link
                key={activity.id}
                href={`/cases/${activity.caseId}`}
                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-cyan-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 text-sm truncate">
                        {activity.caseName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 truncate">
                        Your answer: {activity.userAnswer}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(activity.timeSpent)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Link Icon */}
                  <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
