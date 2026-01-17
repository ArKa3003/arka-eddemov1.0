"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { AssessmentCard, AssessmentCardSkeleton } from "./assessment-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Assessment, UserAssessment } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface AssessmentGridProps {
  /** Array of assessments */
  assessments: Assessment[];
  /** User assessment data keyed by assessment ID */
  userAssessments: Record<string, UserAssessment>;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * AssessmentGrid - Responsive grid of assessment cards.
 */
export function AssessmentGrid({
  assessments,
  userAssessments,
  isLoading = false,
  className,
}: AssessmentGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {[...Array(6)].map((_, i) => (
          <AssessmentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (assessments.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 },
        },
      }}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {assessments.map((assessment, index) => (
        <AssessmentCard
          key={assessment.id}
          assessment={assessment}
          userAssessment={userAssessments[assessment.id]}
          index={index}
        />
      ))}
    </motion.div>
  );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        No assessments found
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">
        Try adjusting your filters or create a custom quiz to test your
        knowledge.
      </p>
      <Button onClick={() => window.location.reload()}>View All Assessments</Button>
    </motion.div>
  );
}
