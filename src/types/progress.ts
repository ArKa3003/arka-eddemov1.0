export interface Progress {
  userId: string;
  casesCompleted: number;
  totalCases: number;
  assessmentsCompleted: number;
  totalAssessments: number;
  currentStreak: number;
  longestStreak: number;
  competencies: Competency[];
  achievements: Achievement[];
  lastActivityDate?: Date;
}

export interface Competency {
  category: string;
  score: number; // 0-100
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlockedAt: Date;
}