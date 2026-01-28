/**
 * Database Seed Script
 * 
 * Populates the Supabase database with initial cases and assessments.
 * 
 * Usage:
 *   npx tsx scripts/seed.ts
 * 
 * Make sure your .env.local file has the correct Supabase credentials.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL')
  console.error('  SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample cases matching the schema
const sampleCases = [
  {
    slug: 'chest-pain-typical-angina',
    title: 'Typical Angina with Cardiovascular Risk Factors',
    chief_complaint: 'Chest pressure with exertion for the past 2 months',
    category: 'chest-pain',
    difficulty: 'intermediate',
    specialties: ['em', 'im', 'fm'],
    patient_data: {
      age: 62,
      sex: 'male',
      history: [
        'Type 2 Diabetes Mellitus - 10 years',
        'Hypertension - 15 years',
        'Hyperlipidemia',
        'Former smoker - quit 5 years ago (30 pack-years)',
      ],
      vitals: {
        heart_rate: 76,
        blood_pressure: '142/88',
        respiratory_rate: 14,
        temperature: 36.7,
        oxygen_saturation: 98,
      },
    },
    hpi: `A 62-year-old male presents with a 2-month history of chest discomfort that occurs with physical exertion. He describes the sensation as a "pressure" or "tightness" in the center of his chest, sometimes radiating to his left arm. The discomfort typically begins after walking 2-3 blocks or climbing a flight of stairs and resolves within 5-10 minutes of rest.`,
    physical_exam: {
      cardiovascular: 'Regular rate and rhythm. Normal S1, S2. No murmurs.',
      lungs: 'Clear to auscultation bilaterally.',
      extremities: 'No peripheral edema.',
    },
    imaging_options: [
      {
        id: 'stress-echo',
        name: 'Exercise Stress Echocardiography',
        modality: 'ultrasound',
        acr_rating: 8,
      },
      {
        id: 'stress-mpi',
        name: 'Stress Myocardial Perfusion Imaging',
        modality: 'nuclear',
        acr_rating: 8,
      },
      {
        id: 'coronary-cta',
        name: 'Coronary CTA',
        modality: 'ct',
        acr_rating: 6,
      },
    ],
    correct_answer: 'stress-echo',
    explanation: `This patient has typical angina with intermediate-to-high pretest probability for coronary artery disease. Functional testing (stress test with imaging) is the appropriate first-line evaluation. Exercise stress echocardiography or stress myocardial perfusion imaging are both excellent choices (ACR 8).`,
    teaching_points: [
      'Typical angina has three characteristics: substernal discomfort, provoked by exertion/stress, relieved by rest.',
      'For intermediate pretest probability patients, functional testing (stress test) is preferred.',
      'Exercise stress with imaging provides both diagnostic and prognostic information.',
    ],
    status: 'published',
  },
  {
    slug: 'low-back-pain-mechanical',
    title: 'Acute Mechanical Low Back Pain',
    chief_complaint: 'Lower back pain for 3 days after lifting heavy box',
    category: 'low-back-pain',
    difficulty: 'beginner',
    specialties: ['fm', 'em'],
    patient_data: {
      age: 35,
      sex: 'male',
      history: ['No significant past medical history'],
      vitals: {
        heart_rate: 72,
        blood_pressure: '120/80',
        respiratory_rate: 16,
        temperature: 36.5,
      },
    },
    hpi: `A 35-year-old male presents with 3 days of lower back pain that started after lifting a heavy box at work. The pain is localized to the lower lumbar region, rated 6/10, and is worse with movement and bending. He denies any radicular symptoms, numbness, or weakness in the legs. No bowel or bladder dysfunction.`,
    physical_exam: {
      back: 'Tenderness to palpation over L4-L5 region. No step-off deformity.',
      neurologic: 'Full strength in lower extremities. Normal reflexes. Negative straight leg raise bilaterally.',
    },
    imaging_options: [
      {
        id: 'lumbar-xray',
        name: 'Lumbar Spine X-Ray',
        modality: 'xray',
        acr_rating: 2,
      },
      {
        id: 'lumbar-mri',
        name: 'Lumbar Spine MRI',
        modality: 'mri',
        acr_rating: 1,
      },
      {
        id: 'no-imaging',
        name: 'No Imaging - Clinical Management',
        modality: 'none',
        acr_rating: 9,
      },
    ],
    correct_answer: 'no-imaging',
    explanation: `This patient has acute mechanical low back pain without red flags. According to ACR guidelines, imaging is NOT indicated in the first 6 weeks unless red flags are present. Clinical management with NSAIDs, activity modification, and physical therapy is appropriate.`,
    teaching_points: [
      'Acute low back pain without red flags does not require imaging in the first 6 weeks.',
      'Red flags include: cauda equina symptoms, progressive neurologic deficit, history of cancer, fever, or trauma.',
      'Most acute low back pain resolves with conservative management.',
    ],
    status: 'published',
  },
  {
    slug: 'headache-migraine',
    title: 'Recurrent Migraine Headache',
    chief_complaint: 'Recurrent headaches for 6 months',
    category: 'headache',
    difficulty: 'beginner',
    specialties: ['fm', 'im', 'em'],
    patient_data: {
      age: 28,
      sex: 'female',
      history: ['Migraine headaches since age 18'],
      vitals: {
        heart_rate: 68,
        blood_pressure: '110/70',
        respiratory_rate: 14,
        temperature: 36.6,
      },
    },
    hpi: `A 28-year-old female presents with a history of recurrent headaches for 6 months. She describes them as unilateral, throbbing, associated with photophobia and nausea. They typically last 4-6 hours and occur 2-3 times per month. She has tried over-the-counter medications with limited relief.`,
    physical_exam: {
      general: 'Well-appearing female in no acute distress.',
      neurologic: 'Normal cranial nerves. No focal neurologic deficits.',
      fundoscopic: 'Normal optic discs, no papilledema.',
    },
    imaging_options: [
      {
        id: 'head-ct',
        name: 'Head CT without Contrast',
        modality: 'ct',
        acr_rating: 2,
      },
      {
        id: 'head-mri',
        name: 'Brain MRI',
        modality: 'mri',
        acr_rating: 2,
      },
      {
        id: 'no-imaging',
        name: 'No Imaging - Clinical Management',
        modality: 'none',
        acr_rating: 8,
      },
    ],
    correct_answer: 'no-imaging',
    explanation: `This patient has a classic migraine pattern without red flags. Neuroimaging is typically not indicated for patients with a stable migraine pattern and normal neurologic examination. Clinical management with migraine-specific medications and lifestyle modifications is appropriate.`,
    teaching_points: [
      'Migraine headaches with a stable pattern and normal exam typically do not require neuroimaging.',
      'Red flags for headache include: sudden onset, worst headache of life, focal neurologic deficits, papilledema, or change in pattern.',
      'Consider imaging if there are concerning features or if the headache pattern has changed.',
    ],
    status: 'published',
  },
]

// Sample assessments
const sampleAssessments = [
  {
    name: 'Quick Assessment - Chest Pain',
    type: 'quick',
    description: 'A quick 5-question assessment covering common chest pain presentations.',
    question_count: 5,
    time_limit: 15,
    categories: ['chest-pain'],
    passing_score: 70,
    is_active: true,
  },
  {
    name: 'Emergency Medicine Specialty Assessment',
    type: 'specialty',
    description: 'Comprehensive assessment covering emergency medicine imaging decisions.',
    question_count: 20,
    time_limit: 60,
    categories: ['chest-pain', 'abdominal-pain', 'headache', 'extremity-trauma'],
    passing_score: 75,
    is_active: true,
  },
  {
    name: 'Full Board Review Assessment',
    type: 'full',
    description: 'Complete assessment covering all case categories and difficulty levels.',
    question_count: 50,
    time_limit: 120,
    categories: ['chest-pain', 'low-back-pain', 'headache', 'abdominal-pain', 'extremity-trauma'],
    passing_score: 80,
    is_active: true,
  },
]

async function seedCases() {
  console.log('🌱 Seeding cases...')
  
  for (const caseData of sampleCases) {
    const { data, error } = await supabase
      .from('cases')
      .upsert(caseData, { onConflict: 'slug' })
      .select()

    if (error) {
      console.error(`❌ Error seeding case ${caseData.slug}:`, error.message)
    } else {
      console.log(`✅ Seeded case: ${caseData.title}`)
    }
  }
}

async function seedAssessments() {
  console.log('🌱 Seeding assessments...')
  
  for (const assessmentData of sampleAssessments) {
    const { data, error } = await supabase
      .from('assessments')
      .upsert(assessmentData, { onConflict: 'id' })
      .select()

    if (error) {
      console.error(`❌ Error seeding assessment ${assessmentData.name}:`, error.message)
    } else {
      console.log(`✅ Seeded assessment: ${assessmentData.name}`)
    }
  }
}

async function main() {
  console.log('🚀 Starting database seed...\n')

  try {
    await seedCases()
    console.log('')
    await seedAssessments()
    console.log('\n✨ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed script
main()
