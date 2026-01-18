"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Eye,
  X,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  FileText,
  User,
  Stethoscope,
  Activity,
  FlaskConical,
  Image,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, slugify } from "@/lib/utils";
import type {
  CaseCategory,
  DifficultyLevel,
  SpecialtyTrack,
  VitalSigns,
  LabResult,
  ClinicalPearl,
  Reference,
} from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CaseFormData {
  // Basic Info
  title: string;
  slug: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  specialtyTags: SpecialtyTrack[];
  acrTopic: string;

  // Patient Info
  patientAge: number;
  patientSex: "male" | "female";
  chiefComplaint: string;

  // Clinical Vignette
  clinicalVignette: string;
  patientHistory: string[];
  medications: string[];
  socialHistory: string;
  familyHistory: string;
  reviewOfSystems: string;

  // Physical Exam & Vitals
  vitalSigns: VitalSigns | null;
  physicalExam: string;

  // Lab Results
  labResults: LabResult[];

  // Imaging Options
  imagingRatings: ImagingRating[];

  // Explanation & Teaching
  explanation: string;
  teachingPoints: string[];
  clinicalPearls: ClinicalPearl[];
  hints: string[];

  // References
  references: Reference[];

  // Status
  isPublished: boolean;
}

export interface ImagingRating {
  imagingOptionId: string;
  imagingName: string;
  acrRating: number;
  rationale: string;
  isOptimal: boolean;
}

