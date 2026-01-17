"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Thermometer,
  Wind,
  Droplets,
  Stethoscope,
  FlaskConical,
  Lightbulb,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { PatientCard } from "./patient-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Case, VitalSigns, LabResult } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface ClinicalVignetteProps {
  /** Case data */
  caseData: Case;
  /** Mode for displaying hints */
  mode: "learning" | "quiz";
  /** Current hint index (for progressive reveal) */
  hintsRevealed?: number;
  /** Handler to reveal next hint */
  onRevealHint?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ClinicalVignette - Complete clinical case presentation.
 */
export function ClinicalVignette({
  caseData,
  mode,
  hintsRevealed = 0,
  onRevealHint,
  className,
}: ClinicalVignetteProps) {
  const [showPhysicalExam, setShowPhysicalExam] = React.useState(false);
  const [showLabResults, setShowLabResults] = React.useState(false);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Patient Card */}
      <Card>
        <CardContent className="pt-6">
          <PatientCard
            age={caseData.patient_age}
            sex={caseData.patient_sex}
            chiefComplaint={caseData.chief_complaint}
          />
        </CardContent>
      </Card>

      {/* HPI / Clinical Vignette */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-500" />
            History of Present Illness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {caseData.clinical_vignette}
          </p>
        </CardContent>
      </Card>

      {/* Past Medical History */}
      {caseData.patient_history && caseData.patient_history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Past Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {caseData.patient_history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Vital Signs */}
      {caseData.vital_signs && (
        <VitalSignsDisplay vitals={caseData.vital_signs} />
      )}

      {/* Physical Exam (Collapsible) */}
      {caseData.physical_exam && (
        <CollapsibleSection
          title="Physical Examination"
          icon={<Stethoscope className="w-4 h-4 text-violet-500" />}
          isOpen={showPhysicalExam}
          onToggle={() => setShowPhysicalExam(!showPhysicalExam)}
        >
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {caseData.physical_exam}
          </p>
        </CollapsibleSection>
      )}

      {/* Lab Results (Collapsible) */}
      {caseData.lab_results && caseData.lab_results.length > 0 && (
        <CollapsibleSection
          title="Laboratory Results"
          icon={<FlaskConical className="w-4 h-4 text-emerald-500" />}
          isOpen={showLabResults}
          onToggle={() => setShowLabResults(!showLabResults)}
        >
          <LabResultsTable results={caseData.lab_results} />
        </CollapsibleSection>
      )}

      {/* Clinical Question */}
      <Card className="border-cyan-200 bg-cyan-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-cyan-700">
            <HelpCircle className="w-4 h-4" />
            Clinical Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cyan-800 font-medium">
            What is the most appropriate imaging study for this patient?
          </p>
        </CardContent>
      </Card>

      {/* Hints (Learning Mode Only) */}
      {mode === "learning" && caseData.hints && caseData.hints.length > 0 && (
        <HintsSection
          hints={caseData.hints}
          hintsRevealed={hintsRevealed}
          onRevealHint={onRevealHint}
        />
      )}
    </div>
  );
}

// ============================================================================
// Vital Signs Display
// ============================================================================

interface VitalSignsDisplayProps {
  vitals: VitalSigns;
}

function VitalSignsDisplay({ vitals }: VitalSignsDisplayProps) {
  const items = [
    {
      icon: HeartPulse,
      label: "HR",
      value: vitals.heart_rate,
      unit: "bpm",
      color: "text-rose-500",
    },
    {
      icon: Droplets,
      label: "BP",
      value:
        vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic
          ? `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}`
          : null,
      unit: "mmHg",
      color: "text-blue-500",
    },
    {
      icon: Wind,
      label: "RR",
      value: vitals.respiratory_rate,
      unit: "/min",
      color: "text-cyan-500",
    },
    {
      icon: Thermometer,
      label: "Temp",
      value: vitals.temperature,
      unit: vitals.temperature_unit === "celsius" ? "°C" : "°F",
      color: "text-amber-500",
    },
    {
      icon: Droplets,
      label: "SpO₂",
      value: vitals.oxygen_saturation,
      unit: "%",
      color: "text-emerald-500",
    },
  ].filter((item) => item.value !== null);

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Vital Signs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 bg-slate-50 rounded-lg"
            >
              <item.icon className={cn("w-5 h-5 mb-1", item.color)} />
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="font-semibold text-slate-900">
                {item.value}
                <span className="text-xs font-normal text-slate-500 ml-0.5">
                  {item.unit}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Lab Results Table
// ============================================================================

interface LabResultsTableProps {
  results: LabResult[];
}

function LabResultsTable({ results }: LabResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 font-medium text-slate-600">
              Test
            </th>
            <th className="text-left py-2 px-3 font-medium text-slate-600">
              Value
            </th>
            <th className="text-left py-2 px-3 font-medium text-slate-600">
              Reference
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={index}
              className={cn(
                "border-b border-slate-100",
                result.is_abnormal && "bg-rose-50"
              )}
            >
              <td className="py-2 px-3 text-slate-700">{result.name}</td>
              <td
                className={cn(
                  "py-2 px-3 font-medium",
                  result.is_abnormal ? "text-rose-600" : "text-slate-900"
                )}
              >
                {result.value} {result.unit}
                {result.is_abnormal && (
                  <AlertCircle className="w-3.5 h-3.5 inline ml-1 text-rose-500" />
                )}
              </td>
              <td className="py-2 px-3 text-slate-500">
                {result.reference_range}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Collapsible Section
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <Card>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-slate-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ============================================================================
// Hints Section
// ============================================================================

interface HintsSectionProps {
  hints: string[];
  hintsRevealed: number;
  onRevealHint?: () => void;
}

function HintsSection({ hints, hintsRevealed, onRevealHint }: HintsSectionProps) {
  const canRevealMore = hintsRevealed < hints.length;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-amber-700">
          <Lightbulb className="w-4 h-4" />
          Hints
          <Badge variant="warning" size="sm" className="ml-2">
            {hintsRevealed}/{hints.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Revealed hints */}
        <AnimatePresence>
          {hints.slice(0, hintsRevealed).map((hint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-amber-800"
            >
              <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {index + 1}
              </span>
              <p>{hint}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Reveal more button */}
        {canRevealMore && (
          <button
            onClick={onRevealHint}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            <Lightbulb className="w-4 h-4" />
            Reveal hint {hintsRevealed + 1}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
