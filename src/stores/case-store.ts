// @ts-nocheck
import { create } from "zustand";
import type { Case } from "@/types/cases";

interface CaseStore {
  cases: Case[];
  selectedCase: Case | null;
  setCases: (cases: Case[]) => void;
  setSelectedCase: (caseItem: Case | null) => void;
  addCase: (caseItem: Case) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  selectedCase: null,
  setCases: (cases) => set({ cases }),
  setSelectedCase: (selectedCase) => set({ selectedCase }),
  addCase: (caseItem) =>
    set((state) => ({
      cases: [...state.cases, caseItem],
    })),
  updateCase: (id, updates) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
}));