export interface CaseEditorProps {
  /** Initial form data (for editing) */
  initialData?: Partial<CaseFormData>;
  /** Case ID (for editing) */
  caseId?: string;
  /** Available imaging options */
  imagingOptions: Array<{ id: string; name: string; modality: string }>;
  /** Submit handler */
  onSubmit: (data: CaseFormData) => Promise<void>;
  /** Is new case */
  isNew?: boolean;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FORM_DATA: CaseFormData = {
  title: "",
  slug: "",
  category: "chest-pain",
  difficulty: "intermediate",
  specialtyTags: [],
  acrTopic: "",
  patientAge: 45,
  patientSex: "male",
  chiefComplaint: "",
  clinicalVignette: "",
  patientHistory: [],
  medications: [],
  socialHistory: "",
  familyHistory: "",
  reviewOfSystems: "",
  vitalSigns: {
    heart_rate: 80,
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    respiratory_rate: 16,
    temperature: 37,
    temperature_unit: "celsius",
    oxygen_saturation: 98,
  },
  physicalExam: "",
  labResults: [],
  imagingRatings: [],
  explanation: "",
  teachingPoints: [],
  clinicalPearls: [],
  hints: [],
  references: [],
  isPublished: false,
};

// ============================================================================
// Component
// ============================================================================

export function CaseEditor({
  initialData,
  caseId,
  imagingOptions,
  onSubmit,
  isNew = true,
}: CaseEditorProps) {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = React.useState<CaseFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["basic", "patient", "clinical"])
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Auto-generate slug from title
  React.useEffect(() => {
    if (isNew && formData.title && !initialData?.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.title),
      }));
    }
  }, [formData.title, isNew, initialData?.slug]);

  // Auto-save draft
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title) {
        localStorage.setItem(
          `case-draft-${caseId || "new"}`,
          JSON.stringify(formData)
        );
        setLastSaved(new Date());
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [formData, caseId]);

  /**
   * Update form field
   */
  const updateField = <K extends keyof CaseFormData>(
    field: K,
    value: CaseFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /**
   * Toggle section
   */
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Chief complaint is required";
    }
    if (!formData.clinicalVignette.trim()) {
      newErrors.clinicalVignette = "Clinical vignette is required";
    }
    if (formData.imagingRatings.length === 0) {
      newErrors.imagingRatings = "At least one imaging option is required";
    }
    if (!formData.explanation.trim()) {
      newErrors.explanation = "Explanation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSubmit(formData);
      localStorage.removeItem(`case-draft-${caseId || "new"}`);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle duplicate
   */
  const handleDuplicate = () => {
    const duplicatedData = {
      ...formData,
      title: `${formData.title} (Copy)`,
      slug: `${formData.slug}-copy`,
      isPublished: false,
    };
    localStorage.setItem("case-draft-new", JSON.stringify(duplicatedData));
    router.push("/admin/cases/new");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/cases")}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {isNew ? "New Case" : "Edit Case"}
              </h1>
              {lastSaved && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Auto-saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Toggle */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("edit")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTab === "edit"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTab === "preview"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {formData.isPublished ? "Published" : "Draft"}
              </span>
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) => updateField("isPublished", checked)}
              />
            </div>

            {/* Actions */}
            {!isNew && (
              <Button
                variant="outline"
                onClick={handleDuplicate}
                className="border-slate-700 text-slate-300"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isNew ? "Create Case" : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "edit" ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Basic Info */}
              <EditorSection
                title="Basic Information"
                icon={<FileText className="w-4 h-4" />}
                isExpanded={expandedSections.has("basic")}
                onToggle={() => toggleSection("basic")}
                hasError={!!(errors.title || errors.slug)}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm text-slate-400 mb-1 block">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g., Acute Chest Pain Evaluation"
                      error={errors.title}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Slug *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="acute-chest-pain-evaluation"
                      error={errors.slug}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      ACR Topic Reference
                    </label>
                    <Input
                      value={formData.acrTopic}
                      onChange={(e) => updateField("acrTopic", e.target.value)}
                      placeholder="ACR AC: Chest Pain"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        updateField("category", e.target.value as CaseCategory)
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="chest-pain">Chest Pain</option>
                      <option value="low-back-pain">Low Back Pain</option>
                      <option value="headache">Headache</option>
                      <option value="abdominal-pain">Abdominal Pain</option>
                      <option value="extremity-trauma">Extremity Trauma</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Difficulty *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        updateField("difficulty", e.target.value as DifficultyLevel)
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-slate-400 mb-2 block">
                      Specialty Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["em", "im", "fm", "surgery", "peds"] as SpecialtyTrack[]).map(
                        (spec) => (
                          <button
                            key={spec}
                            onClick={() => {
                              const current = formData.specialtyTags;
                              updateField(
                                "specialtyTags",
                                current.includes(spec)
                                  ? current.filter((s) => s !== spec)
                                  : [...current, spec]
                              );
                            }}
                            className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                              formData.specialtyTags.includes(spec)
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            )}
                          >
                            {spec.toUpperCase()}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </EditorSection>

              {/* Patient Info */}
              <EditorSection
                title="Patient Information"
                icon={<User className="w-4 h-4" />}
                isExpanded={expandedSections.has("patient")}
                onToggle={() => toggleSection("patient")}
                hasError={!!errors.chiefComplaint}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Age *
                    </label>
                    <Input
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) =>
                        updateField("patientAge", parseInt(e.target.value) || 0)
                      }
                      min={0}
                      max={120}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Sex *
                    </label>
                    <select
                      value={formData.patientSex}
                      onChange={(e) =>
                        updateField(
                          "patientSex",
                          e.target.value as "male" | "female"
                        )
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-sm text-slate-400 mb-1 block">
                      Chief Complaint *
                    </label>
                    <Input
                      value={formData.chiefComplaint}
                      onChange={(e) => updateField("chiefComplaint", e.target.value)}
                      placeholder='e.g., "Sharp chest pain for 2 hours"'
                      error={errors.chiefComplaint}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </EditorSection>

              {/* Clinical Vignette */}
              <EditorSection
                title="Clinical Vignette"
                icon={<Stethoscope className="w-4 h-4" />}
                isExpanded={expandedSections.has("clinical")}
                onToggle={() => toggleSection("clinical")}
                hasError={!!errors.clinicalVignette}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      History of Present Illness *
                    </label>
                    <textarea
                      value={formData.clinicalVignette}
                      onChange={(e) => updateField("clinicalVignette", e.target.value)}
                      rows={6}
                      placeholder="Detailed clinical scenario..."
                      className={cn(
                        "w-full px-3 py-2 bg-slate-800 border rounded-lg text-white resize-y",
                        errors.clinicalVignette ? "border-rose-500" : "border-slate-700"
                      )}
                    />
                    {errors.clinicalVignette && (
                      <p className="text-xs text-rose-400 mt-1">
                        {errors.clinicalVignette}
                      </p>
                    )}
                  </div>
                  <TagInput
                    label="Past Medical History"
                    value={formData.patientHistory}
                    onChange={(v) => updateField("patientHistory", v)}
                    placeholder="Add condition..."
                  />
                  <TagInput
                    label="Medications"
                    value={formData.medications}
                    onChange={(v) => updateField("medications", v)}
                    placeholder="Add medication..."
                  />
                </div>
              </EditorSection>

              {/* Vitals & Physical Exam */}
              <EditorSection
                title="Vitals & Physical Exam"
                icon={<Activity className="w-4 h-4" />}
                isExpanded={expandedSections.has("vitals")}
                onToggle={() => toggleSection("vitals")}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <VitalInput
                      label="Heart Rate"
                      value={formData.vitalSigns?.heart_rate || 80}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          heart_rate: v,
                        })
                      }
                      unit="bpm"
                    />
                    <VitalInput
                      label="Systolic BP"
                      value={formData.vitalSigns?.blood_pressure_systolic || 120}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          blood_pressure_systolic: v,
                        })
                      }
                      unit="mmHg"
                    />
                    <VitalInput
                      label="Diastolic BP"
                      value={formData.vitalSigns?.blood_pressure_diastolic || 80}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          blood_pressure_diastolic: v,
                        })
                      }
                      unit="mmHg"
                    />
                    <VitalInput
                      label="Respiratory Rate"
                      value={formData.vitalSigns?.respiratory_rate || 16}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          respiratory_rate: v,
                        })
                      }
                      unit="/min"
                    />
                    <VitalInput
                      label="Temperature"
                      value={formData.vitalSigns?.temperature || 37}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          temperature: v,
                        })
                      }
                      unit="°C"
                      step={0.1}
                    />
                    <VitalInput
                      label="SpO2"
                      value={formData.vitalSigns?.oxygen_saturation || 98}
                      onChange={(v) =>
                        updateField("vitalSigns", {
                          ...formData.vitalSigns!,
                          oxygen_saturation: v,
                        })
                      }
                      unit="%"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Physical Exam Findings
                    </label>
                    <textarea
                      value={formData.physicalExam}
                      onChange={(e) => updateField("physicalExam", e.target.value)}
                      rows={4}
                      placeholder="Pertinent physical exam findings..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-y"
                    />
                  </div>
                </div>
              </EditorSection>

              {/* Lab Results */}
              <EditorSection
                title="Lab Results"
                icon={<FlaskConical className="w-4 h-4" />}
                isExpanded={expandedSections.has("labs")}
                onToggle={() => toggleSection("labs")}
              >
                <LabResultsEditor
                  value={formData.labResults}
                  onChange={(v) => updateField("labResults", v)}
                />
              </EditorSection>

              {/* Imaging Options */}
              <EditorSection
                title="Imaging Options & Ratings"
                icon={<Image className="w-4 h-4" />}
                isExpanded={expandedSections.has("imaging")}
                onToggle={() => toggleSection("imaging")}
                hasError={!!errors.imagingRatings}
              >
                <ImagingRatingsEditor
                  value={formData.imagingRatings}
                  onChange={(v) => updateField("imagingRatings", v)}
                  imagingOptions={imagingOptions}
                  error={errors.imagingRatings}
                />
              </EditorSection>

              {/* Explanation & Teaching */}
              <EditorSection
                title="Explanation & Teaching Points"
                icon={<BookOpen className="w-4 h-4" />}
                isExpanded={expandedSections.has("teaching")}
                onToggle={() => toggleSection("teaching")}
                hasError={!!errors.explanation}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Detailed Explanation *
                    </label>
                    <textarea
                      value={formData.explanation}
                      onChange={(e) => updateField("explanation", e.target.value)}
                      rows={6}
                      placeholder="Why the optimal imaging is appropriate..."
                      className={cn(
                        "w-full px-3 py-2 bg-slate-800 border rounded-lg text-white resize-y",
                        errors.explanation ? "border-rose-500" : "border-slate-700"
                      )}
                    />
                  </div>
                  <TagInput
                    label="Teaching Points"
                    value={formData.teachingPoints}
                    onChange={(v) => updateField("teachingPoints", v)}
                    placeholder="Add teaching point..."
                  />
                  <TagInput
                    label="Hints (Learning Mode)"
                    value={formData.hints}
                    onChange={(v) => updateField("hints", v)}
                    placeholder="Add hint..."
                  />
                </div>
              </EditorSection>

              {/* References */}
              <EditorSection
                title="References"
                icon={<LinkIcon className="w-4 h-4" />}
                isExpanded={expandedSections.has("references")}
                onToggle={() => toggleSection("references")}
              >
                <ReferencesEditor
                  value={formData.references}
                  onChange={(v) => updateField("references", v)}
                />
              </EditorSection>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CasePreview formData={formData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// Editor Section
// ============================================================================

interface EditorSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  hasError?: boolean;
  children: React.ReactNode;
}

