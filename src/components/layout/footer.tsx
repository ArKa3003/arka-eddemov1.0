"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Linkedin, Github, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case Studies", href: "#cases" },
    { label: "Specialty Tracks", href: "#tracks" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "Community", href: "#community" },
    { label: "Blog", href: "#blog" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
    { label: "Partners", href: "#partners" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "Accessibility", href: "#accessibility" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
];

/**
 * Marketing footer component with logo, links, social icons, and copyright.
 * Features accordion sections on mobile for better UX.
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FooterSection = ({
    title,
    links,
    sectionKey,
  }: {
    title: string;
    links: typeof footerLinks.product;
    sectionKey: string;
  }) => {
    const isOpen = openSections[sectionKey];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    return (
      <div>
        {/* Mobile: Accordion Header */}
        <button
          onClick={() => toggleSection(sectionKey)}
          className="md:hidden w-full flex items-center justify-between py-3 text-sm font-semibold focus-visible-ring rounded-md"
          aria-expanded={isOpen}
          aria-controls={`footer-section-${sectionKey}`}
        >
          <span>{title}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        {/* Desktop: Static Header */}
        <h3 className="hidden md:block text-sm font-semibold mb-4">{title}</h3>

        {/* Links */}
        <AnimatePresence>
          {(isOpen || !isMobile) && (
            <motion.ul
              id={`footer-section-${sectionKey}`}
              initial={isMobile ? { height: 0, opacity: 0 } : undefined}
              animate={isMobile ? { height: "auto", opacity: 1 } : undefined}
              exit={isMobile ? { height: 0, opacity: 0 } : undefined}
              transition={{
                duration: isReducedMotion ? 0.1 : 0.3,
                ease: "easeInOut",
              }}
              className="space-y-3 overflow-hidden"
            >
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible-ring rounded-md px-1 py-1 inline-block touch-target"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <footer className="border-t bg-background mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-1 mb-4 focus-visible-ring rounded-md p-1 inline-block"
              aria-label="ARKA-ED Home"
            >
              <span className="text-2xl font-bold text-accent-500">ARKA</span>
              <span className="text-2xl font-bold text-primary-900">-ED</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Medical education platform teaching imaging appropriateness through interactive cases and assessments.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-accent-500 transition-colors focus-visible-ring rounded-md p-2 touch-target"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <FooterSection title="Product" links={footerLinks.product} sectionKey="product" />

          {/* Resources Links */}
          <FooterSection title="Resources" links={footerLinks.resources} sectionKey="resources" />

          {/* Company Links */}
          <FooterSection title="Company" links={footerLinks.company} sectionKey="company" />

          {/* Legal Links */}
          <FooterSection title="Legal" links={footerLinks.legal} sectionKey="legal" />
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <p className="text-sm text-center text-muted-foreground">
            &copy; 2026 ARKA Health Technologies
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AIIE v2.0 | RAND/UCLA + GRADE Methodology
          </p>
        </div>
      </div>
    </footer>
  );
}