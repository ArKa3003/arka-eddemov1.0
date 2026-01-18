// @ts-nocheck
"use client";

import * as React from "react";

// ============================================================================
// Types
// ============================================================================

export type CaseMode = "learning" | "quiz";

export interface LearningModeState {
  /** Current mode */
  mode: CaseMode;
  /** Number of hints revealed */
  hintsUsed: number;
  /** Time spent on current case (seconds) */
  timeSpent: number;
  /** Case start timestamp */
  startTime: number | null;
  /** Is timer running */
  isTimerRunning: boolean;
  /** Quiz time remaining (seconds) */
  quizTimeRemaining: number | null;
  /** Auto-save enabled */
  autoSaveEnabled: boolean;
  /** Last auto-save timestamp */
  lastAutoSave: number | null;
}

export interface LearningModeActions {
  /** Set the mode */
  setMode: (mode: CaseMode) => void;
  /** Toggle between modes */
  toggleMode: () => void;
  /** Reveal a hint */
  revealHint: () => void;
  /** Reset hints */
  resetHints: () => void;
  /** Start timer */
  startTimer: () => void;
  /** Stop timer */
  stopTimer: () => void;
  /** Reset timer */
  resetTimer: () => void;
  /** Reset all state */
  reset: () => void;
  /** Enable/disable auto-save */
  setAutoSave: (enabled: boolean) => void;
  /** Trigger manual save */
  saveProgress: () => void;
}

export interface UseLearningModeOptions {
  /** Initial mode */
  initialMode?: CaseMode;
  /** Maximum hints available */
  maxHints?: number;
  /** Quiz duration in seconds */
  quizDuration?: number;
  /** Auto-save interval in seconds */
  autoSaveInterval?: number;
  /** Callback when time runs out (quiz mode) */
  onTimeUp?: () => void;
  /** Callback for auto-save */
  onAutoSave?: (state: LearningModeState) => void;
  /** Persist mode preference */
  persistMode?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY_MODE = "arka-ed-preferred-mode";
const STORAGE_KEY_STATE = "arka-ed-learning-state";
const DEFAULT_QUIZ_DURATION = 5 * 60; // 5 minutes
const DEFAULT_AUTO_SAVE_INTERVAL = 30; // 30 seconds

// ============================================================================
// Hook
// ============================================================================

/**
 * useLearningMode - Manages learning/quiz mode state, hints, and timer.
 */
export function useLearningMode(
  options: UseLearningModeOptions = {}
): LearningModeState & LearningModeActions {
  const {
    initialMode = "learning",
    maxHints = 3,
    quizDuration = DEFAULT_QUIZ_DURATION,
    autoSaveInterval = DEFAULT_AUTO_SAVE_INTERVAL,
    onTimeUp,
    onAutoSave,
    persistMode = true,
  } = options;

  // State
  const [mode, setModeState] = React.useState<CaseMode>(initialMode);
  const [hintsUsed, setHintsUsed] = React.useState(0);
  const [timeSpent, setTimeSpent] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [quizTimeRemaining, setQuizTimeRemaining] = React.useState<number | null>(
    null
  );
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);
  const [lastAutoSave, setLastAutoSave] = React.useState<number | null>(null);

