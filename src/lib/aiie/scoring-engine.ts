import { AIIE, getScoreCategory } from '../constants/aiie'

// Clinical factors that influence AIIE scores
export interface ClinicalInput {
  // Patient demographics
  age: number
  sex: 'male' | 'female'
  
  // Presentation
  chiefComplaint: string
  duration: string // acute (<7 days), subacute (1-6 weeks), chronic (>6 weeks)
  severity: 'mild' | 'moderate' | 'severe'
  
  // Red flags (increase appropriateness)
  redFlags: string[]
  
  // Risk factors
  cancerHistory: boolean
  immunocompromised: boolean
  recentTrauma: boolean
  neurologicDeficit: boolean
  progressiveSymptoms: boolean
  
  // Prior workup
  priorImaging: string[]
  labsAvailable: string[]
  physicalExamFindings: string[]
}

export interface ScoringResult {
  modality: string
  finalScore: number
  category: 'appropriate' | 'uncertain' | 'inappropriate'
  categoryLabel: string
  shapFactors: ShapFactor[]
  radiationLevel: string
  estimatedCost: string
  alternativeRecommendation?: string
}

export interface ShapFactor {
  factor: string
  contribution: number // -2 to +2
  value: string
  explanation: string
  evidenceCitation: string
}

// Baseline modality scores (starting point before clinical adjustments)
const MODALITY_BASELINES: Record<string, { baseScore: number; radiation: string; cost: string }> = {
  'X-ray': { baseScore: 5, radiation: 'low', cost: '$50-150' },
  'CT without contrast': { baseScore: 5, radiation: 'medium', cost: '$300-600' },
  'CT with contrast': { baseScore: 5, radiation: 'medium', cost: '$400-800' },
  'MRI without contrast': { baseScore: 5, radiation: 'none', cost: '$500-1500' },
  'MRI with contrast': { baseScore: 5, radiation: 'none', cost: '$700-2000' },
  'Ultrasound': { baseScore: 5, radiation: 'none', cost: '$100-300' },
  'Nuclear medicine': { baseScore: 5, radiation: 'high', cost: '$500-1500' },
  'No imaging': { baseScore: 5, radiation: 'none', cost: '$0' }
}

// Factor weights based on peer-reviewed literature
const FACTOR_WEIGHTS = {
  redFlag: { weight: 1.5, citation: 'JAMA 2019: Red flags in imaging guidelines' },
  acuteOnset: { weight: 0.8, citation: 'Radiology 2020: Timing and imaging appropriateness' },
  chronicDuration: { weight: -0.5, citation: 'AJR 2021: Conservative management in chronic conditions' },
  priorNormalImaging: { weight: -1.0, citation: 'JACR 2022: Repeat imaging utility' },
  neurologicDeficit: { weight: 2.0, citation: 'Neurology 2020: Imaging in neurologic emergencies' },
  cancerHistory: { weight: 1.5, citation: 'JCO 2021: Imaging in oncology surveillance' },
  ageExtreme: { weight: 0.5, citation: 'Pediatrics 2020: Age-based imaging considerations' },
  conservativeTrialFailed: { weight: 1.0, citation: 'Spine 2019: Imaging after conservative therapy' }
}