function EditorSection({
  title,
  icon,
  isExpanded,
  onToggle,
  hasError,
  children,
}: EditorSectionProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{icon}</span>
          <span className="font-medium text-white">{title}</span>
          {hasError && (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="pt-0 pb-4 px-4">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ============================================================================
// Tag Input
// ============================================================================

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function TagInput({ label, value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  return (
    <div>
      <label className="text-sm text-slate-400 mb-1 block">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <Badge
            key={item}
            variant="default"
            className="bg-slate-700 text-slate-300"
          >
            {item}
            <button
              onClick={() => handleRemove(item)}
              className="ml-1 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          className="bg-slate-800 border-slate-700 text-white"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="border-slate-700 text-slate-300"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Vital Input
// ============================================================================

interface VitalInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  step?: number;
}

function VitalInput({ label, value, onChange, unit, step = 1 }: VitalInputProps) {
  return (
    <div>
      <label className="text-sm text-slate-400 mb-1 block">{label}</label>
      <div className="flex">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          className="bg-slate-800 border-slate-700 text-white rounded-r-none"
        />
        <span className="px-3 py-2 bg-slate-700 border border-l-0 border-slate-700 rounded-r-lg text-slate-400 text-sm">
          {unit}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Lab Results Editor
// ============================================================================

interface LabResultsEditorProps {
  value: LabResult[];
  onChange: (value: LabResult[]) => void;
}

function LabResultsEditor({ value, onChange }: LabResultsEditorProps) {
  const addLab = () => {
    onChange([
      ...value,
      { name: "", value: "", unit: "", reference_range: "", is_abnormal: false },
    ]);
  };

  const updateLab = (index: number, field: keyof LabResult, val: any) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const removeLab = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.map((lab, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-slate-800 rounded-lg">
          <div className="flex-1 grid grid-cols-5 gap-2">
            <Input
              value={lab.name}
              onChange={(e) => updateLab(index, "name", e.target.value)}
              placeholder="Name"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              value={lab.value}
              onChange={(e) => updateLab(index, "value", e.target.value)}
              placeholder="Value"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              value={lab.unit}
              onChange={(e) => updateLab(index, "unit", e.target.value)}
              placeholder="Unit"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              value={lab.reference_range}
              onChange={(e) => updateLab(index, "reference_range", e.target.value)}
              placeholder="Reference"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={lab.is_abnormal}
                onCheckedChange={(checked) =>
                  updateLab(index, "is_abnormal", checked)
                }
              />
              <span className="text-xs text-slate-400">Abnormal</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeLab(index)}
            className="text-slate-400 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addLab}
        className="w-full border-slate-700 text-slate-300 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Lab Result
      </Button>
    </div>
  );
}

// ============================================================================
// Imaging Ratings Editor
// ============================================================================

interface ImagingRatingsEditorProps {
  value: ImagingRating[];
  onChange: (value: ImagingRating[]) => void;
  imagingOptions: Array<{ id: string; name: string; modality: string }>;
  error?: string;
}

function ImagingRatingsEditor({
  value,
  onChange,
  imagingOptions,
  error,
}: ImagingRatingsEditorProps) {
  const addRating = (optionId: string) => {
    const option = imagingOptions.find((o) => o.id === optionId);
    if (!option || value.some((v) => v.imagingOptionId === optionId)) return;

    onChange([
      ...value,
      {
        imagingOptionId: optionId,
        imagingName: option.name,
        acrRating: 5,
        rationale: "",
        isOptimal: false,
      },
    ]);
  };

  const updateRating = (index: number, field: keyof ImagingRating, val: any) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    // Only one optimal
    if (field === "isOptimal" && val === true) {
      updated.forEach((r, i) => {
        if (i !== index) r.isOptimal = false;
      });
    }
    onChange(updated);
  };

  const removeRating = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const availableOptions = imagingOptions.filter(
    (o) => !value.some((v) => v.imagingOptionId === o.id)
  );

  return (
    <div className="space-y-3">
      {value.map((rating, index) => (
        <div key={rating.imagingOptionId} className="p-4 bg-slate-800 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-medium text-white">{rating.imagingName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-400">ACR Rating:</span>
                <select
                  value={rating.acrRating}
                  onChange={(e) =>
                    updateRating(index, "acrRating", parseInt(e.target.value))
                  }
                  className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1 ml-4">
                  <Checkbox
                    checked={rating.isOptimal}
                    onCheckedChange={(checked) =>
                      updateRating(index, "isOptimal", checked)
                    }
                  />
                  <span className="text-sm text-emerald-400">Optimal Choice</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeRating(index)}
              className="text-slate-400 hover:text-rose-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <textarea
            value={rating.rationale}
            onChange={(e) => updateRating(index, "rationale", e.target.value)}
            placeholder="Rationale for this rating..."
            rows={2}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm resize-none"
          />
        </div>
      ))}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {availableOptions.length > 0 && (
        <div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addRating(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 border-dashed rounded-lg text-slate-400"
            defaultValue=""
          >
            <option value="">+ Add imaging option...</option>
            {availableOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({opt.modality})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// References Editor
// ============================================================================

interface ReferencesEditorProps {
  value: Reference[];
  onChange: (value: Reference[]) => void;
}

function ReferencesEditor({ value, onChange }: ReferencesEditorProps) {
  const addReference = () => {
    onChange([...value, { title: "", source: "", year: new Date().getFullYear() }]);
  };

  const updateReference = (index: number, field: keyof Reference, val: any) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const removeReference = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.map((ref, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-slate-800 rounded-lg">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <Input
              value={ref.title}
              onChange={(e) => updateReference(index, "title", e.target.value)}
              placeholder="Title"
              className="col-span-2 bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              value={ref.source}
              onChange={(e) => updateReference(index, "source", e.target.value)}
              placeholder="Source"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              type="number"
              value={ref.year}
              onChange={(e) =>
                updateReference(index, "year", parseInt(e.target.value))
              }
              placeholder="Year"
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
            <Input
              value={ref.url || ""}
              onChange={(e) => updateReference(index, "url", e.target.value)}
              placeholder="URL (optional)"
              className="col-span-4 bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeReference(index)}
            className="text-slate-400 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addReference}
        className="w-full border-slate-700 text-slate-300 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Reference
      </Button>
    </div>
  );
}

// ============================================================================
// Case Preview
// ============================================================================

interface CasePreviewProps {
  formData: CaseFormData;
}

function CasePreview({ formData }: CasePreviewProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" className="bg-slate-700">
            {formData.category.replace("-", " ")}
          </Badge>
          <Badge
            variant="default"
            className={cn(
              formData.difficulty === "beginner" && "bg-emerald-500/20 text-emerald-400",
              formData.difficulty === "intermediate" && "bg-amber-500/20 text-amber-400",
              formData.difficulty === "advanced" && "bg-rose-500/20 text-rose-400"
            )}
          >
            {formData.difficulty}
          </Badge>
          {!formData.isPublished && (
            <Badge variant="default" className="bg-slate-600">
              Draft
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-white">
          {formData.title || "Untitled Case"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <p className="text-lg text-white">
            {formData.patientAge}-year-old {formData.patientSex}
          </p>
          <p className="text-slate-400 italic mt-1">
            "{formData.chiefComplaint || "No chief complaint"}"
          </p>
        </div>

        {/* HPI */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">
            History of Present Illness
          </h3>
          <p className="text-white whitespace-pre-wrap">
            {formData.clinicalVignette || "No clinical vignette provided."}
          </p>
        </div>

        {/* Vitals */}
        {formData.vitalSigns && (
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Vital Signs
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">
                  {formData.vitalSigns.heart_rate}
                </p>
                <p className="text-xs text-slate-400">HR (bpm)</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">
                  {formData.vitalSigns.blood_pressure_systolic}/
                  {formData.vitalSigns.blood_pressure_diastolic}
                </p>
                <p className="text-xs text-slate-400">BP (mmHg)</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">
                  {formData.vitalSigns.oxygen_saturation}%
                </p>
                <p className="text-xs text-slate-400">SpO2</p>
              </div>
            </div>
          </div>
        )}

        {/* Imaging Options */}
        {formData.imagingRatings.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Imaging Options ({formData.imagingRatings.length})
            </h3>
            <div className="space-y-2">
              {formData.imagingRatings.map((rating) => (
                <div
                  key={rating.imagingOptionId}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between",
                    rating.isOptimal
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "bg-slate-800"
                  )}
                >
                  <span className="text-white">{rating.imagingName}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        rating.acrRating >= 7
                          ? "bg-emerald-500"
                          : rating.acrRating >= 4
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      )}
                    >
                      ACR {rating.acrRating}
                    </Badge>
                    {rating.isOptimal && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
