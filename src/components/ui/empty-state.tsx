"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileQuestion,
  BookOpen,
  ClipboardList,
  Trophy,
  Inbox,
  FolderOpen,
  Filter,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type EmptyStateVariant =
  | "default"
  | "no-cases"
  | "no-progress"
  | "no-assessments"
  | "no-search-results"
  | "no-filtered-results"
  | "no-achievements"
  | "no-users"
  | "no-data";

export interface EmptyStateProps {
  /** Preset variant */
  variant?: EmptyStateVariant;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Primary action */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Additional className */
  className?: string;
  /** Compact size */
  compact?: boolean;
}

// ============================================================================
// Variant Configs
// ============================================================================

const VARIANTS: Record<
  EmptyStateVariant,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
> = {
  default: {
    icon: <Inbox className="w-12 h-12" />,
    title: "Nothing here yet",
    description: "Content will appear here once it's available.",
  },
  "no-cases": {
    icon: <BookOpen className="w-12 h-12" />,
    title: "No cases found",
    description:
      "We couldn't find any cases matching your criteria. Try adjusting your filters or search terms.",
  },
  "no-progress": {
    icon: <BarChart3 className="w-12 h-12" />,
    title: "No progress yet",
    description:
      "Complete your first case to start tracking your progress and building your medical imaging knowledge.",
  },
  "no-assessments": {
    icon: <ClipboardList className="w-12 h-12" />,
    title: "No assessments available",
    description:
      "There are no assessments available right now. Check back soon or create a custom quiz.",
  },
  "no-search-results": {
    icon: <Search className="w-12 h-12" />,
    title: "No results found",
    description:
      'Your search didn\'t match any items. Try different keywords or check your spelling.',
  },
  "no-filtered-results": {
    icon: <Filter className="w-12 h-12" />,
    title: "No matching results",
    description:
      "No items match your current filters. Try removing some filters to see more results.",
  },
  "no-achievements": {
    icon: <Trophy className="w-12 h-12" />,
    title: "No achievements yet",
    description:
      "Complete cases and reach milestones to unlock achievements and earn badges.",
  },
  "no-users": {
    icon: <UserPlus className="w-12 h-12" />,
    title: "No users found",
    description:
      "No users match your search criteria. Try adjusting your filters.",
  },
  "no-data": {
    icon: <FolderOpen className="w-12 h-12" />,
    title: "No data available",
    description:
      "There's no data to display at the moment. Check back later.",
  },
};

// ============================================================================
// EmptyState Component
// ============================================================================

/**
 * Empty state component for displaying when content is not available.
 *
 * @example
 * ```tsx
 * // Using preset variant
 * <EmptyState
 *   variant="no-cases"
 *   action={{ label: "Clear filters", onClick: () => {} }}
 * />
 *
 * // Custom content
 * <EmptyState
 *   icon={<CustomIcon />}
 *   title="Custom Title"
 *   description="Custom description"
 * />
 * ```
 */
export function EmptyState({
  variant = "default",
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  const config = VARIANTS[variant];

  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={cn(
          "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
          compact ? "w-16 h-16 mb-4" : "w-24 h-24 mb-6"
        )}
      >
        {displayIcon}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          "font-semibold text-slate-900 dark:text-white",
          compact ? "text-lg" : "text-xl"
        )}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className={cn(
          "mt-2 text-slate-500 dark:text-slate-400 max-w-md",
          compact ? "text-sm" : "text-base"
        )}
      >
        {displayDescription}
      </motion.p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={cn(
            "flex items-center gap-3",
            compact ? "mt-4" : "mt-6"
          )}
        >
          {action && (
            <Button onClick={action.onClick} size={compact ? "sm" : "default"}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={compact ? "sm" : "default"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Preset Empty States
// ============================================================================

export function NoCasesFound({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  return (
    <EmptyState
      variant="no-cases"
      action={
        onClearFilters
          ? { label: "Clear Filters", onClick: onClearFilters }
          : undefined
      }
    />
  );
}

export function NoProgressYet({
  onStartCase,
}: {
  onStartCase?: () => void;
}) {
  return (
    <EmptyState
      variant="no-progress"
      action={
        onStartCase
          ? { label: "Start Your First Case", onClick: onStartCase }
          : undefined
      }
    />
  );
}

export function NoAssessmentsAvailable({
  onCreateQuiz,
}: {
  onCreateQuiz?: () => void;
}) {
  return (
    <EmptyState
      variant="no-assessments"
      action={
        onCreateQuiz
          ? { label: "Create Custom Quiz", onClick: onCreateQuiz }
          : undefined
      }
    />
  );
}

export function NoSearchResults({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      variant="no-search-results"
      description={
        query
          ? `No results found for "${query}". Try different keywords or check your spelling.`
          : "Your search didn't match any items. Try different keywords."
      }
      action={onClear ? { label: "Clear Search", onClick: onClear } : undefined}
    />
  );
}

export function NoFilteredResults({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  return (
    <EmptyState
      variant="no-filtered-results"
      action={
        onClearFilters
          ? { label: "Clear All Filters", onClick: onClearFilters }
          : undefined
      }
    />
  );
}

export function NoAchievementsYet() {
  return <EmptyState variant="no-achievements" />;
}
