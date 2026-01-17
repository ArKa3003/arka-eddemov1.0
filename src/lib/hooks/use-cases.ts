"use client";

import { useState, useEffect } from "react";

export interface Case {
  id: string;
  title: string;
  description: string;
  specialty: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  completed?: boolean;
}

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching cases
    setTimeout(() => {
      setCases([]);
      setLoading(false);
    }, 1000);
  }, []);

  return { cases, loading };
}