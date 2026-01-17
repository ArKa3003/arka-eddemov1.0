"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SpineIcon,
  Brain,
  Heart,
  Activity,
  Bone,
  Clock,
  CheckCircle,
  RotateCcw,
  Circle,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  Case,
  CaseCategory,
  DifficultyLevel,
  SpecialtyTrack,
  UserCaseAttempt,
} from "@/types/database";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Category configuration with icons and labels
 */
const CATEGORY_CONFIG: Record<
  CaseCategory,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  "low-back-pain": {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v8M12 14v8M8 6c0-2 2-4 4-4s4 2 4 4M8 18c0 2 2 4 4 4s4-2 4-4" />
      </svg>
    ),
    label: "Low Back Pain",
    color: "violet",
  },
  headache: {
    icon: Brain,
    label: "Headache",
    color: "rose",
  },
  "chest-pain": {
    icon: Heart,
    label: "Chest Pain",
    color: "red",
  },
  "abdominal-pain": {
    icon: Activity,
    label: "Abdominal Pain",
    color: "amber",
  },
  "extremity-trauma": {
    icon: Bone,
    label: "Extremity Trauma",
    color: "blue",
  },
};

/**
 * Difficulty configuration with colors
 */
const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; variant: "success" | "warning" | "error"; bgClass: string }
> = {
  beginner: {
    label: "Beginner",
    variant: "success",
    bgClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  intermediate: {
    label: "Intermediate",
    variant: "warning",
    bgClass: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  advanced: {
    label: "Advanced",
    variant: "error",
    bgClass: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  },
};

/**
 * Specialty configuration
 */
const SPECIALTY_CONFIG: Record<SpecialtyTrack, { label: string; color: string }> = {
  em: { label: "EM", color: "rose" },
  im: { label: "IM", color: "blue" },
  fm: { label: "FM", color: "emerald" },
  surgery: { label: "Surgery", color: "violet" },
  peds: { label: "Peds", color: "teal" },
};

// ============================================================================
// Types
// ============================================================================

export type CaseStatus = "not_started" | "in_progress" | "completed";

export interface CaseCardProps {
  /** Case data */
  case_data: Case;
  /** User's attempts on this case */
  user_attempts?: UserCaseAttempt[];
  /** Animation index for staggered entrance */
  index?: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CaseCard - Display a clinical case with status, difficulty, and progress.
 *
 * Features:
 * - Category icon and badge
 * - Difficulty badge (color coded)
 * - Title (2 lines max)
 * - Chief complaint quote
 * - Specialty tags
 * - Time estimate
 * - Status rendering with visual indicators
 * - Motion animations
 * - Hover lift effect
 * - Border-left accent for completed cases
 */
export function CaseCard({
  case_data,
  user_attempts = [],
  index = 0,
  className,
}: CaseCardProps) {
  // Determine status from latest attempt
  const { status, latestAttempt, bestScore } = React.useMemo(() => {
    if (user_attempts.length === 0) {
      return { status: "not_started" as CaseStatus, latestAttempt: null, bestScore: null };
    }

    const sorted = [...user_attempts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latest = sorted[0];
    const best = Math.max(...user_attempts.map((a) => a.score));

    // Consider completed if any attempt was correct or score >= 70
    const hasCompleted = user_attempts.some((a) => a.is_correct || a.score >= 70);

    return {
      status: hasCompleted ? ("completed" as CaseStatus) : ("in_progress" as CaseStatus),
      latestAttempt: latest,
      bestScore: best,
    };
  }, [user_attempts]);

  const categoryConfig = CATEGORY_CONFIG[case_data.category];
  const difficultyConfig = DIFFICULTY_CONFIG[case_data.difficulty];
  const CategoryIcon = categoryConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/cases/${case_data.slug}`} className="block group">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative bg-white rounded-xl border border-slate-200 p-5 transition-shadow duration-300",
            "hover:shadow-lg hover:shadow-slate-200/50",
            status === "completed" && "border-l-4 border-l-emerald-500",
            className
          )}
        >
          {/* Header: Category + Difficulty */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  `bg-${categoryConfig.color}-100`
                )}
                style={{
                  backgroundColor: `var(--${categoryConfig.color}-100, #f0f0f0)`,
                }}
              >
                <CategoryIcon
                  className={cn("w-4 h-4", `text-${categoryConfig.color}-600`)}
                  style={{ color: `var(--${categoryConfig.color}-600, #666)` }}
                />
              </div>
              <Badge
                variant="outline"
                size="sm"
                className="text-xs font-medium text-slate-600"
              >
                {categoryConfig.label}
              </Badge>
            </div>
            <Badge
              size="sm"
              className={cn("text-xs font-medium border", difficultyConfig.bgClass)}
            >
              {difficultyConfig.label}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
            {case_data.title}
          </h3>

          {/* Chief Complaint Quote */}
          <div className="flex items-start gap-2 mb-4">
            <Quote className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 line-clamp-2 italic">
              &ldquo;{case_data.chief_complaint}&rdquo;
            </p>
          </div>

          {/* Specialty Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {case_data.specialty_tags.map((tag) => {
              const config = SPECIALTY_CONFIG[tag];
              return (
                <Badge
                  key={tag}
                  variant={tag as any}
                  size="sm"
                  className="text-xs"
                >
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Footer: Time + Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {/* Time Estimate */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">~5 min</span>
            </div>

            {/* Status */}
            <StatusIndicator status={status} score={bestScore} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface StatusIndicatorProps {
  status: CaseStatus;
  score: number | null;
}

function StatusIndicator({ status, score }: StatusIndicatorProps) {
  switch (status) {
    case "completed":
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <Badge variant="success" size="sm" className="text-xs">
            {score !== null ? `${score}%` : "Done"}
          </Badge>
        </div>
      );
    case "in_progress":
      return (
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-600 font-medium">Try Again</span>
        </div>
      );
    case "not_started":
    default:
      return (
        <div className="flex items-center gap-1.5">
          <Circle className="w-4 h-4 text-slate-300" />
          <span className="text-xs text-slate-400">Not Started</span>
        </div>
      );
  }
}

// ============================================================================
// Skeleton
// ============================================================================

export function CaseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
          <div className="w-20 h-5 rounded bg-slate-200" />
        </div>
        <div className="w-16 h-5 rounded bg-slate-200" />
      </div>

      {/* Title */}
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />

      {/* Quote */}
      <div className="h-4 bg-slate-200 rounded w-full mb-1" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />

      {/* Tags */}
      <div className="flex gap-1.5 mb-4">
        <div className="w-12 h-5 rounded bg-slate-200" />
        <div className="w-14 h-5 rounded bg-slate-200" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="w-16 h-4 rounded bg-slate-200" />
        <div className="w-20 h-5 rounded bg-slate-200" />
      </div>
    </div>
  );
}
