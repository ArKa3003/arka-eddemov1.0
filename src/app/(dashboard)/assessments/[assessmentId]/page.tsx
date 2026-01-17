"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  FileText,
  Target,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClinicalVignette } from "@/components/cases/clinical-vignette";
import { OrderingInterface } from "@/components/cases/ordering-interface";
import {
  QuizProgress,
  QuizProgressCompact,
  FlagToggle,
  QuizNavigation,
  type CaseStatus,
} from "@/components/assessments/quiz-progress";
import { QuizTimer, TimerBadge, TimeUpModal } from "@/components/cases/quiz-timer";
import {
  ResultsBreakdown,
  type CategoryScore,
  type DifficultyScore,
  type CaseResult,
} from "@/components/assessments/results-breakdown";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type AssessmentState = "start" | "in_progress" | "completed";

interface CaseAnswer {
  caseId: string;
  selectedImaging: string[];
  flagged: boolean;
  timeSpent: number;
}

// ============================================================================
// Mock Data (would come from API/props in production)
// ============================================================================

const MOCK_ASSESSMENT = {
  id: "1",
  title: "Emergency Medicine Imaging Assessment",
  description:
    "Test your knowledge of appropriate imaging orders in emergency medicine scenarios. This assessment covers common presentations including chest pain, abdominal pain, and trauma.",
  case_ids: ["case-1", "case-2", "case-3", "case-4", "case-5"],
  time_limit_minutes: 25,
  passing_score: 70,
  specialty_track: "em" as const,
  difficulty: "intermediate" as const,
};

const MOCK_CASES = [
  {
    id: "case-1",
    title: "Chest Pain Evaluation",
    slug: "chest-pain-1",
    chief_complaint: "Sharp chest pain that worsens with breathing",
    clinical_vignette:
      "A 45-year-old male presents to the ED with acute onset of sharp, left-sided chest pain that started 2 hours ago. The pain worsens with deep inspiration and is partially relieved by leaning forward. He denies any recent trauma or surgery.",
    patient_age: 45,
    patient_sex: "male" as const,
    patient_history: ["Hypertension", "Type 2 Diabetes"],
    vital_signs: {
      heart_rate: 92,
      blood_pressure_systolic: 148,
      blood_pressure_diastolic: 92,
      respiratory_rate: 20,
      temperature: 37.2,
      temperature_unit: "celsius" as const,
      oxygen_saturation: 96,
    },
    physical_exam: "Cardiac exam reveals a pericardial friction rub.",
    lab_results: null,
    category: "chest-pain" as const,
    specialty_tags: ["em" as const],
    difficulty: "intermediate" as const,
    acr_topic: "Chest Pain",
    optimal_imaging: ["echocardiogram"],
    explanation: "Echocardiography is the imaging of choice for suspected pericarditis.",
    teaching_points: [
      "Pericardial friction rub is pathognomonic for pericarditis",
      "ECG changes precede imaging in acute pericarditis",
    ],
    clinical_pearls: null,
    hints: null,
    references: [],
    is_published: true,
    created_at: "",
    updated_at: "",
  },
];

