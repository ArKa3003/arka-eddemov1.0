"use client";

import { motion } from "framer-motion";

export interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export function SlideIn({ children, direction = "left", delay = 0 }: SlideInProps) {
  const variants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}