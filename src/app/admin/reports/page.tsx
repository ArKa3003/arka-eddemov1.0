// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Users,
  Target,
  BarChart3,
  TrendingUp,
  Filter,
  FileDown,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "user" | "assessment" | "performance" | "institutional";
}

// ============================================================================
// Mock Data
// ============================================================================

const AVAILABLE_REPORTS: Report[] = [
  {
    id: "user-progress",
    name: "User Progress Summary",
    description: "Comprehensive overview of user activity, completion rates, and performance metrics",
    icon: <Users className="w-5 h-5" />,
    category: "user",
  },
  {
    id: "assessment-results",
    name: "Assessment Results by User",
    description: "Detailed breakdown of assessment performance for each user",
    icon: <FileText className="w-5 h-5" />,
    category: "assessment",
  },
  {
    id: "category-performance",
    name: "Category Performance",
    description: "Performance metrics broken down by case category",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "performance",
  },
  {
    id: "institutional-benchmarks",
    name: "Institutional Benchmarks",
    description: "Compare your institution's performance against system-wide averages",
    icon: <Target className="w-5 h-5" />,
    category: "institutional",
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<
    "all" | "user" | "assessment" | "performance" | "institutional"
  >("all");
  const [dateRange, setDateRange] = React.useState<"week" | "month" | "quarter" | "year">("month");
  const [generating, setGenerating] = React.useState<string | null>(null);

  const filteredReports = React.useMemo(() => {
    if (selectedCategory === "all") return AVAILABLE_REPORTS;
    return AVAILABLE_REPORTS.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  const handleGenerateReport = async (reportId: string, format: "pdf" | "csv") => {
    setGenerating(`${reportId}-${format}`);
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(null);
    // In real implementation, this would download the file
    alert(`${AVAILABLE_REPORTS.find((r) => r.id === reportId)?.name} (${format.toUpperCase()}) generated successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1">
            Generate and export comprehensive analytics reports
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Category:</span>
            </div>
            <div className="flex gap-2">
              {(["all", "user", "assessment", "performance", "institutional"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedCategory === cat
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                )
              )}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) =>
                  setDateRange(e.target.value as "week" | "month" | "quarter" | "year")
                }
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                      {report.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white">{report.name}</CardTitle>
                      <Badge
                        variant="primary"
                        className="mt-2 bg-slate-700 text-slate-300 capitalize"
                      >
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">{report.description}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                  <Button
                    onClick={() => handleGenerateReport(report.id, "pdf")}
                    disabled={generating === `${report.id}-pdf`}
                    variant="primary"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {generating === `${report.id}-pdf` ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4 mr-2" />
                    )}
                    PDF
                  </Button>
                  <Button
                    onClick={() => handleGenerateReport(report.id, "csv")}
                    disabled={generating === `${report.id}-csv`}
                    variant="primary"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {generating === `${report.id}-csv` ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                    )}
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Reports Generated"
          value="1,247"
          change={12.5}
          icon={<FileText className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title="Users Analyzed"
          value="856"
          icon={<Users className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Avg Performance"
          value="73%"
          change={2.1}
          icon={<Target className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Export Rate"
          value="94%"
          icon={<Download className="w-5 h-5" />}
          color="violet"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: "cyan" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <Card className={cn("border", colors[color])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={cn("p-2 rounded-lg", colors[color])}>{icon}</div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                change >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              <TrendingUp className="w-3 h-3" />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}
