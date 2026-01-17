"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { BookCheck, Target, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ProgressSummaryProps {
  /** Total cases completed */
  casesCompleted: number;
  /** Total cases available */
  totalCases: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Current streak in days */
  streakDays: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ProgressSummary - Animated progress stats display.
 * Shows cases completed, accuracy, and streak with count-up animations.
 */
export function ProgressSummary({
  casesCompleted,
  totalCases,
  accuracy,
  streakDays,
  className,
}: ProgressSummaryProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-3 gap-4",
        className
      )}
    >
      {/* Cases Completed */}
      <StatCard
        icon={BookCheck}
        iconColor="text-cyan-500"
        iconBg="bg-cyan-500/10"
        label="Cases Completed"
        value={casesCompleted}
        total={totalCases}
        suffix={`/${totalCases}`}
        animate={isInView}
        delay={0}
      />

      {/* Accuracy */}
      <StatCard
        icon={Target}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-500/10"
        label="Accuracy"
        value={accuracy}
        suffix="%"
        animate={isInView}
        delay={0.1}
      />

      {/* Streak */}
      <StatCard
        icon={Flame}
        iconColor="text-amber-500"
        iconBg="bg-amber-500/10"
        label="Day Streak"
        value={streakDays}
        suffix=" days"
        animate={isInView}
        delay={0.2}
      />
    </motion.div>
  );
}

// ============================================================================
// Stat Card Component
// ============================================================================

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number;
  total?: number;
  suffix?: string;
  animate: boolean;
  delay: number;
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  total,
  suffix = "",
  animate,
  delay,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!animate) return;

    const duration = 1000;
    const startTime = Date.now();
    const startDelay = delay * 1000;

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - startDelay;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(eased * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, startDelay);

    return () => clearTimeout(timer);
  }, [animate, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900">
          {displayValue}
        </span>
        <span className="text-slate-500 text-sm">{suffix}</span>
      </div>

      {/* Progress bar for cases completed */}
      {total && (
        <div className="mt-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={animate ? { width: `${(value / total) * 100}%` } : {}}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Skeleton
// ============================================================================

export function ProgressSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
          </div>
          <div className="w-20 h-8 bg-slate-200 rounded mb-3" />
          <div className="h-1.5 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
