'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  GraduationCap,
  Stethoscope,
  UserCog,
  Siren,
  Heart,
  Users,
  Scissors,
  Baby,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/Navigation'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type UserRole = 'student' | 'resident' | 'attending'
type SpecialtyTrack = 'em' | 'im' | 'fm' | 'surgery' | 'peds'

interface OnboardingData {
  specialty?: SpecialtyTrack
  trainingYear?: string
  institution?: string
  learningGoals?: string
}

const SPECIALTIES = [
  {
    id: 'em' as SpecialtyTrack,
    label: 'Emergency Medicine',
    icon: Siren,
    color: 'rose',
  },
  {
    id: 'im' as SpecialtyTrack,
    label: 'Internal Medicine',
    icon: Heart,
    color: 'blue',
  },
  {
    id: 'fm' as SpecialtyTrack,
    label: 'Family Medicine',
    icon: Users,
    color: 'emerald',
  },
  {
    id: 'surgery' as SpecialtyTrack,
    label: 'Surgery',
    icon: Scissors,
    color: 'violet',
  },
  {
    id: 'peds' as SpecialtyTrack,
    label: 'Pediatrics',
    icon: Baby,
    color: 'teal',
  },
]

const TRAINING_YEARS = {
  student: ['MS1', 'MS2', 'MS3', 'MS4'],
  resident: ['PGY1', 'PGY2', 'PGY3', 'PGY4', 'PGY5'],
  attending: [],
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [data, setData] = useState<OnboardingData>({})

  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true // Welcome step
      case 1:
        return !!data.specialty
      case 2:
        return user?.role === 'attending' || !!data.trainingYear
      case 3:
        return true // Learning goals step
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1 && canProceed()) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsSubmitting(true)
    try {
      updateUser({
        specialty: data.specialty,
        trainingYear: data.trainingYear,
        institution: data.institution,
        onboardingComplete: true,
      })
      toast.success('Onboarding completed!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to complete onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const firstName = user.name.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-200">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 py-6">
        {[...Array(totalSteps)].map((_, index) => (
          <button
            key={index}
            onClick={() => index < currentStep && setCurrentStep(index)}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              index === currentStep
                ? 'w-8 bg-cyan-500'
                : index < currentStep
                ? 'bg-cyan-500 cursor-pointer hover:bg-cyan-600'
                : 'bg-slate-300'
            )}
            disabled={index > currentStep}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Step 1: Welcome */}
              {currentStep === 0 && (
                <div className="text-center">
                  <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className="relative">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                        <Stethoscope className="w-16 h-16 text-white" />
                      </div>
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-8 h-8 text-amber-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-slate-900 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to ARKA-ED, {firstName}!
                  </motion.h1>

                  <motion.p
                    className="text-lg text-slate-600 mb-8 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Let&apos;s personalize your experience to help you master medical imaging
                    appropriateness.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      { icon: BookOpen, label: '50+ Cases' },
                      { icon: Target, label: 'ACR Criteria' },
                      { icon: BarChart3, label: 'Progress Tracking' },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700"
                      >
                        <feature.icon className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      size="lg"
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg"
                      onClick={nextStep}
                    >
                      Let&apos;s Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Step 2: Specialty */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                    What&apos;s your specialty interest?
                  </h2>
                  <p className="text-slate-600 mb-8 text-center">
                    We&apos;ll recommend cases relevant to your practice
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {SPECIALTIES.map((specialty) => {
                      const isSelected = data.specialty === specialty.id
                      return (
                        <button
                          key={specialty.id}
                          onClick={() => setData({ ...data, specialty: specialty.id })}
                          className={cn(
                            'relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all',
                            isSelected
                              ? `border-${specialty.color}-500 bg-${specialty.color}-50`
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          )}
                        >
                          <specialty.icon
                            className={cn(
                              'w-8 h-8',
                              isSelected ? `text-${specialty.color}-500` : 'text-slate-600'
                            )}
                          />
                          <div className="text-center">
                            <div
                              className={cn(
                                'font-semibold text-sm',
                                isSelected ? `text-${specialty.color}-700` : 'text-slate-900'
                              )}
                            >
                              {specialty.label}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className={`absolute top-2 right-2 w-5 h-5 text-${specialty.color}-500`} />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!data.specialty}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Training Year */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                    What year are you in?
                  </h2>
                  <p className="text-slate-600 mb-8 text-center">
                    This helps us tailor cases to your experience level
                  </p>

                  {user.role && TRAINING_YEARS[user.role]?.length > 0 ? (
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                      {TRAINING_YEARS[user.role].map((year) => (
                        <button
                          key={year}
                          onClick={() => setData({ ...data, trainingYear: year })}
                          className={cn(
                            'px-6 py-3 rounded-lg border-2 transition-all text-lg font-medium',
                            data.trainingYear === year
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          )}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-8">
                      <p className="text-slate-600 text-center">
                        No training year selection needed for your role.
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Institution (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="University Hospital"
                      value={data.institution || ''}
                      onChange={(e) => setData({ ...data, institution: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={user.role !== 'attending' && !data.trainingYear}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Learning Goals */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                    What are your learning goals?
                  </h2>
                  <p className="text-slate-600 mb-8 text-center">
                    Help us personalize your learning path
                  </p>

                  <div className="mb-8">
                    <textarea
                      placeholder="E.g., Master chest imaging for emergency cases, improve ACR appropriateness scores..."
                      value={data.learningGoals || ''}
                      onChange={(e) => setData({ ...data, learningGoals: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[120px]"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      onClick={completeOnboarding}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6"
                      loading={isSubmitting}
                    >
                      Complete Setup
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
