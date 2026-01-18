// @ts-nocheck
"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { CaseCard, CaseCardSkeleton } from "./case-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Case, UserCaseAttempt } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CaseWithAttempts extends Case {
  user_case_attempts?: UserCaseAttempt[];
}

export interface CaseGridProps {
  /** Array of cases with optional user attempts */
  cases: CaseWithAttempts[];
  /** Loading state */
  isLoading?: boolean;
  /** Number of skeleton cards to show when loading */
  skeletonCount?: number;
  /** Callback when a case is clicked */
  onCaseClick?: (caseData: Case) => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CaseGrid - Responsive grid of case cards with loading and empty states.
 *
 * Grid layout:
 * - 3 columns on desktop (lg+)
 * - 2 columns on tablet (md)
 * - 1 column on mobile
 */
export function CaseGrid({
  cases,
  isLoading = false,
  skeletonCount = 12,
  className,
}: CaseGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
          className
        )}
      >
        {[...Array(skeletonCount)].map((_, i) => (
          <CaseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (cases.length === 0) {
    return <EmptyState />;
  }

  // Cases grid
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
        className
      )}
    >
      {cases.map((caseData, index) => (
        <CaseCard
          key={caseData.id}
          case_data={caseData}
          user_attempts={caseData.user_case_attempts}
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
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        No cases found
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">
        Try adjusting your filters or search terms to find more cases.
      </p>
      <Button variant="default" onClick={() => window.location.reload()}>
        <BookOpen className="w-4 h-4 mr-2" />
        View All Cases
      </Button>
    </motion.div>
  );
}

// ============================================================================
// Grid Skeleton
// ============================================================================

export function CaseGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <CaseCardSkeleton key={i} />
      ))}
    </div>
  );
}
