// @ts-nocheck
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Clock,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Play,
  Save,
  Sparkles,
  Target,
  FileText,
  Settings,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LinearProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel, SpecialtyTrack } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface QuizConfig {
  title: string;
  categories: CaseCategory[];
  caseCount: number;
  difficultyMix: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  timeLimit: number | null;
  randomize: boolean;
  specialty: SpecialtyTrack | "all";
}

export interface QuizBuilderProps {
  /** Current step (0-3) */
  currentStep: number;
  /** Quiz configuration */
  config: QuizConfig;
  /** Update configuration */
  onConfigChange: (config: Partial<QuizConfig>) => void;
  /** Go to next step */
  onNext: () => void;
  /** Go to previous step */
  onPrevious: () => void;
  /** Start the quiz */
  onStart: () => void;
  /** Save quiz template */
  onSave?: () => void;
  /** Available case counts per category */
  categoryCounts: Record<CaseCategory, number>;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const STEPS = [
  { title: "Select Topics", icon: FileText },
  { title: "Set Parameters", icon: Settings },
  { title: "Specialty Focus", icon: Target },
  { title: "Review & Start", icon: Sparkles },
];

const CATEGORIES: { value: CaseCategory; label: string; icon: string }[] = [
  { value: "low-back-pain", label: "Low Back Pain", icon: "🦴" },
  { value: "headache", label: "Headache", icon: "🧠" },
  { value: "chest-pain", label: "Chest Pain", icon: "❤️" },
  { value: "abdominal-pain", label: "Abdominal Pain", icon: "🩺" },
  { value: "extremity-trauma", label: "Extremity Trauma", icon: "🦵" },
];

const SPECIALTIES: { value: SpecialtyTrack | "all"; label: string; color: string }[] = [
  { value: "all", label: "All Specialties", color: "slate" },
  { value: "em", label: "Emergency Medicine", color: "rose" },
  { value: "im", label: "Internal Medicine", color: "blue" },
  { value: "fm", label: "Family Medicine", color: "emerald" },
  { value: "surgery", label: "Surgery", color: "violet" },
  { value: "peds", label: "Pediatrics", color: "teal" },
];

// ============================================================================
// Main Component
// ============================================================================

export function QuizBuilder({
  currentStep,
  config,
  onConfigChange,
  onNext,
  onPrevious,
  onStart,
  onSave,
  categoryCounts,
  className,
}: QuizBuilderProps) {
  const totalAvailableCases = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const selectedCategoryCount = config.categories.reduce(
    (sum, cat) => sum + (categoryCounts[cat] || 0),
    0
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Indicator */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <Step1Topics
              categories={config.categories}
              categoryCounts={categoryCounts}
              onChange={(categories) => onConfigChange({ categories })}
            />
          )}

          {currentStep === 1 && (
            <Step2Parameters
              caseCount={config.caseCount}
              maxCases={selectedCategoryCount || totalAvailableCases}
              difficultyMix={config.difficultyMix}
              timeLimit={config.timeLimit}
              randomize={config.randomize}
              onChange={onConfigChange}
            />
          )}

          {currentStep === 2 && (
            <Step3Specialty
              specialty={config.specialty}
              onChange={(specialty) => onConfigChange({ specialty })}
            />
          )}

