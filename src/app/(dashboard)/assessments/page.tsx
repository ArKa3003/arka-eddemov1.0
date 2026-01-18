import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { Button } from "@/components/ui/button";
import { AssessmentFilters } from "@/components/assessments/assessment-filters";
import { AssessmentGrid } from "@/components/assessments/assessment-grid";
import type { Assessment, UserAssessment } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface AssessmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ============================================================================
// Page Component
// ============================================================================

export default async function AssessmentsPage({
  searchParams,
}: AssessmentsPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Assessments
            </h1>
            <p className="text-slate-600">
              Test your knowledge with comprehensive evaluations
            </p>
          </div>

          {/* Create Custom Quiz Button */}
          <Link href="/assessments/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Custom Quiz
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AssessmentFilters />
        </div>

        {/* Assessments Grid */}
        <Suspense fallback={<AssessmentGridSkeleton />}>
          <AssessmentsSection searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

// ============================================================================
// Assessments Section (Server Component)
// ============================================================================

interface AssessmentsSectionProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function AssessmentsSection({ searchParams }: AssessmentsSectionProps) {
  const user = await getUser();
  const supabase = await createClient();

  // Parse filters
  const specialty = searchParams.specialty as string | undefined;
  const difficulty = searchParams.difficulty as string | undefined;
  const status = searchParams.status as string | undefined;

  // Build query for assessments
  let query = supabase
    .from("assessments")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Apply filters
  if (specialty && specialty !== "all") {
    query = query.eq("specialty_track", specialty);
  }

  if (difficulty && difficulty !== "all") {
    query = query.eq("difficulty", difficulty);
  }

  const { data: assessments, error } = await query;

  if (error) {
    console.error("Error fetching assessments:", error);
    return <AssessmentGrid assessments={[]} userAssessments={{}} />;
  }

  // Get user's custom assessments
  let customAssessments: Assessment[] = [];
  if (user) {
    const { data: custom } = await supabase
      .from("assessments")
      .select("*")
      .eq("created_by", user.id)
      .eq("is_custom", true);

    customAssessments = custom || [];
  }

  // Combine published and custom assessments
  const allAssessments: Assessment[] = [
    ...customAssessments,
    ...(assessments || []).filter(
      (a) => !customAssessments.some((c) => c.id === a.id)
    ),
  ];

  // Get user's assessment progress
  let userAssessments: Record<string, UserAssessment> = {};
  if (user && allAssessments.length > 0) {
    const assessmentIds = allAssessments.map((a) => a.id);

    const { data: userProgress } = await supabase
      .from("user_assessments")
      .select("*")
      .eq("user_id", user.id)
      .in("assessment_id", assessmentIds);

    if (userProgress) {
      userAssessments = userProgress.reduce((acc, ua) => {
        // Keep the most recent or best attempt
        const existing = acc[ua.assessment_id];
        if (
          !existing ||
          (ua.status === "completed" && existing.status !== "completed") ||
          (ua.score || 0) > (existing.score || 0)
        ) {
          acc[ua.assessment_id] = ua;
        }
        return acc;
      }, {} as Record<string, UserAssessment>);
    }
  }

  // Filter by status if needed
  let filteredAssessments = allAssessments;
  if (status && status !== "all") {
    filteredAssessments = allAssessments.filter((assessment) => {
      const userAssessment = userAssessments[assessment.id];

      switch (status) {
        case "not_started":
          return !userAssessment;
        case "in_progress":
          return (
            userAssessment &&
            userAssessment.status === "in_progress"
          );
        case "completed":
          return (
            userAssessment &&
            userAssessment.status === "completed"
          );
        default:
          return true;
      }
    });
  }

  return (
    <AssessmentGrid
      assessments={filteredAssessments as Assessment[]}
      userAssessments={userAssessments}
    />
  );
}

// ============================================================================
// Skeleton
// ============================================================================

function AssessmentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
        >
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="flex gap-2 mb-4">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="h-5 w-20 bg-slate-200 rounded" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2" />
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <div className="h-8 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-20 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: "Assessments | ARKA-ED",
  description:
    "Test your knowledge with comprehensive assessments on medical imaging appropriateness.",
};
