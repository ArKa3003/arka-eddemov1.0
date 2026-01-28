"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  navItems: Array<{ href: string; label: string; icon?: React.ComponentType<{ className?: string }> }>;
  onClose?: () => void;
  className?: string;
}

/**
 * Enhanced mobile navigation component with full-screen slide-out menu.
 * Features smooth animations, outside click handling, and accessibility support.
 */
export function MobileNav({ navItems, onClose, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Close menu on navigation
  const handleLinkClick = () => {
    setOpen(false);
    onClose?.();
  };

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-mobile-nav]')) {
        setOpen(false);
        onClose?.();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Animation variants
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: isReducedMotion ? "tween" : "spring",
        damping: 25,
        stiffness: 200,
        duration: isReducedMotion ? 0.2 : undefined,
      },
    },
    open: {
      x: 0,
      transition: {
        type: isReducedMotion ? "tween" : "spring",
        damping: 25,
        stiffness: 200,
        duration: isReducedMotion ? 0.2 : undefined,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        duration: isReducedMotion ? 0.1 : 0.3,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: isReducedMotion ? 0 : i * 0.05,
        duration: isReducedMotion ? 0.1 : 0.3,
      },
    }),
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "lg:hidden p-2 rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
          "min-w-[44px] min-h-[44px] flex items-center justify-center",
          "transition-colors hover:bg-slate-100",
          className
        )}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav-menu"
            data-mobile-nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className={cn(
              "fixed inset-y-0 right-0 z-50 w-full max-w-sm",
              "bg-white shadow-xl lg:hidden",
              "flex flex-col"
            )}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
              <button
                onClick={() => {
                  setOpen(false);
                  onClose?.();
                }}
                className={cn(
                  "p-2 rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
                  "min-w-[44px] min-h-[44px] flex items-center justify-center",
                  "transition-colors hover:bg-slate-100"
                )}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg",
                          "text-base font-medium text-slate-700",
                          "transition-colors hover:bg-slate-100",
                          "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
                          "min-h-[44px]"
                        )}
                      >
                        {Icon && <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
                        <span>{item.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
