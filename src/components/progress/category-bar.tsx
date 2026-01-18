// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CategoryData {
  category: CaseCategory;
  label: string;
  attempted: number;
  correct: number;
  total: number;
  icon?: string;
}

export interface CategoryBarProps {
  /** Category data */
  category: CategoryData;
  /** Animation index for staggered reveal */
  index?: number;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export interface CategoryBreakdownProps {
  /** Array of category data */
  categories: CategoryData[];
  /** Title */
  title?: string;
  /** Click handler for categories */
  onCategoryClick?: (category: CaseCategory) => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const CATEGORY_ICONS: Record<CaseCategory, string> = {
  "low-back-pain": "🦴",
  headache: "🧠",
  "chest-pain": "❤️",
  "abdominal-pain": "🩺",
  "extremity-trauma": "🦵",
};

// ============================================================================
// Single Category Bar
// ============================================================================

export function CategoryBar({
  category,
  index = 0,
  onClick,
  className,
}: CategoryBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedWidth, setAnimatedWidth] = React.useState(0);

  const accuracy = category.attempted > 0
    ? Math.round((category.correct / category.attempted) * 100)
    : 0;

  const attemptedPercent = category.total > 0
    ? (category.attempted / category.total) * 100
    : 0;

  // Determine color based on performance
  const getColor = () => {
    if (accuracy >= 80) return { bg: "bg-emerald-500", text: "text-emerald-600" };
    if (accuracy >= 60) return { bg: "bg-amber-500", text: "text-amber-600" };
    return { bg: "bg-rose-500", text: "text-rose-600" };
  };

  const colors = getColor();

  // Animate bar width
  React.useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setAnimatedWidth(attemptedPercent);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [isInView, attemptedPercent, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group cursor-pointer",
        onClick && "hover:bg-slate-50 rounded-lg transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {category.icon || CATEGORY_ICONS[category.category]}
            </span>
            <span className="font-medium text-slate-900">{category.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={cn("font-semibold", colors.text)}>
                {accuracy}%
              </span>
              <span className="text-xs text-slate-500 ml-1">accuracy</span>
            </div>
            {onClick && (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className={cn("absolute inset-y-0 left-0 rounded-full", colors.bg)}
            initial={{ width: 0 }}
            animate={{ width: `${animatedWidth}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>
            {category.correct} correct / {category.attempted} attempted
          </span>
          <span>{category.total} total cases</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Category Breakdown Card
// ============================================================================

export function CategoryBreakdown({
  categories,
  title = "Performance by Category",
  onCategoryClick,
  className,
}: CategoryBreakdownProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-slate-100">
          {categories.map((cat, index) => (
            <CategoryBar
              key={cat.category}
              category={cat}
              index={index}
              onClick={
                onCategoryClick
                  ? () => onCategoryClick(cat.category)
                  : undefined
              }
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Mini Category Bar (for compact views)
// ============================================================================

export interface MiniCategoryBarProps {
  label: string;
  value: number;
  max?: number;
  color?: "cyan" | "emerald" | "amber" | "rose" | "violet";
  className?: string;
}

export function MiniCategoryBar({
  label,
  value,
  max = 100,
  color = "cyan",
  className,
}: MiniCategoryBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses = {
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    violet: "bg-violet-500",
  };

  return (
    <div ref={ref} className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
