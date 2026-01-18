// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CompetencyScore {
  category: CaseCategory;
  label: string;
  current: number;
  target: number;
}

export interface CompetencyRadarProps {
  /** Category scores */
  scores: CompetencyScore[];
  /** Show target line */
  showTarget?: boolean;
  /** Title */
  title?: string;
  /** Current score color */
  currentColor?: string;
  /** Target score color */
  targetColor?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Custom Tooltip
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 min-w-[140px]">
      <p className="text-sm font-medium text-slate-900 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">{entry.name}:</span>
          <span
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * CompetencyRadar - Recharts RadarChart for competency visualization.
 */
export function CompetencyRadar({
  scores,
  showTarget = true,
  title = "Competency by Category",
  currentColor = "#06b6d4",
  targetColor = "#e2e8f0",
  className,
}: CompetencyRadarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isAnimated, setIsAnimated] = React.useState(false);

  React.useEffect(() => {
    if (isInView && !isAnimated) {
      setTimeout(() => setIsAnimated(true), 100);
    }
  }, [isInView, isAnimated]);

  // Format data for Recharts
  const chartData = scores.map((s) => ({
    category: s.label,
    current: isAnimated ? s.current : 0,
    target: s.target,
    fullMark: 100,
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickCount={5}
                  axisLine={false}
                />
                {showTarget && (
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke={targetColor}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="none"
                    animationDuration={0}
                  />
                )}
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke={currentColor}
                  strokeWidth={2}
                  fill={currentColor}
                  fillOpacity={0.3}
                  animationDuration={1500}
                  animationBegin={isAnimated ? 0 : 9999}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
            {scores.map((score) => (
              <div
                key={score.category}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
              >
                <span className="text-xs text-slate-600 truncate">
                  {score.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold ml-2",
                    score.current >= score.target
                      ? "text-emerald-600"
                      : score.current >= score.target * 0.7
                      ? "text-amber-600"
                      : "text-rose-600"
                  )}
                >
                  {score.current}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
