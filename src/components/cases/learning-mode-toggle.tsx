"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Timer,
  HelpCircle,
  Trophy,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type CaseMode = "learning" | "quiz";

export interface LearningModeToggleProps {
  /** Current mode */
  mode: CaseMode;
  /** Mode change handler */
  onModeChange: (mode: CaseMode) => void;
  /** Whether toggle is disabled */
  disabled?: boolean;
  /** Persist preference to localStorage */
  persist?: boolean;
  /** Show mode features tooltip */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Mode Features
// ============================================================================

const MODE_FEATURES = {
  learning: {
    icon: BookOpen,
    label: "Learning",
    color: "cyan",
    features: [
      { icon: Lightbulb, text: "Hints available" },
      { icon: Timer, text: "No timer pressure" },
      { icon: HelpCircle, text: "Detailed feedback" },
    ],
  },
  quiz: {
    icon: GraduationCap,
    label: "Quiz",
    color: "amber",
    features: [
      { icon: Trophy, text: "Score tracking" },
      { icon: Timer, text: "5-minute timer" },
      { icon: HelpCircle, text: "No hints" },
    ],
  },
};

// ============================================================================
// LocalStorage Key
// ============================================================================

const STORAGE_KEY = "arka-ed-preferred-mode";

// ============================================================================
// Component
// ============================================================================

/**
 * LearningModeToggle - Toggle between Learning and Quiz modes.
 * - Learning: Hints available, no timer, detailed feedback
 * - Quiz: No hints, timer, score tracking
 */
export function LearningModeToggle({
  mode,
  onModeChange,
  disabled = false,
  persist = true,
  showTooltip = true,
  className,
}: LearningModeToggleProps) {
  // Load preference from localStorage on mount
  React.useEffect(() => {
    if (persist && typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as CaseMode | null;
      if (saved && (saved === "learning" || saved === "quiz") && saved !== mode) {
        onModeChange(saved);
      }
    }
  }, []);

  // Save preference to localStorage
  const handleModeChange = (newMode: CaseMode) => {
    if (persist && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
    onModeChange(newMode);
  };

  const toggle = (
    <div
      className={cn(
        "relative flex items-center bg-slate-100 rounded-lg p-1",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Animated background */}
      <motion.div
        layout
        className={cn(
          "absolute inset-y-1 rounded-md shadow-sm",
          mode === "learning" ? "bg-cyan-100" : "bg-amber-100"
        )}
        initial={false}
        animate={{
          left: mode === "learning" ? "4px" : "50%",
          right: mode === "learning" ? "50%" : "4px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Learning Mode */}
      <button
        type="button"
        onClick={() => !disabled && handleModeChange("learning")}
        disabled={disabled}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
          mode === "learning"
            ? "text-cyan-700"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Learning</span>
      </button>

      {/* Quiz Mode */}
      <button
        type="button"
        onClick={() => !disabled && handleModeChange("quiz")}
        disabled={disabled}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
          mode === "quiz"
            ? "text-amber-700"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <GraduationCap className="w-4 h-4" />
        <span className="hidden sm:inline">Quiz</span>
      </button>
    </div>
  );

  if (!showTooltip) {
    return toggle;
  }

  const currentFeatures = MODE_FEATURES[mode];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{toggle}</TooltipTrigger>
        <TooltipContent side="bottom" className="w-48">
          <div className="space-y-2">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <currentFeatures.icon className="w-4 h-4" />
              {currentFeatures.label} Mode
            </p>
            <ul className="space-y-1">
              {currentFeatures.features.map((feature, index) => (
                <li
                  key={index}
                  className="text-xs text-slate-500 flex items-center gap-1.5"
                >
                  <feature.icon className="w-3 h-3" />
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Compact Variant
// ============================================================================

export interface LearningModeToggleCompactProps {
  mode: CaseMode;
  onModeChange: (mode: CaseMode) => void;
  disabled?: boolean;
  persist?: boolean;
  className?: string;
}

export function LearningModeToggleCompact({
  mode,
  onModeChange,
  disabled = false,
  persist = true,
  className,
}: LearningModeToggleCompactProps) {
  const nextMode = mode === "learning" ? "quiz" : "learning";

  const handleClick = () => {
    if (disabled) return;
    if (persist && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, nextMode);
    }
    onModeChange(nextMode);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium transition-colors",
        mode === "learning"
          ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
          : "bg-amber-100 text-amber-700 hover:bg-amber-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {mode === "learning" ? (
        <>
          <BookOpen className="w-4 h-4" />
          Learning
        </>
      ) : (
        <>
          <GraduationCap className="w-4 h-4" />
          Quiz
        </>
      )}
    </button>
  );
}

// ============================================================================
// Mode Info Card
// ============================================================================

export interface ModeInfoCardProps {
  mode: CaseMode;
  className?: string;
}

export function ModeInfoCard({ mode, className }: ModeInfoCardProps) {
  const config = MODE_FEATURES[mode];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg p-4 border",
        mode === "learning"
          ? "bg-cyan-50 border-cyan-200"
          : "bg-amber-50 border-amber-200",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon
          className={cn(
            "w-5 h-5",
            mode === "learning" ? "text-cyan-600" : "text-amber-600"
          )}
        />
        <h4
          className={cn(
            "font-semibold",
            mode === "learning" ? "text-cyan-700" : "text-amber-700"
          )}
        >
          {config.label} Mode
        </h4>
      </div>
      <ul className="space-y-2">
        {config.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
            <feature.icon className="w-4 h-4 text-slate-400" />
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
