"use client";

import { useState } from "react";

export interface Assessment {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export function useAssessment(assessmentId?: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Placeholder for fetching assessment

  return {
    assessment,
    loading,
    currentQuestion,
    setCurrentQuestion,
  };
}