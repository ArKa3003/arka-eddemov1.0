"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Siren,
  Heart,
  Users,
  Scissors,
  Baby,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type SpecialtyTrackConfig,
  type TrackColor,
  type TrackIcon,
  getAllTracks,
  getTrackColorClasses,
} from "@/data/specialty-tracks";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface TrackHeaderProps {
  /** Track configuration */
  track: SpecialtyTrackConfig;
  /** Progress percentage (0-100) */
  progress: number;
  /** Completed cases count */
  completedCases: number;
  /** Total cases count */
  totalCases: number;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Icon Map
// ============================================================================

const TRACK_ICONS: Record<TrackIcon, React.ComponentType<{ className?: string }>> = {
  Siren,
  Heart,
  Users,
  Scissors,
  Baby,
};

// ============================================================================
// Component
// ============================================================================

/**
 * TrackHeader - Displays specialty track header with progress and selector.
 */
export function TrackHeader({
  track,
  progress,
  completedCases,
  totalCases,
  className,
}: TrackHeaderProps) {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  const selectorRef = React.useRef<HTMLDivElement>(null);

  const colors = getTrackColorClasses(track.color);
  const Icon = TRACK_ICONS[track.icon];
  const allTracks = getAllTracks();

  // Close selector on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-10",
          colors.bg
        )}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Icon, Title, Description */}
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Large Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center",
                colors.bg
              )}
            >
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            {/* Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  {track.name} Track
                </h1>
                <Badge className={cn(colors.bg, "text-white")}>
                  {track.shortName}
                </Badge>
              </div>
              <p className="text-slate-600 max-w-xl">{track.description}</p>

              {/* Progress Stats */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                  <span className="text-sm text-slate-600">
                    {completedCases}/{totalCases} cases
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-semibold", colors.text)}>
                    {progress}% complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Track Selector */}
          <div className="flex-shrink-0" ref={selectorRef}>
            <Button
              variant="outline"
              onClick={() => setSelectorOpen(!selectorOpen)}
              className="w-full sm:w-auto"
            >
              Switch Track
              <ChevronDown
                className={cn(
                  "w-4 h-4 ml-2 transition-transform",
                  selectorOpen && "rotate-180"
                )}
              />
            </Button>

            {/* Dropdown */}
            {selectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                {allTracks.map((t) => {
                  const tColors = getTrackColorClasses(t.color);
                  const TIcon = TRACK_ICONS[t.icon];
                  const isSelected = t.id === track.id;

                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        router.push(`/specialty/${t.slug}`);
                        setSelectorOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left",
                        isSelected && "bg-slate-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          tColors.bg
                        )}
                      >
                        <TIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-500">{t.shortName}</p>
                      </div>
                      {isSelected && (
                        <Check className={cn("w-4 h-4", tColors.text)} />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", colors.bg)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Track Header
// ============================================================================

export interface TrackHeaderCompactProps {
  track: SpecialtyTrackConfig;
  progress: number;
  className?: string;
}

export function TrackHeaderCompact({
  track,
  progress,
  className,
}: TrackHeaderCompactProps) {
  const colors = getTrackColorClasses(track.color);
  const Icon = TRACK_ICONS[track.icon];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          colors.bg
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm truncate">
          {track.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", colors.bg)}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
