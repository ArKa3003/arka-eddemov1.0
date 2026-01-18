// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface StatsCardProps {
  /** Stat title */
  title: string;
  /** Current value */
  value: number | string;
  /** Previous value for trend calculation */
  previousValue?: number;
  /** Trend direction (auto-calculated if previousValue provided) */
  trend?: "up" | "down" | "neutral";
  /** Trend percentage (auto-calculated if previousValue provided) */
  trendValue?: number;
  /** Icon component */
  icon: React.ReactNode;
  /** Icon background color */
  iconColor?: "cyan" | "emerald" | "amber" | "rose" | "violet" | "blue";
  /** Format as currency */
  isCurrency?: boolean;
  /** Format as percentage */
  isPercentage?: boolean;
  /** Suffix text (e.g., "hours", "days") */
  suffix?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Animation delay */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const ICON_COLORS = {
  cyan: "bg-cyan-100 text-cyan-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-blue-100 text-blue-600",
};

// ============================================================================
// Component
// ============================================================================

/**
 * StatsCard - Reusable stat display with trend and animation.
 */
export function StatsCard({
  title,
  value,
  previousValue,
  trend: trendProp,
  trendValue: trendValueProp,
  icon,
  iconColor = "cyan",
  isCurrency = false,
  isPercentage = false,
  suffix,
  subtitle,
  delay = 0,
  className,
}: StatsCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedValue, setAnimatedValue] = React.useState(0);

  // Calculate trend if previousValue provided
  const trend = React.useMemo(() => {
    if (trendProp) return trendProp;
    if (previousValue === undefined || typeof value !== "number") return "neutral";
    if (value > previousValue) return "up";
    if (value < previousValue) return "down";
    return "neutral";
  }, [trendProp, previousValue, value]);

  const trendValue = React.useMemo(() => {
    if (trendValueProp !== undefined) return trendValueProp;
    if (previousValue === undefined || typeof value !== "number" || previousValue === 0)
      return 0;
    return Math.round(((value - previousValue) / previousValue) * 100);
  }, [trendValueProp, previousValue, value]);

  // Animate number if it's a number
  React.useEffect(() => {
    if (!isInView || typeof value !== "number") return;

    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(animate, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  // Format display value
  const displayValue = React.useMemo(() => {
    const val = typeof value === "number" ? animatedValue : value;
    if (isCurrency && typeof val === "number") {
      return `$${val.toLocaleString()}`;
    }
    if (isPercentage && typeof val === "number") {
      return `${val}%`;
    }
    return val;
  }, [animatedValue, value, isCurrency, isPercentage]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            {/* Icon */}
            <div className={cn("p-3 rounded-xl", ICON_COLORS[iconColor])}>
              {icon}
            </div>

            {/* Trend Badge */}
            {trend !== "neutral" && (
              <TrendBadge trend={trend} value={Math.abs(trendValue)} />
            )}
          </div>

          {/* Value */}
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900">
              {displayValue}
              {suffix && (
                <span className="text-lg font-normal text-slate-500 ml-1">
                  {suffix}
                </span>
              )}
            </p>
            <p className="text-sm text-slate-500 mt-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Trend Badge
// ============================================================================

interface TrendBadgeProps {
  trend: "up" | "down" | "neutral";
  value: number;
}

function TrendBadge({ trend, value }: TrendBadgeProps) {
  if (trend === "neutral") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        trend === "up" && "bg-emerald-100 text-emerald-700",
        trend === "down" && "bg-rose-100 text-rose-700"
      )}
    >
      {trend === "up" ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {value}%
    </div>
  );
}

// ============================================================================
// Ring Chart Stats Card
// ============================================================================

export interface RingStatsCardProps {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  iconColor?: "cyan" | "emerald" | "amber" | "rose" | "violet" | "blue";
  ringColor?: string;
  delay?: number;
  className?: string;
}

export function RingStatsCard({
  title,
  value,
  total,
  icon,
  iconColor = "cyan",
  ringColor = "#06b6d4",
  delay = 0,
  className,
}: RingStatsCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedValue, setAnimatedValue] = React.useState(0);

  const percentage = total > 0 ? (value / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Animate percentage
  React.useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(percentage * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(animate, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, percentage, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            {/* Ring Chart */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                {/* Background ring */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn("p-2 rounded-lg", ICON_COLORS[iconColor])}>
                  {icon}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {Math.round(animatedValue * total / 100)}
                <span className="text-lg font-normal text-slate-400">
                  /{total}
                </span>
              </p>
              <p className="text-sm text-slate-500 mt-1">{title}</p>
              <p className="text-xs text-cyan-600 font-medium mt-0.5">
                {Math.round(animatedValue)}% complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Streak Stats Card
// ============================================================================

export interface StreakStatsCardProps {
  currentStreak: number;
  longestStreak: number;
  delay?: number;
  className?: string;
}

export function StreakStatsCard({
  currentStreak,
  longestStreak,
  delay = 0,
  className,
}: StreakStatsCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedValue, setAnimatedValue] = React.useState(0);

  // Animate streak
  React.useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(currentStreak * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(animate, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, currentStreak, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500", className)}>
        <CardContent className="p-5 text-white">
          <div className="flex items-start justify-between">
            {/* Fire Icon with Animation */}
            <motion.div
              animate={isInView ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-4xl"
            >
              🔥
            </motion.div>
            <div className="text-right">
              <p className="text-xs text-white/80">Best: {longestStreak} days</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-4xl font-bold">
              {animatedValue}
              <span className="text-lg font-normal text-white/80 ml-1">days</span>
            </p>
            <p className="text-sm text-white/90 mt-1">Current Streak</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
