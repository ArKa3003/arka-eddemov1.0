// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CaseTable,
  CaseFilters,
  type CaseTableRow,
  type SortField,
  type SortDirection,
} from "@/components/admin/case-table";
import type { CaseCategory, DifficultyLevel } from "@/types/database";

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CASES: CaseTableRow[] = [
  {
    id: "1",
    title: "Acute Chest Pain Evaluation",
    slug: "acute-chest-pain-evaluation",
    category: "chest-pain",
    difficulty: "intermediate",
    isPublished: true,
    attempts: 423,
    avgScore: 76,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2026-01-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Low Back Pain Workup",
    slug: "low-back-pain-workup",
    category: "low-back-pain",
    difficulty: "beginner",
    isPublished: true,
    attempts: 389,
    avgScore: 72,
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2026-01-08T11:00:00Z",
  },
  {
    id: "3",
    title: "Thunderclap Headache",
    slug: "thunderclap-headache",
    category: "headache",
    difficulty: "advanced",
    isPublished: true,
    attempts: 312,
    avgScore: 68,
    createdAt: "2025-12-01T15:00:00Z",
    updatedAt: "2026-01-05T16:00:00Z",
  },
  {
    id: "4",
    title: "Right Lower Quadrant Pain",
    slug: "rlq-pain",
    category: "abdominal-pain",
    difficulty: "intermediate",
    isPublished: true,
    attempts: 287,
    avgScore: 74,
    createdAt: "2025-12-10T08:00:00Z",
    updatedAt: "2026-01-03T09:30:00Z",
  },
  {
    id: "5",
    title: "Ankle Injury Assessment",
    slug: "ankle-injury-assessment",
    category: "extremity-trauma",
    difficulty: "beginner",
    isPublished: true,
    attempts: 256,
    avgScore: 81,
    createdAt: "2025-11-25T12:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "6",
    title: "Pediatric Chest Pain",
    slug: "pediatric-chest-pain",
    category: "chest-pain",
    difficulty: "advanced",
    isPublished: false,
    attempts: 0,
    avgScore: null,
    createdAt: "2026-01-10T16:00:00Z",
    updatedAt: "2026-01-12T09:00:00Z",
  },
  {
    id: "7",
    title: "Migraine vs Secondary Headache",
    slug: "migraine-vs-secondary",
    category: "headache",
    difficulty: "intermediate",
    isPublished: true,
    attempts: 198,
    avgScore: 70,
    createdAt: "2025-12-05T14:00:00Z",
    updatedAt: "2025-12-28T11:00:00Z",
  },
  {
    id: "8",
    title: "Atraumatic Back Pain in Elderly",
    slug: "elderly-back-pain",
    category: "low-back-pain",
    difficulty: "advanced",
    isPublished: false,
    attempts: 0,
    avgScore: null,
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-01-11T15:00:00Z",
  },
  {
    id: "9",
    title: "Acute Abdomen in Young Female",
    slug: "acute-abdomen-female",
    category: "abdominal-pain",
    difficulty: "intermediate",
    isPublished: true,
    attempts: 234,
    avgScore: 65,
    createdAt: "2025-11-28T09:00:00Z",
    updatedAt: "2025-12-20T14:00:00Z",
  },
  {
    id: "10",
    title: "Wrist Fracture Imaging",
    slug: "wrist-fracture-imaging",
    category: "extremity-trauma",
    difficulty: "beginner",
    isPublished: true,
    attempts: 178,
    avgScore: 85,
    createdAt: "2025-12-08T11:00:00Z",
    updatedAt: "2025-12-15T16:00:00Z",
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function CaseManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State from URL params
  const search = searchParams.get("search") || "";
  const category = (searchParams.get("category") || "") as CaseCategory | "";
  const difficulty = (searchParams.get("difficulty") || "") as DifficultyLevel | "";
  const status = (searchParams.get("status") || "all") as "all" | "published" | "draft";
  const sortField = (searchParams.get("sort") || "updatedAt") as SortField;
  const sortDirection = (searchParams.get("dir") || "desc") as SortDirection;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const pageSize = 10;

  /**
   * Update URL params
   */
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Filter and sort cases
   */
  const filteredCases = React.useMemo(() => {
    let result = [...MOCK_CASES];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.slug.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category) {
      result = result.filter((c) => c.category === category);
    }

    // Difficulty filter
    if (difficulty) {
      result = result.filter((c) => c.difficulty === difficulty);
    }

    // Status filter
    if (status === "published") {
      result = result.filter((c) => c.isPublished);
    } else if (status === "draft") {
      result = result.filter((c) => !c.isPublished);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "difficulty":
          const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          comparison = diffOrder[a.difficulty] - diffOrder[b.difficulty];
          break;
        case "attempts":
          comparison = a.attempts - b.attempts;
          break;
        case "avgScore":
          comparison = (a.avgScore || 0) - (b.avgScore || 0);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [search, category, difficulty, status, sortField, sortDirection]);

  // Pagination
  const totalCount = filteredCases.length;
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /**
   * Handle delete
   */
  const handleDelete = (ids: string[]) => {
    console.log("Delete cases:", ids);
    // In production, this would call the API
    setSelectedIds([]);
  };

  /**
   * Handle publish
   */
  const handlePublish = (ids: string[]) => {
    console.log("Publish cases:", ids);
    setSelectedIds([]);
  };

  /**
   * Handle unpublish
   */
  const handleUnpublish = (ids: string[]) => {
    console.log("Unpublish cases:", ids);
    setSelectedIds([]);
  };

  /**
   * Handle duplicate
   */
  const handleDuplicate = (id: string) => {
    console.log("Duplicate case:", id);
  };

  /**
   * Handle archive
   */
  const handleArchive = (id: string) => {
    console.log("Archive case:", id);
  };

  /**
   * Clear filters
   */
  const handleClearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Case Management</h1>
            <p className="text-slate-400 text-sm">
              {totalCount} case{totalCount !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="default"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Link href="/admin/cases/new">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Case
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <CaseFilters
          search={search}
          category={category}
          difficulty={difficulty}
          status={status}
          onSearchChange={(value) => updateParams({ search: value })}
          onCategoryChange={(value) => updateParams({ category: value })}
          onDifficultyChange={(value) => updateParams({ difficulty: value })}
          onStatusChange={(value) => updateParams({ status: value })}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <CaseTable
          cases={paginatedCases}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          sortField={sortField}
          sortDirection={sortDirection}
          selectedIds={selectedIds}
          isLoading={isLoading}
          onSelectionChange={setSelectedIds}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
        />
      </div>
    </div>
  );
}
