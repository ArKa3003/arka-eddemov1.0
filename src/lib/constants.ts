// @ts-nocheck
export const APP_NAME = "ARKA-ED";
export const APP_DESCRIPTION = "Medical education platform teaching imaging appropriateness";

export const ACR_RATINGS = {
  MIN: 1,
  MAX: 9,
} as const;

export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const SPECIALTIES = [
  "Radiology",
  "Emergency Medicine",
  "Primary Care",
  "Cardiology",
  "Oncology",
] as const;

export const USER_ROLES = ["student", "instructor", "admin"] as const;