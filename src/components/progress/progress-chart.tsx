"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ProgressDataPoint {
  date: string;
  value: number;
  cases?: number;
  label?: string;
}

export interface ProgressChartProps {
  /** Chart data */
  data: ProgressDataPoint[];
  /** Date range label */
  dateRange?: "week" | "month" | "all";
  /** Metric being displayed */
  metric?: "accuracy" | "cases" | "time";
  /** Chart title */
  title?: string;
  /** Show area fill */
  showArea?: boolean;
  /** Line color */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Custom Tooltip
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ProgressDataPoint;
  }>;
  label?: string;
  metric?: string;
}

function CustomTooltip({ active, payload, label, metric }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const point = data.payload;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 min-w-[140px]">
      <p className="text-xs text-slate-500 mb-1">{point.label || label}</p>
      <p className="text-lg font-bold text-slate-900">
        {metric === "accuracy" ? `${data.value}%` : data.value}
      </p>
      {point.cases !== undefined && (
        <p className="text-xs text-slate-500 mt-1">{point.cases} cases</p>
      )}
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

/**
 * ProgressChart - Recharts LineChart wrapper with animations.
 */
export function ProgressChart({
  data,
  dateRange = "week",
  metric = "accuracy",
  title = "Performance Over Time",
  showArea = true,
  color = "#06b6d4",
  className,
}: ProgressChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isAnimated, setIsAnimated] = React.useState(false);

  React.useEffect(() => {
    if (isInView && !isAnimated) {
      setIsAnimated(true);
    }
  }, [isInView, isAnimated]);

  // Format date for X axis
  const formatXAxis = (date: string) => {
    const d = new Date(date);
    if (dateRange === "week") {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (dateRange === "month") {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return d.toLocaleDateString("en-US", { month: "short" });
  };

  // Get Y axis label
  const getYAxisLabel = () => {
    switch (metric) {
      case "accuracy":
        return "Accuracy %";
      case "cases":
        return "Cases";
      case "time":
        return "Minutes";
      default:
        return "";
    }
  };

  // Calculate trend
  const trend = React.useMemo(() => {
    if (data.length < 2) return null;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const change = last - first;
    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      value: Math.abs(change),
    };
  }, [data]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {trend && trend.direction !== "neutral" && (
            <Badge
              variant={trend.direction === "up" ? "success" : "destructive"}
              size="sm"
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
              {metric === "accuracy" ? "%" : ""}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {showArea ? (
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={metric === "accuracy" ? [0, 100] : ["auto", "auto"]}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip metric={metric} />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    animationDuration={1500}
                    animationBegin={isAnimated ? 0 : 9999}
                  />
                </AreaChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={metric === "accuracy" ? [0, 100] : ["auto", "auto"]}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip metric={metric} />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: color }}
                    animationDuration={1500}
                    animationBegin={isAnimated ? 0 : 9999}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
