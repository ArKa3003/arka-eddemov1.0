"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrackHeader } from "@/components/specialty/track-header";
import {
  CurriculumModuleList,
  type ModuleCase,
} from "@/components/specialty/curriculum-module";
import {
  TrackProgress,
  TrackResources,
  TrackCertificate,
  type ModuleStatus,
} from "@/components/specialty/track-progress";
import {
  type SpecialtyTrackConfig,
  calculateModuleProgress,
  calculateTrackProgress,
  isModuleUnlocked,
  getEstimatedTimeRemaining,
} from "@/data/specialty-tracks";

// ============================================================================
// Types
// ============================================================================

interface SpecialtyTrackContentProps {
  track: SpecialtyTrackConfig;
}

// ============================================================================
// Mock User Progress Data
// ============================================================================

// In production, this would come from the database
const MOCK_COMPLETED_CASES = [
  "trauma-head-1",
  "trauma-cspine-1",
  "trauma-chest-1",
  "trauma-abd-1",
  "trauma-pelvic-1",
  "chest-acs-1",
  "chest-pe-1",
  "msk-lbp-1",
  "msk-knee-1",
  "cardio-hf-1",
  "acute-appendicitis-1",
  "presp-bronchiolitis-1",
];

const MOCK_CASE_SCORES: Record<string, number> = {
  "trauma-head-1": 85,
  "trauma-cspine-1": 92,
  "trauma-chest-1": 78,
  "trauma-abd-1": 100,
  "trauma-pelvic-1": 88,
  "chest-acs-1": 95,
  "chest-pe-1": 72,
  "msk-lbp-1": 80,
  "msk-knee-1": 75,
  "cardio-hf-1": 90,
  "acute-appendicitis-1": 85,
  "presp-bronchiolitis-1": 88,
};

// ============================================================================
// Component
// ============================================================================

export function SpecialtyTrackContent({ track }: SpecialtyTrackContentProps) {
  // In production, fetch user's progress from the database
  const completedCases = MOCK_COMPLETED_CASES;
  const caseScores = MOCK_CASE_SCORES;

  // Calculate completed modules
  const completedModules = track.curriculum
    .filter((module) => {
      const progress = calculateModuleProgress(module, completedCases);
      return progress.isComplete;
    })
    .map((m) => m.id);

  // Calculate overall track progress
  const trackProgress = calculateTrackProgress(track, completedCases);

  // Prepare module data for components
  const modulesData = track.curriculum.map((module) => {
    const progress = calculateModuleProgress(module, completedCases);
    const unlocked = isModuleUnlocked(module, completedModules, completedCases);

    // Generate case data
    const cases: ModuleCase[] = module.caseIds.map((caseId, index) => ({
      id: caseId,
      title: formatCaseTitle(caseId),
      completed: completedCases.includes(caseId),
      score: caseScores[caseId],
    }));

    return {
      module,
      isUnlocked: unlocked,
      progress: {
        completed: progress.completed,
        total: progress.total,
        percentage: progress.percentage,
      },
      isComplete: progress.isComplete,
      cases,
    };
  });

  // Prepare module status for progress sidebar
  const moduleStatuses: ModuleStatus[] = track.curriculum.map((module) => {
    const progress = calculateModuleProgress(module, completedCases);
    const unlocked = isModuleUnlocked(module, completedModules, completedCases);

    return {
      id: module.id,
      title: module.title,
      isComplete: progress.isComplete,
      isUnlocked: unlocked,
      progress: progress.percentage,
    };
  });

  // Calculate time remaining
  const timeRemaining = getEstimatedTimeRemaining(track, completedCases);

  // Check if assessment is available (all modules complete)
  const assessmentAvailable = completedModules.length === track.curriculum.length;

  // Check if certificate is earned (would come from DB)
  const certificateEarned = assessmentAvailable; // Simplified for demo

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Track Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm mb-6"
        >
          <TrackHeader
            track={track}
            progress={trackProgress.percentage}
            completedCases={trackProgress.completed}
            totalCases={trackProgress.total}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Curriculum Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Title */}
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">
                Curriculum
              </h2>
              <p className="text-slate-600 text-sm">
                Complete modules sequentially to unlock the next section
              </p>
            </div>

            {/* Module List */}
            <CurriculumModuleList modules={modulesData} color={track.color} />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Track Progress */}
            <TrackProgress
              progress={trackProgress.percentage}
              completedCases={trackProgress.completed}
              totalCases={trackProgress.total}
              modules={moduleStatuses}
              timeRemaining={timeRemaining}
              color={track.color}
              assessmentAvailable={assessmentAvailable}
              assessmentId={track.assessmentId}
            />

            {/* Certificate */}
            <TrackCertificate
              trackName={track.name}
              certificateName={track.certificateName}
              earned={certificateEarned}
              earnedAt={certificateEarned ? new Date().toISOString() : undefined}
              color={track.color}
            />

            {/* Resources */}
            <TrackResources resources={track.resources} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Format case ID into readable title
 */
function formatCaseTitle(caseId: string): string {
  // Convert case ID to readable title
  // e.g., "trauma-head-1" → "Trauma Head Case 1"
  return caseId
    .split("-")
    .map((word, index) => {
      if (word.match(/^\d+$/)) return `Case ${word}`;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
