'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Target, TrendingUp, Clock, ArrowRight, Flame, AlertCircle } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Achievements } from '@/components/dashboard/Achievements'
import { getMockProgressData } from '@/lib/data/progress'
import * as React from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const progressData = React.useMemo(() => getMockProgressData(), [])

  if (!user) {
    return null
  }

  const firstName = user.name.split(' ')[0] || 'there'
  const { stats, categoryPerformance, specialtyPerformance, recentActivity, achievements, recommendations } = progressData

  // Calculate progress percentage for circular progress
  const progressPercent = stats.totalCases > 0 
    ? Math.round((stats.casesCompleted / stats.totalCases) * 100) 
    : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <main id="main-content" className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {firstName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Continue your journey to master medical imaging appropriateness
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Cases Completed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Cases Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#e2e8f0"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#06b6d4"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-900">{progressPercent}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {stats.casesCompleted}/{stats.totalCases}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Total cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Accuracy */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Overall Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-cyan-600">
                    {stats.overallAccuracy}%
                  </div>
                  <div className="flex items-center gap-1">
                    {stats.accuracyTrend === 'up' ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-emerald-600 font-medium">+5%</span>
                      </>
                    ) : stats.accuracyTrend === 'down' ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-rose-500 rotate-180" />
                        <span className="text-sm text-rose-600 font-medium">-2%</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">vs last week</p>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.currentStreak}
                  </div>
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-sm text-slate-500 mt-1">days in a row</p>
              </CardContent>
            </Card>

            {/* Time Spent */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-violet-600">
                  {stats.timeSpent.hours}h {stats.timeSpent.minutes}m
                </div>
                <p className="text-sm text-slate-500 mt-1">Total study time</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <div className="mb-8">
            <ProgressChart
              accuracyData={progressData.accuracyOverTime}
              casesData={progressData.casesPerWeek}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Performance by Category */}
            <CategoryBreakdown categories={categoryPerformance} />

            {/* Performance by Specialty Track */}
            <CategoryBreakdown
              categories={specialtyPerformance.map((sp) => ({
                category: sp.specialty,
                label: sp.label,
                completed: sp.completed,
                total: sp.total,
                accuracy: sp.accuracy,
              }))}
              title="Performance by Specialty Track"
            />
          </div>

          {/* Recent Activity Feed */}
          <div className="mb-8">
            <ActivityFeed activities={recentActivity} />
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <Achievements achievements={achievements} />
          </div>

          {/* Recommended Next Steps */}
          {recommendations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={cn(
                        'p-4 rounded-lg border transition-colors hover:bg-slate-50',
                        rec.priority === 'high' && 'border-amber-300 bg-amber-50/50',
                        rec.priority === 'medium' && 'border-slate-200',
                        rec.priority === 'low' && 'border-slate-200'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">{rec.title}</h4>
                          <p className="text-sm text-slate-600">{rec.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(rec.actionUrl)}
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow focus-visible-ring" onClick={() => router.push('/cases')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push('/cases')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                    Continue Learning
                  </CardTitle>
                  <ArrowRight className="w-5 h-5 text-slate-400" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Practice with real clinical cases and master imaging appropriateness
                </p>
                <Button className="w-full touch-target" onClick={() => router.push('/cases')} aria-label="Browse cases">
                  Browse Cases
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow focus-visible-ring" onClick={() => router.push('/assessment')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push('/assessment')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    Start Assessment
                  </CardTitle>
                  <ArrowRight className="w-5 h-5 text-slate-400" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Test your knowledge with timed assessments and track your progress
                </p>
                <Button className="w-full touch-target" variant="secondary" onClick={() => router.push('/assessment')} aria-label="Take assessment">
                  Take Assessment
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow focus-visible-ring" onClick={() => router.push('/progress')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push('/progress')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-5 h-5 text-violet-600" aria-hidden="true" />
                    View Full Analytics
                  </CardTitle>
                  <ArrowRight className="w-5 h-5 text-slate-400" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm">
                  Dive deep into your performance metrics and detailed analytics
                </p>
                <Button className="w-full touch-target" variant="outline" onClick={() => router.push('/progress')} aria-label="View analytics">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