          {currentStep === 3 && (
            <Step4Review
              config={config}
              categoryCounts={categoryCounts}
              onSave={onSave}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          variant="default"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        {currentStep < 3 ? (
          <Button onClick={onNext} disabled={currentStep === 0 && config.categories.length === 0}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={onStart}>
            <Play className="w-4 h-4 mr-2" />
            Start Quiz
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Step Indicator
// ============================================================================

interface StepIndicatorProps {
  currentStep: number;
  steps: typeof STEPS;
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.title}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-cyan-500 text-white",
                  isCompleted && "bg-emerald-500 text-white",
                  !isActive && !isCompleted && "bg-slate-200 text-slate-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-xs mt-1 hidden sm:block",
                  isActive && "text-cyan-600 font-medium",
                  isCompleted && "text-emerald-600",
                  !isActive && !isCompleted && "text-slate-500"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentStep ? "bg-emerald-500" : "bg-slate-200"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================================
// Step 1: Select Topics
// ============================================================================

interface Step1TopicsProps {
  categories: CaseCategory[];
  categoryCounts: Record<CaseCategory, number>;
  onChange: (categories: CaseCategory[]) => void;
}

function Step1Topics({ categories, categoryCounts, onChange }: Step1TopicsProps) {
  const allSelected = categories.length === CATEGORIES.length;

  const toggleCategory = (category: CaseCategory) => {
    if (categories.includes(category)) {
      onChange(categories.filter((c) => c !== category));
    } else {
      onChange([...categories, category]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(CATEGORIES.map((c) => c.value));
    }
  };

  const selectedCount = categories.reduce(
    (sum, cat) => sum + (categoryCounts[cat] || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Topics</CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <p className="text-sm text-slate-500">
          Choose the categories you want to practice
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.value] || 0;
          const isSelected = categories.includes(cat.value);

          return (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border transition-all",
                isSelected
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-slate-900">{cat.label}</p>
                  <p className="text-sm text-slate-500">{count} cases available</p>
                </div>
              </div>
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-cyan-500" />
              ) : (
                <Square className="w-5 h-5 text-slate-300" />
              )}
            </button>
          );
        })}

        {/* Coverage Preview */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Coverage</span>
            <span className="font-medium">
              {selectedCount} cases available from selected topics
            </span>
          </div>
          <div className="flex gap-1 h-2">
            {CATEGORIES.map((cat) => {
              const isSelected = categories.includes(cat.value);
              const width = ((categoryCounts[cat.value] || 0) / 50) * 100;
              return (
                <div
                  key={cat.value}
                  className={cn(
                    "h-full rounded-full transition-colors",
                    isSelected ? "bg-cyan-500" : "bg-slate-200"
                  )}
                  style={{ width: `${Math.max(width, 5)}%` }}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Step 2: Set Parameters
// ============================================================================

interface Step2ParametersProps {
  caseCount: number;
  maxCases: number;
  difficultyMix: { beginner: number; intermediate: number; advanced: number };
  timeLimit: number | null;
  randomize: boolean;
  onChange: (changes: Partial<QuizConfig>) => void;
}

function Step2Parameters({
  caseCount,
  maxCases,
  difficultyMix,
  timeLimit,
  randomize,
  onChange,
}: Step2ParametersProps) {
  const updateDifficultyMix = (
    key: keyof typeof difficultyMix,
    value: number
  ) => {
    // Ensure total is 100%
    const others = Object.entries(difficultyMix)
      .filter(([k]) => k !== key)
      .reduce((sum, [, v]) => sum + v, 0);

    const newValue = Math.min(value, 100 - (others > 0 ? 10 : 0)); // Keep at least 10% for others
    const remainder = 100 - newValue;

    const otherKeys = Object.keys(difficultyMix).filter(
      (k) => k !== key
    ) as (keyof typeof difficultyMix)[];
    const otherTotal = otherKeys.reduce((sum, k) => sum + difficultyMix[k], 0);

    const newMix = { ...difficultyMix, [key]: newValue };

    // Redistribute remainder proportionally
    if (otherTotal > 0) {
      otherKeys.forEach((k) => {
        newMix[k] = Math.round((difficultyMix[k] / otherTotal) * remainder);
      });
    } else {
      // Split evenly if others are 0
      const perOther = Math.round(remainder / otherKeys.length);
      otherKeys.forEach((k, i) => {
        newMix[k] = i === otherKeys.length - 1 ? remainder - perOther * (otherKeys.length - 1) : perOther;
      });
    }

    onChange({ difficultyMix: newMix });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Parameters</CardTitle>
        <p className="text-sm text-slate-500">
          Customize your quiz settings
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Number of Cases */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Number of Cases: {caseCount}
          </label>
          <input
            type="range"
            min={5}
            max={Math.min(30, maxCases)}
            value={caseCount}
            onChange={(e) => onChange({ caseCount: parseInt(e.target.value) })}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>5</span>
            <span>{Math.min(30, maxCases)}</span>
          </div>
        </div>

        {/* Difficulty Mix */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-3 block">
            Difficulty Mix
          </label>
          <div className="space-y-4">
            {/* Beginner */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-emerald-600 font-medium">
                  Beginner
                </span>
                <span className="text-sm font-semibold">
                  {difficultyMix.beginner}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={difficultyMix.beginner}
                onChange={(e) =>
                  updateDifficultyMix("beginner", parseInt(e.target.value))
                }
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Intermediate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-amber-600 font-medium">
                  Intermediate
                </span>
                <span className="text-sm font-semibold">
                  {difficultyMix.intermediate}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={difficultyMix.intermediate}
                onChange={(e) =>
                  updateDifficultyMix("intermediate", parseInt(e.target.value))
                }
                className="w-full accent-amber-500"
              />
            </div>

            {/* Advanced */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-rose-600 font-medium">
                  Advanced
                </span>
                <span className="text-sm font-semibold">
                  {difficultyMix.advanced}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={difficultyMix.advanced}
                onChange={(e) =>
                  updateDifficultyMix("advanced", parseInt(e.target.value))
                }
                className="w-full accent-rose-500"
              />
            </div>

            {/* Visual Bar */}
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${difficultyMix.beginner}%` }}
              />
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${difficultyMix.intermediate}%` }}
              />
              <div
                className="bg-rose-500 transition-all"
                style={{ width: `${difficultyMix.advanced}%` }}
              />
            </div>
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              Time Limit
            </label>
            <Switch
              checked={timeLimit !== null}
              onCheckedChange={(checked) =>
                onChange({ timeLimit: checked ? 15 : null })
              }
            />
          </div>
          {timeLimit !== null && (
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <input
                type="range"
                min={5}
                max={60}
                value={timeLimit}
                onChange={(e) =>
                  onChange({ timeLimit: parseInt(e.target.value) })
                }
                className="flex-1 accent-cyan-500"
              />
              <span className="text-sm font-medium w-16">{timeLimit} min</span>
            </div>
          )}
        </div>

        {/* Randomize */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-slate-500" />
            <label className="text-sm font-medium text-slate-700">
              Randomize Order
            </label>
          </div>
          <Switch
            checked={randomize}
            onCheckedChange={(checked) => onChange({ randomize: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Step 3: Specialty Focus
// ============================================================================

interface Step3SpecialtyProps {
  specialty: SpecialtyTrack | "all";
  onChange: (specialty: SpecialtyTrack | "all") => void;
}

function Step3Specialty({ specialty, onChange }: Step3SpecialtyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialty Focus</CardTitle>
        <p className="text-sm text-slate-500">
          Optional: Focus on a specific specialty track
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SPECIALTIES.map((spec) => {
            const isSelected = specialty === spec.value;
            return (
              <button
                key={spec.value}
                onClick={() => onChange(spec.value)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all",
                  isSelected
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <p className="font-medium text-slate-900">{spec.label}</p>
                {spec.value !== "all" && (
                  <Badge
                    size="sm"
                    className="mt-2"
                    variant={spec.value as any}
                  >
                    {spec.value.toUpperCase()}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Step 4: Review & Start
// ============================================================================

interface Step4ReviewProps {
  config: QuizConfig;
  categoryCounts: Record<CaseCategory, number>;
  onSave?: () => void;
}

function Step4Review({ config, categoryCounts, onSave }: Step4ReviewProps) {
  const estimatedTime = config.timeLimit || Math.round(config.caseCount * 2.5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Quiz</CardTitle>
        <p className="text-sm text-slate-500">
          Confirm your selections before starting
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quiz Name */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Quiz Name (optional)
          </label>
          <Input
            placeholder="My Custom Quiz"
            value={config.title}
            onChange={(e) => {}}
          />
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
          {/* Topics */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Topics</p>
            <div className="flex flex-wrap gap-1">
              {config.categories.map((cat) => (
                <Badge key={cat} variant="default" size="sm">
                  {CATEGORIES.find((c) => c.value === cat)?.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {config.caseCount}
              </p>
              <p className="text-xs text-slate-500">Cases</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {config.timeLimit ? `${config.timeLimit}m` : "∞"}
              </p>
              <p className="text-xs text-slate-500">Time Limit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                ~{estimatedTime}m
              </p>
              <p className="text-xs text-slate-500">Est. Duration</p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Difficulty Mix</p>
            <div className="flex h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500"
                style={{ width: `${config.difficultyMix.beginner}%` }}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${config.difficultyMix.intermediate}%` }}
              />
              <div
                className="bg-rose-500"
                style={{ width: `${config.difficultyMix.advanced}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-emerald-600">
                {config.difficultyMix.beginner}% Beginner
              </span>
              <span className="text-amber-600">
                {config.difficultyMix.intermediate}% Int.
              </span>
              <span className="text-rose-600">
                {config.difficultyMix.advanced}% Adv.
              </span>
            </div>
          </div>

          {/* Specialty */}
          {config.specialty !== "all" && (
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Specialty Focus</p>
              <Badge variant={config.specialty as any}>
                {SPECIALTIES.find((s) => s.value === config.specialty)?.label}
              </Badge>
            </div>
          )}

          {/* Options */}
          <div className="pt-3 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
            {config.randomize && (
              <span className="flex items-center gap-1">
                <Shuffle className="w-3 h-3" />
                Randomized
              </span>
            )}
            {config.timeLimit && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Timed
              </span>
            )}
          </div>
        </div>

        {/* Save Button */}
        {onSave && (
          <Button variant="default" onClick={onSave} className="w-full">
            <Bookmark className="w-4 h-4 mr-2" />
            Save Quiz Template
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Saved Quizzes Section
// ============================================================================

export interface SavedQuiz {
  id: string;
  title: string;
  config: QuizConfig;
  createdAt: string;
}

interface SavedQuizzesSectionProps {
  quizzes: SavedQuiz[];
  onSelect: (quiz: SavedQuiz) => void;
  onDelete: (id: string) => void;
}

export function SavedQuizzesSection({
  quizzes,
  onSelect,
  onDelete,
}: SavedQuizzesSectionProps) {
  if (quizzes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-cyan-500" />
          My Saved Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-slate-900 text-sm">
                {quiz.title || "Untitled Quiz"}
              </p>
              <p className="text-xs text-slate-500">
                {quiz.config.caseCount} cases •{" "}
                {quiz.config.categories.length} topics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => onSelect(quiz)}>
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(quiz.id)}
                className="text-slate-400 hover:text-rose-500"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
