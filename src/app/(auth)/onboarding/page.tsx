"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ClipboardList,
  MousePointerClick,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Target,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Types
type UserRole = "student" | "resident" | "attending";
type SpecialtyTrack = "em" | "im" | "fm" | "surgery" | "peds";

interface OnboardingData {
  role: UserRole | null;
  trainingYear: string | null;
  specialtyTrack: SpecialtyTrack | null;
}

// Constants
const ROLES = [
  {
    id: "student" as UserRole,
    label: "Medical Student",
    icon: GraduationCap,
    description: "Currently enrolled in medical school",
    years: ["MS1", "MS2", "MS3", "MS4"],
  },
  {
    id: "resident" as UserRole,
    label: "Resident Physician",
    icon: Stethoscope,
    description: "In residency training program",
    years: ["PGY-1", "PGY-2", "PGY-3", "PGY-4", "PGY-5", "Fellow"],
  },
  {
    id: "attending" as UserRole,
    label: "Attending Physician",
    icon: UserCog,
    description: "Board certified practicing physician",
    years: null,
  },
];

const SPECIALTIES = [
  {
    id: "em" as SpecialtyTrack,
    label: "Emergency Medicine",
    icon: Siren,
    color: "rose",
    caseCount: 15,
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    textClass: "text-rose-500",
  },
  {
    id: "im" as SpecialtyTrack,
    label: "Internal Medicine",
    icon: Heart,
    color: "blue",
    caseCount: 12,
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    textClass: "text-blue-500",
  },
  {
    id: "fm" as SpecialtyTrack,
    label: "Family Medicine",
    icon: Users,
    color: "emerald",
    caseCount: 10,
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    textClass: "text-emerald-500",
  },
  {
    id: "surgery" as SpecialtyTrack,
    label: "Surgery",
    icon: Scissors,
    color: "violet",
    caseCount: 8,
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    textClass: "text-violet-500",
  },
  {
    id: "peds" as SpecialtyTrack,
    label: "Pediatrics",
    icon: Baby,
    color: "teal",
    caseCount: 8,
    bgClass: "bg-teal-500/10",
    borderClass: "border-teal-500/30",
    textClass: "text-teal-500",
  },
];

const TUTORIAL_SLIDES = [
  {
    title: "Read the Clinical Case",
    description:
      "Each case presents a patient with symptoms, history, and exam findings. Review the clinical vignette carefully.",
    icon: ClipboardList,
    mockup: "case-vignette",
  },
  {
    title: "Choose the Right Imaging",
    description:
      "Select the most appropriate imaging study based on ACR Appropriateness Criteria. Consider cost, radiation, and diagnostic value.",
    icon: MousePointerClick,
    mockup: "imaging-selection",
  },
  {
    title: "Get Instant Feedback",
    description:
      "Learn immediately whether your choice was appropriate, with detailed explanations and ACR evidence.",
    icon: CheckCircle,
    mockup: "feedback-panel",
  },
];

