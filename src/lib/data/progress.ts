/**
 * Mock progress data for ARKA-ED dashboard
 * Ready to be replaced with Supabase queries
 */

import type { CaseCategory, SpecialtyTrack } from '@/types/database'

// ============================================================================
// Types
// ============================================================================

export interface DashboardStats {
  casesCompleted: number
  totalCases: number
  overallAccuracy: number
  currentStreak: number
  timeSpent: {
    hours: number
    minutes: number
  }
  accuracyTrend: 'up' | 'down' | 'neutral'
}

export interface CategoryPerformance {
  category: CaseCategory
  label: string
  completed: number
  total: number
  accuracy: number
}

export interface SpecialtyPerformance {
  specialty: SpecialtyTrack
  label: string
  completed: number
  total: number
  accuracy: number
}

export interface ActivityItem {
  id: string
  caseName: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number // seconds
  timestamp: string
  caseId: string
}

export interface AchievementStatus {
  slug: string
  name: string
  description: string
  icon: string
  isEarned: boolean
  earnedAt?: string
  progress: number
  total: number
}

export interface Recommendation {
  id: string
  type: 'category' | 'specialty' | 'assessment' | 'badge'
  title: string
  description: string
  actionUrl: string
  priority: 'high' | 'medium' | 'low'
}

export interface ProgressData {
  stats: DashboardStats
  categoryPerformance: CategoryPerformance[]
  specialtyPerformance: SpecialtyPerformance[]
  recentActivity: ActivityItem[]
  achievements: AchievementStatus[]
  recommendations: Recommendation[]
  accuracyOverTime: Array<{ date: string; accuracy: number }>
  casesPerWeek: Array<{ week: string; cases: number }>
}

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Generate mock dashboard data
 */
