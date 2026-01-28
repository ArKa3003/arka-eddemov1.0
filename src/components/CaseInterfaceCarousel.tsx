'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle2, Activity } from 'lucide-react';

interface CaseSlide {
  id: number;
  phase: 'initial' | 'processing' | 'results';
}

const SLIDES: CaseSlide[] = [
  { id: 1, phase: 'initial' },
  { id: 2, phase: 'processing' },
  { id: 3, phase: 'results' }
];

const SLIDE_DURATION = 3500; // 3.5 seconds per slide

export function CaseInterfaceCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-cyan-500/10 rounded-full text-cyan-400 text-sm mb-4">
            INTERACTIVE DEMO
          </span>
          <h2 className="text-3xl font-bold text-white">Case Interface Preview</h2>
          <p className="text-gray-400 mt-2">Watch AIIE analyze a clinical case in real-time</p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            {/* Window Header with Navigation Dots */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border-b border-slate-600">
              <div className="flex gap-2">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-cyan-400 scale-110'
                        : 'bg-slate-500 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">Case Interface Preview</span>
            </div>

            {/* Slide Content */}
            <div className="p-6 min-h-[400px]">
              <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {SLIDES[currentSlide].phase === 'initial' && <InitialSlide />}
                {SLIDES[currentSlide].phase === 'processing' && <ProcessingSlide />}
                {SLIDES[currentSlide].phase === 'results' && <ResultsSlide />}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all ease-linear"
                style={{ 
                  width: '100%',
                  animation: `progress ${SLIDE_DURATION}ms linear infinite`,
                }}
              />
            </div>
          </div>

          {/* Slide Labels */}
          <div className="flex justify-center gap-8 mt-6">
            {['Present Case', 'AIIE Analysis', 'View Results'].map((label, i) => (
              <button
                key={label}
                onClick={() => goToSlide(i)}
                className={`text-sm transition-all ${
                  i === currentSlide 
                    ? 'text-cyan-400 font-semibold' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

// Slide 1: Initial Case Presentation
function InitialSlide() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Chief Complaint</div>
        <div className="text-white text-xl font-semibold">Sudden severe headache</div>
      </div>
      
      <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Patient Information</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Age:</span> <span className="text-white">52 years</span></div>
          <div><span className="text-gray-400">Sex:</span> <span className="text-white">Female</span></div>
          <div><span className="text-gray-400">Onset:</span> <span className="text-white">"Worst headache of my life"</span></div>
          <div><span className="text-gray-400">Duration:</span> <span className="text-white">2 hours</span></div>
        </div>
      </div>

      <div className="flex gap-3">
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Red Flag: Thunderclap</span>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">Age &gt; 50</span>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2">
        <Activity className="w-5 h-5" />
        Analyze with AIIE
      </button>
    </div>
  );
}

// Slide 2: Processing/Analysis State
function ProcessingSlide() {
  const [progress, setProgress] = useState(0);
  const steps = [
    'Extracting clinical features...',
    'Matching to evidence base...',
    'Calculating appropriateness score...',
    'Generating SHAP explanations...'
  ];
  const currentStep = Math.min(Math.floor(progress / 25), steps.length - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="relative inline-flex">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-sm">{progress}%</span>
          </div>
        </div>
        <h3 className="text-white text-xl font-semibold mt-4">AIIE Analysis in Progress</h3>
        <p className="text-gray-400 mt-2">{steps[currentStep]}</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            {i <= currentStep ? (
              <CheckCircle2 className={`w-5 h-5 ${i < currentStep ? 'text-green-400' : 'text-cyan-400 animate-pulse'}`} />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
            )}
            <span className={`text-sm ${i <= currentStep ? 'text-white' : 'text-gray-500'}`}>{step}</span>
          </div>
        ))}
      </div>

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Slide 3: Results Display
function ResultsSlide() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Recommended Imaging</div>
        <div className="text-cyan-400 text-xl font-semibold">CT Head without contrast</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">AIIE Rating</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-400">8</span>
            <span className="text-gray-500">/ 9</span>
          </div>
          <div className="text-green-400 text-sm mt-1">Usually Appropriate</div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Radiation</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-cyan-400">2.1</span>
            <span className="text-cyan-400 text-lg">mSv</span>
          </div>
          <div className="text-gray-400 text-sm mt-1">Low dose</div>
        </div>
      </div>

      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
          <div>
            <div className="text-green-400 font-semibold">Evidence Supports Imaging</div>
            <div className="text-gray-400 text-sm mt-1">
              Thunderclap headache with age &gt;50 strongly indicates need for immediate CT to rule out subarachnoid hemorrhage.
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
        View Full SHAP Explanation
      </button>
    </div>
  );
}

