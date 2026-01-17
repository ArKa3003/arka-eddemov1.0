"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Clock,
  Trophy,
  Flame,
  Filter,
  Dumbbell,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard, RingStatsCard, StreakStatsCard } from "./stats-card";
import { ProgressChart, type ProgressDataPoint } from "./progress-chart";
import { CompetencyRadar, type CompetencyScore } from "./competency-radar";
import { CategoryBreakdown, type CategoryData } from "./category-bar";
import { StreakCalendar, type DayActivity } from "./streak-calendar";
import { ActivityFeed, type ActivityItem } from "./activity-feed";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

type DateRange = "week" | "month" | "all";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  total?: number;
}

interface WeakArea {
  category: CaseCategory;
  label: string;
  accuracy: number;
  suggestedCases: { id: string; title: string }[];
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_STATS = {
  casesCompleted: 32,
  totalCases: 50,
  accuracyRate: 76,
  previousAccuracy: 72,
  currentStreak: 7,
  longestStreak: 14,
  timeInvested: 12.5,
};

const MOCK_CHART_DATA: ProgressDataPoint[] = [
  { date: "2026-01-11", value: 68, cases: 4, label: "Jan 11" },
  { date: "2026-01-12", value: 72, cases: 3, label: "Jan 12" },
  { date: "2026-01-13", value: 75, cases: 5, label: "Jan 13" },
  { date: "2026-01-14", value: 71, cases: 2, label: "Jan 14" },
  { date: "2026-01-15", value: 78, cases: 4, label: "Jan 15" },
  { date: "2026-01-16", value: 82, cases: 6, label: "Jan 16" },
  { date: "2026-01-17", value: 76, cases: 3, label: "Jan 17" },
];

const MOCK_COMPETENCY_SCORES: CompetencyScore[] = [
  { category: "low-back-pain", label: "Low Back Pain", current: 85, target: 80 },
  { category: "headache", label: "Headache", current: 72, target: 80 },
  { category: "chest-pain", label: "Chest Pain", current: 78, target: 80 },
  { category: "abdominal-pain", label: "Abdominal Pain", current: 65, target: 80 },
  { category: "extremity-trauma", label: "Extremity Trauma", current: 58, target: 80 },
];

const MOCK_CATEGORY_DATA: CategoryData[] = [
  { category: "low-back-pain", label: "Low Back Pain", attempted: 10, correct: 8, total: 12, icon: "🦴" },
  { category: "headache", label: "Headache", attempted: 8, correct: 6, total: 10, icon: "🧠" },
  { category: "chest-pain", label: "Chest Pain", attempted: 12, correct: 9, total: 15, icon: "❤️" },
  { category: "abdominal-pain", label: "Abdominal Pain", attempted: 10, correct: 6, total: 18, icon: "🩺" },
  { category: "extremity-trauma", label: "Extremity Trauma", attempted: 5, correct: 3, total: 8, icon: "🦵" },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "case_completed",
    title: "Acute Chest Pain Evaluation",
    score: 92,
    isCorrect: true,
    timeSpent: 180,
    category: "chest-pain",
    difficulty: "intermediate",
    caseId: "case-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    type: "achievement_earned",
    title: "Streak Master",
    subtitle: "7-day streak achieved!",
    achievementId: "streak-7",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "3",
    type: "case_completed",
    title: "Lumbar Radiculopathy",
    score: 68,
    isCorrect: false,
    timeSpent: 240,
    category: "low-back-pain",
    difficulty: "advanced",
    caseId: "case-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "4",
    type: "assessment_completed",
    title: "EM Quick Assessment",
    score: 75,
    assessmentId: "assess-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "5",
    type: "case_completed",
    title: "Thunderclap Headache",
    score: 85,
    isCorrect: true,
    timeSpent: 195,
    category: "headache",
    difficulty: "advanced",
    caseId: "case-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const MOCK_STREAK_ACTIVITIES: DayActivity[] = Array.from({ length: 84 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (83 - i));
  const dateStr = date.toISOString().split("T")[0];
  const count = Math.random() > 0.3 ? Math.floor(Math.random() * 8) : 0;
  const isStreak = i >= 77; // Last 7 days are streak
  return { date: dateStr, count, isStreak };
});

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "1", name: "First Steps", description: "Complete your first case", icon: "👣", earned: true },
  { id: "2", name: "Quick Learner", description: "Complete 10 cases", icon: "📚", earned: true },
  { id: "3", name: "Streak Starter", description: "3-day streak", icon: "🔥", earned: true },
  { id: "4", name: "Streak Master", description: "7-day streak", icon: "🔥", earned: true },
  { id: "5", name: "Perfectionist", description: "Score 100% on a case", icon: "💯", earned: true },
  { id: "6", name: "Category Expert", description: "Master all categories", icon: "🎯", earned: false, progress: 3, total: 5 },
  { id: "7", name: "Speed Demon", description: "Complete a case in under 2 minutes", icon: "⚡", earned: false },
  { id: "8", name: "Night Owl", description: "Study after midnight", icon: "🦉", earned: false },
];

