// Re-export all database types (primary source of truth)
export * from "./database";

// Re-export only non-conflicting types from other modules
// These files have duplicate types - only export unique types

// From cases.ts - PatientInfo (ImagingOption conflicts with AIIE types below)
export type { PatientInfo } from "./cases";

// From assessments.ts - Question, AssessmentResult, Answer (Assessment conflicts with database.ts)
export type { Question, AssessmentResult, Answer } from "./assessments";

// From progress.ts - Competency (Progress conflicts with AIIE types below)
export type { Competency } from "./progress";

// Core AIIE Types
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'resident' | 'attending' | 'admin'
  institution?: string
  specialty?: string
  trainingYear?: string
  onboardingComplete: boolean
}

export interface Case {
  id: string
  slug: string
  title: string
  chiefComplaint: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  specialties: string[]
  patientData: {
    age: number
    sex: string
    vitals?: Record<string, string>
  }
  hpi: string
  physicalExam: Record<string, string>
  imagingOptions: ImagingOption[]
  correctAnswer: string
  explanation: string
  teachingPoints: string[]
}

export interface ImagingOption {
  id: string
  modality: string
  bodyPart: string
  contrast: boolean
  aiieScore: number
  radiationLevel: string
  estimatedCost: string
  shapFactors: ShapFactor[]
}

export interface ShapFactor {
  factor: string
  contribution: number
  value: string
  explanation: string
  evidenceCitation: string
}

export interface CaseAttempt {
  id: string
  caseId: string
  userId: string
  selectedOption: string
  score: number
  timeTaken: number
  hintsUsed: number
  mode: 'learning' | 'assessment'
  createdAt: Date
}

export interface Progress {
  casesCompleted: number
  totalCases: number
  accuracy: number
  streak: number
  byCategory: Record<string, { completed: number; correct: number }>
  bySpecialty: Record<string, { completed: number; correct: number }>
}
