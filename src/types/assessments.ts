export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration?: number; // in minutes
  passingScore?: number; // percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  completedAt: Date;
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
}