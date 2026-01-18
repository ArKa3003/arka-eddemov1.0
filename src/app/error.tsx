// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Global Error Boundary Page
 *
 * Displays when an unhandled error occurs in the application.
 * Provides retry, navigation, and support options.
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  // Log error to console in development
  React.useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const handleReport = () => {
    const subject = encodeURIComponent("ARKA-ED Error Report");
    const body = encodeURIComponent(
      `Error Details:
      
Message: ${error.message}
Digest: ${error.digest || "N/A"}
URL: ${typeof window !== "undefined" ? window.location.href : "N/A"}
Time: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
`
    );

    window.open(`mailto:support@arka-ed.com?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl font-bold text-cyan-400">ARKA</span>
            <span className="text-3xl font-bold text-white">-ED</span>
          </Link>
        </motion.div>

        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </motion.div>
            </div>
            <h1 className="text-xl font-semibold text-white text-center">
              Something went wrong
            </h1>
            <p className="mt-2 text-slate-400 text-center text-sm">
              We encountered an unexpected error. Don't worry, your progress has
              been saved.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            <Button
              onClick={reset}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <div className="flex gap-3">
              <Button
                asChild
                variant="default"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Link href="/cases">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Cases
                </Link>
              </Button>
              <Button
                onClick={handleReport}
                variant="default"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          {/* Error Details (Collapsible) */}
          <div className="border-t border-slate-800">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-6 py-3 flex items-center justify-between text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              <span>Technical Details</span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-6 pb-4"
              >
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 overflow-x-auto">
                  <p>
                    <span className="text-rose-400">Error:</span>{" "}
                    {error.message || "Unknown error"}
                  </p>
                  {error.digest && (
                    <p className="mt-1">
                      <span className="text-slate-500">Digest:</span>{" "}
                      {error.digest}
                    </p>
                  )}
                  <p className="mt-1">
                    <span className="text-slate-500">Time:</span>{" "}
                    {new Date().toISOString()}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center text-sm text-slate-500"
        >
          If this problem persists, please{" "}
          <a
            href="mailto:support@arka-ed.com"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            contact our support team
          </a>
          .
        </motion.p>
      </div>
    </div>
  );
}
