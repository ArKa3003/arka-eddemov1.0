'use client'

import * as React from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface ProgressChartProps {
  accuracyData: Array<{ date: string; accuracy: number }>
  casesData: Array<{ week: string; cases: number }>
  className?: string
}

// ============================================================================
// Custom Tooltip
// ============================================================================

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    color?: string
  }>
  label?: string
  type?: 'accuracy' | 'cases'
}

function CustomTooltip({ active, payload, label, type }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const value = payload[0].value

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 min-w-[140px]">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900">
        {type === 'accuracy' ? `${value}%` : value}
        {type === 'cases' && ' cases'}
      </p>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

export function ProgressChart({
  accuracyData,
  casesData,
  className,
}: ProgressChartProps) {
  const [viewMode, setViewMode] = React.useState<'accuracy' | 'cases'>('accuracy')

  // Format dates for display
  const formattedAccuracyData = accuracyData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Progress Overview</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'accuracy' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('accuracy')}
            className="h-8"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Accuracy
          </Button>
          <Button
            variant={viewMode === 'cases' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cases')}
            className="h-8"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Cases
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'accuracy' ? (
              <LineChart
                data={formattedAccuracyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip type="accuracy" />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={casesData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
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
                <Tooltip content={<CustomTooltip type="cases" />} />
                <Bar dataKey="cases" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
