"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { CaseEditor, CaseFormData } from "@/components/admin/case-editor";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

/**
 * Case Edit Page
 * 
 * Admin page for editing existing cases or creating new ones.
 * Uses [caseId] as dynamic route - "new" for new cases.
 */
export default function CaseEditPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.caseId as string;
  const isNew = caseId === "new";

  const [loading, setLoading] = React.useState(!isNew);
  const [initialData, setInitialData] = React.useState<Partial<CaseFormData> | null>(
    null
  );
  const [imagingOptions, setImagingOptions] = React.useState<
    Array<{ id: string; name: string; modality: string }>
  >([]);

  // Fetch case data and imaging options
  React.useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      // Fetch imaging options
      const { data: options } = await supabase
        .from("imaging_options")
        .select("id, name, modality")
        .eq("is_active", true)
        .order("name");

      if (options) {
        setImagingOptions(options);
      }

      // If editing, fetch case data
      if (!isNew) {
        const { data: caseData, error } = await supabase
          .from("cases")
          .select(
            `
            *,
            case_imaging_ratings (
              id,
              imaging_option_id,
              acr_rating,
              rationale,
              imaging_options (id, name)
            )
          `
          )
          .eq("id", caseId)
          .single();

        if (error || !caseData) {
          console.error("Failed to fetch case:", error);
          router.push("/admin/cases");
          return;
        }

        // Transform case data to form data
        const formData: Partial<CaseFormData> = {
          title: caseData.title,
          slug: caseData.slug,
          category: caseData.category,
          difficulty: caseData.difficulty,
          specialtyTags: caseData.specialty_tags || [],
          acrTopic: caseData.acr_topic || "",
          patientAge: caseData.patient_age,
          patientSex: caseData.patient_sex,
          chiefComplaint: caseData.chief_complaint,
          clinicalVignette: caseData.clinical_vignette,
          patientHistory: caseData.patient_history || [],
          medications: [],
          socialHistory: "",
          familyHistory: "",
          reviewOfSystems: "",
          vitalSigns: caseData.vital_signs,
          physicalExam: caseData.physical_exam || "",
          labResults: caseData.lab_results || [],
          imagingRatings: (caseData.case_imaging_ratings || []).map(
            (rating: any) => ({
              imagingOptionId: rating.imaging_option_id,
              imagingName: rating.imaging_options?.name || "",
              acrRating: rating.acr_rating,
              rationale: rating.rationale || "",
              isOptimal: caseData.optimal_imaging?.includes(rating.imaging_option_id),
            })
          ),
          explanation: caseData.explanation || "",
          teachingPoints: caseData.teaching_points || [],
          clinicalPearls: caseData.clinical_pearls || [],
          hints: caseData.hints || [],
          references: caseData.references || [],
          isPublished: caseData.is_published,
        };

        setInitialData(formData);
      }

      setLoading(false);
    }

    fetchData();
  }, [caseId, isNew, router]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (formData: CaseFormData) => {
    const supabase = createClient();

    // Transform form data to database format
    const casePayload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      difficulty: formData.difficulty,
      specialty_tags: formData.specialtyTags,
      acr_topic: formData.acrTopic,
      patient_age: formData.patientAge,
      patient_sex: formData.patientSex,
      chief_complaint: formData.chiefComplaint,
      clinical_vignette: formData.clinicalVignette,
      patient_history: formData.patientHistory,
      vital_signs: formData.vitalSigns,
      physical_exam: formData.physicalExam,
      lab_results: formData.labResults,
      optimal_imaging: formData.imagingRatings
        .filter((r) => r.isOptimal)
        .map((r) => r.imagingOptionId),
      explanation: formData.explanation,
      teaching_points: formData.teachingPoints,
      clinical_pearls: formData.clinicalPearls,
      hints: formData.hints,
      references: formData.references,
      is_published: formData.isPublished,
    };

    try {
      if (isNew) {
        // Create new case
        const { data: newCase, error } = await supabase
          .from("cases")
          .insert(casePayload)
          .select("id")
          .single();

        if (error) throw error;

        // Insert imaging ratings
        if (formData.imagingRatings.length > 0 && newCase) {
          const ratings = formData.imagingRatings.map((r) => ({
            case_id: newCase.id,
            imaging_option_id: r.imagingOptionId,
            acr_rating: r.acrRating,
            rationale: r.rationale,
            rating_category:
              r.acrRating >= 7
                ? "usually-appropriate"
                : r.acrRating >= 4
                ? "may-be-appropriate"
                : "usually-not-appropriate",
          }));

          await supabase.from("case_imaging_ratings").insert(ratings);
        }

        router.push("/admin/cases");
      } else {
        // Update existing case
        const { error } = await supabase
          .from("cases")
          .update(casePayload)
          .eq("id", caseId);

        if (error) throw error;

        // Delete existing ratings and re-insert
        await supabase
          .from("case_imaging_ratings")
          .delete()
          .eq("case_id", caseId);

        if (formData.imagingRatings.length > 0) {
          const ratings = formData.imagingRatings.map((r) => ({
            case_id: caseId,
            imaging_option_id: r.imagingOptionId,
            acr_rating: r.acrRating,
            rationale: r.rationale,
            rating_category:
              r.acrRating >= 7
                ? "usually-appropriate"
                : r.acrRating >= 4
                ? "may-be-appropriate"
                : "usually-not-appropriate",
          }));

          await supabase.from("case_imaging_ratings").insert(ratings);
        }

        router.push("/admin/cases");
      }
    } catch (error) {
      console.error("Failed to save case:", error);
      throw error;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading case...</p>
        </div>
      </div>
    );
  }

  return (
    <CaseEditor
      initialData={initialData || undefined}
      caseId={isNew ? undefined : caseId}
      imagingOptions={imagingOptions}
      onSubmit={handleSubmit}
      isNew={isNew}
    />
  );
}
