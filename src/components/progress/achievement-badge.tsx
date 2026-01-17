"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Calendar, Award, Lock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import {
  type AchievementDefinition,
  type AchievementSlug,
  ACHIEVEMENT_CATEGORY_LABELS,
} from "@/data/achievements";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface AchievementBadgeProps {
  /** Achievement definition */
  achievement: AchievementDefinition;
  /** Whether the achievement is earned */
  isEarned: boolean;
  /** Date earned */
  earnedAt?: string;
  /** Current progress (for unearned) */
  progress?: number;
  /** Total required (for unearned) */
  total?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Click handler (default opens modal) */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Size Configuration
// ============================================================================

const SIZE_CLASSES = {
  sm: {
    container: "w-12 h-12",
    icon: "text-xl",
    ring: "ring-2",
  },
  md: {
    container: "w-16 h-16",
    icon: "text-2xl",
    ring: "ring-2",
  },
  lg: {
    container: "w-24 h-24",
    icon: "text-4xl",
    ring: "ring-4",
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * AchievementBadge - Displays an achievement badge with earned/locked state.
 */
export function AchievementBadge({
  achievement,
  isEarned,
  earnedAt,
  progress = 0,
  total,
  size = "md",
  showTooltip = true,
  onClick,
  className,
}: AchievementBadgeProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  const sizeClasses = SIZE_CLASSES[size];
  const progressPercent = total ? Math.round((progress / total) * 100) : 0;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all",
          sizeClasses.container,
          isEarned
            ? "bg-gradient-to-br from-amber-100 to-amber-200 ring-amber-300"
            : "bg-slate-100 ring-slate-200",
          sizeClasses.ring,
          "ring-offset-2 ring-offset-white",
          className
        )}
      >
        {/* Icon */}
        <span
          className={cn(
            sizeClasses.icon,
            !isEarned && "grayscale opacity-50"
          )}
        >
          {achievement.icon}
        </span>

        {/* Shine animation for earned */}
        {isEarned && (
          <motion.div
            initial={{ opacity: 0, rotate: -45 }}
            animate={{
              opacity: [0, 0.5, 0],
              x: [-20, 40],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute inset-0 overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12" />
          </motion.div>
        )}

        {/* Lock icon for unearned */}
        {!isEarned && !achievement.isSecret && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center">
            <Lock className="w-3 h-3 text-slate-600" />
          </div>
        )}

        {/* Checkmark for earned */}
        {isEarned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={achievement}
        isEarned={isEarned}
        earnedAt={earnedAt}
        progress={progress}
        total={total}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// ============================================================================
// Achievement Modal
// ============================================================================

interface AchievementModalProps {
  achievement: AchievementDefinition;
  isEarned: boolean;
  earnedAt?: string;
  progress?: number;
  total?: number;
  isOpen: boolean;
  onClose: () => void;
}

function AchievementModal({
  achievement,
  isEarned,
  earnedAt,
  progress = 0,
  total,
  isOpen,
  onClose,
}: AchievementModalProps) {
  const [copied, setCopied] = React.useState(false);

  const progressPercent = total ? Math.round((progress / total) * 100) : 0;
  const formattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleShare = async () => {
    const text = isEarned
      ? `I earned the "${achievement.name}" achievement on ARKA-ED! 🎉`
      : `Working towards the "${achievement.name}" achievement on ARKA-ED!`;

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      // Ignore share errors
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="sm" className="text-center">
        {/* Large Badge */}
        <div className="flex justify-center py-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center",
              isEarned
                ? "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 ring-4 ring-amber-300 ring-offset-4"
                : "bg-slate-100 ring-4 ring-slate-200 ring-offset-4"
            )}
          >
            <span
              className={cn(
                "text-6xl",
                !isEarned && "grayscale opacity-50"
              )}
            >
              {achievement.icon}
            </span>
          </motion.div>
        </div>

        {/* Name & Description */}
        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {achievement.name}
          </h2>
          <p className="text-slate-600">{achievement.description}</p>

          {/* Category Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" size="sm">
              {ACHIEVEMENT_CATEGORY_LABELS[achievement.category]}
            </Badge>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          {isEarned ? (
            <div className="flex items-center justify-center gap-3 text-emerald-600">
              <Award className="w-5 h-5" />
              <span className="font-medium">Earned!</span>
              {formattedDate && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium">
                  {progress} / {total || achievement.requirementValue}
                </span>
              </div>
              <LinearProgress
                value={progressPercent}
                color={progressPercent >= 75 ? "warning" : "default"}
              />
              <p className="text-xs text-slate-500 mt-2">
                {total
                  ? `${progressPercent}% complete`
                  : "Keep going to unlock this achievement!"}
              </p>
            </div>
          )}
        </div>

        {/* Points */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-amber-500">⭐</span>
          <span className="font-medium text-slate-900">
            {achievement.points} points
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="flex-1">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </>
            )}
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Achievement Grid
// ============================================================================

export interface AchievementGridProps {
  achievements: Array<{
    achievement: AchievementDefinition;
    isEarned: boolean;
    earnedAt?: string;
    progress?: number;
    total?: number;
  }>;
  size?: "sm" | "md" | "lg";
  columns?: number;
  className?: string;
}

export function AchievementGrid({
  achievements,
  size = "md",
  columns = 4,
  className,
}: AchievementGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5",
        columns === 6 && "grid-cols-6",
        className
      )}
    >
      {achievements.map(({ achievement, isEarned, earnedAt, progress, total }) => (
        <div key={achievement.slug} className="flex flex-col items-center gap-2">
          <AchievementBadge
            achievement={achievement}
            isEarned={isEarned}
            earnedAt={earnedAt}
            progress={progress}
            total={total}
            size={size}
          />
          <span
            className={cn(
              "text-xs text-center font-medium",
              isEarned ? "text-slate-900" : "text-slate-500"
            )}
          >
            {achievement.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Achievement Notification Toast
// ============================================================================

export interface AchievementToastProps {
  achievement: AchievementDefinition;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-amber-200 p-4 flex items-center gap-4 max-w-sm z-50"
    >
      {/* Badge */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">{achievement.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
          Achievement Unlocked!
        </p>
        <p className="font-bold text-slate-900 truncate">{achievement.name}</p>
        <p className="text-sm text-slate-500 truncate">{achievement.description}</p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// ============================================================================
// Recent Achievement Card
// ============================================================================

export interface RecentAchievementProps {
  achievement: AchievementDefinition;
  earnedAt: string;
  className?: string;
}

export function RecentAchievementCard({
  achievement,
  earnedAt,
  className,
}: RecentAchievementProps) {
  const formattedDate = new Date(earnedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">{achievement.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm truncate">
          {achievement.name}
        </p>
        <p className="text-xs text-amber-600">{formattedDate}</p>
      </div>
      <span className="text-amber-500 text-sm">+{achievement.points}</span>
    </div>
  );
}
