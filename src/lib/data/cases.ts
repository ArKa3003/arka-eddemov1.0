import { ClinicalInput, ScoringResult, calculateAIIEScore, rankImagingOptions } from '@/lib/aiie/scoring-engine'

export interface ClinicalCase {
  id: string
  title: string
  specialty: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  patientPresentation: {
    age: number
    sex: 'male' | 'female'
    chiefComplaint: string
    hpi: string
    physicalExam: string[]
    vitalSigns?: {
      hr: number
      bp: string
      temp: number
      rr: number
      o2sat: number
    }
  }
  clinicalInput: ClinicalInput
  imagingOptions: ScoringResult[]
  teachingPoints: string[]
  keyPearls: string[]
}

// ============================================================================
// LOW BACK PAIN CASES
// ============================================================================

export const case1_AcuteMechanicalLBP: ClinicalCase = {
  id: 'lbp-acute-mechanical',
  title: 'Acute Mechanical Low Back Pain',
  specialty: 'Emergency Medicine',
  difficulty: 'beginner',
  patientPresentation: {
    age: 28,
    sex: 'male',
    chiefComplaint: 'Low back pain for 3 days',
    hpi: 'A 28-year-old male presents with low back pain that started 3 days ago after helping a friend move furniture. The pain is localized to the lower lumbar region, rated 6/10, worse with movement and relieved by rest. No radiation, numbness, or weakness. No bowel/bladder dysfunction.',
    physicalExam: [
      'Normal gait',
      'Full range of motion with mild discomfort',
      'No focal neurologic deficits',
      'Negative straight leg raise bilaterally',
      'No spinal tenderness to palpation'
    ],
    vitalSigns: {
      hr: 72,
      bp: '118/76',
      temp: 36.8,
      rr: 14,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 28,
    sex: 'male',
    chiefComplaint: 'Low back pain',
    duration: 'acute',
    severity: 'moderate',
    redFlags: [],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: [],
    physicalExamFindings: ['No neurologic deficits', 'Normal gait']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 28,
      sex: 'male',
      chiefComplaint: 'Low back pain',
      duration: 'acute',
      severity: 'moderate',
      redFlags: [],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: [],
      physicalExamFindings: ['No neurologic deficits', 'Normal gait']
    },
    ['X-ray', 'CT without contrast', 'MRI without contrast', 'No imaging']
  ),
  teachingPoints: [
    'Acute mechanical low back pain without red flags typically does not require immediate imaging',
    'First-line management includes NSAIDs, activity modification, and patient education',
    'Imaging should be reserved for patients with red flags or failure of conservative management after 4-6 weeks',
    'X-ray has limited utility in acute mechanical LBP without trauma or red flags'
  ],
  keyPearls: [
    'Red flags include: cauda equina syndrome, progressive neurologic deficit, suspected cancer, infection, or fracture',
    'ACR guidelines recommend imaging only after 6 weeks of conservative management fails in uncomplicated LBP',
    'Radiation exposure should be minimized, especially in young patients'
  ]
}

