"use client";

import * as React from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface ConfettiProps {
  /** Whether confetti is active */
  active: boolean;
  /** Number of confetti particles */
  particleCount?: number;
  /** Duration in milliseconds */
  duration?: number;
  /** Spread angle in degrees */
  spread?: number;
  /** Starting velocity */
  startVelocity?: number;
  /** Confetti colors */
  colors?: string[];
  /** Origin point (0-1 for x and y) */
  origin?: { x: number; y: number };
  /** Callback when animation completes */
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "square" | "circle" | "ribbon";
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_COLORS = [
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#f43f5e", // rose-500
  "#3b82f6", // blue-500
  "#22d3ee", // cyan-400
  "#fbbf24", // amber-400
];

// ============================================================================
// Confetti Component
// ============================================================================

/**
 * Canvas-based confetti animation component.
 * Triggered on achievements, perfect scores, and celebrations.
 *
 * @example
 * ```tsx
 * const [showConfetti, setShowConfetti] = useState(false);
 *
 * <Confetti
 *   active={showConfetti}
 *   onComplete={() => setShowConfetti(false)}
 * />
 * ```
 */
export function Confetti({
  active,
  particleCount = 100,
  duration = 3000,
  spread = 70,
  startVelocity = 30,
  colors = DEFAULT_COLORS,
  origin = { x: 0.5, y: 0.6 },
  onComplete,
}: ConfettiProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>();
  const particlesRef = React.useRef<Particle[]>([]);
  const startTimeRef = React.useRef<number>(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Create particles
  const createParticles = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    const originX = canvas.width * origin.x;
    const originY = canvas.height * origin.y;
    const spreadRad = (spread * Math.PI) / 180;

    for (let i = 0; i < particleCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad * 2;
      const velocity = startVelocity * (0.5 + Math.random() * 0.5);
      const shapes: Particle["shape"][] = ["square", "circle", "ribbon"];

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    return particles;
  }, [particleCount, spread, startVelocity, colors, origin]);

  // Animation loop
  const animate = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    let hasActiveParticles = false;

    particlesRef.current.forEach((particle) => {
      // Physics
      particle.vy += 0.5; // Gravity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99; // Air resistance
      particle.rotation += particle.rotationSpeed;

      // Fade out
      particle.opacity = Math.max(0, 1 - progress);

      if (particle.opacity > 0) {
        hasActiveParticles = true;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        // Draw shape
        switch (particle.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "ribbon":
            ctx.fillRect(
              -particle.size / 2,
              -particle.size / 4,
              particle.size,
              particle.size / 2
            );
            break;
          case "square":
          default:
            ctx.fillRect(
              -particle.size / 2,
              -particle.size / 2,
              particle.size,
              particle.size
            );
        }

        ctx.restore();
      }
    });

    if (hasActiveParticles && progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onComplete?.();
    }
  }, [duration, onComplete]);

  // Start animation when active
  React.useEffect(() => {
    if (!active || !mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles and start
    particlesRef.current = createParticles() || [];
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, mounted, createParticles, animate]);

  // Handle resize
  React.useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || !active) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ width: "100%", height: "100%" }}
    />,
    document.body
  );
}

// ============================================================================
// useConfetti Hook
// ============================================================================

/**
 * Hook for triggering confetti animations.
 *
 * @example
 * ```tsx
 * const { triggerConfetti, ConfettiComponent } = useConfetti();
 *
 * <button onClick={triggerConfetti}>Celebrate!</button>
 * {ConfettiComponent}
 * ```
 */
export function useConfetti(options?: Partial<ConfettiProps>) {
  const [active, setActive] = React.useState(false);

  const triggerConfetti = React.useCallback(() => {
    setActive(true);
  }, []);

  const handleComplete = React.useCallback(() => {
    setActive(false);
    options?.onComplete?.();
  }, [options]);

  const ConfettiComponent = (
    <Confetti {...options} active={active} onComplete={handleComplete} />
  );

  return {
    triggerConfetti,
    active,
    ConfettiComponent,
  };
}

// ============================================================================
// Preset Confetti Functions
// ============================================================================

/**
 * Success confetti - cyan/green colors, center origin
 */
export function SuccessConfetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  return (
    <Confetti
      active={active}
      colors={["#06b6d4", "#10b981", "#22d3ee", "#34d399", "#67e8f9"]}
      particleCount={80}
      onComplete={onComplete}
    />
  );
}

/**
 * Achievement confetti - gold/amber colors, more particles
 */
export function AchievementConfetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  return (
    <Confetti
      active={active}
      colors={["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7", "#f97316"]}
      particleCount={150}
      duration={4000}
      onComplete={onComplete}
    />
  );
}

/**
 * Perfect score confetti - rainbow colors, maximum celebration
 */
export function PerfectScoreConfetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  return (
    <Confetti
      active={active}
      colors={[
        "#ef4444", // red
        "#f97316", // orange
        "#f59e0b", // amber
        "#84cc16", // lime
        "#10b981", // emerald
        "#06b6d4", // cyan
        "#3b82f6", // blue
        "#8b5cf6", // violet
        "#d946ef", // fuchsia
      ]}
      particleCount={200}
      duration={5000}
      spread={90}
      startVelocity={40}
      onComplete={onComplete}
    />
  );
}
