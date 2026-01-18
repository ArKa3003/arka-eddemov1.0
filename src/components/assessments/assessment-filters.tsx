// @ts-nocheck
"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Configuration
// ============================================================================

const SPECIALTIES = [
  { value: "all", label: "All Specialties" },
  { value: "em", label: "Emergency Medicine" },
  { value: "im", label: "Internal Medicine" },
  { value: "fm", label: "Family Medicine" },
  { value: "surgery", label: "Surgery" },
  { value: "peds", label: "Pediatrics" },
];

const DIFFICULTIES = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const STATUSES = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

// ============================================================================
// Component
// ============================================================================

export function AssessmentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Current filter values
  const specialty = searchParams.get("specialty") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const status = searchParams.get("status") || "all";

  // Count active filters
  const activeFilterCount = [
    specialty !== "all",
    difficulty !== "all",
    status !== "all",
  ].filter(Boolean).length;

  /**
   * Update filter in URL
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Specialty Filter */}
        <FilterSelect
          value={specialty}
          onChange={(v) => updateFilter("specialty", v)}
          options={SPECIALTIES}
        />

        {/* Difficulty Filter */}
        <FilterSelect
          value={difficulty}
          onChange={(v) => updateFilter("difficulty", v)}
          options={DIFFICULTIES}
        />

        {/* Status Filter */}
        <FilterSelect
          value={status}
          onChange={(v) => updateFilter("status", v)}
          options={STATUSES}
        />

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {specialty !== "all" && (
            <FilterTag
              label={SPECIALTIES.find((s) => s.value === specialty)?.label || ""}
              onRemove={() => updateFilter("specialty", "all")}
            />
          )}
          {difficulty !== "all" && (
            <FilterTag
              label={DIFFICULTIES.find((d) => d.value === difficulty)?.label || ""}
              onRemove={() => updateFilter("difficulty", "all")}
            />
          )}
          {status !== "all" && (
            <FilterTag
              label={STATUSES.find((s) => s.value === status)?.label || ""}
              onRemove={() => updateFilter("status", "all")}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500",
        "cursor-pointer hover:border-slate-300 transition-colors",
        value !== "all" && "border-cyan-500 bg-cyan-50"
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-cyan-100 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
