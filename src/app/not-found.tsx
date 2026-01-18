"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Custom 404 Not Found Page
 *
 * Displays when a user navigates to a non-existent route.
 * Includes ARKA branding, search suggestion, and helpful navigation.
 */
export default function NotFound() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/cases?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl font-bold text-cyan-400">ARKA</span>
            <span className="text-3xl font-bold text-white">-ED</span>
          </Link>
        </motion.div>

        {/* 404 Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-8"
        >
          <span className="text-[12rem] font-black text-slate-800 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 px-6 py-3 rounded-lg border border-slate-700"
            >
              <p className="text-xl font-semibold text-white">Page not found</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-slate-400 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
          Try searching for what you need or navigate back to safety.
        </motion.p>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search for cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
              Search
            </Button>
          </div>
        </motion.form>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white"
          >
            <Link href="/cases">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Cases
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </motion.div>

        {/* Help Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-sm text-slate-500"
        >
          Need help?{" "}
          <a
            href="mailto:support@arka-ed.com"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Contact support
          </a>
        </motion.p>
      </div>
    </div>
  );
}
