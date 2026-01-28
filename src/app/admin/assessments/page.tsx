// @ts-nocheck
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Target,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalClose, ModalFooter } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Assessment, DifficultyLevel, SpecialtyTrack } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface AssessmentWithStats extends Assessment {
  total_attempts: number;
  average_score: number;
  completion_rate: number;
}

interface AssessmentFormData {
  title: string;
  description: string;
  case_ids: string[];
  time_limit_minutes: number | null;
  passing_score: number;
  specialty_track: SpecialtyTrack | null;
  difficulty: DifficultyLevel | null;
  is_published: boolean;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_ASSESSMENTS: AssessmentWithStats[] = [
  {
    id: "1",
    title: "Emergency Medicine Comprehensive",
    description: "Comprehensive assessment covering all EM topics",
    case_ids: ["case-1", "case-2", "case-3"],
    time_limit_minutes: 60,
    passing_score: 75,
    specialty_track: "em",
    difficulty: "intermediate",
    is_published: true,
    is_custom: false,
    created_by: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    total_attempts: 342,
    average_score: 78,
    completion_rate: 68,
  },
  {
    id: "2",
    title: "Internal Medicine Basics",
    description: "Fundamental IM assessment for residents",
    case_ids: ["case-4", "case-5"],
    time_limit_minutes: 45,
    passing_score: 70,
    specialty_track: "im",
    difficulty: "beginner",
    is_published: true,
    is_custom: false,
    created_by: null,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
    total_attempts: 189,
    average_score: 72,
    completion_rate: 82,
  },
  {
    id: "3",
    title: "Advanced Radiology Cases",
    description: "Challenging cases for attending physicians",
    case_ids: ["case-6", "case-7", "case-8", "case-9"],
    time_limit_minutes: 90,
    passing_score: 85,
    specialty_track: null,
    difficulty: "advanced",
    is_published: false,
    is_custom: true,
    created_by: "admin-1",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-12T00:00:00Z",
    total_attempts: 45,
    average_score: 65,
    completion_rate: 45,
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentsManagementPage() {
  const [assessments, setAssessments] = React.useState<AssessmentWithStats[]>(MOCK_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterPublished, setFilterPublished] = React.useState<"all" | "published" | "unpublished">("all");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedAssessment, setSelectedAssessment] = React.useState<AssessmentWithStats | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Filter assessments
  const filteredAssessments = React.useMemo(() => {
    return assessments.filter((assessment) => {
      if (searchQuery && !assessment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterPublished === "published" && !assessment.is_published) {
        return false;
      }
      if (filterPublished === "unpublished" && assessment.is_published) {
        return false;
      }
      return true;
    });
  }, [assessments, searchQuery, filterPublished]);

  const handleTogglePublish = async (id: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_published: !a.is_published } : a))
    );
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assessment Management</h1>
          <p className="text-slate-400 mt-1">
            Create and manage assessments for your institution
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value={assessments.length}
          icon={<ClipboardList className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title="Published"
          value={assessments.filter((a) => a.is_published).length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Total Attempts"
          value={assessments.reduce((sum, a) => sum + a.total_attempts, 0)}
          icon={<Users className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Avg Completion Rate"
          value={`${Math.round(
            assessments.reduce((sum, a) => sum + a.completion_rate, 0) / assessments.length
          )}%`}
          icon={<Target className="w-5 h-5" />}
          color="violet"
        />
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <select
              value={filterPublished}
              onChange={(e) =>
                setFilterPublished(e.target.value as "all" | "published" | "unpublished")
              }
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="all">All Assessments</option>
              <option value="published">Published Only</option>
              <option value="unpublished">Unpublished Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assessments List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {assessment.title}
                      </h3>
                      {assessment.is_published ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Published
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                          Draft
                        </Badge>
                      )}
                      {assessment.is_custom && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      {assessment.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText className="w-4 h-4" />
                        {assessment.case_ids.length} questions
                      </div>
                      {assessment.time_limit_minutes && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4" />
                          {assessment.time_limit_minutes} min
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-300">
                        <Target className="w-4 h-4" />
                        Passing: {assessment.passing_score}%
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="w-4 h-4" />
                        {assessment.total_attempts} attempts
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">Avg Score:</span>
                        <span
                          className={cn(
                            "font-medium",
                            assessment.average_score >= 75
                              ? "text-emerald-400"
                              : assessment.average_score >= 60
                              ? "text-amber-400"
                              : "text-rose-400"
                          )}
                        >
                          {assessment.average_score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublish(assessment.id)}
                      disabled={loading}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        assessment.is_published
                          ? "text-emerald-400 hover:bg-emerald-500/10"
                          : "text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      {assessment.is_published ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <AssessmentActionMenu
                      assessment={assessment}
                      onEdit={() => {
                        setSelectedAssessment(assessment);
                        setShowEditModal(true);
                      }}
                      onDelete={() => handleDelete(assessment.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showCreateModal || showEditModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedAssessment(null);
          }
        }}
      >
        <ModalContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle className="text-white">
              {showEditModal ? "Edit Assessment" : "Create Custom Assessment"}
            </ModalTitle>
            <ModalClose />
          </ModalHeader>
          <AssessmentForm
            assessment={selectedAssessment}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedAssessment(null);
            }}
            onSave={(data) => {
              if (showEditModal && selectedAssessment) {
                setAssessments((prev) =>
                  prev.map((a) =>
                    a.id === selectedAssessment.id
                      ? { ...a, ...data, updated_at: new Date().toISOString() }
                      : a
                  )
                );
              } else {
                const newAssessment: AssessmentWithStats = {
                  id: Date.now().toString(),
                  ...data,
                  is_custom: true,
                  created_by: "current-user-id",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  total_attempts: 0,
                  average_score: 0,
                  completion_rate: 0,
                };
                setAssessments((prev) => [...prev, newAssessment]);
              }
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedAssessment(null);
            }}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", colors[color])}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentActionMenu({
  assessment,
  onEdit,
  onDelete,
}: {
  assessment: AssessmentWithStats;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-white"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <button
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AssessmentForm({
  assessment,
  onClose,
  onSave,
}: {
  assessment: AssessmentWithStats | null;
  onClose: () => void;
  onSave: (data: AssessmentFormData) => void;
}) {
  const [formData, setFormData] = React.useState<AssessmentFormData>({
    title: assessment?.title || "",
    description: assessment?.description || "",
    case_ids: assessment?.case_ids || [],
    time_limit_minutes: assessment?.time_limit_minutes || null,
    passing_score: assessment?.passing_score || 70,
    specialty_track: assessment?.specialty_track || null,
    difficulty: assessment?.difficulty || null,
    is_published: assessment?.is_published || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="bg-slate-800 border-slate-700 text-white"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={3}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Time Limit (minutes)
          </label>
          <Input
            type="number"
            value={formData.time_limit_minutes || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                time_limit_minutes: e.target.value
                  ? parseInt(e.target.value)
                  : null,
              })
            }
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Passing Score (%)
          </label>
          <Input
            type="number"
            value={formData.passing_score}
            onChange={(e) =>
              setFormData({
                ...formData,
                passing_score: parseInt(e.target.value),
              })
            }
            min={0}
            max={100}
            required
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Specialty</label>
          <select
            value={formData.specialty_track || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                specialty_track: e.target.value
                  ? (e.target.value as SpecialtyTrack)
                  : null,
              })
            }
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="">None</option>
            <option value="em">Emergency Medicine</option>
            <option value="im">Internal Medicine</option>
            <option value="fm">Family Medicine</option>
            <option value="surgery">Surgery</option>
            <option value="peds">Pediatrics</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Difficulty</label>
          <select
            value={formData.difficulty || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                difficulty: e.target.value
                  ? (e.target.value as DifficultyLevel)
                  : null,
              })
            }
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_published}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_published: checked })
          }
        />
        <label className="text-sm text-slate-300">Publish immediately</label>
      </div>
      <ModalFooter className="px-0 pb-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
          {assessment ? "Update" : "Create"} Assessment
        </Button>
      </ModalFooter>
    </form>
  );
}
