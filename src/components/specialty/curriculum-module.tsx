// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Lock,
  CheckCircle,
  Circle,
  Clock,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinearProgress } from "@/components/ui/progress";
import {
  type CurriculumModule,
  type TrackColor,
  getTrackColorClasses,
} from "@/data/specialty-tracks";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

// ============================================================================
// Types
// ============================================================================

export interface ModuleCase {
  id: string;
  title: string;
  completed: boolean;
  score?: number;
}

export interface CurriculumModuleCardProps {
  /** Module configuration */
  module: CurriculumModule;
  /** Module index (for display) */
  index: number;
  /** Whether module is unlocked */
  isUnlocked: boolean;
  /** Completion progress */
  progress: { completed: number; total: number; percentage: number };
  /** Whether module is complete */
  isComplete: boolean;
  /** Cases with completion status */
  cases: ModuleCase[];
  /** Track color */
  color: TrackColor;
  /** Whether to start expanded */
  defaultExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CurriculumModuleCard - Expandable card for curriculum modules.
 */
export function CurriculumModuleCard({
  module,
  index,
  isUnlocked,
  progress,
  isComplete,
  cases,
  color,
  defaultExpanded = false,
  className,
}: CurriculumModuleCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [hasShownCelebration, setHasShownCelebration] = React.useState(false);

  const colors = getTrackColorClasses(color);

  // Trigger celebration when module is completed
  React.useEffect(() => {
    if (isComplete && !hasShownCelebration) {
      setHasShownCelebration(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#06b6d4", "#8b5cf6"],
      });
    }
  }, [isComplete, hasShownCelebration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "transition-all",
          !isUnlocked && "opacity-60",
          isComplete && colors.border,
          className
        )}
      >
        <CardHeader className="p-0">
          <button
            onClick={() => isUnlocked && setIsExpanded(!isExpanded)}
            disabled={!isUnlocked}
            className={cn(
              "w-full p-4 sm:p-5 text-left transition-colors",
              isUnlocked && "hover:bg-slate-50"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Module Number / Status */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  isComplete
                    ? "bg-emerald-100"
                    : !isUnlocked
                    ? "bg-slate-100"
                    : colors.bgLight
                )}
              >
                {isComplete ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : !isUnlocked ? (
                  <Lock className="w-5 h-5 text-slate-400" />
                ) : (
                  <span className={cn("font-bold", colors.text)}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <Badge variant="success" size="sm">
                        Complete
                      </Badge>
                    )}
                    {!isUnlocked && (
                      <Badge variant="default" size="sm">
                        Locked
                      </Badge>
                    )}
                    {isUnlocked && (
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-slate-400 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {module.description}
                </p>

                {/* Progress & Stats */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1 max-w-[200px]">
                    <LinearProgress
                      value={progress.percentage}
                      color={isComplete ? "success" : "default"}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {progress.completed}/{progress.total} cases
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{module.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </button>
        </CardHeader>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && isUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0 pb-4 px-4 sm:px-5">
                <div className="border-t border-slate-100 pt-4">
                  {/* Case List */}
                  <div className="space-y-2">
                    {cases.map((c, i) => (
                      <ModuleCaseItem
                        key={c.id}
                        caseData={c}
                        index={i}
                        color={color}
                      />
                    ))}
                  </div>

                  {/* Start Button */}
                  {!isComplete && (
                    <div className="mt-4">
                      <Link
                        href={`/cases/${
                          cases.find((c) => !c.completed)?.id || cases[0].id
                        }`}
                      >
                        <Button className={cn(colors.bg, "hover:opacity-90")}>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {progress.completed > 0 ? "Continue" : "Start"} Module
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Completion Badge */}
                  {isComplete && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-600">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Module completed!
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock Requirement Message */}
        {!isUnlocked && module.unlockRequirement && (
          <CardContent className="pt-0 pb-4 px-4 sm:px-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Lock className="w-4 h-4" />
              <span>
                Complete{" "}
                {module.unlockRequirement.type === "module"
                  ? `the previous module`
                  : `${module.unlockRequirement.value} cases`}{" "}
                to unlock
              </span>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Module Case Item
// ============================================================================

interface ModuleCaseItemProps {
  caseData: ModuleCase;
  index: number;
  color: TrackColor;
}

function ModuleCaseItem({ caseData, index, color }: ModuleCaseItemProps) {
  const colors = getTrackColorClasses(color);

  return (
    <Link href={`/cases/${caseData.id}`}>
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-colors",
          caseData.completed
            ? "bg-emerald-50 hover:bg-emerald-100"
            : "bg-slate-50 hover:bg-slate-100"
        )}
      >
        {/* Status Icon */}
        {caseData.completed ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5 text-slate-300" />
        )}

        {/* Case Title */}
        <span
          className={cn(
            "flex-1 text-sm",
            caseData.completed ? "text-emerald-700" : "text-slate-700"
          )}
        >
          {caseData.title || `Case ${index + 1}`}
        </span>

        {/* Score Badge */}
        {caseData.completed && caseData.score !== undefined && (
          <Badge
            size="sm"
            variant={caseData.score >= 80 ? "success" : "default"}
          >
            {caseData.score}%
          </Badge>
        )}
      </div>
    </Link>
  );
}

// ============================================================================
// Module List
// ============================================================================

export interface CurriculumModuleListProps {
  modules: Array<{
    module: CurriculumModule;
    isUnlocked: boolean;
    progress: { completed: number; total: number; percentage: number };
    isComplete: boolean;
    cases: ModuleCase[];
  }>;
  color: TrackColor;
  className?: string;
}

export function CurriculumModuleList({
  modules,
  color,
  className,
}: CurriculumModuleListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {modules.map((m, index) => (
        <CurriculumModuleCard
          key={m.module.id}
          module={m.module}
          index={index}
          isUnlocked={m.isUnlocked}
          progress={m.progress}
          isComplete={m.isComplete}
          cases={m.cases}
          color={color}
          defaultExpanded={index === 0 && m.isUnlocked && !m.isComplete}
        />
      ))}
    </div>
  );
}
