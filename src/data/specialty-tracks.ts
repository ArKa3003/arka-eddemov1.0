// @ts-nocheck
import type { SpecialtyTrack as SpecialtyTrackEnum } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type TrackColor = "rose" | "blue" | "emerald" | "violet" | "teal";
export type TrackIcon = "Siren" | "Heart" | "Users" | "Scissors" | "Baby";

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  caseIds: string[];
  unlockRequirement: {
    type: "module" | "cases" | null;
    value: string | number | null;
  } | null;
  estimatedMinutes: number;
}

export interface SpecialtyTrackConfig {
  id: SpecialtyTrackEnum;
  name: string;
  slug: string;
  shortName: string;
  color: TrackColor;
  icon: TrackIcon;
  description: string;
  longDescription: string;
  curriculum: CurriculumModule[];
  assessmentId: string;
  certificateName: string;
  prerequisites: string[];
  resources: TrackResource[];
}

export interface TrackResource {
  id: string;
  title: string;
  type: "acr-topic" | "guideline" | "reading" | "video";
  url?: string;
  description?: string;
}

export interface TrackProgress {
  trackId: SpecialtyTrackEnum;
  completedCases: string[];
  moduleProgress: Record<string, { completed: number; total: number }>;
  overallProgress: number;
  assessmentPassed: boolean;
  certificateEarned: boolean;
}

// ============================================================================
// Track Configurations
// ============================================================================

