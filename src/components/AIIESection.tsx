'use client';

import { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  Brain,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface Citation {
  id: number;
  text: string;
  source: string;
  url?: string;
}

const CITATIONS: Citation[] = [
  { id: 1, text: '49–96% CDS alert override rate', source: 'PubMed Central', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  { id: 2, text: '2.4% voluntary adoption of ACR criteria', source: 'JACR 2024' },
  { id: 3, text: '44% ACR panel expertise gaps', source: 'ACR methodology review' },
  { id: 4, text: '62% of denials overturned on appeal', source: 'ASTRO Survey 2024' },
  { id: 5, text: '6–26% reduction in inappropriate imaging with CDS', source: 'ScienceDirect' },
  { id: 6, text: 'XGBoost achieves AUC 0.876–0.942 in clinical prediction', source: 'Medical AI studies' },
  { id: 7, text: 'RAND/UCLA Appropriateness Method validation', source: 'RAND Health' },
  { id: 8, text: 'FDA 21st Century Cures Act § 3060', source: 'FDA.gov', url: 'https://www.fda.gov/' },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

export function AIIESection() {
  const [sectionRef, inView] = useInView();
  const [activeTab, setActiveTab] = useState<'aiie' | 'acr'>('aiie');

  return (
    <section
      id="aiie"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-slate-900 to-slate-800"
      aria-labelledby="aiie-heading"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-400 text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            PROPRIETARY TECHNOLOGY
          </span>
          <h2
            id="aiie-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Introducing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              AIIE
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ARKA Imaging Intelligence Engine — a next-generation clinical
            decision support system that transforms how physicians learn and
            apply imaging appropriateness, beyond static ACR Appropriateness
            Criteria.
          </p>
        </div>

        {/* Comparison Toggle */}
        <div
          className={`flex justify-center mb-12 transition-all duration-700 delay-100 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="inline-flex bg-slate-700/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('aiie')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'aiie'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-glow'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              AIIE Technology
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('acr')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'acr'
                  ? 'bg-slate-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Traditional ACR
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div
          className={`grid lg:grid-cols-2 gap-8 mb-16 transition-all duration-700 delay-200 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* AIIE Card */}
          <div
            className={`rounded-2xl p-8 transition-all duration-300 ${
              activeTab === 'aiie'
                ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-2 border-cyan-500/50 scale-[1.02] shadow-glow'
                : 'bg-slate-800/60 border border-slate-600/70'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AIIE</h3>
                <p className="text-cyan-300 text-sm">ARKA Imaging Intelligence Engine</p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  text: 'Knowledge graph architecture',
                  desc: 'Dynamic clinical reasoning on rich patient, context, and utilization signals vs. static Boolean rules.',
                },
                {
                  icon: CheckCircle2,
                  text: 'XGBoost + SHAP explainability',
                  desc: 'Machine learning tuned on clinical data with transparent feature attributions (AUC 0.876–0.942 in published studies).⁶',
                },
                {
                  icon: CheckCircle2,
                  text: 'Tiered behavioral alerting',
                  desc: 'Graduated nudge design that targets high‑risk, high‑waste orders and reduces non‑actionable interruptions.',
                },
                {
                  icon: CheckCircle2,
                  text: 'RAND/UCLA + GRADE methodology',
                  desc: 'Appropriateness thresholds grounded in validated consensus frameworks, updated as evidence evolves.⁷',
                },
                {
                  icon: CheckCircle2,
                  text: 'Cumulative radiation tracking',
                  desc: 'Longitudinal tracking of prior exposure to protect high‑risk patients and surface safer alternatives.',
                },
                {
                  icon: Shield,
                  text: 'FDA non‑device CDS compliant',
                  desc: 'Designed to meet 21st Century Cures Act § 3060 criteria for non‑device clinical decision support.⁸',
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">{item.text}</span>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ACR Card */}
          <div
            className={`rounded-2xl p-8 transition-all duration-300 ${
              activeTab === 'acr'
                ? 'bg-slate-700/70 border-2 border-slate-400/60 scale-[1.02]'
                : 'bg-slate-800/60 border border-slate-600/70'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-200" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Traditional ACR</h3>
                <p className="text-gray-300 text-sm">Appropriateness Criteria</p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                {
                  icon: AlertTriangle,
                  text: 'Static rule-based guidance',
                  desc: 'Boolean logic tied to a limited number of structured fields; difficult to personalize in real time.',
                  warning: true,
                },
                {
                  icon: AlertTriangle,
                  text: '49–96% override rate¹',
                  desc: 'Published CDS studies report very high alert override rates, signaling alert fatigue and low trust.',
                  warning: true,
                },
                {
                  icon: AlertTriangle,
                  text: '2.4% voluntary adoption²',
                  desc: 'JACR data show very limited voluntary use without regulatory or payer mandates.',
                  warning: true,
                },
                {
                  icon: AlertTriangle,
                  text: '44% panel expertise gaps³',
                  desc: 'Methodology reviews highlight incomplete specialty and stakeholder representation in some topics.',
                  warning: true,
                },
                {
                  icon: AlertTriangle,
                  text: '62% appeal reversal rate⁴',
                  desc: 'Majority of imaging denials in some cohorts are overturned on appeal, reflecting misalignment with clinical nuance.',
                  warning: true,
                },
                {
                  icon: AlertTriangle,
                  text: 'Limited real-time personalization',
                  desc: 'One-size-fits-all rules that cannot easily incorporate local practice patterns or patient‑level risk.',
                  warning: true,
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      item.warning ? 'text-amber-400' : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <span className="text-white font-medium">{item.text}</span>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Statistics */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-300 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[
            {
              stat: '6–26%',
              label: 'Reduction in inappropriate imaging with CDS implementations⁵',
              className: 'text-cyan-400',
            },
            {
              stat: '< 3 sec',
              label: 'Targeted response time for order‑entry recommendations',
              className: 'text-teal-400',
            },
            {
              stat: '62%',
              label: 'Typical denial appeal reversal rate that AIIE aims to prevent⁴',
              className: 'text-emerald-400',
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-slate-800/60 rounded-xl p-6 text-center border border-slate-600/70"
            >
              <div className={`text-4xl font-bold mb-2 ${item.className}`}>
                {item.stat}
              </div>
              <p className="text-gray-300 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Citations */}
        <div
          className={`bg-slate-900/70 rounded-xl p-6 border border-slate-700 transition-all duration-700 delay-400 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            References & empirical data
          </h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-300">
            {CITATIONS.map((citation) => (
              <div key={citation.id} className="flex gap-2 items-start">
                <span className="text-cyan-400 shrink-0">[{citation.id}]</span>
                <div>
                  <span>{citation.text}</span>
                  <span className="block text-xs text-gray-400">
                    — <em>{citation.source}</em>
                    {citation.url && (
                      <>
                        {' '}
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline decoration-dotted underline-offset-4"
                        >
                          View source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-semibold text-white shadow-glow hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Experience AIIE in action
            <TrendingUp className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

