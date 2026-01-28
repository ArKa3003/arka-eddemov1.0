"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap,
  Stethoscope,
  FileText,
  Settings,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QUICK_QUIZ,
  SPECIALTY_ASSESSMENTS,
  FULL_EXAM,
  ASSESSMENT_RULES,
  type Assessment,
} from "@/lib/data/assessments";
import { cn } from "@/lib/utils";
import type { SpecialtyTrack } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface AssessmentCardProps {
  assessment: Assessment;
  bestScore?: number | null;
  onStart: () => void;
  index: number;
}

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentSelectionPage() {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] =
    React.useState<SpecialtyTrack | null>(null);

  const handleStartQuickQuiz = () => {
    router.push(`/assessment/${QUICK_QUIZ.id}`);
  };

  const handleStartSpecialty = (specialty: SpecialtyTrack) => {
    router.push(`/assessment/${SPECIALTY_ASSESSMENTS[specialty].id}`);
  };

  const handleStartFullExam = () => {
    router.push(`/assessment/${FULL_EXAM.id}`);
  };

  const handleStartCustom = () => {
    router.push("/assessments/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
            Choose Your Assessment
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Test your knowledge with comprehensive evaluations. Select an
            assessment type to begin.
          </p>
        </div>

        {/* Assessment Rules Panel */}
        <AssessmentRulesPanel />

        {/* Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Quiz */}
          <AssessmentCard
            assessment={QUICK_QUIZ}
            onStart={handleStartQuickQuiz}
            index={0}
          />

          {/* Full Exam */}
          <AssessmentCard
            assessment={FULL_EXAM}
            onStart={handleStartFullExam}
            index={1}
          />
        </div>

        {/* Specialty Assessments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Specialty Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SPECIALTY_ASSESSMENTS).map((assessment, index) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onStart={() =>
                  handleStartSpecialty(assessment.specialty as SpecialtyTrack)
                }
                index={index + 2}
              />
            ))}
          </div>
        </div>

        {/* Custom Assessment */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Custom Assessment
          </h2>
          <CustomAssessmentCard onStart={handleStartCustom} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Assessment Rules Panel
// ============================================================================

function AssessmentRulesPanel() {
  return (
    <Card className="mb-8 border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
          <Target className="w-5 h-5" />
          Assessment Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong>No hints available</strong> - Assessments are
              closed-book evaluations
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong>Cannot go back</strong> - Once you move to the next
              question, you cannot return
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong>Timer visible</strong> - Time remaining is displayed at all
              times
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>
              <strong>Auto-submit</strong> - Assessment automatically submits
              when time expires
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Assessment Card Component
// ============================================================================

function AssessmentCard({
  assessment,
  bestScore,
  onStart,
  index,
}: AssessmentCardProps) {
  const getIcon = () => {
    switch (assessment.type) {
      case "quick":
        return <Zap className="w-6 h-6" />;
      case "specialty":
        return <Stethoscope className="w-6 h-6" />;
      case "full":
        return <FileText className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getColorScheme = () => {
    switch (assessment.type) {
      case "quick":
        return {
          bg: "bg-cyan-50",
          border: "border-cyan-200",
          icon: "text-cyan-600",
          button: "bg-cyan-600 hover:bg-cyan-700",
        };
      case "specialty":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: "text-emerald-600",
          button: "bg-emerald-600 hover:bg-emerald-700",
        };
      case "full":
        return {
          bg: "bg-violet-50",
          border: "border-violet-200",
          icon: "text-violet-600",
          button: "bg-violet-600 hover:bg-violet-700",
        };
      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: "text-slate-600",
          button: "bg-slate-600 hover:bg-slate-700",
        };
    }
  };

  const colors = getColorScheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "h-full flex flex-col transition-all duration-300 hover:shadow-lg",
          colors.bg,
          colors.border
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className={cn("p-2 rounded-lg", colors.bg)}>{getIcon()}</div>
            {assessment.specialty && (
              <Badge variant={assessment.specialty as any} size="sm">
                {assessment.specialty.toUpperCase()}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{assessment.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-slate-600 mb-6 flex-1">
            {assessment.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-slate-900">
                {assessment.questionCount}
              </p>
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-slate-900">
                {assessment.timeLimit}
              </p>
              <p className="text-xs text-slate-500">Minutes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                <Target className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-slate-900">
                {assessment.passingScore}%
              </p>
              <p className="text-xs text-slate-500">To Pass</p>
            </div>
          </div>

          {/* Best Score */}
          {bestScore !== null && bestScore !== undefined && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-slate-600">Best Score:</span>
                <span className="font-semibold text-slate-900">{bestScore}%</span>
              </div>
            </div>
          )}

          {/* Start Button */}
          <Button
            onClick={onStart}
            className={cn("w-full", colors.button)}
            size="lg"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Custom Assessment Card
// ============================================================================

interface CustomAssessmentCardProps {
  onStart: () => void;
}

function CustomAssessmentCard({ onStart }: CustomAssessmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-slate-200 rounded-lg">
              <Settings className="w-8 h-8 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                Create Custom Assessment
              </h3>
              <p className="text-slate-600 mb-6">
                Build your own assessment by choosing specific categories,
                setting the question count, and customizing the time limit.
                Perfect for targeted practice on areas you want to improve.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Choose categories</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Set question count</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Customize time limit</span>
                </div>
              </div>
              <Button onClick={onStart} size="lg" className="bg-slate-700 hover:bg-slate-800">
                Create Custom Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
