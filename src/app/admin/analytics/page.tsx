// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  BookOpen,
  Award,
  Calendar,
  Flame,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Mock Data
// ============================================================================

const USAGE_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  daily: Math.floor(Math.random() * 100) + 50,
  weekly: Math.floor(Math.random() * 200) + 150,
  attempts: Math.floor(Math.random() * 500) + 200,
  registrations: Math.floor(Math.random() * 20) + 5,
}));

const CATEGORY_DATA = [
  { name: "Chest Pain", attempts: 1250, accuracy: 72, avgTime: 4.2 },
  { name: "Low Back Pain", attempts: 980, accuracy: 78, avgTime: 3.8 },
  { name: "Headache", attempts: 850, accuracy: 65, avgTime: 5.1 },
  { name: "Abdominal Pain", attempts: 720, accuracy: 70, avgTime: 4.5 },
  { name: "Extremity Trauma", attempts: 650, accuracy: 82, avgTime: 3.2 },
];

const DIFFICULTY_DATA = [
  { name: "Beginner", count: 2400, accuracy: 85 },
  { name: "Intermediate", count: 1800, accuracy: 72 },
  { name: "Advanced", count: 900, accuracy: 58 },
];

const TOP_CASES = [
  { title: "Acute Chest Pain Evaluation", attempts: 450, accuracy: 68 },
  { title: "Low Back Pain - Red Flags", attempts: 380, accuracy: 75 },
  { title: "Thunderclap Headache", attempts: 320, accuracy: 62 },
  { title: "Right Lower Quadrant Pain", attempts: 290, accuracy: 71 },
  { title: "Ankle Injury Assessment", attempts: 275, accuracy: 84 },
];

const HARDEST_CASES = [
  { title: "Aortic Dissection Workup", accuracy: 42, attempts: 180 },
  { title: "Pediatric Head Trauma", accuracy: 48, attempts: 150 },
  { title: "Pulmonary Embolism Evaluation", accuracy: 52, attempts: 220 },
  { title: "Stroke Imaging Protocol", accuracy: 55, attempts: 190 },
  { title: "Abdominal Aortic Aneurysm", accuracy: 58, attempts: 160 },
];

const SCORE_DISTRIBUTION = [
  { range: "0-20%", count: 120 },
  { range: "21-40%", count: 280 },
  { range: "41-60%", count: 450 },
  { range: "61-80%", count: 680 },
  { range: "81-100%", count: 520 },
];

const RETENTION_DATA = [
  { week: "Week 1", retained: 100, churned: 0 },
  { week: "Week 2", retained: 72, churned: 28 },
  { week: "Week 3", retained: 58, churned: 14 },
  { week: "Week 4", retained: 48, churned: 10 },
  { week: "Week 5", retained: 42, churned: 6 },
  { week: "Week 6", retained: 38, churned: 4 },
  { week: "Week 7", retained: 35, churned: 3 },
  { week: "Week 8", retained: 33, churned: 2 },
];

const STREAK_DISTRIBUTION = [
  { streak: "1-3 days", count: 450 },
  { streak: "4-7 days", count: 280 },
  { streak: "8-14 days", count: 150 },
  { streak: "15-30 days", count: 80 },
  { streak: "30+ days", count: 40 },
];

const COLORS = {
  cyan: "#06b6d4",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  blue: "#3b82f6",
};