  // Refs for intervals
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load persisted mode on mount
  React.useEffect(() => {
    if (persistMode && typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_MODE) as CaseMode | null;
      if (saved && (saved === "learning" || saved === "quiz")) {
        setModeState(saved);
      }
    }
  }, [persistMode]);

  // Timer effect
  React.useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);

        // Handle quiz countdown
        if (mode === "quiz" && quizTimeRemaining !== null) {
          setQuizTimeRemaining((prev) => {
            if (prev === null || prev <= 1) {
              onTimeUp?.();
              setIsTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, mode, quizTimeRemaining, onTimeUp]);

  // Auto-save effect
  React.useEffect(() => {
    if (autoSaveEnabled && onAutoSave) {
      autoSaveRef.current = setInterval(() => {
        const state: LearningModeState = {
          mode,
          hintsUsed,
          timeSpent,
          startTime,
          isTimerRunning,
          quizTimeRemaining,
          autoSaveEnabled,
          lastAutoSave: Date.now(),
        };
        onAutoSave(state);
        setLastAutoSave(Date.now());
      }, autoSaveInterval * 1000);
    }

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [
    autoSaveEnabled,
    autoSaveInterval,
    mode,
    hintsUsed,
    timeSpent,
    startTime,
    isTimerRunning,
    quizTimeRemaining,
    onAutoSave,
  ]);

  // Actions
  const setMode = React.useCallback(
    (newMode: CaseMode) => {
      setModeState(newMode);
      if (persistMode && typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MODE, newMode);
      }

      // Reset quiz timer when switching to quiz mode
      if (newMode === "quiz") {
        setQuizTimeRemaining(quizDuration);
      } else {
        setQuizTimeRemaining(null);
      }
    },
    [persistMode, quizDuration]
  );

  const toggleMode = React.useCallback(() => {
    setMode(mode === "learning" ? "quiz" : "learning");
  }, [mode, setMode]);

  const revealHint = React.useCallback(() => {
    if (hintsUsed < maxHints && mode === "learning") {
      setHintsUsed((prev) => prev + 1);
    }
  }, [hintsUsed, maxHints, mode]);

  const resetHints = React.useCallback(() => {
    setHintsUsed(0);
  }, []);

  const startTimer = React.useCallback(() => {
    if (!isTimerRunning) {
      setStartTime(Date.now());
      setIsTimerRunning(true);

      // Initialize quiz timer
      if (mode === "quiz" && quizTimeRemaining === null) {
        setQuizTimeRemaining(quizDuration);
      }
    }
  }, [isTimerRunning, mode, quizDuration, quizTimeRemaining]);

  const stopTimer = React.useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = React.useCallback(() => {
    setIsTimerRunning(false);
    setTimeSpent(0);
    setStartTime(null);
    if (mode === "quiz") {
      setQuizTimeRemaining(quizDuration);
    }
  }, [mode, quizDuration]);

  const reset = React.useCallback(() => {
    setHintsUsed(0);
    setTimeSpent(0);
    setStartTime(null);
    setIsTimerRunning(false);
    setQuizTimeRemaining(mode === "quiz" ? quizDuration : null);
    setLastAutoSave(null);
  }, [mode, quizDuration]);

  const setAutoSave = React.useCallback((enabled: boolean) => {
    setAutoSaveEnabled(enabled);
  }, []);

  const saveProgress = React.useCallback(() => {
    if (onAutoSave) {
      const state: LearningModeState = {
        mode,
        hintsUsed,
        timeSpent,
        startTime,
        isTimerRunning,
        quizTimeRemaining,
        autoSaveEnabled,
        lastAutoSave: Date.now(),
      };
      onAutoSave(state);
      setLastAutoSave(Date.now());
    }
  }, [
    mode,
    hintsUsed,
    timeSpent,
    startTime,
    isTimerRunning,
    quizTimeRemaining,
    autoSaveEnabled,
    onAutoSave,
  ]);

  return {
    // State
    mode,
    hintsUsed,
    timeSpent,
    startTime,
    isTimerRunning,
    quizTimeRemaining,
    autoSaveEnabled,
    lastAutoSave,
    // Actions
    setMode,
    toggleMode,
    revealHint,
    resetHints,
    startTimer,
    stopTimer,
    resetTimer,
    reset,
    setAutoSave,
    saveProgress,
  };
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * useQuizTimer - Simplified quiz timer hook
 */
export function useQuizTimer(
  duration: number = DEFAULT_QUIZ_DURATION,
  onTimeUp?: () => void
) {
  const [remaining, setRemaining] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const start = React.useCallback(() => setIsRunning(true), []);
  const stop = React.useCallback(() => setIsRunning(false), []);
  const reset = React.useCallback(() => {
    setRemaining(duration);
    setIsRunning(false);
  }, [duration]);

  const formatTime = React.useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    remaining,
    isRunning,
    isExpired: remaining <= 0,
    formatted: formatTime(remaining),
    start,
    stop,
    reset,
  };
}

/**
 * useHintTracker - Simplified hint tracking hook
 */
export function useHintTracker(maxHints: number = 3) {
  const [hintsUsed, setHintsUsed] = React.useState(0);

  const reveal = React.useCallback(() => {
    if (hintsUsed < maxHints) {
      setHintsUsed((prev) => prev + 1);
    }
  }, [hintsUsed, maxHints]);

  const reset = React.useCallback(() => setHintsUsed(0), []);

  return {
    hintsUsed,
    hintsRemaining: maxHints - hintsUsed,
    canReveal: hintsUsed < maxHints,
    reveal,
    reset,
  };
}