export const SPECIALTY_TRACKS: Record<SpecialtyTrackEnum, SpecialtyTrackConfig> = {
  em: {
    id: "em",
    name: "Emergency Medicine",
    slug: "em",
    shortName: "EM",
    color: "rose",
    icon: "Siren",
    description: "Master imaging decisions in the acute care setting",
    longDescription:
      "Learn to make rapid, appropriate imaging decisions for emergency presentations. This track covers trauma, chest pain, abdominal emergencies, neurological presentations, and pediatric emergencies from the ED perspective.",
    curriculum: [
      {
        id: "em-trauma",
        title: "Trauma Imaging",
        description: "Appropriate imaging in trauma scenarios including head, spine, chest, and abdominal trauma",
        caseIds: ["trauma-head-1", "trauma-cspine-1", "trauma-chest-1", "trauma-abd-1", "trauma-pelvic-1"],
        unlockRequirement: null,
        estimatedMinutes: 60,
      },
      {
        id: "em-chest",
        title: "Chest Pain Evaluation",
        description: "Imaging approach to acute chest pain including ACS, PE, and aortic emergencies",
        caseIds: ["chest-acs-1", "chest-pe-1", "chest-dissection-1", "chest-pericarditis-1", "chest-pneumothorax-1"],
        unlockRequirement: { type: "module", value: "em-trauma" },
        estimatedMinutes: 75,
      },
      {
        id: "em-abdominal",
        title: "Abdominal Emergencies",
        description: "Appropriate imaging for acute abdominal pain presentations",
        caseIds: ["abd-appendicitis-1", "abd-cholecystitis-1", "abd-sbo-1", "abd-diverticulitis-1", "abd-aaa-1"],
        unlockRequirement: { type: "module", value: "em-chest" },
        estimatedMinutes: 75,
      },
      {
        id: "em-neuro",
        title: "Neurological Emergencies",
        description: "Imaging for stroke, seizure, headache, and altered mental status",
        caseIds: ["neuro-stroke-1", "neuro-sah-1", "neuro-seizure-1", "neuro-headache-1", "neuro-meningitis-1"],
        unlockRequirement: { type: "module", value: "em-abdominal" },
        estimatedMinutes: 60,
      },
      {
        id: "em-peds",
        title: "Pediatric EM Cases",
        description: "Special considerations for pediatric emergency imaging",
        caseIds: ["peds-bronchiolitis-1", "peds-intussusception-1", "peds-pyloric-1", "peds-nai-1", "peds-foreign-body-1"],
        unlockRequirement: { type: "module", value: "em-neuro" },
        estimatedMinutes: 60,
      },
    ],
    assessmentId: "em-comprehensive",
    certificateName: "Emergency Imaging Appropriateness Certificate",
    prerequisites: [],
    resources: [
      { id: "acr-trauma", title: "ACR Appropriateness Criteria: Trauma", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "acr-chest-pain", title: "ACR AC: Chest Pain", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "atls-guidelines", title: "ATLS Imaging Guidelines", type: "guideline" },
      { id: "em-imaging-book", title: "Emergency Radiology: The Requisites", type: "reading" },
    ],
  },
  im: {
    id: "im",
    name: "Internal Medicine",
    slug: "im",
    shortName: "IM",
    color: "blue",
    icon: "Heart",
    description: "Optimize imaging for inpatient and outpatient medicine",
    longDescription:
      "Develop expertise in imaging decisions for common internal medicine presentations. This track emphasizes evidence-based approaches to diagnostic workups in both inpatient and ambulatory settings.",
    curriculum: [
      {
        id: "im-cardio",
        title: "Cardiovascular Imaging",
        description: "Appropriate imaging for cardiac conditions including heart failure, valvular disease, and coronary artery disease",
        caseIds: ["cardio-hf-1", "cardio-cad-1", "cardio-valve-1", "cardio-afib-1", "cardio-pericardial-1"],
        unlockRequirement: null,
        estimatedMinutes: 90,
      },
      {
        id: "im-pulm",
        title: "Pulmonary Imaging",
        description: "Imaging approach to dyspnea, cough, and pulmonary nodules",
        caseIds: ["pulm-pna-1", "pulm-copd-1", "pulm-nodule-1", "pulm-ild-1", "pulm-effusion-1"],
        unlockRequirement: { type: "module", value: "im-cardio" },
        estimatedMinutes: 75,
      },
      {
        id: "im-gi",
        title: "GI & Hepatobiliary Imaging",
        description: "Appropriate imaging for GI symptoms and liver disease",
        caseIds: ["gi-gerd-1", "gi-pancreatitis-1", "gi-cirrhosis-1", "gi-gib-1", "gi-jaundice-1"],
        unlockRequirement: { type: "module", value: "im-pulm" },
        estimatedMinutes: 75,
      },
      {
        id: "im-renal",
        title: "Renal & Urological Imaging",
        description: "Imaging for kidney disease, stones, and urological conditions",
        caseIds: ["renal-stone-1", "renal-aki-1", "renal-mass-1", "renal-hematuria-1", "renal-uti-1"],
        unlockRequirement: { type: "module", value: "im-gi" },
        estimatedMinutes: 60,
      },
      {
        id: "im-onc",
        title: "Oncologic Imaging",
        description: "Cancer screening, staging, and surveillance imaging",
        caseIds: ["onc-lung-1", "onc-colon-1", "onc-lymphoma-1", "onc-breast-1", "onc-staging-1"],
        unlockRequirement: { type: "module", value: "im-renal" },
        estimatedMinutes: 90,
      },
    ],
    assessmentId: "im-comprehensive",
    certificateName: "Internal Medicine Imaging Appropriateness Certificate",
    prerequisites: [],
    resources: [
      { id: "acr-chest", title: "ACR AC: Thoracic Imaging", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "acr-cardiac", title: "ACR AC: Cardiac Imaging", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "cw-imaging", title: "Choosing Wisely: Imaging", type: "guideline" },
    ],
  },
  fm: {
    id: "fm",
    name: "Family Medicine",
    slug: "fm",
    shortName: "FM",
    color: "emerald",
    icon: "Users",
    description: "Evidence-based imaging for primary care",
    longDescription:
      "Master imaging appropriateness for the breadth of family medicine practice. This track covers common presentations across all ages with emphasis on outpatient diagnostic approaches and avoiding unnecessary imaging.",
    curriculum: [
      {
        id: "fm-msk",
        title: "Musculoskeletal Imaging",
        description: "Appropriate imaging for common MSK complaints including back pain, joint pain, and injuries",
        caseIds: ["msk-lbp-1", "msk-knee-1", "msk-shoulder-1", "msk-ankle-1", "msk-hip-1"],
        unlockRequirement: null,
        estimatedMinutes: 75,
      },
      {
        id: "fm-headache",
        title: "Headache Evaluation",
        description: "When to image headache and red flags requiring urgent evaluation",
        caseIds: ["ha-tension-1", "ha-migraine-1", "ha-cluster-1", "ha-secondary-1", "ha-thunderclap-1"],
        unlockRequirement: { type: "module", value: "fm-msk" },
        estimatedMinutes: 60,
      },
      {
        id: "fm-screening",
        title: "Cancer Screening",
        description: "Evidence-based imaging for cancer screening in primary care",
        caseIds: ["screen-lung-1", "screen-breast-1", "screen-colon-1", "screen-prostate-1", "screen-ovarian-1"],
        unlockRequirement: { type: "module", value: "fm-headache" },
        estimatedMinutes: 75,
      },
      {
        id: "fm-wellness",
        title: "Wellness & Preventive Imaging",
        description: "Appropriate use of imaging in preventive care and health maintenance",
        caseIds: ["wellness-thyroid-1", "wellness-incidental-1", "wellness-followup-1", "wellness-anxiety-1", "wellness-dexa-1"],
        unlockRequirement: { type: "module", value: "fm-screening" },
        estimatedMinutes: 60,
      },
      {
        id: "fm-peds-fm",
        title: "Pediatric Primary Care Imaging",
        description: "Imaging considerations for common pediatric presentations",
        caseIds: ["pfm-uri-1", "pfm-limping-1", "pfm-abdominal-1", "pfm-developmental-1", "pfm-fever-1"],
        unlockRequirement: { type: "module", value: "fm-wellness" },
        estimatedMinutes: 60,
      },
    ],
    assessmentId: "fm-comprehensive",
    certificateName: "Primary Care Imaging Appropriateness Certificate",
    prerequisites: [],
    resources: [
      { id: "acr-msk", title: "ACR AC: Musculoskeletal Imaging", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "uspstf", title: "USPSTF Screening Recommendations", type: "guideline" },
      { id: "aafp-imaging", title: "AAFP Imaging Guidelines", type: "guideline" },
    ],
  },
  surgery: {
    id: "surgery",
    name: "Surgery",
    slug: "surgery",
    shortName: "Surg",
    color: "violet",
    icon: "Scissors",
    description: "Preoperative and surgical imaging decisions",
    longDescription:
      "Learn appropriate imaging for surgical conditions and preoperative planning. This track covers acute surgical emergencies, elective surgical workups, and postoperative imaging considerations.",
    curriculum: [
      {
        id: "surg-acute",
        title: "Acute Abdomen",
        description: "Imaging approach to the acute surgical abdomen",
        caseIds: ["acute-appendicitis-1", "acute-perforation-1", "acute-obstruction-1", "acute-ischemia-1", "acute-pancreatitis-1"],
        unlockRequirement: null,
        estimatedMinutes: 90,
      },
      {
        id: "surg-hepatobiliary",
        title: "Hepatobiliary Surgery",
        description: "Preoperative imaging for hepatobiliary conditions",
        caseIds: ["hb-gallstones-1", "hb-cholecystitis-1", "hb-choledocho-1", "hb-liver-mass-1", "hb-pancreatic-1"],
        unlockRequirement: { type: "module", value: "surg-acute" },
        estimatedMinutes: 75,
      },
      {
        id: "surg-colorectal",
        title: "Colorectal Surgery",
        description: "Imaging for colorectal conditions and cancer staging",
        caseIds: ["cr-diverticulitis-1", "cr-cancer-staging-1", "cr-abscess-1", "cr-fistula-1", "cr-rectal-1"],
        unlockRequirement: { type: "module", value: "surg-hepatobiliary" },
        estimatedMinutes: 75,
      },
      {
        id: "surg-vascular",
        title: "Vascular Surgery",
        description: "Imaging for vascular surgical conditions",
        caseIds: ["vasc-aaa-1", "vasc-pad-1", "vasc-carotid-1", "vasc-dvt-1", "vasc-mesenteric-1"],
        unlockRequirement: { type: "module", value: "surg-colorectal" },
        estimatedMinutes: 60,
      },
      {
        id: "surg-trauma-surg",
        title: "Surgical Trauma",
        description: "Imaging in surgical trauma management",
        caseIds: ["strm-blunt-abd-1", "strm-penetrating-1", "strm-solid-organ-1", "strm-hollow-viscus-1", "strm-diaphragm-1"],
        unlockRequirement: { type: "module", value: "surg-vascular" },
        estimatedMinutes: 75,
      },
    ],
    assessmentId: "surgery-comprehensive",
    certificateName: "Surgical Imaging Appropriateness Certificate",
    prerequisites: [],
    resources: [
      { id: "acr-acute-abd", title: "ACR AC: Acute Abdominal Pain", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "acs-trauma", title: "ACS Trauma Imaging Guidelines", type: "guideline" },
      { id: "sages-guidelines", title: "SAGES Imaging Guidelines", type: "guideline" },
    ],
  },
  peds: {
    id: "peds",
    name: "Pediatrics",
    slug: "peds",
    shortName: "Peds",
    color: "teal",
    icon: "Baby",
    description: "Child-specific imaging with radiation awareness",
    longDescription:
      "Master pediatric imaging appropriateness with special attention to radiation safety and ALARA principles. This track covers common pediatric presentations with age-appropriate imaging strategies.",
    curriculum: [
      {
        id: "peds-resp",
        title: "Pediatric Respiratory",
        description: "Imaging for respiratory conditions in children",
        caseIds: ["presp-bronchiolitis-1", "presp-croup-1", "presp-pneumonia-1", "presp-asthma-1", "presp-foreign-body-1"],
        unlockRequirement: null,
        estimatedMinutes: 60,
      },
      {
        id: "peds-gi",
        title: "Pediatric GI",
        description: "Abdominal imaging in pediatric patients",
        caseIds: ["pgi-intussusception-1", "pgi-pyloric-1", "pgi-appendicitis-1", "pgi-constipation-1", "pgi-meckel-1"],
        unlockRequirement: { type: "module", value: "peds-resp" },
        estimatedMinutes: 75,
      },
      {
        id: "peds-msk",
        title: "Pediatric MSK",
        description: "Musculoskeletal imaging in children including fractures and hip disorders",
        caseIds: ["pmsk-toddler-fx-1", "pmsk-hip-1", "pmsk-limp-1", "pmsk-osteomyelitis-1", "pmsk-nai-1"],
        unlockRequirement: { type: "module", value: "peds-gi" },
        estimatedMinutes: 75,
      },
      {
        id: "peds-neuro",
        title: "Pediatric Neuroimaging",
        description: "Brain and spine imaging in pediatric patients",
        caseIds: ["pneuro-seizure-1", "pneuro-headache-1", "pneuro-developmental-1", "pneuro-vp-shunt-1", "pneuro-trauma-1"],
        unlockRequirement: { type: "module", value: "peds-msk" },
        estimatedMinutes: 60,
      },
      {
        id: "peds-neonatal",
        title: "Neonatal Imaging",
        description: "Imaging in the neonatal period",
        caseIds: ["neo-nec-1", "neo-rdm-1", "neo-hip-screening-1", "neo-cranial-us-1", "neo-jaundice-1"],
        unlockRequirement: { type: "module", value: "peds-neuro" },
        estimatedMinutes: 60,
      },
    ],
    assessmentId: "peds-comprehensive",
    certificateName: "Pediatric Imaging Appropriateness Certificate",
    prerequisites: [],
    resources: [
      { id: "acr-peds", title: "ACR AC: Pediatric Imaging", type: "acr-topic", url: "https://acsearch.acr.org/list" },
      { id: "image-gently", title: "Image Gently Campaign", type: "guideline", url: "https://www.imagegently.org" },
      { id: "aap-imaging", title: "AAP Imaging Guidelines", type: "guideline" },
    ],
  },
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get track by slug
 */
export function getTrackBySlug(slug: string): SpecialtyTrackConfig | undefined {
  return Object.values(SPECIALTY_TRACKS).find((track) => track.slug === slug);
}

/**
 * Get all tracks as array
 */
export function getAllTracks(): SpecialtyTrackConfig[] {
  return Object.values(SPECIALTY_TRACKS);
}

/**
 * Get track color classes
 */
export function getTrackColorClasses(color: TrackColor): {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  ring: string;
} {
  const colors: Record<TrackColor, ReturnType<typeof getTrackColorClasses>> = {
    rose: {
      bg: "bg-rose-500",
      bgLight: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-200",
      ring: "ring-rose-500",
    },
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      ring: "ring-blue-500",
    },
    emerald: {
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      ring: "ring-emerald-500",
    },
    violet: {
      bg: "bg-violet-500",
      bgLight: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
      ring: "ring-violet-500",
    },
    teal: {
      bg: "bg-teal-500",
      bgLight: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-200",
      ring: "ring-teal-500",
    },
  };
  return colors[color];
}

