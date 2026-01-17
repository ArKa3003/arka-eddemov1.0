"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  Target,
  Play,
  RotateCcw,
  CheckCircle,
  Circle,
  ArrowRight,
  Trophy,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  Assessment,
  UserAssessment,
  SpecialtyTrack,
  DifficultyLevel,
  AssessmentStatus,
} from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type AssessmentUserStatus = "not_started" | "in_progress" | "completed";

export interface AssessmentCardProps {
  /** Assessment data */
  assessment: Assessment;
  /** User's assessment data (if any) */
  userAssessment?: UserAssessment | null;
  /** Animation index for staggered entrance */
  index?: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const SPECIALTY_CONFIG: Record<SpecialtyTrack, { label: string; color: string }> = {
  em: { label: "Emergency Medicine", color: "rose" },
  im: { label: "Internal Medicine", color: "blue" },
  fm: { label: "Family Medicine", color: "emerald" },
  surgery: { label: "Surgery", color: "violet" },
  peds: { label: "Pediatrics", color: "teal" },
};

const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; color: string; bgClass: string }
> = {
  beginner: {
    label: "Beginner",
    color: "emerald",
    bgClass: "bg-emerald-100 text-emerald-700",
  },
  intermediate: {
    label: "Intermediate",
    color: "amber",
    bgClass: "bg-amber-100 text-amber-700",
  },
  advanced: {
    label: "Advanced",
    color: "rose",
    bgClass: "bg-rose-100 text-rose-700",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * AssessmentCard - Display an assessment with user progress and status.
 */
export function AssessmentCard({
  assessment,
  userAssessment,
  index = 0,
  className,
}: AssessmentCardProps) {
  // Determine user status
  const status: AssessmentUserStatus = React.useMemo(() => {
    if (!userAssessment) return "not_started";
    if (userAssessment.status === "completed") return "completed";
    if (
      userAssessment.status === "in_progress" ||
      userAssessment.status === "not_started"
    ) {
      return userAssessment.current_case_index > 0 ? "in_progress" : "not_started";
    }
    return "not_started";
  }, [userAssessment]);

  // Calculate progress percentage
  const progressPercent = React.useMemo(() => {
    if (!userAssessment || status === "not_started") return 0;
    if (status === "completed") return 100;
    const total = assessment.case_ids.length;
    const current = userAssessment.current_case_index;
    return Math.round((current / total) * 100);
  }, [userAssessment, status, assessment.case_ids.length]);

  // Get best score
  const bestScore = userAssessment?.score ?? null;
  const passed = userAssessment?.passed ?? false;

  // Get configs
  const specialtyConfig = assessment.specialty_track
    ? SPECIALTY_CONFIG[assessment.specialty_track]
    : null;
  const difficultyConfig = assessment.difficulty
    ? DIFFICULTY_CONFIG[assessment.difficulty]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/assessments/${assessment.id}`} className="block group">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative bg-white rounded-xl border border-slate-200 p-5 transition-shadow duration-300",
            "hover:shadow-lg hover:shadow-slate-200/50",
            status === "completed" && passed && "border-l-4 border-l-emerald-500",
            status === "in_progress" && "border-l-4 border-l-amber-500",
            className
          )}
        >
          {/* Custom badge */}
          {assessment.is_custom && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" size="sm">
                <User className="w-3 h-3 mr-1" />
                Custom
              </Badge>
            </div>
          )}

          {/* Header: Title + Badges */}
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 line-clamp-1 mb-2 group-hover:text-cyan-600 transition-colors pr-16">
              {assessment.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialtyConfig && (
                <Badge variant={assessment.specialty_track as any} size="sm">
                  {specialtyConfig.label}
                </Badge>
              )}
              {difficultyConfig && (
                <Badge size="sm" className={difficultyConfig.bgClass}>
                  {difficultyConfig.label}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {assessment.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
            {/* Case Count */}
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{assessment.case_ids.length} cases</span>
            </div>

            {/* Time Limit */}
            {assessment.time_limit_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{assessment.time_limit_minutes} min</span>
              </div>
            )}

            {/* Passing Score */}
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{assessment.passing_score}% to pass</span>
            </div>
          </div>

          {/* Status Section */}
          <div className="pt-3 border-t border-slate-100">
            <StatusSection
              status={status}
              progressPercent={progressPercent}
              bestScore={bestScore}
              passed={passed}
              passingScore={assessment.passing_score}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// Status Section
// ============================================================================

interface StatusSectionProps {
  status: AssessmentUserStatus;
  progressPercent: number;
  bestScore: number | null;
  passed: boolean;
  passingScore: number;
}

function StatusSection({
  status,
  progressPercent,
  bestScore,
  passed,
  passingScore,
}: StatusSectionProps) {
  switch (status) {
    case "completed":
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {passed ? (
              <Trophy className="w-5 h-5 text-emerald-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <span
                className={cn(
                  "font-semibold",
                  passed ? "text-emerald-600" : "text-slate-600"
                )}
              >
                {bestScore}%
              </span>
              <span className="text-sm text-slate-500 ml-1">
                {passed ? "Passed" : "Not Passed"}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Retake
          </Button>
        </div>
      );

    case "in_progress":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <Circle className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <span className="text-sm text-slate-500">{progressPercent}%</span>
          </div>
          <LinearProgress value={progressPercent} color="warning" size="sm" />
          <Button size="sm" className="w-full mt-2">
            Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      );

    case "not_started":
    default:
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Circle className="w-4 h-4" />
            <span className="text-sm">Not Started</span>
          </div>
          <Button size="sm">
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        </div>
      );
  }
}

// ============================================================================
// Skeleton
// ============================================================================

export function AssessmentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      {/* Header */}
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-24 bg-slate-200 rounded" />
        <div className="h-5 w-20 bg-slate-200 rounded" />
      </div>

      {/* Description */}
      <div className="h-4 bg-slate-200 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex justify-between">
        <div className="h-8 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-20 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
