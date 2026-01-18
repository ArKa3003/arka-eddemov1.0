"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Users,
  BookOpen,
  Target,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  FileText,
  ClipboardList,
  Activity,
  Database,
  AlertTriangle,
  Zap,
  UserPlus,
  CheckCircle,
  Award,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Clock,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinearProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: "cyan" | "emerald" | "amber" | "rose" | "violet";
}

interface ActivityItem {
  id: string;
  type: "registration" | "case_completion" | "assessment_pass" | "error";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface PopularCase {
  id: string;
  title: string;
  attempts: number;
  avgScore: number;
  category: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_STATS = {
  totalUsers: 1247,
  userGrowth: 12.5,
  activeUsersDaily: 89,
  activeUsersWeekly: 342,
  activeUsersMonthly: 876,
  totalAttempts: 8934,
  attemptGrowth: 8.2,
  averageAccuracy: 73,
  accuracyChange: 2.1,
};

const MOCK_POPULAR_CASES: PopularCase[] = [
  { id: "1", title: "Acute Chest Pain Evaluation", attempts: 423, avgScore: 76, category: "chest-pain" },
  { id: "2", title: "Low Back Pain Workup", attempts: 389, avgScore: 72, category: "low-back-pain" },
  { id: "3", title: "Abdominal Pain Assessment", attempts: 356, avgScore: 68, category: "abdominal-pain" },
  { id: "4", title: "Headache Red Flags", attempts: 312, avgScore: 81, category: "headache" },
  { id: "5", title: "Ankle Injury Imaging", attempts: 287, avgScore: 79, category: "extremity-trauma" },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "registration",
    title: "New user registered",
    description: "john.smith@hospital.org joined as Resident",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    type: "case_completion",
    title: "Case completed",
    description: "Sarah M. scored 92% on Chest Pain Evaluation",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "3",
    type: "assessment_pass",
    title: "Assessment passed",
    description: "Dr. James K. passed EM Comprehensive with 88%",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "4",
    type: "error",
    title: "Error reported",
    description: "Case 'trauma-head-2' has incorrect answer key",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "5",
    type: "registration",
    title: "New user registered",
    description: "emily.chen@med.edu joined as Medical Student",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const MOCK_SYSTEM_HEALTH = {
  databaseStatus: "healthy" as const,
  errorRate: 0.12,
  avgResponseTime: 145,
  uptime: 99.98,
};

// ============================================================================
// Page Component
// ============================================================================

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">
              Platform overview and management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <Link href="/cases">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Users"
            value={MOCK_STATS.totalUsers.toLocaleString()}
            change={MOCK_STATS.userGrowth}
            changeLabel="vs last month"
            icon={<Users className="w-5 h-5" />}
            color="cyan"
          />
          <AdminStatCard
            title="Active Users (Weekly)"
            value={MOCK_STATS.activeUsersWeekly.toLocaleString()}
            icon={<Activity className="w-5 h-5" />}
            color="emerald"
          />
          <AdminStatCard
            title="Total Case Attempts"
            value={MOCK_STATS.totalAttempts.toLocaleString()}
            change={MOCK_STATS.attemptGrowth}
            changeLabel="vs last month"
            icon={<BookOpen className="w-5 h-5" />}
            color="amber"
          />
          <AdminStatCard
            title="Average Accuracy"
            value={`${MOCK_STATS.averageAccuracy}%`}
            change={MOCK_STATS.accuracyChange}
            changeLabel="vs last month"
            icon={<Target className="w-5 h-5" />}
            color="violet"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Activity & Popular Cases */}
          <div className="lg:col-span-2 space-y-6">
            <RecentActivityCard activities={MOCK_ACTIVITIES} />
            <PopularCasesCard cases={MOCK_POPULAR_CASES} />
          </div>

          {/* Right: System Health & User Stats */}
          <div className="space-y-6">
            <SystemHealthCard health={MOCK_SYSTEM_HEALTH} />
            <UserBreakdownCard
              daily={MOCK_STATS.activeUsersDaily}
              weekly={MOCK_STATS.activeUsersWeekly}
              monthly={MOCK_STATS.activeUsersMonthly}
              total={MOCK_STATS.totalUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stat Card
// ============================================================================

function AdminStatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
}: StatCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const colorClasses = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  const iconColors = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    violet: "text-violet-400",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={cn("p-2 rounded-lg", colorClasses[color])}>
              <span className={iconColors[color]}>{icon}</span>
            </div>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  change >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400 mt-1">{title}</p>
            {changeLabel && (
              <p className="text-xs text-slate-500 mt-0.5">{changeLabel}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Quick Actions
// ============================================================================

function QuickActions() {
  const actions = [
    {
      label: "Add New Case",
      href: "/admin/cases/new",
      icon: Plus,
      color: "bg-cyan-500 hover:bg-cyan-600",
    },
    {
      label: "View Users",
      href: "/admin/users",
      icon: Eye,
      color: "bg-slate-700 hover:bg-slate-600",
    },
    {
      label: "Generate Report",
      href: "/admin/reports",
      icon: FileText,
      color: "bg-slate-700 hover:bg-slate-600",
    },
    {
      label: "Manage Assessments",
      href: "/admin/assessments",
      icon: ClipboardList,
      color: "bg-slate-700 hover:bg-slate-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Button className={cn("text-white", action.color)}>
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

// ============================================================================
// Recent Activity Card
// ============================================================================

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "registration":
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case "case_completion":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "assessment_pass":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  const formatTime = (timestamp: string): string => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Recent Activity
          </CardTitle>
          <Link href="/admin/activity">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                activity.type === "error" ? "bg-rose-500/10" : "bg-slate-800/50"
              )}
            >
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">
                {formatTime(activity.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Popular Cases Card
// ============================================================================

interface PopularCasesCardProps {
  cases: PopularCase[];
}

function PopularCasesCard({ cases }: PopularCasesCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            Popular Cases
          </CardTitle>
          <Link href="/admin/cases">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              Manage Cases
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
            >
              <span className="text-sm font-bold text-slate-500 w-5">
                #{index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {caseItem.title}
                </p>
                <p className="text-xs text-slate-400">
                  {caseItem.attempts} attempts • Avg: {caseItem.avgScore}%
                </p>
              </div>
              <Badge variant="default" size="sm" className="bg-slate-700 text-slate-300">
                {caseItem.category.replace("-", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// System Health Card
// ============================================================================

interface SystemHealthCardProps {
  health: typeof MOCK_SYSTEM_HEALTH;
}

function SystemHealthCard({ health }: SystemHealthCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400";
      case "degraded":
        return "text-amber-400";
      case "down":
        return "text-rose-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-400" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Database Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Database</span>
          </div>
          <span className={cn("text-sm font-medium capitalize", getStatusColor(health.databaseStatus))}>
            {health.databaseStatus}
          </span>
        </div>

        {/* Error Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Error Rate</span>
          </div>
          <span className={cn("text-sm font-medium", health.errorRate < 1 ? "text-emerald-400" : "text-amber-400")}>
            {health.errorRate}%
          </span>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Avg Response</span>
          </div>
          <span className={cn("text-sm font-medium", health.avgResponseTime < 200 ? "text-emerald-400" : "text-amber-400")}>
            {health.avgResponseTime}ms
          </span>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Uptime</span>
          </div>
          <span className="text-sm font-medium text-emerald-400">
            {health.uptime}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// User Breakdown Card
// ============================================================================

interface UserBreakdownCardProps {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}

function UserBreakdownCard({ daily, weekly, monthly, total }: UserBreakdownCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          Active Users
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-400">Daily</span>
            <span className="text-sm font-medium text-white">{daily}</span>
          </div>
          <LinearProgress value={(daily / total) * 100} color="primary" size="sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-400">Weekly</span>
            <span className="text-sm font-medium text-white">{weekly}</span>
          </div>
          <LinearProgress value={(weekly / total) * 100} color="primary" size="sm" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-400">Monthly</span>
            <span className="text-sm font-medium text-white">{monthly}</span>
          </div>
          <LinearProgress value={(monthly / total) * 100} color="primary" size="sm" />
        </div>
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Registered</span>
            <span className="text-sm font-bold text-white">{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