const MOCK_IMAGING_OPTIONS = [
  {
    id: "chest-xray",
    name: "Chest X-ray",
    short_name: "CXR",
    modality: "xray" as const,
    body_region: "chest",
    with_contrast: false,
    typical_cost_usd: 150,
    radiation_msv: 0.1,
    description: "Standard chest radiograph",
    common_indications: ["Pneumonia", "Heart failure"],
    contraindications: [],
    duration: "5 minutes",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ct-chest",
    name: "CT Chest with Contrast",
    short_name: "CT Chest w/",
    modality: "ct" as const,
    body_region: "chest",
    with_contrast: true,
    typical_cost_usd: 1200,
    radiation_msv: 7,
    description: "CT of chest with IV contrast",
    common_indications: ["PE", "Aortic dissection"],
    contraindications: ["Contrast allergy"],
    duration: "15 minutes",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "echocardiogram",
    name: "Transthoracic Echocardiogram",
    short_name: "TTE",
    modality: "ultrasound" as const,
    body_region: "heart",
    with_contrast: false,
    typical_cost_usd: 800,
    radiation_msv: 0,
    description: "Ultrasound of the heart",
    common_indications: ["Pericarditis", "Heart failure"],
    contraindications: [],
    duration: "30 minutes",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentPage({
  params,
}: {
  params: { assessmentId: string };
}) {
  const router = useRouter();

  // State
  const [state, setState] = React.useState<AssessmentState>("start");
  const [currentCaseIndex, setCurrentCaseIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Map<string, CaseAnswer>>(new Map());
  const [selectedImaging, setSelectedImaging] = React.useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = React.useState(
    MOCK_ASSESSMENT.time_limit_minutes * 60
  );
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = React.useState(false);
  const [caseStartTime, setCaseStartTime] = React.useState(Date.now());

  // Current case
  const currentCase = MOCK_CASES[currentCaseIndex] || MOCK_CASES[0];
  const totalCases = MOCK_ASSESSMENT.case_ids.length;
  const isLastCase = currentCaseIndex === totalCases - 1;

  // Case statuses for progress bar
  const caseStatuses: CaseStatus[] = React.useMemo(() => {
    return MOCK_ASSESSMENT.case_ids.map((caseId, index) => {
      const answer = answers.get(caseId);
      return {
        index,
        answered: !!answer && answer.selectedImaging.length > 0,
        flagged: answer?.flagged || false,
        current: index === currentCaseIndex,
      };
    });
  }, [answers, currentCaseIndex]);

  // Timer effect
  React.useEffect(() => {
    if (!timerRunning || state !== "in_progress") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowTimeUpModal(true);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, state]);

  /**
   * Start assessment
   */
  const handleStart = () => {
    setState("in_progress");
    setTimerRunning(true);
    setCaseStartTime(Date.now());
  };

  /**
   * Save current answer and navigate
   */
  const saveCurrentAnswer = () => {
    const timeSpent = Math.floor((Date.now() - caseStartTime) / 1000);
    const existingAnswer = answers.get(currentCase.id);

    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentCase.id, {
        caseId: currentCase.id,
        selectedImaging,
        flagged: existingAnswer?.flagged || false,
        timeSpent: (existingAnswer?.timeSpent || 0) + timeSpent,
      });
      return newAnswers;
    });
  };

  /**
   * Go to previous case
   */
  const handlePrevious = () => {
    if (currentCaseIndex > 0) {
      saveCurrentAnswer();
      setCurrentCaseIndex((prev) => prev - 1);
      const prevAnswer = answers.get(MOCK_ASSESSMENT.case_ids[currentCaseIndex - 1]);
      setSelectedImaging(prevAnswer?.selectedImaging || []);
      setCaseStartTime(Date.now());
    }
  };

  /**
   * Go to next case
   */
  const handleNext = () => {
    if (currentCaseIndex < totalCases - 1) {
      saveCurrentAnswer();
      setCurrentCaseIndex((prev) => prev + 1);
      const nextAnswer = answers.get(MOCK_ASSESSMENT.case_ids[currentCaseIndex + 1]);
      setSelectedImaging(nextAnswer?.selectedImaging || []);
      setCaseStartTime(Date.now());
    }
  };

  /**
   * Navigate to specific case
   */
  const handleCaseClick = (index: number) => {
    if (index !== currentCaseIndex) {
      saveCurrentAnswer();
      setCurrentCaseIndex(index);
      const caseAnswer = answers.get(MOCK_ASSESSMENT.case_ids[index]);
      setSelectedImaging(caseAnswer?.selectedImaging || []);
      setCaseStartTime(Date.now());
    }
  };

  /**
   * Toggle flag for current case
   */
  const handleToggleFlag = () => {
    const existingAnswer = answers.get(currentCase.id);
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentCase.id, {
        caseId: currentCase.id,
        selectedImaging: existingAnswer?.selectedImaging || selectedImaging,
        flagged: !existingAnswer?.flagged,
        timeSpent: existingAnswer?.timeSpent || 0,
      });
      return newAnswers;
    });
  };

  /**
   * Submit assessment
   */
  const handleSubmit = () => {
    saveCurrentAnswer();
    setTimerRunning(false);
    setShowTimeUpModal(false);
    setState("completed");
  };

  // Render based on state
  return (
    <>
      <TimeUpModal isOpen={showTimeUpModal} onSubmit={handleSubmit} />

      <AnimatePresence mode="wait">
        {state === "start" && (
          <StartScreen
            key="start"
            assessment={MOCK_ASSESSMENT}
            onStart={handleStart}
            onBack={() => router.push("/assessments")}
          />
        )}

        {state === "in_progress" && (
          <InProgressScreen
            key="in-progress"
            assessment={MOCK_ASSESSMENT}
            currentCase={currentCase}
            currentCaseIndex={currentCaseIndex}
            totalCases={totalCases}
            caseStatuses={caseStatuses}
            selectedImaging={selectedImaging}
            onSelectionChange={setSelectedImaging}
            imagingOptions={MOCK_IMAGING_OPTIONS}
            timeRemaining={timeRemaining}
            isFlagged={answers.get(currentCase.id)?.flagged || false}
            onToggleFlag={handleToggleFlag}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onCaseClick={handleCaseClick}
            onSubmit={handleSubmit}
            isLastCase={isLastCase}
          />
        )}

        {state === "completed" && (
          <CompletionScreen
            key="completed"
            assessment={MOCK_ASSESSMENT}
            answers={answers}
            totalTimeSpent={MOCK_ASSESSMENT.time_limit_minutes * 60 - timeRemaining}
            onRetake={() => {
              setAnswers(new Map());
              setSelectedImaging([]);
              setCurrentCaseIndex(0);
              setTimeRemaining(MOCK_ASSESSMENT.time_limit_minutes * 60);
              setState("start");
            }}
            onBackToAssessments={() => router.push("/assessments")}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Start Screen
// ============================================================================

interface StartScreenProps {
  assessment: typeof MOCK_ASSESSMENT;
  onStart: () => void;
  onBack: () => void;
}

function StartScreen({ assessment, onStart, onBack }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
    >
      <div className="max-w-lg w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessments
        </Button>

        <Card>
          <CardHeader className="text-center pb-2">
            <Badge variant="em" className="mx-auto mb-3">
              {assessment.specialty_track?.toUpperCase()}
            </Badge>
            <CardTitle className="text-2xl">{assessment.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600 text-center">{assessment.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.case_ids.length}
                </p>
                <p className="text-xs text-slate-500">Cases</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.time_limit_minutes}
                </p>
                <p className="text-xs text-slate-500">Minutes</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                <p className="text-lg font-bold text-slate-900">
                  {assessment.passing_score}%
                </p>
                <p className="text-xs text-slate-500">To Pass</p>
              </div>
            </div>

            {/* Instructions */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Instructions</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>You cannot pause once started</li>
                      <li>Select the most appropriate imaging for each case</li>
                      <li>You can flag cases to review later</li>
                      <li>Feedback is shown after completion</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={onStart} className="w-full" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ============================================================================
// In Progress Screen
// ============================================================================

interface InProgressScreenProps {
  assessment: typeof MOCK_ASSESSMENT;
  currentCase: (typeof MOCK_CASES)[0];
  currentCaseIndex: number;
  totalCases: number;
  caseStatuses: CaseStatus[];
  selectedImaging: string[];
  onSelectionChange: (ids: string[]) => void;
  imagingOptions: typeof MOCK_IMAGING_OPTIONS;
  timeRemaining: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onCaseClick: (index: number) => void;
  onSubmit: () => void;
  isLastCase: boolean;
}

function InProgressScreen({
  assessment,
  currentCase,
  currentCaseIndex,
  totalCases,
  caseStatuses,
  selectedImaging,
  onSelectionChange,
  imagingOptions,
  timeRemaining,
  isFlagged,
  onToggleFlag,
  onPrevious,
  onNext,
  onCaseClick,
  onSubmit,
  isLastCase,
}: InProgressScreenProps) {
  const answeredCount = caseStatuses.filter((c) => c.answered).length;
  const flaggedCount = caseStatuses.filter((c) => c.flagged).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col bg-slate-50"
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-semibold text-slate-900 line-clamp-1">
            {assessment.title}
          </h1>
          <div className="flex items-center gap-4">
            <QuizProgressCompact
              currentIndex={currentCaseIndex}
              totalCases={totalCases}
              answeredCount={answeredCount}
              flaggedCount={flaggedCount}
            />
            <TimerBadge remaining={timeRemaining} />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <QuizProgress
            currentIndex={currentCaseIndex}
            totalCases={totalCases}
            caseStatuses={caseStatuses}
            allowNavigation={true}
            onCaseClick={onCaseClick}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Case */}
        <div className="w-[60%] border-r border-slate-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                Case {currentCaseIndex + 1} of {totalCases}
              </Badge>
              <FlagToggle isFlagged={isFlagged} onToggle={onToggleFlag} />
            </div>
            <ClinicalVignette caseData={currentCase as any} mode="quiz" />
          </div>
        </div>

        {/* Right Panel - Ordering */}
        <div className="w-[40%] flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto">
            <OrderingInterface
              imagingOptions={imagingOptions as any}
              selectedImaging={selectedImaging}
              onSelectionChange={onSelectionChange}
              onSubmit={() => {}}
              mode="quiz"
              disabled={false}
            />
          </div>

          {/* Navigation */}
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <QuizNavigation
              currentIndex={currentCaseIndex}
              totalCases={totalCases}
              canGoBack={currentCaseIndex > 0}
              canGoForward={true}
              onPrevious={onPrevious}
              onNext={onNext}
              onSubmit={onSubmit}
              isLastCase={isLastCase}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Completion Screen
// ============================================================================

interface CompletionScreenProps {
  assessment: typeof MOCK_ASSESSMENT;
  answers: Map<string, CaseAnswer>;
  totalTimeSpent: number;
  onRetake: () => void;
  onBackToAssessments: () => void;
}

function CompletionScreen({
  assessment,
  answers,
  totalTimeSpent,
  onRetake,
  onBackToAssessments,
}: CompletionScreenProps) {
  // Calculate results (mock calculation)
  const correctCount = 3; // Would calculate based on actual answers
  const totalCases = assessment.case_ids.length;
  const score = Math.round((correctCount / totalCases) * 100);
  const passed = score >= assessment.passing_score;

  // Mock data for breakdown
  const categoryScores: CategoryScore[] = [
    { category: "chest-pain", correct: 2, total: 2, percentage: 100 },
    { category: "abdominal-pain", correct: 1, total: 2, percentage: 50 },
    { category: "extremity-trauma", correct: 0, total: 1, percentage: 0 },
  ];

  const difficultyScores: DifficultyScore[] = [
    { difficulty: "beginner", correct: 1, total: 1, percentage: 100 },
    { difficulty: "intermediate", correct: 2, total: 3, percentage: 67 },
    { difficulty: "advanced", correct: 0, total: 1, percentage: 0 },
  ];

  const caseResults: CaseResult[] = [
    {
      caseId: "1",
      caseTitle: "Chest Pain Evaluation",
      category: "chest-pain",
      isCorrect: true,
      userAnswer: "Echocardiogram",
      correctAnswer: "Echocardiogram",
      timeSpent: 120,
      acrRating: 9,
    },
    {
      caseId: "2",
      caseTitle: "Abdominal Pain Assessment",
      category: "abdominal-pain",
      isCorrect: false,
      userAnswer: "CT Abdomen",
      correctAnswer: "Ultrasound",
      timeSpent: 90,
      acrRating: 4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 py-8"
    >
      <div className="max-w-2xl mx-auto px-4">
        <ResultsBreakdown
          score={score}
          totalCases={totalCases}
          correctCount={correctCount}
          passingScore={assessment.passing_score}
          passed={passed}
          totalTimeSpent={totalTimeSpent}
          categoryScores={categoryScores}
          difficultyScores={difficultyScores}
          caseResults={caseResults}
          percentile={75}
          weakAreas={["Advanced difficulty cases", "Trauma imaging selection"]}
          onRetake={onRetake}
          onBackToAssessments={onBackToAssessments}
        />
      </div>
    </motion.div>
  );
}
