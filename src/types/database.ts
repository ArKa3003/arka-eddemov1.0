/**
 * Complete TypeScript type definitions for ARKA-ED database schema.
 * Includes all tables, views, functions, and enums for Supabase integration.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = "student" | "resident" | "attending" | "admin";
export type SpecialtyTrack = "em" | "im" | "fm" | "surgery" | "peds";
export type CaseCategory =
  | "low-back-pain"
  | "headache"
  | "chest-pain"
  | "abdominal-pain"
  | "extremity-trauma";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type Modality =
  | "xray"
  | "ct"
  | "mri"
  | "ultrasound"
  | "nuclear"
  | "fluoroscopy"
  | "mammography"
  | "pet";
export type ACRCategory =
  | "usually-appropriate"
  | "may-be-appropriate"
  | "usually-not-appropriate";
export type AttemptMode = "practice" | "assessment" | "learning";
export type AssessmentStatus = "not_started" | "in_progress" | "completed" | "abandoned";
export type AchievementCategory =
  | "completion"
  | "accuracy"
  | "streak"
  | "speed"
  | "specialty"
  | "milestone";
export type ClinicalPearlCategory =
  | "clinical-pearl"
  | "high-yield"
  | "common-mistake"
  | "board-favorite";
export type PatientSex = "male" | "female";
export type TemperatureUnit = "celsius" | "fahrenheit";

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface VitalSigns {
  heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  respiratory_rate: number | null;
  temperature: number | null;
  temperature_unit: TemperatureUnit | null;
  oxygen_saturation: number | null;
}

export interface LabResult {
  name: string;
  value: string | number;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
}

export interface ClinicalPearl {
  content: string;
  category: ClinicalPearlCategory;
}

export interface Reference {
  title: string;
  source: string;
  year: number;
  url?: string | null;
}

export interface AssessmentAnswer {
  case_id: string;
  selected_imaging: string[];
  acr_rating_received: number | null;
  is_correct: boolean;
  time_spent_seconds: number;
  hints_used: number;
}

export interface CategoryProgress {
  category: CaseCategory;
  attempted: number;
  completed: number;
  accuracy: number;
}

export interface SpecialtyProgress {
  specialty: SpecialtyTrack;
  cases_attempted: number;
  cases_completed: number;
  accuracy: number;
}

// ============================================================================
// TABLE INTERFACES
// ============================================================================

export interface Profile {
  id: string; // UUID, references auth.users
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  institution: string | null;
  specialty_track: SpecialtyTrack | null;
  training_year: number | null;
  streak_count: number;
  last_activity_date: string | null; // ISO date string
  onboarding_completed: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Case {
  id: string; // UUID
  slug: string;
  title: string;
  chief_complaint: string;
  clinical_vignette: string; // Full case description
  patient_age: number;
  patient_sex: PatientSex;
  patient_history: string[];
  vital_signs: VitalSigns | null;
  physical_exam: string | null;
  lab_results: LabResult[] | null;
  category: CaseCategory;
  specialty_tags: SpecialtyTrack[];
  difficulty: DifficultyLevel;
  acr_topic: string;
  optimal_imaging: string[]; // imaging_option IDs
  explanation: string;
  teaching_points: string[];
  clinical_pearls: ClinicalPearl[] | null;
  hints: string[] | null;
  references: Reference[];
  is_published: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ImagingOption {
  id: string; // UUID
  name: string;
  short_name: string;
  modality: Modality;
  body_region: string;
  with_contrast: boolean;
  typical_cost_usd: number;
  radiation_msv: number; // >= 0
  description: string;
  common_indications: string[];
  contraindications: string[];
  duration: string; // e.g., "15-30 minutes"
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface CaseImagingRating {
  id: string; // UUID
  case_id: string; // UUID, references cases
  imaging_option_id: string; // UUID, references imaging_options
  acr_rating: number; // 1-9
  rating_category: ACRCategory;
  rationale: string;
  acr_reference: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface UserCaseAttempt {
  id: string; // UUID
  user_id: string; // UUID, references profiles
  case_id: string; // UUID, references cases
  selected_imaging: string[]; // imaging_option IDs
  acr_rating_received: number | null; // 1-9
  score: number; // 0-100
  is_correct: boolean;
  time_spent_seconds: number;
  mode: AttemptMode;
  assessment_id: string | null; // UUID, references assessments
  hints_used: number;
  feedback_viewed: boolean;
  created_at: string; // ISO timestamp
}

export interface Assessment {
  id: string; // UUID
  title: string;
  description: string;
  case_ids: string[]; // UUID[] of case IDs
  time_limit_minutes: number | null;
  passing_score: number; // 0-100
  specialty_track: SpecialtyTrack | null;
  difficulty: DifficultyLevel | null;
  is_published: boolean;
  is_custom: boolean;
  created_by: string | null; // UUID, references profiles
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface UserAssessment {
  id: string; // UUID
  user_id: string; // UUID, references profiles
  assessment_id: string; // UUID, references assessments
  status: AssessmentStatus;
  current_case_index: number;
  score: number | null; // 0-100
  passed: boolean | null;
  started_at: string | null; // ISO timestamp
  completed_at: string | null; // ISO timestamp
  time_remaining_seconds: number | null;
  answers: AssessmentAnswer[]; // JSONB
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Achievement {
  id: string; // UUID
  slug: string;
  name: string;
  description: string;
  icon: string; // emoji or icon identifier
  category: AchievementCategory;
  requirement_type: string; // e.g., "cases_completed", "streak_days"
  requirement_value: number;
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface UserAchievement {
  id: string; // UUID
  user_id: string; // UUID, references profiles
  achievement_id: string; // UUID, references achievements
  achieved_at: string; // ISO timestamp
  metadata: Record<string, any> | null; // JSONB
}

export interface UserProgress {
  user_id: string; // UUID
  total_cases_attempted: number;
  total_cases_completed: number;
  overall_accuracy: number; // 0-100
  current_streak: number;
  longest_streak: number;
  total_time_spent: number; // seconds
  category_progress: CategoryProgress[];
  specialty_progress: SpecialtyProgress[];
}

// ============================================================================
// SUPABASE DATABASE TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      cases: {
        Row: Case;
        Insert: Omit<Case, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Case, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      imaging_options: {
        Row: ImagingOption;
        Insert: Omit<ImagingOption, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ImagingOption, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      case_imaging_ratings: {
        Row: CaseImagingRating;
        Insert: Omit<CaseImagingRating, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<CaseImagingRating, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      user_case_attempts: {
        Row: UserCaseAttempt;
        Insert: Omit<UserCaseAttempt, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UserCaseAttempt, "id" | "created_at">> & {
          created_at?: string;
        };
      };
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Assessment, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      user_assessments: {
        Row: UserAssessment;
        Insert: Omit<UserAssessment, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserAssessment, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Achievement, "id" | "created_at">> & {
          updated_at?: string;
        };
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, "id"> & {
          id?: string;
        };
        Update: Partial<Omit<UserAchievement, "id">>;
      };
    };
    Views: {
      user_progress: {
        Row: UserProgress;
      };
    };
    Functions: {
      calculate_user_progress: {
        Args: {
          user_id: string;
        };
        Returns: UserProgress;
      };
    };
    Enums: {
      user_role: UserRole;
      specialty_track: SpecialtyTrack;
      case_category: CaseCategory;
      difficulty_level: DifficultyLevel;
      modality: Modality;
      acr_category: ACRCategory;
      attempt_mode: AttemptMode;
      assessment_status: AssessmentStatus;
      achievement_category: AchievementCategory;
      clinical_pearl_category: ClinicalPearlCategory;
      patient_sex: PatientSex;
      temperature_unit: TemperatureUnit;
    };
  };
}