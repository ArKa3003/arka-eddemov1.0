// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} PricingFeature
 * @property {string} text - Feature description
 * @property {boolean} [included] - Whether feature is included (default true)
 */
export interface PricingFeature {
  text: string;
  included?: boolean;
}

/**
 * @typedef {Object} PricingCardProps
 * @property {string} tier - Tier name (e.g., "Free", "Pro", "Enterprise")
 * @property {string} [description] - Tier description
 * @property {number | string} price - Price (number or "Custom")
 * @property {"month" | "year" | "one-time"} [period] - Billing period
 * @property {string} [originalPrice] - Original price for showing discount
 * @property {PricingFeature[]} features - List of features
 * @property {string} ctaText - CTA button text
 * @property {string} [ctaHref] - CTA button link
 * @property {boolean} [featured] - Highlight this tier
 * @property {string} [featuredBadge] - Badge text for featured tier
 * @property {boolean} [disabled] - Disable the CTA
 * @property {string} [className] - Additional CSS classes
 */
export interface PricingCardProps {
  tier: string;
  description?: string;
  price: number | string;
  period?: "month" | "year" | "one-time";
  originalPrice?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaHref?: string;
  featured?: boolean;
  featuredBadge?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Pricing card with tier info, features list, and CTA.
 */
export function PricingCard({
  tier,
  description,
  price,
  period = "month",
  originalPrice,
  features,
  ctaText,
  ctaHref = "/register",
  featured = false,
  featuredBadge = "Most Popular",
  disabled = false,
  className,
}: PricingCardProps) {
  const isCustomPrice = typeof price === "string";
  const periodLabel = {
    month: "/mo",
    year: "/yr",
    "one-time": "",
  }[period];

  return (
    <motion.div
      className={cn(
        "relative flex flex-col p-6 md:p-8 rounded-2xl border",
        featured
          ? "bg-gradient-to-b from-slate-800 to-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-500/10"
          : "bg-slate-900/50 border-slate-800",
        "hover:border-slate-700 transition-colors duration-300",
        className
      )}
      whileHover={{ y: featured ? -8 : -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 px-4 py-1 shadow-lg">
            <Sparkles className="w-3 h-3 mr-1.5" />
            {featuredBadge}
          </Badge>
        </div>
      )}

      {/* Tier name */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{tier}</h3>
        {description && (
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          {!isCustomPrice && <span className="text-slate-400 text-lg">$</span>}
          <span className="text-4xl md:text-5xl font-bold text-white">
            {isCustomPrice ? price : price}
          </span>
          {!isCustomPrice && periodLabel && (
            <span className="text-slate-400">{periodLabel}</span>
          )}
        </div>
        {originalPrice && (
          <div className="text-sm text-slate-500 line-through mt-1">
            {originalPrice}
          </div>
        )}
      </div>

      {/* Features list */}
      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included !== false ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-3 h-3 text-slate-600" />
              </div>
            )}
            <span
              className={cn(
                "text-sm",
                feature.included !== false
                  ? "text-slate-300"
                  : "text-slate-500"
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={cn(
          "w-full py-6",
          featured
            ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg shadow-cyan-500/25"
            : "bg-slate-800 hover:bg-slate-700 text-white"
        )}
        disabled={disabled}
        asChild={!disabled}
      >
        {disabled ? (
          <span>{ctaText}</span>
        ) : (
          <a href={ctaHref}>{ctaText}</a>
        )}
      </Button>

      {/* Featured glow effect */}
      {featured && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 pointer-events-none" />
      )}
    </motion.div>
  );
}

/**
 * @typedef {Object} PricingGridProps
 * @property {React.ReactNode} children - PricingCard components
 * @property {string} [className] - Additional CSS classes
 */
export interface PricingGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Grid container for PricingCard components.
 */
export function PricingGrid({ children, className }: PricingGridProps) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",
        "items-stretch",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
