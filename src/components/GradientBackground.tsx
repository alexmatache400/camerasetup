'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { lerpColor } from '@/utils/colorExtractor';

interface GradientBackgroundProps {
  colorPalettes: string[][];
  activeIndex: number;
  className?: string;
}

/**
 * GradientBackground Component
 * Renders reactive gradient background using Canvas API
 * Smoothly transitions between color palettes using GSAP
 */
export default function GradientBackground({
  colorPalettes,
  activeIndex,
  className = '',
}: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [currentColors, setCurrentColors] = useState<string[]>([]);
  const [targetColors, setTargetColors] = useState<string[]>([]);
  const tweenDataRef = useRef({ progress: 1 });
  const lastUpdateRef = useRef(Date.now());
  const isTransitioningRef = useRef(false);

  // Initialize colors
  useEffect(() => {
    if (colorPalettes.length > 0 && currentColors.length === 0) {
      const initialColors = colorPalettes[activeIndex] || colorPalettes[0];
      setCurrentColors(initialColors);
      setTargetColors(initialColors);
    }
  }, [colorPalettes, activeIndex, currentColors.length]);

  // Handle active index change - trigger color transition
  useEffect(() => {
    if (colorPalettes.length === 0 || currentColors.length === 0) return;

    const newColors = colorPalettes[activeIndex] || colorPalettes[0];

    // Don't transition if colors are the same
    if (JSON.stringify(newColors) === JSON.stringify(targetColors)) return;

    setTargetColors(newColors);
    isTransitioningRef.current = true;

    // Animate transition using GSAP
    tweenDataRef.current = { progress: 0 };
    gsap.to(tweenDataRef.current, {
      progress: 1,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        // Progress is updated, canvas will interpolate colors in render loop
      },
      onComplete: () => {
        setCurrentColors(newColors);
        isTransitioningRef.current = false;
        tweenDataRef.current.progress = 1;
      },
    });
  }, [activeIndex, colorPalettes, currentColors.length, targetColors]);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Performance optimization
    });

    if (!ctx) return;

    // Set canvas size to match display size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render loop with adaptive refresh rate
    const render = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;

      // Adaptive refresh rate:
      // - High FPS (16ms) during transitions
      // - Lower FPS (33ms) when idle
      const targetInterval = isTransitioningRef.current ? 16 : 33;

      if (deltaTime >= targetInterval) {
        lastUpdateRef.current = now;
        drawGradient(ctx, canvas.getBoundingClientRect());
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentColors, targetColors]);

  // Draw gradient on canvas
  const drawGradient = (
    ctx: CanvasRenderingContext2D,
    rect: DOMRect
  ) => {
    const { width, height } = rect;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (currentColors.length === 0) return;

    // Interpolate colors during transition
    const progress = tweenDataRef.current.progress;
    const colors =
      progress < 1 && targetColors.length > 0
        ? currentColors.map((color, i) =>
            lerpColor(color, targetColors[i] || color, progress)
          )
        : currentColors;

    // Check dark mode for opacity adjustment
    const isDark =
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark');
    const opacityMultiplier = isDark ? 0.6 : 1.0;

    // Draw multiple radial gradients for depth
    if (colors[0]) {
      const gradient1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.25,
        0,
        width * 0.25,
        height * 0.25,
        width * 0.7
      );
      gradient1.addColorStop(0, adjustOpacity(colors[0], opacityMultiplier));
      gradient1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);
    }

    if (colors[1]) {
      const gradient2 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.75,
        0,
        width * 0.75,
        height * 0.75,
        width * 0.7
      );
      gradient2.addColorStop(0, adjustOpacity(colors[1], opacityMultiplier));
      gradient2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
    }

    if (colors[2]) {
      const gradient3 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.6,
        0,
        width * 0.5,
        height * 0.6,
        width * 0.6
      );
      gradient3.addColorStop(0, adjustOpacity(colors[2], opacityMultiplier * 0.7));
      gradient3.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Adjust opacity of rgba color
  const adjustOpacity = (rgba: string, multiplier: number): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return rgba;

    const r = match[1];
    const g = match[2];
    const b = match[3];
    const a = match[4] ? parseFloat(match[4]) * multiplier : multiplier;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        filter: 'blur(24px) saturate(1.05)',
        willChange: 'contents',
        backgroundColor: 'transparent',
      }}
      aria-hidden="true"
    />
  );
}
