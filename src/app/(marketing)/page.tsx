"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function useCountUp(target: number, isVisible: boolean, duration = 1200) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) return;
    let start: number | null = null;
    let rafId: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, isVisible, duration]);

  return value;
}

function AnimatedStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const count = useCountUp(value, inView, 1200);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-semibold text-white">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-white/60">
        {label}
      </div>
    </div>
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const parallaxX = useTransform(smoothX, [0, 1], [-12, 12]);
  const parallaxY = useTransform(smoothY, [0, 1], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const headlineWords = ["Master", "Medical", "Imaging", "Appropriateness"];

  return (
    <div className="bg-primary-900 text-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(6,182,212,0.25), transparent 55%), radial-gradient(circle at 20% 30%, rgba(148,163,184,0.2), transparent 60%), radial-gradient(circle at 80% 40%, rgba(6,182,212,0.15), transparent 55%), radial-gradient(circle at bottom right, rgba(15,23,42,0.9), transparent 70%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-24 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SectionBadge>The Future of Medical Education</SectionBadge>

            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              {headlineWords.map((word, index) => (
                <motion.span
                  key={word}
                  className={cn(
                    "mr-2 inline-block",
                    word === "Appropriateness" &&
                      "bg-gradient-to-r from-accent-400 via-accent-500 to-accent-300 bg-clip-text text-transparent"
                  )}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/70">
              The first interactive platform teaching physicians when to order
              imaging — not just how to read it.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" className="px-6">
                Start Learning Free
              </Button>
              <Button variant="outline" size="lg" className="px-6 text-white">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
              <AnimatedStat label="ACR Knowledge Gap" value={97} suffix="%" />
              <AnimatedStat label="Annual Waste" value={100} suffix="B+" />
              <AnimatedStat label="Clinical Cases" value={50} suffix="+" />
            </div>
          </div>

          {/* Mockup */}
          <motion.div
            className="relative flex-1"
            style={{ x: parallaxX, y: parallaxY }}
          >
            <motion.div
              className="absolute -top-6 left-8 h-28 w-28 rounded-full bg-accent-500/20 blur-2xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-4 right-10 h-20 w-20 rounded-full bg-accent-500/20 blur-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-accent-500" />
                <div className="h-3 w-3 rounded-full bg-white/30" />
                <div className="h-3 w-3 rounded-full bg-white/30" />
                <span className="ml-auto text-xs text-white/50">
                  Case Interface Preview
                </span>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-sm uppercase text-white/50">
                    Chief Complaint
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Sudden severe headache
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-sm uppercase text-white/50">
                    Recommended Imaging
                  </p>
                  <p className="mt-2 text-lg font-semibold text-accent-300">
                    CT Head without contrast
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                    <p className="text-xs text-white/50">ACR Rating</p>
                    <p className="mt-2 text-2xl font-semibold text-appropriate-400">
                      8
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                    <p className="text-xs text-white/50">Radiation</p>
                    <p className="mt-2 text-2xl font-semibold text-white/80">
                      2.1 mSv
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white text-primary-900">
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
                stat: "2.4%",
                label: "Use ACR Criteria",
                source: "National survey of residents",
              },
              {
                stat: "50%+",
                label: "Unfamiliar with ACR",
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

      {/* How It Works */}
      <section className="bg-primary-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <SectionBadge>How It Works</SectionBadge>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Evidence-driven learning in four steps
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                title: "Read the Case",
                description: "Experience real patient presentations.",
                icon: Clipboard,
              },
              {
                title: "Order Imaging",
                description: "Select the right modality in context.",
                icon: MousePointer2,
              },
              {
                title: "Get Instant Feedback",
                description: "See ACR-based ratings immediately.",
                icon: CheckCircle2,
              },
              {
                title: "Learn the Evidence",
                description: "Connect guidelines to outcomes.",
                icon: Lightbulb,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white text-primary-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <SectionBadge>Features</SectionBadge>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Built for ordering physicians
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "50+ Clinical Cases",
                description: "Realistic cases spanning high-impact scenarios.",
                icon: BookOpen,
                color: "text-accent-500",
              },
              {
                title: "ACR Criteria Integration",
                description: "Instant ACR ratings with evidence-based guidance.",
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

      {/* Testimonials */}
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
                  "ARKA-ED finally connects ordering decisions to ACR criteria in a way residents actually retain.",
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
                  “{testimonial.quote}”
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

      {/* Pricing */}
      <section className="bg-white text-primary-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <SectionBadge>Pricing</SectionBadge>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Choose the right plan
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                <Button
                  variant={tier.highlight ? "secondary" : "primary"}
                  className="mt-8 w-full"
                >
                  {tier.cta}
                </Button>
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
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 flex-1 rounded-md border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <Button variant="default" size="lg">
                  Get Started
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
    </div>
  );
}