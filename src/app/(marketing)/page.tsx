"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Play,
  Clipboard,
  MousePointer2,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Target,
  DollarSign,
  Route,
  BarChart3,
  Award,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DemoModal } from "@/components/DemoModal";
import { AIIESection } from "@/components/AIIESection";
import { CaseInterfaceCarousel } from "@/components/CaseInterfaceCarousel";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

// Intersection Observer hook for triggering animations on scroll
function useInView(options = {}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect(); // Only trigger once
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView] as const;
}

// Smooth counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = false, inView: boolean = true) {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    if (!inView && startOnView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView, startOnView]);
  
  return count;
}

function HeroSection() {
  const [heroRef, heroInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [stepsRef, stepsInView] = useInView();
  
  // Animated counters
  const knowledgeGap = useCountUp(30, 2000, true, statsInView);
  const annualWaste = useCountUp(100, 2000, true, statsInView);
  const clinicalCases = useCountUp(50, 2000, true, statsInView);

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Content */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 py-20 text-center">
        {/* Small badge / callout */}
        <div className={`inline-flex px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-8 animate-smooth ${heroInView ? "animate-fade-up" : "opacity-0"}`}>
          <span className="text-amber-200 text-sm font-medium">The Future of Medical Education</span>
        </div>

        {/* Main headline — large, bold, white, reference-style */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-8 max-w-5xl mx-auto">
          <span className={`block animate-smooth ${heroInView ? "animate-fade-up animate-delay-100" : "opacity-0"}`}>
            The future of
          </span>
          <span className={`block animate-smooth ${heroInView ? "animate-fade-up animate-delay-200" : "opacity-0"}`}>
            medical education
          </span>
        </h1>

        {/* Subheading */}
        <p className={`text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 animate-smooth ${heroInView ? "animate-fade-up animate-delay-300" : "opacity-0"}`}>
          The first interactive platform teaching physicians when to order imaging — powered by AIIE
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-16 animate-smooth ${heroInView ? "animate-fade-up animate-delay-400" : "opacity-0"}`}>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-semibold text-lg card-hover-smooth">
            Start Learning Free
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-semibold text-lg card-hover-smooth flex items-center gap-2">
            <span>▷</span> Watch Demo
          </button>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { value: knowledgeGap, suffix: "%", label: "AIIE KNOWLEDGE GAP" },
            { value: annualWaste, suffix: "B+", label: "ANNUAL WASTE" },
            { value: clinicalCases, suffix: "+", label: "CLINICAL CASES" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`animate-smooth ${statsInView ? "animate-counter" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-cyan-400">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Evidence-driven learning steps */}
      <div ref={stepsRef} id="how-it-works" className="bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`text-center mb-12 animate-smooth ${stepsInView ? "animate-fade-up" : "opacity-0"}`}>
            <span className="inline-block px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl font-bold">Evidence-driven learning in four steps</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "📄", title: "Read the Case", desc: "Experience real patient presentations." },
              { icon: "🔬", title: "Order Imaging", desc: "Select the right modality." },
              { icon: "✓", title: "Get AIIE Feedback", desc: "See evidence-based ratings instantly." },
              { icon: "💡", title: "Learn the Evidence", desc: "Connect guidelines to outcomes." },
            ].map((step, i) => (
              <div
                key={step.title}
                className={`bg-slate-700/50 rounded-xl p-6 card-hover-smooth animate-smooth ${
                  stepsInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-cyan-400 font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionBadge({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variant === "primary" &&
          "border-accent-400/40 bg-accent-500/10 text-accent-300",
        variant === "danger" &&
          "border-inappropriate-500/40 bg-inappropriate-500/10 text-inappropriate-400"
      )}
    >
      {children}
    </span>
  );
}

export default function MarketingPage() {
  const [showDemo, setShowDemo] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const parallaxX = useTransform(smoothX, [0, 1], [-12, 12]);
  const parallaxY = useTransform(smoothY, [0, 1], [-10, 10]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div className="bg-primary-900 text-white">
      {/* Navigation Bar (sticky) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] border-b transition-all",
          isScrolled
            ? "glass-dark border-b-white/10 bg-primary-900/80 backdrop-blur-md"
            : "bg-primary-900/95"
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1 relative z-[60]">
              <span className="text-2xl font-bold text-accent-500">ARKA</span>
              <span className="text-2xl font-bold text-white">-ED</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-white/80 hover:text-accent-300 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#aiie"
                className="text-sm font-medium text-white/80 hover:text-accent-300 transition-colors"
              >
                AIIE Technology
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-white/80 hover:text-accent-300 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-white/80 hover:text-accent-300 transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-primary-900 border-l border-white/10 shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center space-x-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-2xl font-bold text-accent-500">ARKA</span>
                  <span className="text-2xl font-bold text-white">-ED</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4 flex-1">
                <Link
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-accent-300 transition-colors py-2"
                >
                  How It Works
                </Link>
                <Link
                  href="#aiie"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-accent-300 transition-colors py-2"
                >
                  AIIE Technology
                </Link>
                <Link
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-accent-300 transition-colors py-2"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-accent-300 transition-colors py-2"
                >
                  Pricing
                </Link>
              </nav>

              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                <Button variant="outline" fullWidth asChild className="text-white border-white/20 hover:bg-white/10">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button variant="secondary" fullWidth asChild>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section
        id="main-content"
        className="relative overflow-hidden pt-24 sm:pt-28"
        onMouseMove={handleMouseMove}
        aria-label="Hero section"
      >
        <HeroSection />
      </section>

      {/* AIIE Technology Section */}
      <AIIESection />

      {/* Case Interface Preview (Interactive Carousel) */}
      <div id="demo">
        <CaseInterfaceCarousel />
      </div>

      {/* Problem Section */}
      <section id="problem" className="bg-white text-primary-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <SectionBadge variant="danger">The Problem</SectionBadge>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Every Platform Teaches the Wrong Skill
            </h2>
            <p className="mt-4 text-lg text-primary-700">
              Imaging education focuses on interpretation, leaving ordering
              physicians without the decision-making frameworks they need.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-50 text-primary-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">What Others Teach</th>
                  <th className="px-6 py-4 font-semibold">What You Need</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {[
                  ["Reading CT scans", "WHEN to order"],
                  ["Identifying pathology", "RIGHT modality"],
                  ["Radiologist skills", "Ordering physician skills"],
                ].map(([left, right]) => (
                  <tr key={left}>
                    <td className="px-6 py-4 text-primary-600">{left}</td>
                    <td className="px-6 py-4 font-semibold text-primary-900">
                      {right}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                stat: "30%",
                label: "AIIE Knowledge Gap",
                source: "National survey of residents",
              },
              {
                stat: "50%+",
                label: "Unfamiliar with AIIE",
                source: "Residency program report",
              },
              {
                stat: "$100B",
                label: "Wasted annually",
                source: "Healthcare cost analysis",
              },
            ].map((item) => (
              <Card
                key={item.label}
                variant="elevated"
                className="p-6 shadow-soft"
              >
                <div className="text-3xl font-semibold text-primary-900">
                  {item.stat}
                </div>
                <div className="mt-2 text-sm font-medium text-primary-700">
                  {item.label}
                </div>
                <div className="mt-4 text-xs text-primary-500">
                  {item.source}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}

      {/* Features Section */}
      <section id="features" className="bg-white text-primary-900" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <SectionBadge>Features</SectionBadge>
            <h2 id="features-heading" className="mt-4 text-2xl sm:text-3xl font-semibold md:text-4xl">
              Built for ordering physicians
            </h2>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "50+ Clinical Cases",
                description: "Realistic cases spanning high-impact scenarios.",
                icon: BookOpen,
                color: "text-accent-500",
              },
              {
                title: "AIIE Integration",
                description: "Instant AIIE ratings with evidence-based guidance.",
                icon: Target,
                color: "text-appropriate-500",
              },
              {
                title: "Cost & Radiation Data",
                description: "Make decisions with cost and risk in view.",
                icon: DollarSign,
                color: "text-maybe-500",
              },
              {
                title: "Specialty Tracks",
                description: "Focused learning paths by clinical specialty.",
                icon: Route,
                color: "text-purple-500",
              },
              {
                title: "Progress Analytics",
                description: "Track accuracy, streaks, and improvement.",
                icon: BarChart3,
                color: "text-blue-500",
              },
              {
                title: "Assessment Mode",
                description: "Timed exams to validate ordering mastery.",
                icon: Award,
                color: "text-inappropriate-500",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -6 }}
                  className="rounded-xl border border-primary-100 bg-white p-6 shadow-soft transition-shadow"
                >
                  <div
                    className={cn(
                      "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50",
                      feature.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-primary-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-primary-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <SectionBadge>Trusted by trainees</SectionBadge>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Programs love ARKA-ED
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-white/60">
            {["Harborview", "Stanford", "Johns Hopkins", "Mayo", "UCLA"].map(
              (institution) => (
                <span key={institution} className="text-sm uppercase tracking-widest">
                  {institution}
                </span>
              )
            )}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "ARKA-ED finally connects ordering decisions to AIIE criteria in a way residents actually retain.",
                name: "Dr. Emily Chen",
                role: "EM Program Director",
              },
              {
                quote:
                  "The analytics made it obvious where our interns needed more guidance on imaging utilization.",
                name: "Dr. James Patel",
                role: "Chief Resident",
              },
              {
                quote:
                  "Interactive cases plus feedback loops make this a must-have for modern training.",
                name: "Dr. Sofia Morales",
                role: "Radiology Faculty",
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm text-white/80">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent-500/30" />
                  <div>
                    <div className="text-sm font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white text-primary-900" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <SectionBadge>Pricing</SectionBadge>
            <h2 id="pricing-heading" className="mt-4 text-2xl sm:text-3xl font-semibold md:text-4xl">
              Choose the right plan
            </h2>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Get started with core learning tools.",
                features: [
                  "10 cases",
                  "Basic progress tracking",
                  "Learning mode",
                  "Community support",
                ],
                cta: "Get Started Free",
                ctaLink: "/register?plan=free",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$14.99/mo",
                description: "Best for residents and fellows.",
                features: [
                  "All cases",
                  "Full analytics",
                  "Assessment mode",
                  "Specialty tracks",
                  "Achievements",
                ],
                cta: "Start 7-Day Free Trial",
                ctaLink: "/register?plan=pro",
                highlight: true,
                sub: "$99/yr",
              },
              {
                name: "Institutional",
                price: "Custom",
                description: "For residency programs and hospitals.",
                features: [
                  "Everything in Pro",
                  "Bulk licensing",
                  "LMS integration",
                  "Admin dashboard",
                  "Custom assessments",
                ],
                cta: "Contact Sales",
                ctaLink: "mailto:sales@arka-ed.com",
                highlight: false,
              },
            ].map((tier) => (
              <motion.div
                key={tier.name}
                whileHover={{ y: -6 }}
                className={cn(
                  "rounded-2xl border p-8 shadow-soft",
                  tier.highlight
                    ? "border-accent-500 bg-primary-900 text-white"
                    : "border-primary-100 bg-white"
                )}
              >
                <div className="text-sm font-semibold uppercase tracking-widest">
                  {tier.name}
                </div>
                <div className="mt-4 text-4xl font-semibold">{tier.price}</div>
                {tier.sub && (
                  <div className="mt-1 text-sm text-white/70">{tier.sub}</div>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.ctaLink.startsWith("mailto:") ? (
                  <a href={tier.ctaLink}>
                    <Button
                      variant={tier.highlight ? "secondary" : "primary"}
                      className="mt-8 w-full"
                    >
                      {tier.cta}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant={tier.highlight ? "secondary" : "primary"}
                    className="mt-8 w-full"
                    asChild
                  >
                    <Link href={tier.ctaLink}>{tier.cta}</Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900/40 p-10 md:p-14">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold md:text-4xl">
                Ready to Order Smarter?
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Join the growing community of clinicians mastering imaging
                appropriateness.
              </p>
              <div className="mt-6">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-primary-900 bg-white/30"
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  500+ learners already enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
