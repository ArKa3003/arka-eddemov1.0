// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} CTASectionProps
 * @property {string} headline - Main headline
 * @property {string} [subheadline] - Supporting text
 * @property {string} [primaryCTA] - Primary button text
 * @property {string} [primaryHref] - Primary button link
 * @property {string} [secondaryCTA] - Secondary button text
 * @property {string} [secondaryHref] - Secondary button link
 * @property {boolean} [showEmailCapture] - Show email capture form
 * @property {string} [emailPlaceholder] - Email input placeholder
 * @property {string} [emailButtonText] - Email submit button text
 * @property {Object} [socialProof] - Social proof data
 * @property {string} [socialProof.text] - Social proof text
 * @property {string[]} [socialProof.avatars] - Avatar URLs
 * @property {"gradient" | "dark" | "light"} [variant] - Style variant
 * @property {string} [className] - Additional CSS classes
 */
export interface CTASectionProps {
  headline: string;
  subheadline?: string;
  primaryCTA?: string;
  primaryHref?: string;
  secondaryCTA?: string;
  secondaryHref?: string;
  showEmailCapture?: boolean;
  emailPlaceholder?: string;
  emailButtonText?: string;
  socialProof?: {
    text: string;
    avatars?: string[];
  };
  variant?: "gradient" | "dark" | "light";
  className?: string;
}

/**
 * Full-width CTA section with optional email capture.
 */
export function CTASection({
  headline,
  subheadline,
  primaryCTA = "Get Started",
  primaryHref = "/register",
  secondaryCTA,
  secondaryHref,
  showEmailCapture = false,
  emailPlaceholder = "Enter your email",
  emailButtonText = "Get Started",
  socialProof,
  variant = "gradient",
  className,
}: CTASectionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate submission - replace with actual logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
    // Show success toast/message
  };

  const bgClasses = {
    gradient: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    dark: "bg-slate-950",
    light: "bg-slate-100",
  };

  const textClasses = {
    gradient: "text-white",
    dark: "text-white",
    light: "text-slate-900",
  };

  const subtextClasses = {
    gradient: "text-slate-400",
    dark: "text-slate-400",
    light: "text-slate-600",
  };

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 md:py-32 px-4 overflow-hidden",
        bgClasses[variant],
        className
      )}
    >
      {/* Background decorations */}
      {variant === "gradient" && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4",
            textClasses[variant]
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {headline}
        </motion.h2>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className={cn(
              "text-lg md:text-xl mb-8 max-w-2xl mx-auto",
              subtextClasses[variant]
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* Email capture or CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {showEmailCapture ? (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border",
                    "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  )}
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 shadow-lg shadow-cyan-500/25"
                loading={isSubmitting}
              >
                {emailButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-lg shadow-cyan-500/25"
                asChild
              >
                <a href={primaryHref}>
                  {primaryCTA}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              {secondaryCTA && (
                <Button
                  size="lg"
                  variant="default"
                  className={cn(
                    "px-8 py-6 text-lg",
                    variant === "light"
                      ? "border-slate-300 text-slate-700"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  )}
                  asChild
                >
                  <a href={secondaryHref}>{secondaryCTA}</a>
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Social proof */}
        {socialProof && (
          <motion.div
            className="flex items-center justify-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Avatar stack */}
            {socialProof.avatars && socialProof.avatars.length > 0 ? (
              <div className="flex -space-x-2">
                {socialProof.avatars.slice(0, 5).map((avatar, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-700"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-teal-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-cyan-500 to-teal-500"
                    style={{ opacity: 1 - index * 0.15 }}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className={cn("w-4 h-4", subtextClasses[variant])} />
              <span className={cn("text-sm", subtextClasses[variant])}>
                {socialProof.text}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
