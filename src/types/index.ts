// Re-export all database types (primary source of truth)
export * from "./database";

// Re-export only non-conflicting types from other modules
// These files have duplicate types - only export unique types

// From cases.ts - PatientInfo, ImagingOption (Case conflicts with database.ts)
export type { PatientInfo, ImagingOption } from "./cases";

// From assessments.ts - Question, AssessmentResult, Answer (Assessment conflicts with database.ts)
export type { Question, AssessmentResult, Answer } from "./assessments";

// From progress.ts - Progress, Competency (Achievement conflicts with database.ts)
export type { Progress, Competency } from "./progress";