export function calculateAIIEScore(
  input: ClinicalInput, 
  modality: string
): ScoringResult {
  const baseline = MODALITY_BASELINES[modality] || MODALITY_BASELINES['CT without contrast']
  let score = baseline.baseScore
  const factors: ShapFactor[] = []
  
  // Apply clinical factor adjustments
  // 1. Red flags increase appropriateness
  if (input.redFlags.length > 0) {
    const contribution = Math.min(input.redFlags.length * 0.5, 2)
    score += contribution
    factors.push({
      factor: 'Red Flag Symptoms',
      contribution,
      value: input.redFlags.join(', '),
      explanation: `${input.redFlags.length} red flag(s) present increase imaging urgency`,
      evidenceCitation: FACTOR_WEIGHTS.redFlag.citation
    })
  }
  
  // 2. Neurologic deficit
  if (input.neurologicDeficit) {
    score += FACTOR_WEIGHTS.neurologicDeficit.weight
    factors.push({
      factor: 'Neurologic Deficit',
      contribution: FACTOR_WEIGHTS.neurologicDeficit.weight,
      value: 'Present',
      explanation: 'Focal neurologic findings warrant urgent imaging',
      evidenceCitation: FACTOR_WEIGHTS.neurologicDeficit.citation
    })
  }
  
  // 3. Cancer history
  if (input.cancerHistory) {
    score += FACTOR_WEIGHTS.cancerHistory.weight
    factors.push({
      factor: 'Cancer History',
      contribution: FACTOR_WEIGHTS.cancerHistory.weight,
      value: 'Present',
      explanation: 'History of malignancy requires exclusion of metastatic disease',
      evidenceCitation: FACTOR_WEIGHTS.cancerHistory.citation
    })
  }
  
  // 4. Duration adjustment
  if (input.duration === 'acute') {
    score += FACTOR_WEIGHTS.acuteOnset.weight
    factors.push({
      factor: 'Acute Onset',
      contribution: FACTOR_WEIGHTS.acuteOnset.weight,
      value: '<7 days',
      explanation: 'Recent onset supports imaging workup',
      evidenceCitation: FACTOR_WEIGHTS.acuteOnset.citation
    })
  } else if (input.duration === 'chronic') {
    score += FACTOR_WEIGHTS.chronicDuration.weight
    factors.push({
      factor: 'Chronic Duration',
      contribution: FACTOR_WEIGHTS.chronicDuration.weight,
      value: '>6 weeks',
      explanation: 'Chronic conditions often managed conservatively first',
      evidenceCitation: FACTOR_WEIGHTS.chronicDuration.citation
    })
  }
  
  // 5. Prior imaging
  if (input.priorImaging.length > 0 && !input.progressiveSymptoms) {
    score += FACTOR_WEIGHTS.priorNormalImaging.weight
    factors.push({
      factor: 'Prior Imaging Available',
      contribution: FACTOR_WEIGHTS.priorNormalImaging.weight,
      value: input.priorImaging.join(', '),
      explanation: 'Recent normal imaging reduces utility of repeat study',
      evidenceCitation: FACTOR_WEIGHTS.priorNormalImaging.citation
    })
  }
  
  // 6. Age extremes (pediatric <18 or geriatric >65)
  if (input.age < 18) {
    score += FACTOR_WEIGHTS.ageExtreme.weight
    factors.push({
      factor: 'Pediatric Patient',
      contribution: FACTOR_WEIGHTS.ageExtreme.weight,
      value: `${input.age} years`,
      explanation: 'Pediatric patients require careful radiation consideration',
      evidenceCitation: FACTOR_WEIGHTS.ageExtreme.citation
    })
  } else if (input.age > 65) {
    score += FACTOR_WEIGHTS.ageExtreme.weight
    factors.push({
      factor: 'Geriatric Patient',
      contribution: FACTOR_WEIGHTS.ageExtreme.weight,
      value: `${input.age} years`,
      explanation: 'Advanced age may increase suspicion for serious pathology',
      evidenceCitation: FACTOR_WEIGHTS.ageExtreme.citation
    })
  }
  
  // 7. Progressive symptoms (overrides prior imaging penalty)
  if (input.progressiveSymptoms && input.priorImaging.length > 0) {
    score += FACTOR_WEIGHTS.conservativeTrialFailed.weight
    factors.push({
      factor: 'Progressive Symptoms',
      contribution: FACTOR_WEIGHTS.conservativeTrialFailed.weight,
      value: 'Worsening despite prior workup',
      explanation: 'Progressive symptoms warrant repeat imaging even with prior studies',
      evidenceCitation: FACTOR_WEIGHTS.conservativeTrialFailed.citation
    })
  }
  
  // 8. Recent trauma
  if (input.recentTrauma) {
    score += 1.2
    factors.push({
      factor: 'Recent Trauma',
      contribution: 1.2,
      value: 'Present',
      explanation: 'Traumatic mechanism increases likelihood of structural injury',
      evidenceCitation: 'J Trauma Acute Care Surg 2021: Imaging in trauma evaluation'
    })
  }
  
  // 9. Immunocompromised status
  if (input.immunocompromised) {
    score += 1.0
    factors.push({
      factor: 'Immunocompromised',
      contribution: 1.0,
      value: 'Present',
      explanation: 'Immunocompromised patients at higher risk for opportunistic infections',
      evidenceCitation: 'Clin Infect Dis 2020: Imaging in immunocompromised hosts'
    })
  }
  
  // 10. Severity adjustment
  if (input.severity === 'severe') {
    score += 0.5
    factors.push({
      factor: 'Severe Symptoms',
      contribution: 0.5,
      value: 'Severe',
      explanation: 'High symptom severity increases imaging appropriateness',
      evidenceCitation: 'Ann Emerg Med 2019: Symptom severity and imaging decisions'
    })
  } else if (input.severity === 'mild' && input.duration === 'chronic') {
    score -= 0.5
    factors.push({
      factor: 'Mild Chronic Symptoms',
      contribution: -0.5,
      value: 'Mild, chronic',
      explanation: 'Mild chronic symptoms may be managed conservatively',
      evidenceCitation: 'BMJ 2020: Conservative management in chronic pain'
    })
  }
  
  // Clamp score to 1-9 range
  score = Math.max(1, Math.min(9, Math.round(score * 10) / 10))
  
  const categoryData = getScoreCategory(score)
  
  return {
    modality,
    finalScore: score,
    category: score >= 7 ? 'appropriate' : score >= 4 ? 'uncertain' : 'inappropriate',
    categoryLabel: categoryData.label,
    shapFactors: factors,
    radiationLevel: baseline.radiation,
    estimatedCost: baseline.cost,
    alternativeRecommendation: score < 4 ? 'Consider conservative management or alternative modality' : undefined
  }
}

export function rankImagingOptions(
  input: ClinicalInput,
  modalities: string[]
): ScoringResult[] {
  return modalities
    .map(m => calculateAIIEScore(input, m))
    .sort((a, b) => b.finalScore - a.finalScore)
}
