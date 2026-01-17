import { create } from "zustand";
import type { Assessment, AssessmentResult } from "@/types/assessments";

interface AssessmentStore {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  currentResult: AssessmentResult | null;
  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setCurrentResult: (result: AssessmentResult | null) => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  assessments: [],
  currentAssessment: null,
  currentResult: null,
  setAssessments: (assessments) => set({ assessments }),
  setCurrentAssessment: (currentAssessment) => set({ currentAssessment }),
  setCurrentResult: (currentResult) => set({ currentResult }),
}));