export const case2_LBPWithRedFlags: ClinicalCase = {
  id: 'lbp-red-flags',
  title: 'Low Back Pain with Red Flags',
  specialty: 'Emergency Medicine',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 65,
    sex: 'female',
    chiefComplaint: 'Severe low back pain with leg weakness',
    hpi: 'A 65-year-old female with history of breast cancer (treated 2 years ago) presents with severe low back pain that started 2 weeks ago and has progressively worsened. She reports new-onset weakness in her right leg, difficulty walking, and urinary retention. Pain is worse at night and not relieved by rest.',
    physicalExam: [
      'Weakness: Right hip flexor 3/5, right knee extension 4/5',
      'Decreased sensation in right L3-L4 dermatome',
      'Hyperreflexia in right lower extremity',
      'Positive Babinski sign on right',
      'Tenderness over L3-L4 spinous processes'
    ],
    vitalSigns: {
      hr: 88,
      bp: '142/88',
      temp: 37.1,
      rr: 16,
      o2sat: 98
    }
  },
  clinicalInput: {
    age: 65,
    sex: 'female',
    chiefComplaint: 'Low back pain with neurologic deficit',
    duration: 'subacute',
    severity: 'severe',
    redFlags: ['Progressive neurologic deficit', 'Cancer history', 'Night pain', 'Urinary retention'],
    cancerHistory: true,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: true,
    progressiveSymptoms: true,
    priorImaging: [],
    labsAvailable: ['CBC', 'Basic metabolic panel'],
    physicalExamFindings: ['Focal weakness', 'Hyperreflexia', 'Positive Babinski']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 65,
      sex: 'female',
      chiefComplaint: 'Low back pain with neurologic deficit',
      duration: 'subacute',
      severity: 'severe',
      redFlags: ['Progressive neurologic deficit', 'Cancer history', 'Night pain', 'Urinary retention'],
      cancerHistory: true,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: true,
      progressiveSymptoms: true,
      priorImaging: [],
      labsAvailable: ['CBC', 'Basic metabolic panel'],
      physicalExamFindings: ['Focal weakness', 'Hyperreflexia', 'Positive Babinski']
    },
    ['X-ray', 'CT without contrast', 'CT with contrast', 'MRI without contrast', 'MRI with contrast']
  ),
  teachingPoints: [
    'Multiple red flags (cancer history, progressive neurologic deficit, urinary retention) mandate urgent imaging',
    'MRI is the preferred modality for evaluating spinal cord compression and metastatic disease',
    'Contrast-enhanced MRI improves detection of metastatic lesions and infection',
    'This presentation suggests possible spinal cord compression requiring urgent neurosurgical evaluation'
  ],
  keyPearls: [
    'Cancer history + neurologic deficit = high suspicion for metastatic spinal cord compression',
    'Urinary retention with back pain suggests cauda equina syndrome or cord compression',
    'Progressive neurologic deficits require same-day imaging and neurosurgical consultation'
  ]
}

export const case3_ChronicLBPFailedConservative: ClinicalCase = {
  id: 'lbp-chronic-failed-conservative',
  title: 'Chronic Low Back Pain After Failed Conservative Management',
  specialty: 'Primary Care',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 45,
    sex: 'male',
    chiefComplaint: 'Low back pain for 8 weeks',
    hpi: 'A 45-year-old male presents with low back pain that started 8 weeks ago after a work-related lifting injury. He has tried NSAIDs, physical therapy, and activity modification without improvement. Pain radiates to the right buttock but not below the knee. No weakness, numbness, or bowel/bladder changes.',
    physicalExam: [
      'Antalgic gait favoring right leg',
      'Limited forward flexion due to pain',
      'Positive right straight leg raise at 45 degrees',
      'No focal motor weakness',
      'Normal reflexes and sensation'
    ],
    vitalSigns: {
      hr: 76,
      bp: '128/82',
      temp: 36.9,
      rr: 14,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 45,
    sex: 'male',
    chiefComplaint: 'Low back pain',
    duration: 'chronic',
    severity: 'moderate',
    redFlags: [],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: ['X-ray lumbar spine 8 weeks ago - normal'],
    labsAvailable: [],
    physicalExamFindings: ['Positive SLR', 'No neurologic deficits']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 45,
      sex: 'male',
      chiefComplaint: 'Low back pain',
      duration: 'chronic',
      severity: 'moderate',
      redFlags: [],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: ['X-ray lumbar spine 8 weeks ago - normal'],
      labsAvailable: [],
      physicalExamFindings: ['Positive SLR', 'No neurologic deficits']
    },
    ['X-ray', 'CT without contrast', 'MRI without contrast', 'No imaging']
  ),
  teachingPoints: [
    'After 6+ weeks of failed conservative management, imaging becomes appropriate',
    'MRI is preferred over CT for evaluating disc herniation and nerve root compression',
    'Positive SLR suggests possible radiculopathy, warranting advanced imaging',
    'Prior normal X-ray does not exclude disc pathology'
  ],
  keyPearls: [
    'ACR guidelines support imaging after 6 weeks of failed conservative therapy',
    'MRI provides superior soft tissue detail for disc herniation and nerve root compression',
    'Radiculopathy symptoms (radiating pain, positive SLR) increase appropriateness of MRI'
  ]
}

