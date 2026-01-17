"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Stethoscope, BookOpen, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Split layout for authentication pages.
 * Left (50%): Form on white/light background
 * Right (50%): Branded visual with quote (hidden on mobile)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    { icon: BookOpen, text: "50+ Clinical Cases" },
    { icon: Target, text: "ACR Criteria Integration" },
    { icon: Award, text: "Track Your Progress" },
  ];

  const quotes = [
    {
      text: "ARKA-ED transformed how I approach imaging decisions. Now I understand not just what to look for, but when to order.",
      author: "Dr. Sarah Chen",
      role: "EM Resident, Stanford",
    },
    {
      text: "Finally, a platform that teaches what we actually need to know as ordering physicians.",
      author: "Dr. Michael Torres",
      role: "IM Attending, Mayo Clinic",
    },
  ];

  const [quoteIndex] = React.useState(
    Math.floor(Math.random() * quotes.length)
  );
  const currentQuote = quotes[quoteIndex];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header className="p-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">
              ARKA-ED
            </span>
          </Link>
        </header>

        {/* Form container */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">{children}</div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ARKA-ED. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Right side - Branded visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/20 blur-[80px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          {/* Logo mark */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master Medical Imaging
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Appropriateness
            </span>
          </motion.h2>

          <motion.p
            className="text-slate-400 text-lg mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Learn when to order imaging — not just how to read it.
          </motion.p>

          {/* Features */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700"
              >
                <feature.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Quote */}
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <blockquote className="text-lg text-slate-300 mb-4 italic">
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>
            <div className="text-sm">
              <span className="text-white font-medium">
                {currentQuote.author}
              </span>
              <span className="text-slate-500 ml-2">{currentQuote.role}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