/**
 * Multi-step onboarding wizard
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tutorialSlide, setTutorialSlide] = React.useState(0);

  const [data, setData] = React.useState<OnboardingData>({
    role: null,
    trainingYear: null,
    specialtyTrack: null,
  });

  // Get first name from user
  const firstName = React.useMemo(() => {
    if (!user) return "there";
    const fullName = user.user_metadata?.full_name || user.email || "";
    return fullName.split(" ")[0] || "there";
  }, [user]);

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const canProceed = React.useMemo(() => {
    switch (currentStep) {
      case 0:
        return true; // Welcome step
      case 1:
        return data.role !== null && (data.role === "attending" || data.trainingYear !== null);
      case 2:
        return data.specialtyTrack !== null;
      case 3:
        return true; // Tutorial step
      default:
        return false;
    }
  }, [currentStep, data]);

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // Update profile in database
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            role: data.role || "student",
            training_year: data.trainingYear ? parseInt(data.trainingYear.replace(/\D/g, "")) : null,
            specialty_track: data.specialtyTrack,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) {
          console.error("Error updating profile:", error);
          // Still proceed even if update fails
        }
      }

      // Redirect to cases
      router.push("/cases");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      router.push("/cases");
    }
  };

  // Animation variants
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
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            onClick={() => index < currentStep && goToStep(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentStep
                ? "w-8 bg-cyan-500"
                : index < currentStep
                ? "bg-cyan-500 cursor-pointer hover:bg-cyan-600"
                : "bg-slate-300"
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Step 1: Welcome */}
              {currentStep === 0 && (
                <WelcomeStep
                  firstName={firstName}
                  onNext={nextStep}
                  onSkip={handleSkip}
                />
              )}

              {/* Step 2: Role & Experience */}
              {currentStep === 1 && (
                <RoleStep
                  data={data}
                  onChange={(updates) => setData((prev) => ({ ...prev, ...updates }))}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {/* Step 3: Specialty Interest */}
              {currentStep === 2 && (
                <SpecialtyStep
                  data={data}
                  onChange={(updates) => setData((prev) => ({ ...prev, ...updates }))}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {/* Step 4: Quick Tutorial */}
              {currentStep === 3 && (
                <TutorialStep
                  currentSlide={tutorialSlide}
                  onSlideChange={setTutorialSlide}
                  onComplete={completeOnboarding}
                  onBack={prevStep}
                  isSubmitting={isSubmitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Step Components
// ============================================================================

interface WelcomeStepProps {
  firstName: string;
  onNext: () => void;
  onSkip: () => void;
}

function WelcomeStep({ firstName, onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="text-center">
      {/* Animated illustration */}
      <motion.div
        className="mb-8 flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
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

      {/* Welcome text */}
      <motion.h1
        className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3"
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

      {/* Features preview */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { icon: BookOpen, label: "50+ Cases" },
          { icon: Target, label: "ACR Criteria" },
          { icon: BarChart3, label: "Progress Tracking" },
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

      {/* Actions */}
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg"
          onClick={onNext}
        >
          Let&apos;s Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <button
          onClick={onSkip}
          className="text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}

interface RoleStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function RoleStep({ data, onChange, onNext, onBack }: RoleStepProps) {
  const selectedRole = ROLES.find((r) => r.id === data.role);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2 text-center">
        What&apos;s your role?
      </h2>
      <p className="text-slate-600 mb-8 text-center">
        This helps us tailor cases to your experience level
      </p>

      {/* Role cards */}
      <div className="grid gap-4 mb-6">
        {ROLES.map((role) => {
          const isSelected = data.role === role.id;
          return (
            <button
              key={role.id}
              onClick={() =>
                onChange({
                  role: role.id,
                  trainingYear: role.id === "attending" ? null : data.trainingYear,
                })
              }
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-cyan-500" : "bg-slate-100"
                )}
              >
                <role.icon
                  className={cn(
                    "w-6 h-6",
                    isSelected ? "text-white" : "text-slate-600"
                  )}
                />
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "font-semibold",
                    isSelected ? "text-cyan-700" : "text-slate-900"
                  )}
                >
                  {role.label}
                </div>
                <div className="text-sm text-slate-500">{role.description}</div>
              </div>
              {isSelected && (
                <CheckCircle className="w-6 h-6 text-cyan-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Year selector (for students and residents) */}
      {selectedRole && selectedRole.years && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What year are you in?
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedRole.years.map((year) => (
              <button
                key={year}
                onClick={() => onChange({ trainingYear: year })}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all",
                  data.trainingYear === year
                    ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.role || (selectedRole?.years && !data.trainingYear)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface SpecialtyStepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function SpecialtyStep({ data, onChange, onNext, onBack }: SpecialtyStepProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2 text-center">
        What&apos;s your specialty interest?
      </h2>
      <p className="text-slate-600 mb-8 text-center">
        We&apos;ll recommend cases relevant to your practice
      </p>

      {/* Specialty cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {SPECIALTIES.map((specialty) => {
          const isSelected = data.specialtyTrack === specialty.id;
          return (
            <button
              key={specialty.id}
              onClick={() => onChange({ specialtyTrack: specialty.id })}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all",
                isSelected
                  ? `${specialty.borderClass} ${specialty.bgClass}`
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isSelected ? specialty.bgClass : "bg-slate-100"
                )}
              >
                <specialty.icon
                  className={cn(
                    "w-6 h-6",
                    isSelected ? specialty.textClass : "text-slate-600"
                  )}
                />
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "font-semibold text-sm",
                    isSelected ? specialty.textClass : "text-slate-900"
                  )}
                >
                  {specialty.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {specialty.caseCount} cases
                </div>
              </div>
              {isSelected && (
                <CheckCircle
                  className={cn(
                    "absolute top-2 right-2 w-5 h-5",
                    specialty.textClass
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.specialtyTrack}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface TutorialStepProps {
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  onComplete: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

function TutorialStep({
  currentSlide,
  onSlideChange,
  onComplete,
  onBack,
  isSubmitting,
}: TutorialStepProps) {
  const slide = TUTORIAL_SLIDES[currentSlide];
  const isLastSlide = currentSlide === TUTORIAL_SLIDES.length - 1;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2 text-center">
        Quick Tutorial
      </h2>
      <p className="text-slate-600 mb-8 text-center">
        Here&apos;s how ARKA-ED works
      </p>

      {/* Tutorial slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-8"
        >
          <div className="bg-slate-100 rounded-2xl p-8 mb-6">
            {/* Mockup area */}
            <div className="aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center mb-4 overflow-hidden">
              <div className="text-center p-6">
                <slide.icon className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                <div className="text-lg font-semibold text-slate-800">
                  {slide.title}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-center">{slide.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {TUTORIAL_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              index === currentSlide ? "w-8 bg-cyan-500" : "bg-slate-300"
            )}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={currentSlide > 0 ? () => onSlideChange(currentSlide - 1) : onBack}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          {currentSlide > 0 ? "Previous" : "Back"}
        </Button>

        {isLastSlide ? (
          <Button
            onClick={onComplete}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Start My First Case
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onSlideChange(currentSlide + 1)}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