// ============================================================================
// HEADACHE CASES
// ============================================================================

export const case4_BenignHeadache: ClinicalCase = {
  id: 'headache-benign',
  title: 'Benign Tension-Type Headache',
  specialty: 'Emergency Medicine',
  difficulty: 'beginner',
  patientPresentation: {
    age: 32,
    sex: 'female',
    chiefComplaint: 'Headache for 2 days',
    hpi: 'A 32-year-old female presents with a bilateral, pressing headache that started 2 days ago. She describes it as a "band-like" sensation, rated 5/10. The headache is not associated with nausea, vomiting, photophobia, or phonophobia. She has had similar headaches monthly for the past year. No recent trauma, fever, or visual changes.',
    physicalExam: [
      'Alert and oriented',
      'Normal cranial nerve examination',
      'No papilledema on fundoscopic exam',
      'Normal motor and sensory examination',
      'No meningeal signs'
    ],
    vitalSigns: {
      hr: 68,
      bp: '112/70',
      temp: 36.7,
      rr: 12,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 32,
    sex: 'female',
    chiefComplaint: 'Headache',
    duration: 'acute',
    severity: 'mild',
    redFlags: [],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: [],
    physicalExamFindings: ['Normal neurologic exam', 'No red flags']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 32,
      sex: 'female',
      chiefComplaint: 'Headache',
      duration: 'acute',
      severity: 'mild',
      redFlags: [],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: [],
      physicalExamFindings: ['Normal neurologic exam', 'No red flags']
    },
    ['CT without contrast', 'MRI without contrast', 'No imaging']
  ),
  teachingPoints: [
    'Benign tension-type headaches do not require neuroimaging',
    'Red flags for headache include: sudden onset ("thunderclap"), focal neurologic deficits, papilledema, age >50 with new headache, cancer history',
    'Routine neuroimaging in patients with normal neurologic exam and no red flags has low yield',
    'First-line management includes NSAIDs and reassurance'
  ],
  keyPearls: [
    'ACR guidelines: Neuroimaging not indicated for typical tension-type or migraine headaches without red flags',
    'Cost-effectiveness analysis shows low value of routine CT in uncomplicated headaches',
    'Clinical history and physical exam are more important than imaging in benign headaches'
  ]
}

