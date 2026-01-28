/**
 * Supabase API Helpers
 * Client-side functions for interacting with Supabase database
 */

import { createClient } from './client'

// Note: These types may need to be updated to match your actual Database type
// If your Database type uses different table names, adjust accordingly
type Case = {
  id: string
  slug: string
  title: string
  chief_complaint: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  specialties: string[]
  patient_data: any
  hpi: string
  physical_exam: any
  imaging_options: any
  correct_answer: string
  explanation: string
  teaching_points: string[]
  status: string
  created_at: string
}

type CaseAttempt = {
  id: string
  user_id: string
  case_id: string
  selected_option: string
  score: number
  time_taken: number | null
  hints_used: number
  mode: 'learning' | 'assessment'
  created_at: string
}

type Assessment = {
  id: string
  name: string
  type: 'quick' | 'specialty' | 'full' | 'custom'
  description: string | null
  question_count: number
  time_limit: number
  categories: string[] | null
  passing_score: number
  is_active: boolean
  created_at: string
}

type AssessmentAttempt = {
  id: string
  user_id: string
  assessment_id: string
  started_at: string
  completed_at: string | null
  answers: any
  score: number | null
  time_used: number | null
  created_at: string
}

type Profile = {
  id: string
  email: string
  name: string | null
  role: 'student' | 'resident' | 'attending' | 'admin'
  institution: string | null
  specialty: string | null
  training_year: string | null
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all published cases
 */
export async function getCases(filters?: {
  category?: string
  difficulty?: string
  specialty?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('cases')
    .select('*')
    .eq('status', 'published')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters?.specialty) {
    query = query.contains('specialties', [filters.specialty])
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cases:', error)
    throw error
  }

  return data || []
}

/**
 * Get a single case by slug
 */
export async function getCase(slug: string): Promise<Case | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Case not found
      return null
    }
    console.error('Error fetching case:', error)
    throw error
  }

  return data
}

/**
 * Submit a case attempt
 */
export async function submitCaseAttempt(
  caseId: string,
  selectedOption: string,
  score: number,
  timeTaken: number,
  hintsUsed: number = 0,
  mode: 'learning' | 'assessment' = 'learning'
) {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('case_attempts')
    .insert({
      user_id: user.id,
      case_id: caseId,
      selected_option: selectedOption,
      score,
      time_taken: timeTaken,
      hints_used: hintsUsed,
      mode,
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting case attempt:', error)
    throw error
  }

  return data
}

/**
 * Get user progress statistics
 */
export async function getUserProgress(userId?: string) {
  const supabase = createClient()
  
  // Get current user if not provided
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User must be authenticated')
    }
    targetUserId = user.id
  }

  // Get case attempts
  const { data: attempts, error: attemptsError } = await supabase
    .from('case_attempts')
    .select(`
      *,
      cases (
        id,
        slug,
        title,
        category,
        difficulty
      )
    `)
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (attemptsError) {
    console.error('Error fetching user attempts:', attemptsError)
    throw attemptsError
  }

  // Calculate statistics
  const totalAttempts = attempts?.length || 0
  const totalCases = new Set(attempts?.map((a: any) => a.case_id) || []).size
  const averageScore = attempts?.length
    ? attempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / attempts.length
    : 0
  const correctAttempts = attempts?.filter((a: any) => a.score >= 70).length || 0
  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

  // Get category breakdown
  const categoryBreakdown: Record<string, { attempted: number; correct: number }> = {}
  attempts?.forEach((attempt: any) => {
    const caseData = attempt.cases as Case
    if (caseData?.category) {
      if (!categoryBreakdown[caseData.category]) {
        categoryBreakdown[caseData.category] = { attempted: 0, correct: 0 }
      }
      categoryBreakdown[caseData.category].attempted++
      if (attempt.score >= 70) {
        categoryBreakdown[caseData.category].correct++
      }
    }
  })

  return {
    totalAttempts,
    totalCases,
    averageScore: Math.round(averageScore),
    accuracy: Math.round(accuracy),
    correctAttempts,
    categoryBreakdown,
    recentAttempts: attempts?.slice(0, 10) || [],
  }
}

/**
 * Get all active assessments
 */
export async function getAssessments(filters?: {
  type?: string
  category?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('assessments')
    .select('*')
    .eq('is_active', true)

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.category) {
    query = query.contains('categories', [filters.category])
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching assessments:', error)
    throw error
  }

  return data || []
}

/**
 * Get a single assessment by ID
 */
export async function getAssessment(assessmentId: string): Promise<Assessment | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching assessment:', error)
    throw error
  }

  return data
}

/**
 * Start an assessment attempt
 */
export async function startAssessmentAttempt(assessmentId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('assessment_attempts')
    .insert({
      user_id: user.id,
      assessment_id: assessmentId,
      started_at: new Date().toISOString(),
      answers: [],
    })
    .select()
    .single()

  if (error) {
    console.error('Error starting assessment attempt:', error)
    throw error
  }

  return data
}

/**
 * Submit an assessment attempt
 */
export async function submitAssessmentAttempt(
  attemptId: string,
  answers: Record<string, any>,
  score: number,
  timeUsed: number
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('assessment_attempts')
    .update({
      completed_at: new Date().toISOString(),
      answers,
      score,
      time_used: timeUsed,
    })
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error submitting assessment attempt:', error)
    throw error
  }

  return data
}

/**
 * Get user's assessment attempts
 */
export async function getUserAssessmentAttempts(assessmentId?: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }

  let query = supabase
    .from('assessment_attempts')
    .select(`
      *,
      assessments (
        id,
        name,
        type,
        description
      )
    `)
    .eq('user_id', user.id)

  if (assessmentId) {
    query = query.eq('assessment_id', assessmentId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching assessment attempts:', error)
    throw error
  }

  return data || []
}

/**
 * Get user achievements
 */
export async function getUserAchievements() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error fetching achievements:', error)
    throw error
  }

  return data || []
}