export function getMockProgressData(): ProgressData {
  const now = new Date()
  
  // Generate last 30 days of accuracy data
  const accuracyOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split('T')[0],
      accuracy: Math.floor(Math.random() * 20) + 70 + (i * 0.3), // Trending upward
    }
  })

  // Generate last 8 weeks of cases data
  const casesPerWeek = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (7 * (7 - i)))
    return {
      week: `Week ${i + 1}`,
      cases: Math.floor(Math.random() * 5) + 2,
    }
  })

  return {
    stats: {
      casesCompleted: 22,
      totalCases: 50,
      overallAccuracy: 78,
      currentStreak: 5,
      timeSpent: {
        hours: 8,
        minutes: 32,
      },
      accuracyTrend: 'up',
    },
    categoryPerformance: [
      {
        category: 'headache',
        label: 'Neuroimaging',
        completed: 8,
        total: 12,
        accuracy: 75,
      },
      {
        category: 'extremity-trauma',
        label: 'MSK',
        completed: 5,
        total: 10,
        accuracy: 80,
      },
      {
        category: 'chest-pain',
        label: 'Chest',
        completed: 3,
        total: 8,
        accuracy: 67,
      },
      {
        category: 'abdominal-pain',
        label: 'Abdominal',
        completed: 4,
        total: 10,
        accuracy: 50,
      },
      {
        category: 'low-back-pain',
        label: 'Pediatric',
        completed: 2,
        total: 10,
        accuracy: 100,
      },
    ],
    specialtyPerformance: [
      {
        specialty: 'em',
        label: 'Emergency Medicine',
        completed: 12,
        total: 20,
        accuracy: 82,
      },
      {
        specialty: 'im',
        label: 'Internal Medicine',
        completed: 6,
        total: 15,
        accuracy: 75,
      },
      {
        specialty: 'fm',
        label: 'Family Medicine',
        completed: 4,
        total: 10,
        accuracy: 70,
      },
      {
        specialty: 'surgery',
        label: 'Surgery',
        completed: 0,
        total: 5,
        accuracy: 0,
      },
      {
        specialty: 'peds',
        label: 'Pediatrics',
        completed: 0,
        total: 0,
        accuracy: 0,
      },
    ],
    recentActivity: [
      {
        id: '1',
        caseName: 'Acute Chest Pain - 45M',
        userAnswer: 'CT Chest with Contrast',
        isCorrect: true,
        timeSpent: 245,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        caseId: 'chest-pain-001',
      },
      {
        id: '2',
        caseName: 'Headache with Neurological Symptoms',
        userAnswer: 'MRI Brain',
        isCorrect: true,
        timeSpent: 312,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        caseId: 'headache-002',
      },
      {
        id: '3',
        caseName: 'Abdominal Pain - 30F',
        userAnswer: 'CT Abdomen/Pelvis',
        isCorrect: false,
        timeSpent: 189,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'abdominal-pain-001',
      },
      {
        id: '4',
        caseName: 'Knee Trauma - 25M',
        userAnswer: 'X-Ray Knee',
        isCorrect: true,
        timeSpent: 156,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'extremity-trauma-001',
      },
      {
        id: '5',
        caseName: 'Chronic Low Back Pain',
        userAnswer: 'MRI Lumbar Spine',
        isCorrect: true,
        timeSpent: 278,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'low-back-pain-001',
      },
      {
        id: '6',
        caseName: 'Acute Chest Pain - 60M',
        userAnswer: 'CT Chest with Contrast',
        isCorrect: false,
        timeSpent: 201,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'chest-pain-002',
      },
      {
        id: '7',
        caseName: 'Severe Headache',
        userAnswer: 'CT Head',
        isCorrect: true,
        timeSpent: 167,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'headache-003',
      },
      {
        id: '8',
        caseName: 'Abdominal Pain - 50M',
        userAnswer: 'Ultrasound Abdomen',
        isCorrect: true,
        timeSpent: 223,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'abdominal-pain-002',
      },
      {
        id: '9',
        caseName: 'Ankle Fracture',
        userAnswer: 'X-Ray Ankle',
        isCorrect: true,
        timeSpent: 134,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'extremity-trauma-002',
      },
      {
        id: '10',
        caseName: 'Headache with Visual Changes',
        userAnswer: 'MRI Brain',
        isCorrect: true,
        timeSpent: 298,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        caseId: 'headache-004',
      },
    ],
    achievements: [
      {
        slug: 'first-case',
        name: 'First Steps',
        description: 'Complete 1 case',
        icon: '👣',
        isEarned: true,
        earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 1,
        total: 1,
      },
      {
        slug: 'week-streak',
        name: 'Streak Master',
        description: '7 day streak',
        icon: '🔥',
        isEarned: false,
        progress: 5,
        total: 7,
      },
      {
        slug: 'perfect-score',
        name: 'Perfect Score',
        description: '100% on assessment',
        icon: '🎯',
        isEarned: false,
        progress: 0,
        total: 1,
      },
      {
        slug: 'category-expert',
        name: 'Specialty Expert',
        description: 'Complete all cases in one specialty',
        icon: '🏆',
        isEarned: false,
        progress: 0,
        total: 1,
      },
      {
        slug: 'radiation-conscious',
        name: 'Radiation Conscious',
        description: 'Choose lowest-radiation appropriate option 10 times',
        icon: '☢️',
        isEarned: false,
        progress: 3,
        total: 10,
      },
    ],
    recommendations: [
      {
        id: '1',
        type: 'category',
        title: 'Focus on Chest Imaging',
        description: "You're struggling with Chest imaging - try these 3 cases",
        actionUrl: '/cases?category=chest-pain',
        priority: 'high',
      },
      {
        id: '2',
        type: 'badge',
        title: 'Complete 2 more Neuro cases',
        description: 'Complete 2 more Neuro cases to unlock the badge',
        actionUrl: '/cases?category=headache',
        priority: 'medium',
      },
      {
        id: '3',
        type: 'assessment',
        title: 'Take the MSK assessment',
        description: "Take the MSK assessment - you're ready!",
        actionUrl: '/assessments?specialty=msk',
        priority: 'medium',
      },
    ],
    accuracyOverTime,
    casesPerWeek,
  }
}

/**
 * Get loading skeleton data structure
 */
export function getLoadingProgressData(): ProgressData {
  return {
    stats: {
      casesCompleted: 0,
      totalCases: 0,
      overallAccuracy: 0,
      currentStreak: 0,
      timeSpent: { hours: 0, minutes: 0 },
      accuracyTrend: 'neutral',
    },
    categoryPerformance: [],
    specialtyPerformance: [],
    recentActivity: [],
    achievements: [],
    recommendations: [],
    accuracyOverTime: [],
    casesPerWeek: [],
  }
}
