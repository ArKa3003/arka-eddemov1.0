export const AIIE = {
  name: "ARKA Imaging Intelligence Engine",
  acronym: "AIIE",
  version: "2.0.0",
  tagline: "Evidence-Based Imaging Appropriateness Through Transparent AI",
  
  // FDA Non-Device CDS Compliance (21st Century Cures Act § 3060)
  fda: {
    status: "Non-Device CDS",
    reference: "21st Century Cures Act § 3060 (FD&C Act § 520(o)(1)(E))",
    bannerText: "FDA Non-Device CDS | 21st Century Cures Act § 3060 | For HCP Education",
    disclaimer: "AIIE provides evidence-based imaging appropriateness recommendations using RAND/UCLA methodology and peer-reviewed literature. These recommendations support clinical learning but do not constitute medical advice.",
    criteria: {
      criterion1: { title: "Data Input", status: "COMPLIANT", description: "Analyzes clinical indications, NOT medical images" },
      criterion2: { title: "Medical Information", status: "COMPLIANT", description: "Uses peer-reviewed literature and validated guidelines" },
      criterion3: { title: "HCP Recommendations", status: "COMPLIANT", description: "Provides recommendations, not directives" },
      criterion4: { title: "Independent Review", status: "COMPLIANT", description: "Full transparency with SHAP explanations" }
    }
  },

  // Scoring Methodology (RAND/UCLA + GRADE)
  scoring: {
    methodology: "RAND/UCLA Appropriateness Method + GRADE Framework",
    evidenceDate: "January 2026",
    scale: { min: 1, max: 9 },
    categories: {
      appropriate: { range: [7, 9], color: "#22c55e", label: "Usually Appropriate", bgClass: "bg-green-100 text-green-800" },
      uncertain: { range: [4, 6], color: "#f59e0b", label: "May Be Appropriate", bgClass: "bg-yellow-100 text-yellow-800" },
      inappropriate: { range: [1, 3], color: "#ef4444", label: "Usually Not Appropriate", bgClass: "bg-red-100 text-red-800" }
    },
    baselineScore: 5.0
  },

  // Differentiators (for internal reference)
  innovations: [
    "Knowledge Graph Clinical Reasoning",
    "XGBoost + SHAP Explainable AI",
    "Tiered Behavioral Alerting",
    "Cumulative Radiation Tracking",
    "Real-time Evidence Synthesis"
  ],

  // Relative Radiation Levels
  radiationLevels: {
    none: { label: "None", mSv: "0", symbol: "○" },
    minimal: { label: "Minimal", mSv: "<0.1", symbol: "◐" },
    low: { label: "Low", mSv: "0.1-1", symbol: "●" },
    medium: { label: "Medium", mSv: "1-10", symbol: "●●" },
    high: { label: "High", mSv: "10-30", symbol: "●●●" },
    veryHigh: { label: "Very High", mSv: ">30", symbol: "●●●●" }
  }
}

export const getScoreCategory = (score: number) => {
  if (score >= 7) return AIIE.scoring.categories.appropriate
  if (score >= 4) return AIIE.scoring.categories.uncertain
  return AIIE.scoring.categories.inappropriate
}

export const getCategoryLabel = (score: number): string => {
  return getScoreCategory(score).label
}
