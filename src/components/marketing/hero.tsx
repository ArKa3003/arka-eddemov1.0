"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} HeroProps
 * @property {string} [badge] - Badge text above headline
 * @property {string} headline - Main headline (use <gradient> tags for gradient text)
 * @property {string} [subheadline] - Supporting text below headline
 * @property {string} [primaryCTA] - Primary button text
 * @property {string} [primaryHref] - Primary button link
 * @property {string} [secondaryCTA] - Secondary button text
 * @property {string} [secondaryHref] - Secondary button link
 * @property {boolean} [showPlayIcon] - Show play icon on secondary button
 * @property {React.ReactNode} [children] - Additional content (stats, mockups, etc.)
 * @property {string} [className] - Additional CSS classes
 */
export interface HeroProps {
  badge?: string;
  headline: string;
  subheadline?: string;
  primaryCTA?: string;
  primaryHref?: string;
  secondaryCTA?: string;
  secondaryHref?: string;
  showPlayIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Full viewport hero section with gradient background and animations.
 * Supports gradient text in headline using <gradient> tags.
 */
export function Hero({
  badge,
  headline,
  subheadline,
  primaryCTA = "Get Started",
  primaryHref = "/register",
  secondaryCTA,
  secondaryHref,
  showPlayIcon = false,
  children,
  className,
}: HeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  // Parse headline for gradient sections
  const parseHeadline = (text: string) => {
    const parts = text.split(/(<gradient>.*?<\/gradient>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<gradient>")) {
        const content = part.replace(/<\/?gradient>/g, "");
        return (
          <span
            key={index}
            className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent"
          >
            {content}
          </span>
        );
      }
      return part;
    });
  };

  // Split headline into words for stagger animation
  const words = headline.split(" ");

  // Mouse parallax effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950",
        className
      )}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px]"
          animate={{
            x: mousePosition.x * 30,
            y: mousePosition.y * 30,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[100px]"
          animate={{
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-slate-800/50 blur-[80px]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="default"
              className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {badge}
            </Badge>
          </motion.div>
        )}

        {/* Headline with staggered word animation */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {parseHeadline(word)}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
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
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800/50 px-8 py-6 text-lg"
              asChild
            >
              <a href={secondaryHref}>
                {showPlayIcon && <Play className="mr-2 h-5 w-5 fill-current" />}
                {secondaryCTA}
              </a>
            </Button>
          )}
        </motion.div>

        {/* Children (stats, mockups, etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
