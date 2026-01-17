"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [trigger]);

  return null;
}