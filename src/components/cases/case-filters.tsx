"use client";

import { useState } from "react";

export interface CaseFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  specialty?: string;
  difficulty?: string;
  completed?: boolean;
}

export function CaseFilters({ onFilterChange }: CaseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <p className="text-sm text-gray-600">Case filters placeholder</p>
    </div>
  );
}