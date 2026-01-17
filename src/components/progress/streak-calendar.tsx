"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  isToday?: boolean;
  isStreak?: boolean;
}

export interface StreakCalendarProps {
  /** Activity data by date */
  activities: DayActivity[];
  /** Number of weeks to show */
  weeks?: number;
  /** Current streak length */
  currentStreak?: number;
  /** Title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

function getIntensityColor(level: number, isStreak: boolean = false): string {
  if (isStreak) {
    // Streak days use amber
    const streakColors = [
      "bg-slate-100",
      "bg-amber-200",
      "bg-amber-300",
      "bg-amber-400",
      "bg-amber-500",
    ];
    return streakColors[level];
  }
  // Regular days use cyan
  const colors = [
    "bg-slate-100",
    "bg-cyan-200",
    "bg-cyan-300",
    "bg-cyan-400",
    "bg-cyan-500",
  ];
  return colors[level];
}

function generateCalendarDays(weeks: number, activities: DayActivity[]): DayActivity[][] {
  const activityMap = new Map(activities.map((a) => [a.date, a]));
  const today = new Date();
  const calendar: DayActivity[][] = [];

  // Start from `weeks` weeks ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (weeks * 7 - 1) - today.getDay());

  for (let week = 0; week < weeks; week++) {
    const weekDays: DayActivity[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      const dateStr = date.toISOString().split("T")[0];
      const activity = activityMap.get(dateStr);
      const isToday = dateStr === today.toISOString().split("T")[0];

      weekDays.push({
        date: dateStr,
        count: activity?.count || 0,
        isToday,
        isStreak: activity?.isStreak || false,
      });
    }
    calendar.push(weekDays);
  }

  return calendar;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================================
// Component
// ============================================================================

/**
 * StreakCalendar - GitHub-style contribution calendar.
 */
export function StreakCalendar({
  activities,
  weeks = 12,
  currentStreak = 0,
  title = "Activity",
  className,
}: StreakCalendarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const calendar = React.useMemo(
    () => generateCalendarDays(weeks, activities),
    [weeks, activities]
  );

  // Get month labels
  const monthLabels = React.useMemo(() => {
    const labels: { month: string; colStart: number }[] = [];
    let currentMonth = -1;

    calendar.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0].date);
      const month = firstDayOfWeek.getMonth();

      if (month !== currentMonth) {
        labels.push({
          month: MONTHS[month],
          colStart: weekIndex,
        });
        currentMonth = month;
      }
    });

    return labels;
  }, [calendar]);

  // Calculate total cases
  const totalCases = activities.reduce((sum, a) => sum + a.count, 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              {currentStreak > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-amber-500">🔥</span>
                  <span className="font-medium text-amber-600">
                    {currentStreak} day streak
                  </span>
                </span>
              )}
              <span className="text-slate-500">{totalCases} cases total</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            {/* Month Labels */}
            <div className="flex mb-1 ml-8">
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-500"
                  style={{
                    marginLeft: i === 0 ? 0 : `${(label.colStart - (monthLabels[i - 1]?.colStart || 0)) * 14 - 24}px`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex">
              {/* Day Labels */}
              <div className="flex flex-col gap-0.5 mr-2 text-xs text-slate-500">
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={cn(
                      "h-3 flex items-center",
                      i % 2 === 1 && "invisible"
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Squares */}
              <TooltipProvider>
                <div className="flex gap-0.5">
                  {calendar.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-0.5">
                      {week.map((day, dayIndex) => {
                        const level = getIntensityLevel(day.count);
                        const isFuture = new Date(day.date) > new Date();

                        return (
                          <Tooltip key={day.date}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{
                                  delay: (weekIndex * 7 + dayIndex) * 0.002,
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                                className={cn(
                                  "w-3 h-3 rounded-sm transition-colors",
                                  isFuture
                                    ? "bg-slate-50"
                                    : getIntensityColor(level, day.isStreak),
                                  day.isToday && "ring-1 ring-slate-400"
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{formatDate(day.date)}</p>
                              <p className="text-slate-500">
                                {day.count === 0
                                  ? "No activity"
                                  : `${day.count} case${day.count !== 1 ? "s" : ""}`}
                              </p>
                              {day.isStreak && (
                                <p className="text-amber-500 text-xs mt-1">
                                  🔥 Part of streak
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-slate-500">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn("w-3 h-3 rounded-sm", getIntensityColor(level))}
                />
              ))}
              <span className="text-xs text-slate-500">More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Mini Streak Display
// ============================================================================

export interface MiniStreakProps {
  streak: number;
  className?: string;
}

export function MiniStreak({ streak, className }: MiniStreakProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium",
        className
      )}
    >
      <span>🔥</span>
      <span>{streak}</span>
    </div>
  );
}
