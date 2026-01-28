'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileText,
  X,
} from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ImagingOptionCard } from '@/components/cases/imaging-option-card'
import { HintPanel } from '@/components/cases/HintPanel'
import { PatientCard } from '@/components/cases/patient-card'
import { RadiationIndicator } from '@/components/cases/radiation-indicator'
import { FeedbackPanel } from '@/components/cases/FeedbackPanel'
import { AchievementToast, useAchievementToasts } from '@/components/ui/AchievementToast'
import { useCase } from '@/context/CaseContext'
import { getCaseBySlug } from '@/data/cases'
import { getImagingByIds, getImagingById } from '@/data/imaging-options'
import { calculateAIIEScore, type ScoringResult, type ClinicalInput } from '@/lib/aiie/scoring-engine'
import { calculateProgressUpdate } from '@/lib/utils/progress'
import { showCaseSubmissionToast } from '@/lib/utils/achievement-toast'
import type { Case, ImagingOption } from '@/types/database'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

// Format time in seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Get radiation level visual indicator
function getRadiationLevelVisual(msv: number): string {
  if (msv === 0) return '○'
  if (msv < 0.1) return '◐'
  if (msv <= 1) return '●'
  if (msv <= 10) return '●●'
  return '●●●'
}

export default function CasePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const { currentCase, attemptState, setCurrentCase, selectAnswer, useHint, submitAnswer, startTimer } = useCase()

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [imagingOptions, setImagingOptions] = useState<ImagingOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { toasts, showToast, dismissToast } = useAchievementToasts()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    physicalExam: false,
    history: false,
    medications: false,
    allergies: false,
    imaging: false,
  })

  // Calculate AIIE scores for all options
  const allAIIEScores = useMemo(() => {
    if (!caseData || imagingOptions.length === 0) return new Map<string, ScoringResult>()

    // Build clinical input from case data
    const clinicalInput: ClinicalInput = {
      age: caseData.patient_age,
      sex: caseData.patient_sex,
      chiefComplaint: caseData.chief_complaint,
      duration: 'acute', // Could be extracted from clinical_vignette
      severity: 'moderate',
      redFlags: [],
      cancerHistory: caseData.patient_history?.some((h) =>
        h.toLowerCase().includes('cancer')
      ) || false,
      immunocompromised: false,
      recentTrauma: false,
      neurologicDeficit: false,
      progressiveSymptoms: false,
      priorImaging: [],
      labsAvailable: [],
      physicalExamFindings: [],
    }

    // Calculate scores for each option
    const scoresMap = new Map<string, ScoringResult>()
    imagingOptions.forEach((option) => {
      const modalityName = option.modality === 'none' 
        ? 'No imaging'
        : option.modality === 'ct'
        ? option.with_contrast ? 'CT with contrast' : 'CT without contrast'
        : option.modality === 'mri'
        ? option.with_contrast ? 'MRI with contrast' : 'MRI without contrast'
        : option.modality.charAt(0).toUpperCase() + option.modality.slice(1)
      
      const score = calculateAIIEScore(clinicalInput, modalityName)
      scoresMap.set(option.id, score)
    })

    return scoresMap
  }, [caseData, imagingOptions])

  // Load case data
  useEffect(() => {
    setIsLoading(true)
    const caseItem = getCaseBySlug(slug)
    
    if (caseItem) {
      setCaseData(caseItem)
      setCurrentCase(caseItem)
      
      // Get imaging options - for now, show a relevant subset based on case category
      // In production, this would come from case_imaging_ratings table
      // For demo, we'll show common options plus the optimal ones
      const optimalOptions = getImagingByIds(caseItem.optimal_imaging || [])
      
      // Add "No Imaging" option if not already present
      const noImagingOption = getImagingById('no-imaging')
      const allOptions = [...optimalOptions]
      if (noImagingOption && !allOptions.find(o => o.id === 'no-imaging')) {
        allOptions.push(noImagingOption)
      }
      
      // Add a few other relevant options based on category
      // This is a simplified approach - in production, use case_imaging_ratings
      if (caseItem.category === 'headache') {
        const ctHead = getImagingById('ct-head-nc')
        const mriBrain = getImagingById('mri-brain-nc')
        if (ctHead && !allOptions.find(o => o.id === 'ct-head-nc')) {
          allOptions.push(ctHead)
        }
        if (mriBrain && !allOptions.find(o => o.id === 'mri-brain-nc')) {
          allOptions.push(mriBrain)
        }
      }
      
      setImagingOptions(allOptions)
      
      // Start timer when case loads
      startTimer()
    } else {
      // Case not found
      router.push('/cases')
    }
    setIsLoading(false)
  }, [slug, setCurrentCase, startTimer, router])

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Calculate submission results
  const submissionResult = useMemo(() => {
    if (!attemptState.submitted || !caseData || !attemptState.selectedAnswer) return null

    const selectedOption = imagingOptions.find((o) => o.id === attemptState.selectedAnswer)
    const optimalOption = imagingOptions.find((o) =>
      caseData.optimal_imaging.includes(o.id)
    )
    const selectedScore = allAIIEScores.get(attemptState.selectedAnswer || '')
    const optimalScore = optimalOption ? allAIIEScores.get(optimalOption.id) : null

    // Determine if correct (selected option is in optimal imaging)
    const isCorrect = caseData.optimal_imaging.includes(attemptState.selectedAnswer || '')

    // Calculate score (0-100)
    let score = 0
    if (isCorrect) {
      score = 100
    } else if (selectedScore) {
      // Partial credit based on AIIE score
      score = Math.round((selectedScore.finalScore / 9) * 100)
    }

    return {
      isCorrect,
      score,
      selectedOption,
      optimalOption,
      selectedAIIEScore: selectedScore || null,
      optimalAIIEScore: optimalScore || null,
    }
  }, [attemptState.submitted, attemptState.selectedAnswer, caseData, imagingOptions, allAIIEScores])

  // Handle answer submission
  const handleSubmit = () => {
    if (!attemptState.selectedAnswer) {
      toast.error('Please select an imaging option before submitting')
      return
    }
    
    submitAnswer()

    // Show toast notification
    if (submissionResult) {
      showCaseSubmissionToast(
        submissionResult.score,
        submissionResult.isCorrect
      )

      // Update progress (would typically save to database)
      if (caseData) {
        const progressUpdate = calculateProgressUpdate({
          caseId: caseData.id,
          caseCategory: caseData.category,
          specialtyTags: caseData.specialty_tags,
          isCorrect: submissionResult.isCorrect,
          score: submissionResult.score,
          timeSpent: attemptState.timeSpent,
          hintsUsed: attemptState.hintsUsed,
        })
        // TODO: Save progressUpdate to database
      }
    }
  }

  // Handle skip case
  const handleSkip = () => {
    router.push('/cases')
  }

  // Handle next case
  const handleNextCase = () => {
    // TODO: Get next case in sequence
    router.push('/cases')
  }

  // Handle save to study list
  const handleSaveToStudyList = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Save to database
  }

  // Handle back to library
  const handleBackToLibrary = () => {
    router.push('/cases')
  }

  if (isLoading || !caseData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navigation />
          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CasePageSkeleton />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    advanced: 'bg-rose-100 text-rose-700 border-rose-200',
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        
        {/* Achievement Toasts */}
        {toasts.map((toast) => (
          <AchievementToast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            icon={toast.icon}
            showConfetti={toast.showConfetti}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}

        {/* Show Feedback Panel if submitted */}
        {attemptState.submitted && submissionResult && caseData ? (
          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
            <FeedbackPanel
              isCorrect={submissionResult.isCorrect}
              score={submissionResult.score}
              timeSpent={attemptState.timeSpent}
              hintsUsed={attemptState.hintsUsed}
              totalHints={caseData.hints?.length || 0}
              selectedOption={submissionResult.selectedOption || null}
              optimalOption={submissionResult.optimalOption || null}
              selectedAIIEScore={submissionResult.selectedAIIEScore || null}
              optimalAIIEScore={submissionResult.optimalAIIEScore || null}
              allOptions={imagingOptions}
              allAIIEScores={allAIIEScores}
              caseData={caseData}
              onNextCase={handleNextCase}
              onReviewAllOptions={() => {}}
              onSaveToStudyList={handleSaveToStudyList}
              onBackToLibrary={handleBackToLibrary}
              isBookmarked={isBookmarked}
            />
          </div>
        ) : (
          <main id="main-content" className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* FDA Compliance Banner */}
          <div className="mb-4 sm:mb-6 bg-slate-100 border border-slate-300 rounded-lg px-3 sm:px-4 py-2 text-center">
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              FDA Non-Device CDS | For Educational Use
            </p>
          </div>

          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Link href="/cases" className="self-start">
                  <Button variant="ghost" size="sm" className="gap-2 touch-target">
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back to Library
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                    {caseData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge
                      className={cn('border', difficultyColors[caseData.difficulty])}
                      aria-label={`Difficulty: ${caseData.difficulty}`}
                    >
                      {caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}
                    </Badge>
                    {attemptState.mode === 'assessment' && (
                      <div className="flex items-center gap-2 text-sm text-slate-600" aria-label={`Time spent: ${formatTime(attemptState.timeSpent)}`}>
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        <span>{formatTime(attemptState.timeSpent)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Presentation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Patient Presentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Demographics & Chief Complaint */}
                  <PatientCard
                    age={caseData.patient_age}
                    sex={caseData.patient_sex}
                    chiefComplaint={caseData.chief_complaint}
                  />

                  {/* HPI */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">History of Present Illness</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {caseData.clinical_vignette}
                    </p>
                  </div>

                  {/* Vitals */}
                  {caseData.vital_signs && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Vital Signs</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {caseData.vital_signs.heart_rate && (
                          <div>
                            <span className="text-sm text-slate-500">Heart Rate</span>
                            <p className="text-lg font-semibold text-slate-900">
                              {caseData.vital_signs.heart_rate} bpm
                            </p>
                          </div>
                        )}
                        {caseData.vital_signs.blood_pressure_systolic && (
                          <div>
                            <span className="text-sm text-slate-500">Blood Pressure</span>
                            <p className="text-lg font-semibold text-slate-900">
                              {caseData.vital_signs.blood_pressure_systolic}/
                              {caseData.vital_signs.blood_pressure_diastolic} mmHg
                            </p>
                          </div>
                        )}
                        {caseData.vital_signs.temperature && (
                          <div>
                            <span className="text-sm text-slate-500">Temperature</span>
                            <p className="text-lg font-semibold text-slate-900">
                              {caseData.vital_signs.temperature}°{caseData.vital_signs.temperature_unit === 'celsius' ? 'C' : 'F'}
                            </p>
                          </div>
                        )}
                        {caseData.vital_signs.respiratory_rate && (
                          <div>
                            <span className="text-sm text-slate-500">Respiratory Rate</span>
                            <p className="text-lg font-semibold text-slate-900">
                              {caseData.vital_signs.respiratory_rate} /min
                            </p>
                          </div>
                        )}
                        {caseData.vital_signs.oxygen_saturation && (
                          <div>
                            <span className="text-sm text-slate-500">SpO₂</span>
                            <p className="text-lg font-semibold text-slate-900">
                              {caseData.vital_signs.oxygen_saturation}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Physical Exam - Collapsible */}
                  {caseData.physical_exam && (
                    <div>
                      <button
                        onClick={() => toggleSection('physicalExam')}
                        className="flex items-center justify-between w-full text-left touch-target focus-visible-ring rounded-md p-1"
                        aria-expanded={expandedSections.physicalExam}
                        aria-controls="physical-exam-content"
                      >
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" aria-hidden="true" />
                          Physical Examination
                        </h3>
                        {expandedSections.physicalExam ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        )}
                      </button>
                      {expandedSections.physicalExam && (
                        <motion.div
                          id="physical-exam-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-slate-700 whitespace-pre-line"
                        >
                          {caseData.physical_exam}
                        </motion.div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Clinical Context Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Clinical Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Medical History */}
                  {caseData.patient_history && caseData.patient_history.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleSection('history')}
                        className="flex items-center justify-between w-full text-left mb-2 touch-target focus-visible-ring rounded-md p-1"
                        aria-expanded={expandedSections.history}
                        aria-controls="medical-history-content"
                      >
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4" aria-hidden="true" />
                          Medical History
                        </h3>
                        {expandedSections.history ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        )}
                      </button>
                      {expandedSections.history && (
                        <motion.ul
                          id="medical-history-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="list-disc list-inside space-y-1 text-slate-700 ml-4"
                        >
                          {caseData.patient_history.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  )}

                  {/* Medications */}
                  <div>
                    <button
                      onClick={() => toggleSection('medications')}
                      className="flex items-center justify-between w-full text-left mb-2 touch-target focus-visible-ring rounded-md p-1"
                      aria-expanded={expandedSections.medications}
                      aria-controls="medications-content"
                    >
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Pill className="w-4 h-4" aria-hidden="true" />
                        Current Medications
                      </h3>
                      {expandedSections.medications ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      )}
                    </button>
                    {expandedSections.medications && (
                      <motion.div
                        id="medications-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-700"
                      >
                        {caseData.patient_history?.find((h) => h.toLowerCase().includes('medication')) || 'None reported'}
                      </motion.div>
                    )}
                  </div>

                  {/* Allergies */}
                  <div>
                    <button
                      onClick={() => toggleSection('allergies')}
                      className="flex items-center justify-between w-full text-left mb-2 touch-target focus-visible-ring rounded-md p-1"
                      aria-expanded={expandedSections.allergies}
                      aria-controls="allergies-content"
                    >
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                        Allergies
                      </h3>
                      {expandedSections.allergies ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      )}
                    </button>
                    {expandedSections.allergies && (
                      <motion.div
                        id="allergies-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-700"
                      >
                        {caseData.patient_history?.find((h) => h.toLowerCase().includes('allerg')) || 'No known allergies'}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question Prompt */}
              <Card className="border-cyan-200 bg-cyan-50/30">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    What is the most appropriate next imaging study for this patient?
                  </h2>
                </CardContent>
              </Card>

              {/* Imaging Options */}
              <div className="space-y-3">
                {imagingOptions.map((option, index) => (
                  <ImagingOptionCard
                    key={option.id}
                    id={option.id}
                    name={option.name}
                    shortName={option.short_name}
                    modality={option.modality}
                    costUsd={option.typical_cost_usd}
                    radiationMsv={option.radiation_msv}
                    description={option.description}
                    isSelected={attemptState.selectedAnswer === option.id}
                    onSelect={() => selectAnswer(option.id)}
                    disabled={attemptState.submitted}
                    variant={option.modality === 'none' ? 'special' : 'default'}
                    index={index}
                  />
                ))}
              </div>

              {/* Action Buttons - Sticky on mobile */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 -mx-4 sm:mx-0 sm:border-t-0 sm:p-0 sm:static sm:bg-transparent">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!attemptState.selectedAnswer || attemptState.submitted}
                    className="flex-1 touch-target"
                    size="lg"
                    aria-label="Submit your answer"
                  >
                    Submit Answer
                  </Button>
                  <Button
                    onClick={() => useHint()}
                    disabled={attemptState.submitted || attemptState.hintsUsed >= (caseData.hints?.length || 0)}
                    variant="outline"
                    className="flex-1 touch-target"
                    size="lg"
                    aria-label={`Use hint (${attemptState.hintsUsed}/${caseData.hints?.length || 0} used)`}
                  >
                    Use Hint
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="flex-1 touch-target"
                    size="lg"
                    aria-label="Skip this case"
                  >
                    Skip Case
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Hint Panel */}
              {caseData.hints && caseData.hints.length > 0 && (
                <HintPanel
                  hints={caseData.hints}
                  hintsUsed={attemptState.hintsUsed}
                  onUseHint={useHint}
                  disabled={attemptState.submitted || attemptState.mode === 'assessment'}
                />
              )}

              {/* Learning Mode Features */}
              {attemptState.mode === 'learning' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Learning Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Show Teaching Points
                    </Button>
                    {attemptState.submitted && (
                      <Button variant="outline" className="w-full justify-start">
                        Compare All Options
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

// Skeleton Loader Component
function CasePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
