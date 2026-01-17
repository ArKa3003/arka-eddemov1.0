import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { CaseViewer } from "@/components/cases/case-viewer";
import type { Case, ImagingOption, CaseImagingRating, UserCaseAttempt } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// Page Component
// ============================================================================

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const user = await getUser();
  const supabase = await createClient();

  // Fetch case by slug
  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (caseError || !caseData) {
    notFound();
  }

  // Fetch imaging ratings for this case
  const { data: imagingRatings } = await supabase
    .from("case_imaging_ratings")
    .select("*")
    .eq("case_id", caseData.id);

  // Get all relevant imaging option IDs
  const imagingOptionIds = [
    ...(imagingRatings?.map((r) => r.imaging_option_id) || []),
    ...(caseData.optimal_imaging || []),
  ];

  // Fetch imaging options
  let imagingOptions: ImagingOption[] = [];
  if (imagingOptionIds.length > 0) {
    const { data: options } = await supabase
      .from("imaging_options")
      .select("*")
      .in("id", [...new Set(imagingOptionIds)])
      .eq("is_active", true);
    imagingOptions = options || [];
  }

  // If no specific imaging options found, fetch all active options
  if (imagingOptions.length === 0) {
    const { data: allOptions } = await supabase
      .from("imaging_options")
      .select("*")
      .eq("is_active", true)
      .order("modality")
      .order("name");
    imagingOptions = allOptions || [];
  }

  // Fetch user's previous attempts for this case
  let previousAttempts: UserCaseAttempt[] = [];
  if (user) {
    const { data: attempts } = await supabase
      .from("user_case_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("case_id", caseData.id)
      .order("created_at", { ascending: false });
    previousAttempts = attempts || [];
  }

  return (
    <CaseViewer
      caseData={caseData as Case}
      imagingOptions={imagingOptions}
      imagingRatings={(imagingRatings as CaseImagingRating[]) || []}
      previousAttempts={previousAttempts}
      userId={user?.id}
    />
  );
}

// ============================================================================
// Generate Metadata
// ============================================================================

export async function generateMetadata({ params }: CasePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: caseData } = await supabase
    .from("cases")
    .select("title, chief_complaint, category")
    .eq("slug", slug)
    .single();

  if (!caseData) {
    return {
      title: "Case Not Found | ARKA-ED",
    };
  }

  return {
    title: `${caseData.title} | ARKA-ED`,
    description: caseData.chief_complaint,
  };
}

// ============================================================================
// Not Found Page (Create if needed)
// ============================================================================

export function generateStaticParams() {
  // Return empty array for dynamic rendering
  // Cases are fetched from database at runtime
  return [];
}