const MOCK_WEAK_AREAS: WeakArea[] = [
  {
    category: "extremity-trauma",
    label: "Extremity Trauma",
    accuracy: 58,
    suggestedCases: [
      { id: "c1", title: "Ottawa Ankle Rules" },
      { id: "c2", title: "Wrist Fracture Imaging" },
    ],
  },
  {
    category: "abdominal-pain",
    label: "Abdominal Pain",
    accuracy: 60,
    suggestedCases: [
      { id: "c3", title: "RLQ Pain Workup" },
      { id: "c4", title: "Ovarian Torsion" },
    ],
  },
];

// ============================================================================
// Component
// ============================================================================

export function ProgressDashboard() {
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange>("week");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">
              Your Progress
            </h1>
            <p className="text-slate-600">
              Track your learning journey and identify areas for improvement
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200">
            {(["week", "month", "all"] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  dateRange === range
                    ? "bg-cyan-500 text-white"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {range === "week" && "This Week"}
                {range === "month" && "This Month"}
                {range === "all" && "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RingStatsCard
            title="Cases Completed"
            value={MOCK_STATS.casesCompleted}
            total={MOCK_STATS.totalCases}
            icon={<BookOpen className="w-5 h-5" />}
            iconColor="cyan"
            ringColor="#06b6d4"
            delay={0}
          />
          <StatsCard
            title="Accuracy Rate"
            value={MOCK_STATS.accuracyRate}
            previousValue={MOCK_STATS.previousAccuracy}
            isPercentage
            icon={<Target className="w-5 h-5" />}
            iconColor="emerald"
            delay={0.1}
          />
          <StreakStatsCard
            currentStreak={MOCK_STATS.currentStreak}
            longestStreak={MOCK_STATS.longestStreak}
            delay={0.2}
          />
          <StatsCard
            title="Time Invested"
            value={MOCK_STATS.timeInvested}
            suffix="hours"
            icon={<Clock className="w-5 h-5" />}
            iconColor="violet"
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressChart
            data={MOCK_CHART_DATA}
            dateRange={dateRange}
            metric="accuracy"
            title="Performance Over Time"
          />
          <CompetencyRadar
            scores={MOCK_COMPETENCY_SCORES}
            title="Competency by Category"
          />
        </div>

        {/* Calendar & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <StreakCalendar
              activities={MOCK_STREAK_ACTIVITIES}
              weeks={12}
              currentStreak={MOCK_STATS.currentStreak}
              title="Activity Calendar"
            />
          </div>
          <CategoryBreakdown
            categories={MOCK_CATEGORY_DATA}
            title="Category Breakdown"
            onCategoryClick={(cat) => router.push(`/cases?category=${cat}`)}
          />
        </div>

        {/* Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityFeed
            activities={MOCK_ACTIVITIES}
            title="Recent Activity"
            initialCount={5}
          />
          <AchievementsCard achievements={MOCK_ACHIEVEMENTS} />
        </div>

        {/* Weak Areas */}
        <WeakAreasCard
          weakAreas={MOCK_WEAK_AREAS}
          onFocusMode={() => router.push("/cases?sort=weak")}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Achievements Card
// ============================================================================

interface AchievementsCardProps {
  achievements: Achievement[];
}

function AchievementsCard({ achievements }: AchievementsCardProps) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Achievements
          </CardTitle>
          <span className="text-sm text-slate-500">
            {earnedCount}/{achievements.length} earned
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative flex flex-col items-center p-3 rounded-xl transition-colors cursor-pointer",
                achievement.earned
                  ? "bg-amber-50 hover:bg-amber-100"
                  : "bg-slate-100 hover:bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "text-2xl mb-1",
                  !achievement.earned && "grayscale opacity-50"
                )}
              >
                {achievement.icon}
              </span>
              <span
                className={cn(
                  "text-xs text-center font-medium",
                  achievement.earned ? "text-slate-900" : "text-slate-500"
                )}
              >
                {achievement.name}
              </span>
              {achievement.progress !== undefined && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {achievement.progress}/{achievement.total}
                </span>
              )}
              {achievement.earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px] text-white">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Weak Areas Card
// ============================================================================

interface WeakAreasCardProps {
  weakAreas: WeakArea[];
  onFocusMode: () => void;
}

function WeakAreasCard({ weakAreas, onFocusMode }: WeakAreasCardProps) {
  const router = useRouter();

  if (weakAreas.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-amber-800">
            <Dumbbell className="w-4 h-4" />
            Areas for Improvement
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onFocusMode}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Focus Mode
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakAreas.map((area) => (
            <div
              key={area.category}
              className="bg-white rounded-lg p-4 border border-amber-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-900">{area.label}</span>
                <Badge variant="destructive" size="sm">
                  {area.accuracy}% accuracy
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-3">Suggested practice:</p>
              <div className="space-y-2">
                {area.suggestedCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/cases/${c.id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="text-sm text-slate-700">{c.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