export const case5_HeadacheWithRedFlags: ClinicalCase = {
  id: 'headache-red-flags',
  title: 'Thunderclap Headache - Subarachnoid Hemorrhage',
  specialty: 'Emergency Medicine',
  difficulty: 'advanced',
  patientPresentation: {
    age: 48,
    sex: 'male',
    chiefComplaint: 'Worst headache of my life',
    hpi: 'A 48-year-old male presents with sudden-onset severe headache that began 2 hours ago while at rest. He describes it as "the worst headache of my life" - 10/10 severity. Associated with nausea, vomiting, and photophobia. No loss of consciousness. No recent trauma. History of hypertension.',
    physicalExam: [
      'Alert but uncomfortable',
      'Neck stiffness present',
      'Positive Kernig sign',
      'Normal cranial nerves',
      'No focal motor deficits',
      'BP 168/102'
    ],
    vitalSigns: {
      hr: 92,
      bp: '168/102',
      temp: 37.2,
      rr: 16,
      o2sat: 98
    }
  },
  clinicalInput: {
    age: 48,
    sex: 'male',
    chiefComplaint: 'Thunderclap headache',
    duration: 'acute',
    severity: 'severe',
    redFlags: ['Thunderclap onset', 'Worst headache of life', 'Meningeal signs'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: [],
    physicalExamFindings: ['Meningeal signs', 'Neck stiffness']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 48,
      sex: 'male',
      chiefComplaint: 'Thunderclap headache',
      duration: 'acute',
      severity: 'severe',
      redFlags: ['Thunderclap onset', 'Worst headache of life', 'Meningeal signs'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: [],
      physicalExamFindings: ['Meningeal signs', 'Neck stiffness']
    },
    ['CT without contrast', 'CT with contrast', 'MRI without contrast', 'MRI with contrast']
  ),
  teachingPoints: [
    'Thunderclap headache is a red flag requiring urgent neuroimaging',
    'CT without contrast is the first-line imaging modality for suspected subarachnoid hemorrhage',
    'If CT is negative but clinical suspicion remains high, lumbar puncture is indicated',
    'CTA may be needed if CT shows subarachnoid blood to identify aneurysm'
  ],
  keyPearls: [
    'Thunderclap headache = sudden onset severe headache reaching peak intensity within 1 minute',
    'CT without contrast has >95% sensitivity for subarachnoid hemorrhage within 24 hours',
    'Meningeal signs (neck stiffness, Kernig, Brudzinski) suggest subarachnoid hemorrhage or meningitis',
    'Time is critical - early detection prevents rebleeding and improves outcomes'
  ]
}

// ============================================================================
// ABDOMINAL PAIN CASES
// ============================================================================

export const case6_AcuteAppendicitis: ClinicalCase = {
  id: 'abd-acute-appendicitis',
  title: 'Acute Appendicitis',
  specialty: 'Emergency Medicine',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 24,
    sex: 'male',
    chiefComplaint: 'Right lower quadrant abdominal pain',
    hpi: 'A 24-year-old male presents with right lower quadrant abdominal pain that started 12 hours ago. Pain initially periumbilical, then migrated to RLQ. Associated with nausea, vomiting, and anorexia. No fever, diarrhea, or urinary symptoms. Pain is worse with movement.',
    physicalExam: [
      'Tender at McBurney point',
      'Positive Rovsing sign',
      'Positive psoas sign',
      'Guarding present',
      'No rebound tenderness',
      'Normal bowel sounds'
    ],
    vitalSigns: {
      hr: 98,
      bp: '128/78',
      temp: 37.8,
      rr: 16,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 24,
    sex: 'male',
    chiefComplaint: 'Right lower quadrant pain',
    duration: 'acute',
    severity: 'moderate',
    redFlags: ['Focal tenderness', 'Peritoneal signs'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: ['WBC 12,500', 'CRP elevated'],
    physicalExamFindings: ['McBurney tenderness', 'Positive Rovsing sign']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 24,
      sex: 'male',
      chiefComplaint: 'Right lower quadrant pain',
      duration: 'acute',
      severity: 'moderate',
      redFlags: ['Focal tenderness', 'Peritoneal signs'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: ['WBC 12,500', 'CRP elevated'],
      physicalExamFindings: ['McBurney tenderness', 'Positive Rovsing sign']
    },
    ['CT with contrast', 'CT without contrast', 'Ultrasound', 'X-ray']
  ),
  teachingPoints: [
    'CT with contrast is the preferred imaging modality for suspected appendicitis in adults',
    'Ultrasound is first-line in pediatric and pregnant patients to avoid radiation',
    'Classic presentation (migratory pain, RLQ tenderness, positive signs) has high clinical accuracy',
    'CT improves diagnostic accuracy and reduces negative appendectomy rates'
  ],
  keyPearls: [
    'ACR appropriateness: CT abdomen/pelvis with contrast is "Usually Appropriate" for suspected appendicitis',
    'Ultrasound sensitivity ~85% vs CT ~95% for appendicitis',
    'Radiation exposure must be balanced against diagnostic benefit, especially in young patients',
    'Clinical scoring systems (Alvarado, AIR) can help guide imaging decisions'
  ]
}

export const case7_ChronicAbdominalPain: ClinicalCase = {
  id: 'abd-chronic-pain',
  title: 'Chronic Abdominal Pain',
  specialty: 'Primary Care',
  difficulty: 'beginner',
  patientPresentation: {
    age: 38,
    sex: 'female',
    chiefComplaint: 'Recurrent abdominal pain for 3 months',
    hpi: 'A 38-year-old female presents with recurrent, diffuse abdominal pain for 3 months. Pain is intermittent, worse with stress, and associated with bloating and alternating constipation/diarrhea. No weight loss, fever, or blood in stool. Multiple prior ED visits with normal labs and CT.',
    physicalExam: [
      'Soft, non-tender abdomen',
      'Normal bowel sounds',
      'No masses or organomegaly',
      'No peritoneal signs',
      'Normal rectal exam'
    ],
    vitalSigns: {
      hr: 72,
      bp: '118/74',
      temp: 36.8,
      rr: 14,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 38,
    sex: 'female',
    chiefComplaint: 'Chronic abdominal pain',
    duration: 'chronic',
    severity: 'mild',
    redFlags: [],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: ['CT abdomen/pelvis 2 months ago - normal'],
    labsAvailable: ['CBC normal', 'CMP normal', 'Lipase normal'],
    physicalExamFindings: ['Non-tender abdomen', 'No red flags']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 38,
      sex: 'female',
      chiefComplaint: 'Chronic abdominal pain',
      duration: 'chronic',
      severity: 'mild',
      redFlags: [],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: ['CT abdomen/pelvis 2 months ago - normal'],
      labsAvailable: ['CBC normal', 'CMP normal', 'Lipase normal'],
      physicalExamFindings: ['Non-tender abdomen', 'No red flags']
    },
    ['CT with contrast', 'CT without contrast', 'Ultrasound', 'MRI without contrast', 'No imaging']
  ),
  teachingPoints: [
    'Chronic abdominal pain without red flags and with recent normal imaging rarely benefits from repeat CT',
    'Irritable bowel syndrome is a clinical diagnosis and does not require imaging',
    'Repeat imaging within 3 months has very low yield unless new red flags develop',
    'Consider functional causes (IBS, functional dyspepsia) before repeat imaging'
  ],
  keyPearls: [
    'Red flags for chronic abdominal pain: weight loss, blood in stool, family history of GI cancer, age >50',
    'Rome IV criteria help diagnose functional GI disorders without imaging',
    'Repeat CT within 3 months rarely changes management unless new symptoms develop',
    'Consider alternative diagnoses (IBS, functional dyspepsia) before repeat imaging'
  ]
}

// ============================================================================
// CHEST PAIN CASES
// ============================================================================

export const case8_AcuteChestPain: ClinicalCase = {
  id: 'chest-acute-pain',
  title: 'Acute Chest Pain - Atypical',
  specialty: 'Emergency Medicine',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 55,
    sex: 'male',
    chiefComplaint: 'Chest pain for 2 hours',
    hpi: 'A 55-year-old male with hypertension and hyperlipidemia presents with substernal chest pressure that started 2 hours ago at rest. Pain is 6/10, non-radiating, and partially relieved by rest. No diaphoresis, nausea, or dyspnea. Normal EKG and initial troponin.',
    physicalExam: [
      'Comfortable appearance',
      'Normal heart sounds, no murmurs',
      'Clear lungs bilaterally',
      'No lower extremity edema',
      'Normal peripheral pulses'
    ],
    vitalSigns: {
      hr: 78,
      bp: '142/88',
      temp: 36.9,
      rr: 14,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 55,
    sex: 'male',
    chiefComplaint: 'Chest pain',
    duration: 'acute',
    severity: 'moderate',
    redFlags: ['Age >50', 'Cardiac risk factors'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: ['EKG normal', 'Troponin normal'],
    physicalExamFindings: ['Normal cardiac exam']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 55,
      sex: 'male',
      chiefComplaint: 'Chest pain',
      duration: 'acute',
      severity: 'moderate',
      redFlags: ['Age >50', 'Cardiac risk factors'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: ['EKG normal', 'Troponin normal'],
      physicalExamFindings: ['Normal cardiac exam']
    },
    ['CT with contrast', 'CT without contrast', 'X-ray', 'Nuclear medicine']
  ),
  teachingPoints: [
    'Chest pain with cardiac risk factors requires risk stratification',
    'CTA chest is appropriate for intermediate-risk patients with normal EKG and troponin',
    'Coronary CTA can rule out significant CAD in low-to-intermediate risk patients',
    'Radiation exposure must be considered, especially with serial troponins and EKG monitoring'
  ],
  keyPearls: [
    'ACR appropriateness: CTA chest is "Usually Appropriate" for intermediate-risk chest pain',
    'HEART score helps risk-stratify chest pain patients',
    'CTA has high negative predictive value for excluding significant CAD',
    'Consider radiation exposure vs diagnostic benefit, especially in younger patients'
  ]
}

export const case9_ChestPainPneumonia: ClinicalCase = {
  id: 'chest-pneumonia',
  title: 'Chest Pain with Suspected Pneumonia',
  specialty: 'Emergency Medicine',
  difficulty: 'beginner',
  patientPresentation: {
    age: 42,
    sex: 'female',
    chiefComplaint: 'Chest pain and cough',
    hpi: 'A 42-year-old female presents with 3 days of pleuritic chest pain, productive cough with yellow sputum, and fever. No cardiac risk factors. Pain is worse with deep inspiration. She feels short of breath with exertion.',
    physicalExam: [
      'Fever 38.5°C',
      'Tachypnea 22/min',
      'Decreased breath sounds and crackles in right lower lobe',
      'Dullness to percussion right base',
      'Normal heart sounds',
      'No lower extremity edema'
    ],
    vitalSigns: {
      hr: 102,
      bp: '118/72',
      temp: 38.5,
      rr: 22,
      o2sat: 94
    }
  },
  clinicalInput: {
    age: 42,
    sex: 'female',
    chiefComplaint: 'Chest pain with respiratory symptoms',
    duration: 'acute',
    severity: 'moderate',
    redFlags: ['Fever', 'Hypoxia'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: ['WBC 14,000', 'Chest X-ray ordered'],
    physicalExamFindings: ['Crackles', 'Decreased breath sounds', 'Fever']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 42,
      sex: 'female',
      chiefComplaint: 'Chest pain with respiratory symptoms',
      duration: 'acute',
      severity: 'moderate',
      redFlags: ['Fever', 'Hypoxia'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: ['WBC 14,000', 'Chest X-ray ordered'],
      physicalExamFindings: ['Crackles', 'Decreased breath sounds', 'Fever']
    },
    ['X-ray', 'CT without contrast', 'CT with contrast']
  ),
  teachingPoints: [
    'Chest X-ray is the first-line imaging for suspected pneumonia',
    'CT is reserved for complicated cases, immunocompromised patients, or when X-ray is inconclusive',
    'Clinical diagnosis of pneumonia can be made without imaging in uncomplicated cases',
    'Chest X-ray confirms diagnosis and evaluates for complications (pleural effusion, abscess)'
  ],
  keyPearls: [
    'Chest X-ray has high sensitivity for detecting pneumonia',
    'CT is indicated for: immunocompromised patients, suspected complications, or diagnostic uncertainty',
    'Pleural effusion on X-ray may require CT for better characterization',
    'Radiation exposure from chest X-ray is minimal compared to CT'
  ]
}

// ============================================================================
// PEDIATRIC CASES
// ============================================================================

export const case10_PediatricHeadTrauma: ClinicalCase = {
  id: 'peds-head-trauma',
  title: 'Pediatric Head Trauma',
  specialty: 'Pediatric Emergency Medicine',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 8,
    sex: 'male',
    chiefComplaint: 'Head injury after fall',
    hpi: 'An 8-year-old male presents after falling from playground equipment (approximately 4 feet). He hit his head but did not lose consciousness. Parents report he was initially crying but now appears normal. He vomited once in the car on the way to the ED. No seizures, no focal weakness.',
    physicalExam: [
      'Alert and interactive',
      'GCS 15',
      'Normal cranial nerve examination',
      'No signs of basilar skull fracture',
      'Small scalp hematoma over right parietal region',
      'Normal motor and sensory examination',
      'No signs of increased intracranial pressure'
    ],
    vitalSigns: {
      hr: 88,
      bp: '102/64',
      temp: 36.9,
      rr: 18,
      o2sat: 100
    }
  },
  clinicalInput: {
    age: 8,
    sex: 'male',
    chiefComplaint: 'Head trauma',
    duration: 'acute',
    severity: 'moderate',
    redFlags: ['Vomiting'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: true,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: [],
    physicalExamFindings: ['GCS 15', 'Normal neurologic exam', 'Vomiting']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 8,
      sex: 'male',
      chiefComplaint: 'Head trauma',
      duration: 'acute',
      severity: 'moderate',
      redFlags: ['Vomiting'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: true,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: [],
      physicalExamFindings: ['GCS 15', 'Normal neurologic exam', 'Vomiting']
    },
    ['CT without contrast', 'MRI without contrast', 'X-ray', 'No imaging']
  ),
  teachingPoints: [
    'PECARN criteria help determine which pediatric head trauma patients need CT',
    'Radiation exposure is a major concern in pediatric patients due to increased cancer risk',
    'GCS 15, normal exam, and single vomiting may not require CT if other PECARN criteria are absent',
    'Clinical observation may be appropriate before imaging in low-risk pediatric head trauma'
  ],
  keyPearls: [
    'PECARN rules: High-risk criteria (GCS <15, signs of basilar skull fracture, severe mechanism) warrant CT',
    'Radiation exposure in children increases lifetime cancer risk - minimize unnecessary CTs',
    'Single vomiting without other high-risk features may be observed rather than imaged',
    'MRI avoids radiation but requires sedation in young children and is less available emergently'
  ]
}

export const case11_PediatricAppendicitis: ClinicalCase = {
  id: 'peds-appendicitis',
  title: 'Pediatric Appendicitis',
  specialty: 'Pediatric Emergency Medicine',
  difficulty: 'intermediate',
  patientPresentation: {
    age: 12,
    sex: 'female',
    chiefComplaint: 'Abdominal pain',
    hpi: 'A 12-year-old female presents with 18 hours of abdominal pain. Pain started periumbilical and migrated to right lower quadrant. Associated with nausea, vomiting, and anorexia. Low-grade fever. No diarrhea or urinary symptoms.',
    physicalExam: [
      'Fever 37.9°C',
      'Tender at McBurney point',
      'Positive Rovsing sign',
      'Guarding present',
      'Rebound tenderness present',
      'Normal bowel sounds'
    ],
    vitalSigns: {
      hr: 108,
      bp: '112/68',
      temp: 37.9,
      rr: 18,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 12,
    sex: 'female',
    chiefComplaint: 'Right lower quadrant pain',
    duration: 'acute',
    severity: 'moderate',
    redFlags: ['Focal tenderness', 'Peritoneal signs', 'Fever'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: ['WBC 15,000'],
    physicalExamFindings: ['McBurney tenderness', 'Rebound tenderness', 'Fever']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 12,
      sex: 'female',
      chiefComplaint: 'Right lower quadrant pain',
      duration: 'acute',
      severity: 'moderate',
      redFlags: ['Focal tenderness', 'Peritoneal signs', 'Fever'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: ['WBC 15,000'],
      physicalExamFindings: ['McBurney tenderness', 'Rebound tenderness', 'Fever']
    },
    ['Ultrasound', 'CT with contrast', 'CT without contrast', 'MRI without contrast']
  ),
  teachingPoints: [
    'Ultrasound is the first-line imaging modality for suspected appendicitis in pediatric patients',
    'Ultrasound avoids radiation exposure, which is critical in children',
    'CT is reserved for cases where ultrasound is inconclusive or unavailable',
    'MRI can be used as an alternative to CT to avoid radiation but requires longer scan time'
  ],
  keyPearls: [
    'ACR appropriateness: Ultrasound is "Usually Appropriate" for pediatric appendicitis',
    'Radiation exposure in children increases lifetime cancer risk - use ultrasound first',
    'Ultrasound sensitivity ~85% for appendicitis, CT ~95%',
    'If ultrasound is inconclusive, consider MRI (no radiation) before CT'
  ]
}

export const case12_PediatricSeizure: ClinicalCase = {
  id: 'peds-seizure',
  title: 'First-Time Seizure in Child',
  specialty: 'Pediatric Emergency Medicine',
  difficulty: 'advanced',
  patientPresentation: {
    age: 6,
    sex: 'male',
    chiefComplaint: 'First-time seizure',
    hpi: 'A 6-year-old male presents after a witnessed generalized tonic-clonic seizure lasting 2 minutes. The seizure occurred while he was playing, and he had a fever of 38.8°C. Parents report he was acting normally before the event. No head trauma, no known seizure history, no family history of seizures.',
    physicalExam: [
      'Post-ictal, gradually improving',
      'GCS improving from 12 to 14',
      'Fever 38.8°C',
      'Normal cranial nerves',
      'No focal neurologic deficits',
      'Normal fundoscopic exam',
      'No signs of head trauma',
      'Normal cardiac and respiratory exam'
    ],
    vitalSigns: {
      hr: 112,
      bp: '98/62',
      temp: 38.8,
      rr: 20,
      o2sat: 99
    }
  },
  clinicalInput: {
    age: 6,
    sex: 'male',
    chiefComplaint: 'First-time seizure',
    duration: 'acute',
    severity: 'severe',
    redFlags: ['First-time seizure', 'Fever'],
    cancerHistory: false,
    immunocompromised: false,
    recentTrauma: false,
    neurologicDeficit: false,
    progressiveSymptoms: false,
    priorImaging: [],
    labsAvailable: ['CBC', 'CMP', 'Blood glucose'],
    physicalExamFindings: ['Post-ictal', 'Fever', 'No focal deficits']
  },
  imagingOptions: rankImagingOptions(
    {
      age: 6,
      sex: 'male',
      chiefComplaint: 'First-time seizure',
      duration: 'acute',
      severity: 'severe',
      redFlags: ['First-time seizure', 'Fever'],
      cancerHistory: false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: ['CBC', 'CMP', 'Blood glucose'],
      physicalExamFindings: ['Post-ictal', 'Fever', 'No focal deficits']
    },
    ['CT without contrast', 'MRI without contrast', 'No imaging']
  ),
  teachingPoints: [
    'First-time seizure with fever in a child is often a febrile seizure (benign)',
    'Neuroimaging is not routinely indicated for simple febrile seizures',
    'CT may be indicated if: focal seizure, head trauma, persistent focal deficits, or age <6 months',
    'MRI is preferred over CT in children when imaging is needed (no radiation)'
  ],
  keyPearls: [
    'Simple febrile seizures (generalized, <15 min, no focal features) do not require neuroimaging',
    'Complex febrile seizures (focal, prolonged, recurrent) may warrant imaging',
    'Radiation exposure in children increases cancer risk - avoid CT unless necessary',
    'Clinical history and exam are more important than imaging in first-time pediatric seizures'
  ]
}

// ============================================================================
// EXPORT ALL CASES
// ============================================================================

export const allAIIECases: ClinicalCase[] = [
  case1_AcuteMechanicalLBP,
  case2_LBPWithRedFlags,
  case3_ChronicLBPFailedConservative,
  case4_BenignHeadache,
  case5_HeadacheWithRedFlags,
  case6_AcuteAppendicitis,
  case7_ChronicAbdominalPain,
  case8_AcuteChestPain,
  case9_ChestPainPneumonia,
  case10_PediatricHeadTrauma,
  case11_PediatricAppendicitis,
  case12_PediatricSeizure
]

export function getCaseById(id: string): ClinicalCase | undefined {
  return allAIIECases.find(c => c.id === id)
}

export function getCasesBySpecialty(specialty: string): ClinicalCase[] {
  return allAIIECases.filter(c => c.specialty === specialty)
}

export function getCasesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ClinicalCase[] {
  return allAIIECases.filter(c => c.difficulty === difficulty)
}
