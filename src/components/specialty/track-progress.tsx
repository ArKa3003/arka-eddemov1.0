"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Lock,
  Clock,
  Award,
  BookOpen,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type CurriculumModule,
  type TrackColor,
  type TrackResource,
  getTrackColorClasses,
} from "@/data/specialty-tracks";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ModuleStatus {
  id: string;
  title: string;
  isComplete: boolean;
  isUnlocked: boolean;
  progress: number;
}

export interface TrackProgressProps {
  /** Overall progress percentage */
  progress: number;
  /** Completed cases count */
  completedCases: number;
  /** Total cases count */
  totalCases: number;
  /** Module statuses */
  modules: ModuleStatus[];
  /** Estimated time remaining in minutes */
  timeRemaining: number;
  /** Track color */
  color: TrackColor;
  /** Whether assessment is available */
  assessmentAvailable: boolean;
  /** Assessment ID */
  assessmentId?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * TrackProgress - Shows overall track progress with module checklist.
 */
export function TrackProgress({
  progress,
  completedCases,
  totalCases,
  modules,
  timeRemaining,
  color,
  assessmentAvailable,
  assessmentId,
  className,
}: TrackProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  const colors = getTrackColorClasses(color);
  const completedModules = modules.filter((m) => m.isComplete).length;

  // Animate progress
  React.useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedProgress(progress * eased);

      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, progress]);

  // Format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card ref={ref} className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Track Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Ring */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={
                  2 * Math.PI * 42 * (1 - animatedProgress / 100)
                }
                className={colors.text}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">
                {Math.round(animatedProgress)}%
              </span>
              <span className="text-xs text-slate-500">Complete</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {completedCases}/{totalCases} cases completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {completedModules}/{modules.length} modules
              </span>
            </div>
            {timeRemaining > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  ~{formatTime(timeRemaining)} remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Module Checklist */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Module Progress
          </p>
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-3 py-2"
            >
              {/* Status Icon */}
              {module.isComplete ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : !module.isUnlocked ? (
                <Lock className="w-5 h-5 text-slate-300 flex-shrink-0" />
              ) : (
                <Circle className={cn("w-5 h-5 flex-shrink-0", colors.text)} />
              )}

              {/* Title */}
              <span
                className={cn(
                  "flex-1 text-sm",
                  module.isComplete && "text-emerald-700",
                  !module.isUnlocked && "text-slate-400",
                  module.isUnlocked && !module.isComplete && "text-slate-700"
                )}
              >
                {module.title}
              </span>

              {/* Progress Badge */}
              {module.isUnlocked && !module.isComplete && module.progress > 0 && (
                <Badge variant="default" size="sm">
                  {module.progress}%
                </Badge>
              )}
            </motion.div>
          ))}
        </div>

        {/* Assessment CTA */}
        {assessmentId && (
          <div
            className={cn(
              "rounded-xl p-4",
              assessmentAvailable
                ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                : "bg-slate-50 border border-slate-200"
            )}
          >
            <div className="flex items-start gap-3">
              <Award
                className={cn(
                  "w-5 h-5 flex-shrink-0 mt-0.5",
                  assessmentAvailable ? "text-amber-600" : "text-slate-400"
                )}
              />
              <div className="flex-1">
                <p
                  className={cn(
                    "font-medium text-sm",
                    assessmentAvailable ? "text-amber-800" : "text-slate-600"
                  )}
                >
                  Track Assessment
                </p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    assessmentAvailable ? "text-amber-600" : "text-slate-500"
                  )}
                >
                  {assessmentAvailable
                    ? "Ready to test your knowledge!"
                    : `Complete all modules to unlock`}
                </p>
              </div>
              {assessmentAvailable && (
                <Link href={`/assessments/${assessmentId}`}>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    Take Exam
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Track Resources
// ============================================================================

export interface TrackResourcesProps {
  resources: TrackResource[];
  className?: string;
}

export function TrackResources({ resources, className }: TrackResourcesProps) {
  const getResourceIcon = (type: TrackResource["type"]) => {
    switch (type) {
      case "acr-topic":
        return "📋";
      case "guideline":
        return "📜";
      case "reading":
        return "📚";
      case "video":
        return "🎥";
      default:
        return "📄";
    }
  };

  const getResourceLabel = (type: TrackResource["type"]) => {
    switch (type) {
      case "acr-topic":
        return "ACR Criteria";
      case "guideline":
        return "Guideline";
      case "reading":
        return "Reading";
      case "video":
        return "Video";
      default:
        return "Resource";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl">{getResourceIcon(resource.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {resource.title}
                </p>
                <p className="text-xs text-slate-500">
                  {getResourceLabel(resource.type)}
                </p>
              </div>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Track Certificate
// ============================================================================

export interface TrackCertificateProps {
  trackName: string;
  certificateName: string;
  earned: boolean;
  earnedAt?: string;
  color: TrackColor;
  className?: string;
}

export function TrackCertificate({
  trackName,
  certificateName,
  earned,
  earnedAt,
  color,
  className,
}: TrackCertificateProps) {
  const colors = getTrackColorClasses(color);

  if (!earned) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6 text-center">
          <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-500">{certificateName}</p>
          <p className="text-sm text-slate-400 mt-1">
            Complete the track to earn this certificate
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card
      className={cn(
        "overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200",
        className
      )}
    >
      <CardContent className="p-6 text-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-block mb-3"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <p className="font-bold text-amber-800 text-lg">{certificateName}</p>
        <p className="text-sm text-amber-600 mt-1">
          {trackName} Track Completed
        </p>
        {formattedDate && (
          <p className="text-xs text-amber-500 mt-2">Earned {formattedDate}</p>
        )}
        <Button variant="outline" size="sm" className="mt-4">
          View Certificate
        </Button>
      </CardContent>
    </Card>
  );
}
