"use client";

import { useState, useEffect } from "react";

export function useLearningMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("learningMode");
    if (stored) {
      setEnabled(stored === "true");
    }
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("learningMode", String(newValue));
      return newValue;
    });
  };

  return { enabled, toggle };
}