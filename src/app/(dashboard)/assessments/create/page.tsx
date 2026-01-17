"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuizBuilder,
  SavedQuizzesSection,
  type QuizConfig,
  type SavedQuiz,
} from "@/components/assessments/quiz-builder";
import type { CaseCategory } from "@/types/database";

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CATEGORY_COUNTS: Record<CaseCategory, number> = {
  "low-back-pain": 12,
  headache: 10,
  "chest-pain": 15,
  "abdominal-pain": 18,
  "extremity-trauma": 8,
};

const MOCK_SAVED_QUIZZES: SavedQuiz[] = [
  {
    id: "1",
    title: "Quick EM Review",
    config: {
      title: "Quick EM Review",
      categories: ["chest-pain", "abdominal-pain"],
      caseCount: 10,
      difficultyMix: { beginner: 30, intermediate: 50, advanced: 20 },
      timeLimit: 15,
      randomize: true,
      specialty: "em",
    },
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Advanced Practice",
    config: {
      title: "Advanced Practice",
      categories: ["headache", "chest-pain", "extremity-trauma"],
      caseCount: 15,
      difficultyMix: { beginner: 10, intermediate: 40, advanced: 50 },
      timeLimit: 30,
      randomize: true,
      specialty: "all",
    },
    createdAt: "2026-01-10",
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function CreateQuizPage() {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = React.useState(0);
  const [config, setConfig] = React.useState<QuizConfig>({
    title: "",
    categories: [],
    caseCount: 10,
    difficultyMix: { beginner: 33, intermediate: 34, advanced: 33 },
    timeLimit: null,
    randomize: true,
    specialty: "all",
  });

  // Saved quizzes (would come from API/localStorage)
  const [savedQuizzes, setSavedQuizzes] = React.useState<SavedQuiz[]>(
    MOCK_SAVED_QUIZZES
  );

  /**
   * Update configuration
   */
  const handleConfigChange = (changes: Partial<QuizConfig>) => {
    setConfig((prev) => ({ ...prev, ...changes }));
  };

  /**
   * Go to next step
   */
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /**
   * Go to previous step
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * Start the quiz
   */
  const handleStart = () => {
    // Generate quiz ID and navigate to quiz page
    const quizId = `custom-${Date.now()}`;
    
    // In production, this would create the quiz in the database
    // and navigate to the quiz taking page
    console.log("Starting quiz with config:", config);
    
    // For now, navigate to a mock quiz
    router.push(`/assessments/${quizId}`);
  };

  /**
   * Save quiz template
   */
  const handleSave = () => {
    const newQuiz: SavedQuiz = {
      id: `saved-${Date.now()}`,
      title: config.title || "Untitled Quiz",
      config,
      createdAt: new Date().toISOString(),
    };

    setSavedQuizzes((prev) => [newQuiz, ...prev]);

    // In production, this would save to the database
    // Also save to localStorage as backup
    localStorage.setItem(
      "arka-ed-saved-quizzes",
      JSON.stringify([newQuiz, ...savedQuizzes])
    );
  };

  /**
   * Load a saved quiz
   */
  const handleSelectSavedQuiz = (quiz: SavedQuiz) => {
    setConfig(quiz.config);
    setCurrentStep(3); // Go to review step
  };

  /**
   * Delete a saved quiz
   */
  const handleDeleteSavedQuiz = (id: string) => {
    setSavedQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/assessments")}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Create Custom Quiz
          </h1>
          <p className="text-slate-600">
            Build a personalized assessment to practice specific topics
          </p>
        </motion.div>

        {/* Saved Quizzes */}
        {savedQuizzes.length > 0 && currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SavedQuizzesSection
              quizzes={savedQuizzes}
              onSelect={handleSelectSavedQuiz}
              onDelete={handleDeleteSavedQuiz}
            />
          </motion.div>
        )}

        {/* Quiz Builder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuizBuilder
            currentStep={currentStep}
            config={config}
            onConfigChange={handleConfigChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onStart={handleStart}
            onSave={handleSave}
            categoryCounts={MOCK_CATEGORY_COUNTS}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