/**
 * Calculate module progress
 */
export function calculateModuleProgress(
  module: CurriculumModule,
  completedCaseIds: string[]
): { completed: number; total: number; percentage: number; isComplete: boolean } {
  const completed = module.caseIds.filter((id) => completedCaseIds.includes(id)).length;
  const total = module.caseIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage, isComplete: completed >= total };
}

/**
 * Check if module is unlocked
 */
export function isModuleUnlocked(
  module: CurriculumModule,
  completedModules: string[],
  completedCases: string[]
): boolean {
  if (!module.unlockRequirement) return true;

  if (module.unlockRequirement.type === "module") {
    return completedModules.includes(module.unlockRequirement.value as string);
  }

  if (module.unlockRequirement.type === "cases") {
    return completedCases.length >= (module.unlockRequirement.value as number);
  }

  return true;
}

/**
 * Calculate overall track progress
 */
export function calculateTrackProgress(
  track: SpecialtyTrackConfig,
  completedCaseIds: string[]
): { completed: number; total: number; percentage: number } {
  const allCaseIds = track.curriculum.flatMap((m) => m.caseIds);
  const completed = allCaseIds.filter((id) => completedCaseIds.includes(id)).length;
  const total = allCaseIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

/**
 * Get estimated time remaining for track
 */
export function getEstimatedTimeRemaining(
  track: SpecialtyTrackConfig,
  completedCaseIds: string[]
): number {
  return track.curriculum.reduce((total, module) => {
    const moduleProgress = calculateModuleProgress(module, completedCaseIds);
    if (moduleProgress.isComplete) return total;
    const remainingPercentage = (100 - moduleProgress.percentage) / 100;
    return total + Math.round(module.estimatedMinutes * remainingPercentage);
  }, 0);
}
