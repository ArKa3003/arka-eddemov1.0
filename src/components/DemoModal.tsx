"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-primary-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900/40 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="h-10 w-10 ml-1" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    ARKA-ED Platform Demo
                  </h3>
                  <p className="text-white/70 mb-6 max-w-md">
                    Experience how ARKA-ED teaches imaging appropriateness through interactive cases powered by AIIE.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    asChild
                    className="bg-white text-primary-900 hover:bg-white/90"
                  >
                    <Link href="/demo" onClick={onClose}>
                      Try Interactive Demo
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 bg-white dark:bg-primary-900">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary-900 dark:text-white">
                      What You'll See
                    </h4>
                    <ul className="space-y-2 text-sm text-primary-700 dark:text-white/70">
                      <li className="flex items-start gap-2">
                        <span className="text-accent-500 mt-1">•</span>
                        <span>Real patient case presentations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-500 mt-1">•</span>
                        <span>AIIE-powered appropriateness ratings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-500 mt-1">•</span>
                        <span>Evidence-based feedback and learning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-500 mt-1">•</span>
                        <span>Cost and radiation considerations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary-900 dark:text-white">
                      Powered by AIIE
                    </h4>
                    <p className="text-sm text-primary-700 dark:text-white/70 mb-4">
                      ARKA Imaging Intelligence Engine (AIIE) provides evidence-based appropriateness ratings using RAND/UCLA and GRADE methodology.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
