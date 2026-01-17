"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Circle,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface ActivityItem {
  id: string;
  type: "case_completed" | "assessment_completed" | "achievement_earned" | "streak_milestone";
  title: string;
  subtitle?: string;
  score?: number;
  isCorrect?: boolean;
  timeSpent?: number;
  category?: CaseCategory;
  difficulty?: DifficultyLevel;
  caseId?: string;
  assessmentId?: string;
  achievementId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  /** Activity items */
  activities: ActivityItem[];
  /** Maximum items to show initially */
  initialCount?: number;
  /** Title */
  title?: string;
  /** Whether to show "Load More" */
  showLoadMore?: boolean;
  /** Load more callback */
  onLoadMore?: () => void;
  /** Whether more items are loading */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ActivityFeed - Vertical timeline of recent activity.
 */
export function ActivityFeed({
  activities,
  initialCount = 5,
  title = "Recent Activity",
  showLoadMore = true,
  onLoadMore,
  isLoading = false,
  className,
}: ActivityFeedProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [visibleCount, setVisibleCount] = React.useState(initialCount);

  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = activities.length > visibleCount;

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    } else {
      setVisibleCount((prev) => prev + 5);
    }
  };

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
          {activities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <>
              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

                {/* Activity items */}
                <div className="space-y-4">
                  {visibleActivities.map((activity, index) => (
                    <ActivityItemComponent
                      key={activity.id}
                      activity={activity}
                      index={index}
                      isInView={isInView}
                    />
                  ))}
                </div>
              </div>

              {/* Load More */}
              {showLoadMore && hasMore && (
                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <>
                        Load More
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Activity Item Component
// ============================================================================

interface ActivityItemComponentProps {
  activity: ActivityItem;
  index: number;
  isInView: boolean;
}

function ActivityItemComponent({
  activity,
  index,
  isInView,
}: ActivityItemComponentProps) {
  // Get icon based on type and result
  const getIcon = () => {
    switch (activity.type) {
      case "case_completed":
        if (activity.isCorrect === true) {
          return (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          );
        }
        if (activity.isCorrect === false) {
          return (
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
          );
        }
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Circle className="w-4 h-4 text-slate-600" />
          </div>
        );
      case "assessment_completed":
        return (
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-sm">📋</span>
          </div>
        );
      case "achievement_earned":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-sm">🏆</span>
          </div>
        );
      case "streak_milestone":
        return (
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-sm">🔥</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Circle className="w-4 h-4 text-slate-600" />
          </div>
        );
    }
  };

  // Get link based on type
  const getLink = () => {
    if (activity.caseId) return `/cases/${activity.caseId}`;
    if (activity.assessmentId) return `/assessments/${activity.assessmentId}/results`;
    return null;
  };

  const link = getLink();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.05 }}
      className="relative pl-12"
    >
      {/* Icon */}
      <div className="absolute left-0 top-0">{getIcon()}</div>

      {/* Content */}
      <div className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="font-medium text-slate-900 text-sm truncate">
              {activity.title}
            </p>

            {/* Subtitle / Details */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {activity.subtitle && (
                <span className="text-xs text-slate-500">{activity.subtitle}</span>
              )}
              {activity.score !== undefined && (
                <Badge
                  size="sm"
                  variant={activity.score >= 70 ? "success" : "secondary"}
                >
                  {activity.score}%
                </Badge>
              )}
              {activity.timeSpent !== undefined && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatTime(activity.timeSpent)}
                </span>
              )}
              {activity.difficulty && (
                <Badge
                  size="sm"
                  className={cn(
                    activity.difficulty === "beginner" &&
                      "bg-emerald-100 text-emerald-700",
                    activity.difficulty === "intermediate" &&
                      "bg-amber-100 text-amber-700",
                    activity.difficulty === "advanced" &&
                      "bg-rose-100 text-rose-700"
                  )}
                >
                  {activity.difficulty}
                </Badge>
              )}
            </div>
          </div>

          {/* Time & Link */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-slate-400">
              {getRelativeTime(activity.timestamp)}
            </span>
            {link && (
              <Link
                href={link}
                className="text-slate-400 hover:text-cyan-600 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Compact Activity Item (for sidebar/widgets)
// ============================================================================

export interface CompactActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

export function CompactActivity({
  activities,
  maxItems = 3,
  className,
}: CompactActivityProps) {
  const visibleActivities = activities.slice(0, maxItems);

  return (
    <div className={cn("space-y-2", className)}>
      {visibleActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
        >
          {activity.isCorrect === true && (
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          )}
          {activity.isCorrect === false && (
            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          )}
          {activity.isCorrect === undefined && (
            <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )}
          <span className="text-sm text-slate-700 truncate flex-1">
            {activity.title}
          </span>
          <span className="text-xs text-slate-400">
            {getRelativeTime(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
