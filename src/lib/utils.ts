// @ts-nocheck
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInSeconds } from "date-fns";

/**
 * Combines class names using clsx and tailwind-merge.
 * Merges Tailwind classes intelligently, handling conflicts.
 * 
 * @param {...ClassValue[]} inputs - Class names or conditional classes
 * @returns {string} Merged class string
 * 
 * @example
 * ```tsx
 * cn("px-4 py-2", "px-6", isActive && "bg-blue-500")
 * // Returns: "py-2 px-6 bg-blue-500" (px-4 is overridden by px-6)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency in USD.
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: "USD")
 * @returns {string} Formatted currency string
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(99.99) // "$99.99"
 * ```
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats radiation dose in millisieverts (mSv).
 * 
 * @param {number} mSv - Radiation dose in millisieverts
 * @returns {string} Formatted radiation string
 * 
 * @example
 * ```ts
 * formatRadiation(2.5) // "2.5 mSv"
 * formatRadiation(0.1) // "0.1 mSv"
 * ```
 */
export function formatRadiation(mSv: number): string {
  if (mSv === 0) return "No radiation";
  if (mSv < 0.1) return `<0.1 mSv`;
  return `${mSv.toFixed(1)} mSv`;
}

/**
 * Categorizes radiation dose into predefined categories.
 * 
 * @param {number} mSv - Radiation dose in millisieverts
 * @returns {'none' | 'minimal' | 'low' | 'moderate' | 'high'} Radiation category
 * 
 * @example
 * ```ts
 * getRadiationCategory(0) // "none"
 * getRadiationCategory(0.5) // "minimal"
 * getRadiationCategory(5) // "low"
 * getRadiationCategory(15) // "moderate"
 * getRadiationCategory(50) // "high"
 * ```
 */
export function getRadiationCategory(mSv: number): "none" | "minimal" | "low" | "moderate" | "high" {
  if (mSv === 0) return "none";
  if (mSv < 1) return "minimal";
  if (mSv < 10) return "low";
  if (mSv < 30) return "moderate";
  return "high";
}

/**
 * Categorizes ACR Appropriateness Rating.
 * 
 * @param {number} rating - ACR rating (1-9)
 * @returns {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} ACR category
 * 
 * @example
 * ```ts
 * getACRCategory(9) // "usually-appropriate"
 * getACRCategory(5) // "may-be-appropriate"
 * getACRCategory(1) // "usually-not-appropriate"
 * ```
 */
export function getACRCategory(rating: number): "usually-appropriate" | "may-be-appropriate" | "usually-not-appropriate" {
  if (rating >= 7) return "usually-appropriate";
  if (rating >= 4) return "may-be-appropriate";
  return "usually-not-appropriate";
}

/**
 * Gets Tailwind color classes based on ACR rating.
 * 
 * @param {number} rating - ACR rating (1-9)
 * @returns {{ bg: string; text: string; border: string }} Color class strings
 * 
 * @example
 * ```ts
 * getACRColor(9) // { bg: "bg-appropriate-50", text: "text-appropriate-700", border: "border-appropriate-200" }
 * getACRColor(5) // { bg: "bg-maybe-50", text: "text-maybe-700", border: "border-maybe-200" }
 * getACRColor(1) // { bg: "bg-inappropriate-50", text: "text-inappropriate-700", border: "border-inappropriate-200" }
 * ```
 */
export function getACRColor(rating: number): { bg: string; text: string; border: string } {
  if (rating >= 7) {
    return {
      bg: "bg-appropriate-50",
      text: "text-appropriate-700",
      border: "border-appropriate-200",
    };
  }
  if (rating >= 4) {
    return {
      bg: "bg-maybe-50",
      text: "text-maybe-700",
      border: "border-maybe-200",
    };
  }
  return {
    bg: "bg-inappropriate-50",
    text: "text-inappropriate-700",
    border: "border-inappropriate-200",
  };
}

/**
 * Converts ACR rating (1-9) to a score (0-100).
 * 
 * @param {number} acrRating - ACR rating (1-9)
 * @returns {number} Score from 0-100
 * 
 * @example
 * ```ts
 * calculateScore(9) // 100
 * calculateScore(5) // 50
 * calculateScore(1) // 0
 * ```
 */
export function calculateScore(acrRating: number): number {
  if (acrRating < 1) return 0;
  if (acrRating > 9) return 100;
  // Linear scale: 1 = 0%, 9 = 100%
  return Math.round(((acrRating - 1) / 8) * 100);
}

/**
 * Formats duration in seconds to a human-readable string.
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 * 
 * @example
 * ```ts
 * formatDuration(90) // "1m 30s"
 * formatDuration(3661) // "1h 1m 1s"
 * formatDuration(45) // "45s"
 * ```
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`); // Only show seconds if less than an hour

  return parts.join(" ");
}

/**
 * Gets a relative time string (e.g., "2 hours ago", "in 3 days").
 * 
 * @param {Date | string | number} date - The date to compare
 * @returns {string} Relative time string
 * 
 * @example
 * ```ts
 * getTimeAgo(new Date()) // "just now"
 * getTimeAgo(new Date(Date.now() - 3600000)) // "1 hour ago"
 * ```
 */
export function getTimeAgo(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = differenceInSeconds(now, dateObj);

  // Handle future dates
  if (diffInSeconds < 0) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  // Handle very recent dates (< 60 seconds)
  if (diffInSeconds < 60) {
    return "just now";
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Converts text to a URL-friendly slug.
 * 
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 * 
 * @example
 * ```ts
 * slugify("Emergency Medicine") // "emergency-medicine"
 * slugify("ACR Appropriateness Criteria") // "acr-appropriateness-criteria"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove hyphens from start
    .replace(/-+$/, ""); // Remove hyphens from end
}