'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { getMockProgressData } from '@/lib/data/progress'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import * as React from 'react'

export default function ProgressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const progressData = React.useMemo(() => getMockProgressData(), [])

  if (!user) {
    return null
  }

  const { stats, categoryPerformance, specialtyPerformance, accuracyOverTime, casesPerWeek } = progressData

  // Generate monthly accuracy data
  const monthlyAccuracy = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    return months.map((month, index) => ({
      month,
      accuracy: Math.floor(Math.random() * 15) + 70 + index * 1.5,
      peerAverage: Math.floor(Math.random() * 10) + 72 + index * 1.2,
    }))
  }, [])

  // Calculate average time per case
  const averageTimePerCase = React.useMemo(() => {
    const totalSeconds = progressData.recentActivity.reduce((sum, activity) => sum + activity.timeSpent, 0)
    const avgSeconds = progressData.recentActivity.length > 0 
      ? totalSeconds / progressData.recentActivity.length 
      : 0
    return Math.round(avgSeconds / 60) // Convert to minutes
  }, [progressData.recentActivity])

  // Find most missed case types
  const mostMissedCases = React.useMemo(() => {
    const missedByCategory = categoryPerformance
      .map((cat) => ({
        category: cat.label,
        missed: cat.completed - Math.round((cat.completed * cat.accuracy) / 100),
        total: cat.completed,
      }))
      .filter((item) => item.missed > 0)
      .sort((a, b) => b.missed - a.missed)
      .slice(0, 5)

    return missedByCategory
  }, [categoryPerformance])

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export functionality will be implemented with a PDF library')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Detailed Progress Analytics
              </h1>
              <p className="text-slate-600">
                Comprehensive insights into your learning journey
              </p>
            </div>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {stats.casesCompleted}
                </div>
                <p className="text-sm text-slate-500 mt-1">of {stats.totalCases} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Overall Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-600">
                  {stats.overallAccuracy}%
                </div>
                <p className="text-sm text-slate-500 mt-1">All-time average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Avg Time/Case
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-violet-600">
                  {averageTimePerCase}m
                </div>
                <p className="text-sm text-slate-500 mt-1">Per case</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.currentStreak}
                </div>
                <p className="text-sm text-slate-500 mt-1">days</p>
              </CardContent>
            </Card>
          </div>

          {/* Accuracy Trends by Month */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Accuracy Trends by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAccuracy} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
                            <p className="text-xs text-slate-500 mb-2">{payload[0].payload.month}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                                {entry.name === 'accuracy' ? 'Your Accuracy' : 'Peer Average'}: {entry.value}%
                              </p>
                            ))}
                          </div>
                        )
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Your Accuracy"
                      dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="peerAverage"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Peer Average"
                      dot={{ fill: '#94a3b8', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Time-per-Case Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time-per-Case Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600">Average Time</p>
                      <p className="text-2xl font-bold text-slate-900">{averageTimePerCase} minutes</p>
                    </div>
                    <Clock className="w-8 h-8 text-violet-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Fastest Case</span>
                      <span className="font-medium">2m 15s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Slowest Case</span>
                      <span className="font-medium">8m 32s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Total Study Time</span>
                      <span className="font-medium">
                        {stats.timeSpent.hours}h {stats.timeSpent.minutes}m
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Most Missed Case Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Most Missed Case Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mostMissedCases.length > 0 ? (
                  <div className="space-y-3">
                    {mostMissedCases.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{item.category}</span>
                          <span className="text-sm text-slate-600">
                            {item.missed} missed / {item.total} total
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${(item.missed / item.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No missed cases to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryBreakdown categories={categoryPerformance} />
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

          {/* Cases Per Week Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cases Completed Per Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={casesPerWeek} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      label={{ value: 'Cases', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
                            <p className="text-xs text-slate-500 mb-1">{payload[0].payload.week}</p>
                            <p className="text-lg font-bold text-slate-900">
                              {payload[0].value} cases
                            </p>
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="cases" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