// ============================================================================
// Component
// ============================================================================

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<"week" | "month" | "year">(
    "month"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Comprehensive platform insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
          {(["week", "month", "year"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                dateRange === range
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value="1,247"
          change={12.5}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
        />
        <KPICard
          title="Active Users (Weekly)"
          value="482"
          change={8.3}
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Case Attempts"
          value="12,450"
          change={15.2}
          icon={<BookOpen className="w-5 h-5" />}
          color="amber"
        />
        <KPICard
          title="Avg Accuracy"
          value="72%"
          change={-2.1}
          icon={<Target className="w-5 h-5" />}
          color="violet"
        />
      </div>

      {/* Usage Trends */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Active Users Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USAGE_DATA}>
                  <defs>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.cyan}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.cyan}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.violet}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.violet}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="daily"
                    name="Daily Active"
                    stroke={COLORS.cyan}
                    fill="url(#colorDaily)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="weekly"
                    name="Weekly Active"
                    stroke={COLORS.violet}
                    fill="url(#colorWeekly)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Case Attempts & Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={USAGE_DATA.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => v.slice(8)}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="attempts"
                    name="Case Attempts"
                    fill={COLORS.emerald}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="registrations"
                    name="New Users"
                    fill={COLORS.blue}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Analytics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Most Attempted Cases */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Most Attempted Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_CASES.map((caseItem, i) => (
                <motion.div
                  key={caseItem.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {caseItem.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {caseItem.attempts.toLocaleString()} attempts
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      caseItem.accuracy >= 70
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {caseItem.accuracy}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hardest Cases */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              Hardest Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {HARDEST_CASES.map((caseItem, i) => (
                <motion.div
                  key={caseItem.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {caseItem.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {caseItem.attempts} attempts
                    </p>
                  </div>
                  <Badge className="bg-rose-500/20 text-rose-400">
                    {caseItem.accuracy}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CATEGORY_DATA.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{cat.name}</span>
                    <span className="text-sm font-medium text-white">
                      {cat.accuracy}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        cat.accuracy >= 75
                          ? "bg-emerald-500"
                          : cat.accuracy >= 65
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.accuracy}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SCORE_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
                    {SCORE_DISTRIBUTION.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index < 2
                            ? COLORS.rose
                            : index < 3
                            ? COLORS.amber
                            : COLORS.emerald
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Difficulty Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DIFFICULTY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    <Cell fill={COLORS.emerald} />
                    <Cell fill={COLORS.amber} />
                    <Cell fill={COLORS.rose} />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {DIFFICULTY_DATA.map((d, i) => (
                <div key={d.name} className="text-center">
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      i === 0
                        ? "text-emerald-400"
                        : i === 1
                        ? "text-amber-400"
                        : "text-rose-400"
                    )}
                  >
                    {d.accuracy}%
                  </p>
                  <p className="text-xs text-slate-400">{d.name} Accuracy</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Retention Cohorts */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              User Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RETENTION_DATA}>
                  <defs>
                    <linearGradient id="retainedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.emerald}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.emerald}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="retained"
                    name="Retained %"
                    stroke={COLORS.emerald}
                    fill="url(#retainedGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-400">72%</p>
                <p className="text-xs text-slate-400">Week 2 Retention</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">48%</p>
                <p className="text-xs text-slate-400">Week 4 Retention</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">33%</p>
                <p className="text-xs text-slate-400">Week 8 Retention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Distribution */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Streak Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STREAK_DISTRIBUTION} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="streak"
                    stroke="#64748b"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Users"
                    fill={COLORS.amber}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-4 p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">Average Streak</span>
              </div>
              <span className="text-xl font-bold text-amber-400">6.4 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Analysis */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            Time Spent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {CATEGORY_DATA.map((cat) => (
              <div key={cat.name} className="p-4 bg-slate-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">{cat.avgTime}</p>
                <p className="text-xs text-slate-400">min avg</p>
                <p className="text-sm text-slate-300 mt-2">{cat.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Platform-wide Average</p>
              <p className="text-3xl font-bold text-white">4.2 minutes</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Total Learning Time</p>
              <p className="text-3xl font-bold text-violet-400">2,847 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function KPICard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "cyan" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  const isPositive = change >= 0;

  return (
    <Card className={cn("border", colors[color])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <div
              className={cn(
                "flex items-center gap-1 mt-1 text-sm",
                isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-slate-500">vs last period</span>
            </div>
          </div>
          <div className={cn("p-3 rounded-lg", colors[color])}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
