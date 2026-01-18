// @ts-nocheck
"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Zap,
  Scan,
  Activity,
  Radio,
  Atom,
  LayoutGrid,
  CircleOff,
  DollarSign,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagingOptionCard, ImagingOptionCardSkeleton } from "./imaging-option-card";
import { RadiationBadge } from "./radiation-indicator";
import { cn } from "@/lib/utils";
import type { ImagingOption, Modality } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export type CaseMode = "learning" | "quiz";

export interface OrderingInterfaceProps {
  /** Available imaging options */
  imagingOptions: ImagingOption[];
  /** Currently selected imaging IDs */
  selectedImaging: string[];
  /** Selection change handler */
  onSelectionChange: (ids: string[]) => void;
  /** Submit handler */
  onSubmit: () => void;
  /** Current mode */
  mode: CaseMode;
  /** Whether interface is disabled (after submission) */
  disabled?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const MODALITY_TABS: {
  value: Modality | "all" | "none";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "xray", label: "X-ray", icon: Zap },
  { value: "ct", label: "CT", icon: Scan },
  { value: "mri", label: "MRI", icon: Activity },
  { value: "ultrasound", label: "US", icon: Radio },
  { value: "nuclear", label: "Nuclear", icon: Atom },
];

const NO_IMAGING_OPTION = {
  id: "no-imaging",
  name: "No Imaging Indicated",
  shortName: "No Imaging",
  modality: "none" as const,
  costUsd: 0,
  radiationMsv: 0,
};

// ============================================================================
// Component
// ============================================================================

/**
 * OrderingInterface - Imaging selection interface with search, filters, and summary.
 */
export function OrderingInterface({
  imagingOptions,
  selectedImaging,
  onSelectionChange,
  onSubmit,
  mode,
  disabled = false,
  isLoading = false,
  className,
}: OrderingInterfaceProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeModality, setActiveModality] = React.useState<Modality | "all" | "none">("all");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter options
  const filteredOptions = React.useMemo(() => {
    let options = imagingOptions;

    // Filter by modality
    if (activeModality !== "all" && activeModality !== "none") {
      options = options.filter((opt) => opt.modality === activeModality);
    }

    // Filter by search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      options = options.filter(
        (opt) =>
          opt.name.toLowerCase().includes(query) ||
          opt.short_name.toLowerCase().includes(query) ||
          opt.modality.toLowerCase().includes(query)
      );
    }

    return options;
  }, [imagingOptions, activeModality, debouncedSearch]);

  // Calculate selection totals
  const selectionTotals = React.useMemo(() => {
    if (selectedImaging.includes("no-imaging")) {
      return { count: 1, cost: 0, radiation: 0, isNoImaging: true };
    }

    const selected = imagingOptions.filter((opt) => selectedImaging.includes(opt.id));
    return {
      count: selected.length,
      cost: selected.reduce((sum, opt) => sum + opt.typical_cost_usd, 0),
      radiation: selected.reduce((sum, opt) => sum + opt.radiation_msv, 0),
      isNoImaging: false,
    };
  }, [selectedImaging, imagingOptions]);

  /**
   * Handle option selection
   */
  const handleSelect = (optionId: string) => {
    if (disabled) return;

    if (optionId === "no-imaging") {
      // Selecting "No Imaging" clears other selections
      if (selectedImaging.includes("no-imaging")) {
        onSelectionChange([]);
      } else {
        onSelectionChange(["no-imaging"]);
      }
    } else {
      // Selecting an imaging option removes "No Imaging"
      let newSelection = selectedImaging.filter((id) => id !== "no-imaging");

      if (newSelection.includes(optionId)) {
        newSelection = newSelection.filter((id) => id !== optionId);
      } else {
        newSelection = [...newSelection, optionId];
      }

      onSelectionChange(newSelection);
    }
  };

  /**
   * Clear all selections
   */
  const clearSelection = () => {
    if (!disabled) {
      onSelectionChange([]);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Order Imaging
        </h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search imaging studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modality Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {MODALITY_TABS.map((tab) => {
            const isActive = activeModality === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveModality(tab.value)}
                disabled={disabled}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Options List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          // Loading skeletons
          <>
            {[...Array(5)].map((_, i) => (
              <ImagingOptionCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {/* Imaging Options */}
            {filteredOptions.map((option, index) => (
              <ImagingOptionCard
                key={option.id}
                id={option.id}
                name={option.name}
                shortName={option.short_name}
                modality={option.modality}
                costUsd={option.typical_cost_usd}
                radiationMsv={option.radiation_msv}
                description={option.description}
                isSelected={selectedImaging.includes(option.id)}
                onSelect={() => handleSelect(option.id)}
                disabled={disabled}
                index={index}
              />
            ))}

            {/* Empty state for filtered list */}
            {filteredOptions.length === 0 && debouncedSearch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-slate-500"
              >
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No imaging studies match your search</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-slate-500">or</span>
          </div>
        </div>

        {/* No Imaging Option */}
        <ImagingOptionCard
          id="no-imaging"
          name="No Imaging Indicated"
          shortName="No Imaging"
          modality="none"
          costUsd={0}
          radiationMsv={0}
          isSelected={selectedImaging.includes("no-imaging")}
          onSelect={() => handleSelect("no-imaging")}
          disabled={disabled}
          variant="special"
        />
      </div>

      {/* Selection Summary + Submit */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        {/* Summary */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {selectionTotals.count > 0 ? (
              <>
                <Badge variant="primary">
                  {selectionTotals.isNoImaging
                    ? "No Imaging"
                    : `${selectionTotals.count} selected`}
                </Badge>
                {!selectionTotals.isNoImaging && (
                  <>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      ${selectionTotals.cost.toLocaleString()}
                    </span>
                    <RadiationBadge doseMsv={selectionTotals.radiation} />
                  </>
                )}
              </>
            ) : (
              <span className="text-sm text-slate-500">No selection</span>
            )}
          </div>

          {/* Clear button */}
          {selectionTotals.count > 0 && !disabled && (
            <button
              onClick={clearSelection}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={disabled || selectionTotals.count === 0}
          className="w-full"
          size="lg"
        >
          {disabled ? (
            "Submitted"
          ) : (
            <>
              Submit Order
              {mode === "quiz" && (
                <AlertTriangle className="w-4 h-4 ml-2 text-amber-300" />
              )}
            </>
          )}
        </Button>

        {/* Mode hint */}
        {mode === "learning" && !disabled && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Learning mode: You can try multiple times
          </p>
        )}
      </div>
    </div>
  );
}
