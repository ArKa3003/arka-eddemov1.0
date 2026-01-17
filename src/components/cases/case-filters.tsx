"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel, SpecialtyTrack } from "@/types/database";

// ============================================================================
// Configuration
// ============================================================================

const CATEGORIES: { value: CaseCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "low-back-pain", label: "Low Back Pain" },
  { value: "headache", label: "Headache" },
  { value: "chest-pain", label: "Chest Pain" },
  { value: "abdominal-pain", label: "Abdominal Pain" },
  { value: "extremity-trauma", label: "Extremity Trauma" },
];

const SPECIALTIES: { value: SpecialtyTrack | "all"; label: string; color: string }[] = [
  { value: "all", label: "All Specialties", color: "slate" },
  { value: "em", label: "EM", color: "rose" },
  { value: "im", label: "IM", color: "blue" },
  { value: "fm", label: "FM", color: "emerald" },
  { value: "surgery", label: "Surgery", color: "violet" },
  { value: "peds", label: "Peds", color: "teal" },
];

const DIFFICULTIES: { value: DifficultyLevel | "all"; label: string; color: string }[] = [
  { value: "all", label: "All Levels", color: "slate" },
  { value: "beginner", label: "Beginner", color: "emerald" },
  { value: "intermediate", label: "Intermediate", color: "amber" },
  { value: "advanced", label: "Advanced", color: "rose" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "alphabetical", label: "Alphabetical" },
  { value: "newest", label: "Newest First" },
  { value: "difficulty", label: "By Difficulty" },
];

// ============================================================================
// Types
// ============================================================================

export interface CaseFiltersProps {
  className?: string;
}

export interface FilterState {
  category: CaseCategory | "all";
  specialty: SpecialtyTrack | "all";
  difficulty: DifficultyLevel | "all";
  status: string;
  search: string;
  sort: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CaseFilters - Filter and search controls for the case library.
 * Uses URL search params for state (shareable URLs).
 */
export function CaseFilters({ className }: CaseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = React.useState(searchParams.get("search") || "");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Current filter state from URL
  const filters: FilterState = {
    category: (searchParams.get("category") as CaseCategory | "all") || "all",
    specialty: (searchParams.get("specialty") as SpecialtyTrack | "all") || "all",
    difficulty: (searchParams.get("difficulty") as DifficultyLevel | "all") || "all",
    status: searchParams.get("status") || "all",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "alphabetical",
  };

  // Count active filters
  const activeFilterCount = [
    filters.category !== "all",
    filters.specialty !== "all",
    filters.difficulty !== "all",
    filters.status !== "all",
  ].filter(Boolean).length;

  /**
   * Update URL with new filter value
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to page 1 when filtering
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    router.push(pathname);
    setSearchValue("");
  };

  /**
   * Debounced search
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateFilter("search", searchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search + Mobile Filter Toggle */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search cases..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          className="lg:hidden flex items-center gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className={cn("lg:flex flex-wrap gap-3 items-center", showMobileFilters ? "flex" : "hidden")}>
        {/* Category Filter */}
        <FilterSelect
          value={filters.category}
          onChange={(v) => updateFilter("category", v)}
          options={CATEGORIES}
          label="Category"
        />

        {/* Specialty Filter */}
        <FilterSelect
          value={filters.specialty}
          onChange={(v) => updateFilter("specialty", v)}
          options={SPECIALTIES}
          label="Specialty"
        />

        {/* Difficulty Filter */}
        <FilterSelect
          value={filters.difficulty}
          onChange={(v) => updateFilter("difficulty", v)}
          options={DIFFICULTIES}
          label="Difficulty"
        />

        {/* Status Filter */}
        <FilterSelect
          value={filters.status}
          onChange={(v) => updateFilter("status", v)}
          options={STATUSES}
          label="Status"
        />

        {/* Sort */}
        <FilterSelect
          value={filters.sort}
          onChange={(v) => updateFilter("sort", v)}
          options={SORT_OPTIONS}
          label="Sort"
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
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Tags (Mobile) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 lg:hidden">
          {filters.category !== "all" && (
            <FilterTag
              label={CATEGORIES.find((c) => c.value === filters.category)?.label || ""}
              onRemove={() => updateFilter("category", "all")}
            />
          )}
          {filters.specialty !== "all" && (
            <FilterTag
              label={SPECIALTIES.find((s) => s.value === filters.specialty)?.label || ""}
              onRemove={() => updateFilter("specialty", "all")}
            />
          )}
          {filters.difficulty !== "all" && (
            <FilterTag
              label={DIFFICULTIES.find((d) => d.value === filters.difficulty)?.label || ""}
              onRemove={() => updateFilter("difficulty", "all")}
            />
          )}
          {filters.status !== "all" && (
            <FilterTag
              label={STATUSES.find((s) => s.value === filters.status)?.label || ""}
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
  options: { value: string; label: string; color?: string }[];
  label: string;
}

function FilterSelect({ value, onChange, options, label }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500",
          "cursor-pointer hover:border-slate-300 transition-colors",
          value !== "all" && value !== "alphabetical" && "border-cyan-500 bg-cyan-50"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
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

// ============================================================================
// Export filter parsing utility
// ============================================================================

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams
): FilterState {
  return {
    category: (searchParams.get("category") as CaseCategory | "all") || "all",
    specialty: (searchParams.get("specialty") as SpecialtyTrack | "all") || "all",
    difficulty: (searchParams.get("difficulty") as DifficultyLevel | "all") || "all",
    status: searchParams.get("status") || "all",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "alphabetical",
  };
}
