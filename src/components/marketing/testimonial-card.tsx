// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} TestimonialCardProps
 * @property {string} quote - The testimonial quote
 * @property {string} author - Author name
 * @property {string} [role] - Author role/title
 * @property {string} [institution] - Author institution
 * @property {string} [avatarUrl] - Author avatar URL
 * @property {string} [avatarFallback] - Fallback initials for avatar
 * @property {number} [rating] - Optional star rating (1-5)
 * @property {"default" | "featured"} [variant] - Card style variant
 * @property {string} [className] - Additional CSS classes
 */
export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  institution?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  rating?: number;
  variant?: "default" | "featured";
  className?: string;
}

/**
 * Testimonial card with quote, author info, and optional rating.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  institution,
  avatarUrl,
  avatarFallback,
  rating,
  variant = "default",
  className,
}: TestimonialCardProps) {
  const isFeatured = variant === "featured";

  // Generate initials from author name
  const initials =
    avatarFallback ||
    author
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <motion.div
      className={cn(
        "relative p-6 md:p-8 rounded-2xl",
        isFeatured
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20"
          : "bg-slate-900/50 border border-slate-800",
        "hover:border-slate-700 transition-colors duration-300",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Quote icon */}
      <Quote
        className={cn(
          "absolute top-4 right-4 w-8 h-8",
          isFeatured ? "text-cyan-500/20" : "text-slate-700"
        )}
      />

      {/* Rating */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-700"
              )}
            />
          ))}
        </div>
      )}

      {/* Quote text */}
      <blockquote
        className={cn(
          "text-base md:text-lg leading-relaxed mb-6",
          isFeatured ? "text-white" : "text-slate-300"
        )}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold",
            "overflow-hidden",
            isFeatured
              ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white"
              : "bg-slate-800 text-slate-400"
          )}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Name and details */}
        <div>
          <div className={cn("font-semibold", isFeatured ? "text-white" : "text-slate-200")}>
            {author}
          </div>
          {(role || institution) && (
            <div className="text-sm text-slate-400">
              {role}
              {role && institution && " · "}
              {institution}
            </div>
          )}
        </div>
      </div>

      {/* Featured gradient border effect */}
      {isFeatured && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 pointer-events-none" />
      )}
    </motion.div>
  );
}

/**
 * @typedef {Object} TestimonialCarouselProps
 * @property {TestimonialCardProps[]} testimonials - Array of testimonials
 * @property {string} [className] - Additional CSS classes
 */
export interface TestimonialCarouselProps {
  testimonials: TestimonialCardProps[];
  className?: string;
}

/**
 * Testimonial carousel with auto-scroll
 */
export function TestimonialCarousel({
  testimonials,
  className,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Auto-advance
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className={cn("relative", className)}>
      {/* Testimonials */}
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-cyan-500 w-6"
                : "bg-slate-700 hover:bg-slate-600"
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Logo bar for displaying partner/institution logos
 */
export interface LogoBarProps {
  logos: Array<{ name: string; logoUrl?: string }>;
  className?: string;
}

export function LogoBar({ logos, className }: LogoBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 md:gap-12",
        "opacity-60",
        className
      )}
    >
      {logos.map((logo, index) => (
        <div
          key={index}
          className="text-slate-500 font-semibold text-lg tracking-wide"
        >
          {logo.logoUrl ? (
            <img
              src={logo.logoUrl}
              alt={logo.name}
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
            />
          ) : (
            logo.name
          )}
        </div>
      ))}
    </div>
  );
}
