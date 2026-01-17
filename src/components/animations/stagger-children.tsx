"use client";

import { motion } from "framer-motion";

export interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerChildren({ children, staggerDelay = 0.1 }: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}