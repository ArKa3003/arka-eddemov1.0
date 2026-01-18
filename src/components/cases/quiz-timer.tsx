// @ts-nocheck
"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Timer, AlertTriangle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface QuizTimerProps {
  /** Duration in seconds */
  duration: number;
  /** Callback when timer expires */
  onTimeUp?: () => void;
  /** Callback for each tick */
  onTick?: (remaining: number) => void;
  /** Auto-start on mount */
  autoStart?: boolean;
  /** Allow pause/resume */
  allowPause?: boolean;
  /** Warning threshold in seconds */
  warningThreshold?: number;
  /** Danger threshold in seconds */
  dangerThreshold?: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * QuizTimer - Countdown timer for quiz mode with visual feedback.
 */
export function QuizTimer({
  duration,
  onTimeUp,
  onTick,
  autoStart = true,
  allowPause = false,
  warningThreshold = 60,
  dangerThreshold = 30,
  className,
}: QuizTimerProps) {
  const [remaining, setRemaining] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const [hasStarted, setHasStarted] = React.useState(autoStart);

  // Timer effect
  React.useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);

        if (next <= 0) {
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining, onTick, onTimeUp]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Determine color based on remaining time
  const getColorClasses = () => {
    if (remaining <= dangerThreshold) {
      return {
        bg: "bg-rose-100",
        text: "text-rose-700",
        ring: "ring-rose-500",
        icon: "text-rose-500",
      };
    }
    if (remaining <= warningThreshold) {
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        ring: "ring-amber-500",
        icon: "text-amber-500",
      };
    }
    return {
      bg: "bg-slate-100",
      text: "text-slate-700",
      ring: "ring-slate-300",
      icon: "text-slate-500",
    };
  };

  const colors = getColorClasses();
  const progressPercentage = (remaining / duration) * 100;

  // Start timer
  const start = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  // Pause/Resume
  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  // Reset
  const reset = () => {
    setRemaining(duration);
    setIsRunning(false);
    setHasStarted(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Timer Display */}
      <motion.div
        animate={remaining <= dangerThreshold ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-semibold",
          colors.bg,
          colors.text
        )}
      >
        <Timer className={cn("w-4 h-4", colors.icon)} />
        <span className="min-w-[48px] text-center">{formatTime(remaining)}</span>

        {/* Warning indicator */}
        {remaining <= dangerThreshold && remaining > 0 && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Pause/Resume Button (if allowed) */}
      {allowPause && hasStarted && remaining > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePause}
          className="w-8 h-8 p-0"
        >
          {isRunning ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
      )}

      {/* Start Button (if not auto-start) */}
      {!autoStart && !hasStarted && (
        <Button variant="default" size="sm" onClick={start}>
          Start Timer
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Circular Timer Variant
// ============================================================================

export interface CircularTimerProps {
  duration: number;
  remaining: number;
  size?: number;
  strokeWidth?: number;
  showTime?: boolean;
  className?: string;
}

export function CircularTimer({
  duration,
  remaining,
  size = 60,
  strokeWidth = 4,
  showTime = true,
  className,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / duration;
  const offset = circumference * (1 - progress);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get color based on remaining time
  const getColor = () => {
    if (remaining <= 30) return "#ef4444"; // rose-500
    if (remaining <= 60) return "#f59e0b"; // amber-500
    return "#64748b"; // slate-500
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      {/* Center time */}
      {showTime && (
        <span className="absolute text-xs font-mono font-semibold text-slate-700">
          {formatTime(remaining)}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Compact Timer Badge
// ============================================================================

export interface TimerBadgeProps {
  remaining: number;
  className?: string;
}

export function TimerBadge({ remaining, className }: TimerBadgeProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isDanger = remaining <= 30;
  const isWarning = remaining <= 60 && remaining > 30;

  return (
    <motion.span
      animate={isDanger ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold",
        isDanger
          ? "bg-rose-100 text-rose-700"
          : isWarning
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-100 text-slate-700",
        className
      )}
    >
      <Timer className="w-3 h-3" />
      {formatTime(remaining)}
    </motion.span>
  );
}

// ============================================================================
// Time's Up Modal
// ============================================================================

export interface TimeUpModalProps {
  isOpen: boolean;
  onSubmit: () => void;
  className?: string;
}

export function TimeUpModal({ isOpen, onSubmit, className }: TimeUpModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-xl",
          className
        )}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center"
        >
          <Timer className="w-8 h-8 text-rose-500" />
        </motion.div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">Time&apos;s Up!</h3>
        <p className="text-slate-600 mb-6">
          Your quiz time has expired. Your current selection will be submitted.
        </p>

        <Button onClick={onSubmit} className="w-full">
          Submit Answers
        </Button>
      </motion.div>
    </motion.div>
  );
}
