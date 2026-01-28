'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Case } from '@/types/database'

export type CaseMode = 'learning' | 'assessment'

export interface CaseAttemptState {
  caseId: string | null
  selectedAnswer: string | null
  hintsUsed: number
  timeSpent: number // in seconds
  mode: CaseMode
  submitted: boolean
  startTime: number | null
}

interface CaseContextType {
  currentCase: Case | null
  attemptState: CaseAttemptState
  setCurrentCase: (caseData: Case | null) => void
  selectAnswer: (optionId: string) => void
  useHint: () => void
  submitAnswer: () => void
  resetAttempt: () => void
  setMode: (mode: CaseMode) => void
  startTimer: () => void
  stopTimer: () => void
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: ReactNode }) {
  const [currentCase, setCurrentCase] = useState<Case | null>(null)
  const [attemptState, setAttemptState] = useState<CaseAttemptState>({
    caseId: null,
    selectedAnswer: null,
    hintsUsed: 0,
    timeSpent: 0,
    mode: 'learning',
    submitted: false,
    startTime: null,
  })

  // Timer effect
  useEffect(() => {
    if (attemptState.startTime && !attemptState.submitted) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - attemptState.startTime!) / 1000)
        setAttemptState((prev) => ({ ...prev, timeSpent: elapsed }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [attemptState.startTime, attemptState.submitted])

  const selectAnswer = (optionId: string) => {
    if (attemptState.submitted) return
    setAttemptState((prev) => ({ ...prev, selectedAnswer: optionId }))
  }

  const useHint = () => {
    if (attemptState.submitted) return
    setAttemptState((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
  }

  const submitAnswer = () => {
    if (!attemptState.selectedAnswer || attemptState.submitted) return
    setAttemptState((prev) => ({
      ...prev,
      submitted: true,
      startTime: null,
    }))
  }

  const resetAttempt = () => {
    setAttemptState({
      caseId: currentCase?.id || null,
      selectedAnswer: null,
      hintsUsed: 0,
      timeSpent: 0,
      mode: attemptState.mode,
      submitted: false,
      startTime: null,
    })
  }

  const setMode = (mode: CaseMode) => {
    setAttemptState((prev) => ({ ...prev, mode }))
  }

  const startTimer = () => {
    if (!attemptState.startTime && !attemptState.submitted) {
      setAttemptState((prev) => ({
        ...prev,
        startTime: Date.now(),
      }))
    }
  }

  const stopTimer = () => {
    if (attemptState.startTime) {
      const elapsed = Math.floor((Date.now() - attemptState.startTime) / 1000)
      setAttemptState((prev) => ({
        ...prev,
        timeSpent: elapsed,
        startTime: null,
      }))
    }
  }

  // Update caseId when currentCase changes
  useEffect(() => {
    if (currentCase && currentCase.id !== attemptState.caseId) {
      setAttemptState((prev) => ({
        ...prev,
        caseId: currentCase.id,
        selectedAnswer: null,
        hintsUsed: 0,
        timeSpent: 0,
        submitted: false,
        startTime: null,
      }))
    }
  }, [currentCase, attemptState.caseId])

  return (
    <CaseContext.Provider
      value={{
        currentCase,
        attemptState,
        setCurrentCase,
        selectAnswer,
        useHint,
        submitAnswer,
        resetAttempt,
        setMode,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export function useCase() {
  const context = useContext(CaseContext)
  if (context === undefined) {
    throw new Error('useCase must be used within a CaseProvider')
  }
  return context
}
