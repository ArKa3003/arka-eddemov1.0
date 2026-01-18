// @ts-nocheck
"use client";
import * as React from "react";
import { User, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientSex } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface PatientCardProps {
  /** Patient age in years */
  age: number;
  /** Patient sex */
  sex: PatientSex;
  /** Chief complaint text */
  chiefComplaint: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * PatientCard - Displays patient demographics with chief complaint.
 * Uses avatar circle with icon and formatted patient description.
 */
export function PatientCard({
  age,
  sex,
  chiefComplaint,
  className,
}: PatientCardProps) {
  const sexLabel = sex === "male" ? "male" : "female";

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {/* Avatar */}
      <div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
          sex === "male" ? "bg-blue-100" : "bg-pink-100"
        )}
      >
        <User
          className={cn(
            "w-7 h-7",
            sex === "male" ? "text-blue-600" : "text-pink-600"
          )}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Demographics */}
        <p className="text-lg font-semibold text-slate-900">
          {age}-year-old {sexLabel}
        </p>

        {/* Chief Complaint */}
        <div className="mt-2 flex items-start gap-2">
          <Quote className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
          <p className="text-slate-700 italic leading-relaxed">
            &ldquo;{chiefComplaint}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Variant
// ============================================================================

export interface PatientCardCompactProps {
  age: number;
  sex: PatientSex;
  className?: string;
}

export function PatientCardCompact({
  age,
  sex,
  className,
}: PatientCardCompactProps) {
  const sexLabel = sex === "male" ? "male" : "female";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          sex === "male" ? "bg-blue-100" : "bg-pink-100"
        )}
      >
        <User
          className={cn(
            "w-4 h-4",
            sex === "male" ? "text-blue-600" : "text-pink-600"
          )}
        />
      </div>
      <span className="text-sm font-medium text-slate-700">
        {age}yo {sexLabel}
      </span>
    </div>
  );
}
