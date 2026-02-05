'use client';

import { useRef, useState, useCallback, MouseEvent } from 'react';

type BadgeVariant = 'brand' | 'type' | 'price' | 'new';

interface Badge3DProps {
  text: string;
  variant: BadgeVariant;
  scale?: number;
  vertical?: boolean;
}

const variantStyles = {
  brand: {
    background: 'linear-gradient(135deg, var(--badge-brand-from), var(--badge-brand-via), var(--badge-brand-to))',
    shadow: 'color-mix(in srgb, var(--badge-brand) 50%, transparent)',
  },
  type: {
    background: 'linear-gradient(135deg, var(--badge-type-from), var(--badge-type-via), var(--badge-type-to))',
    shadow: 'color-mix(in srgb, var(--badge-type) 50%, transparent)',
  },
  price: {
    background: 'linear-gradient(135deg, var(--badge-price-from), var(--badge-price-via), var(--badge-price-to))',
    shadow: 'color-mix(in srgb, var(--badge-price) 50%, transparent)',
  },
  new: {
    background: 'linear-gradient(135deg, var(--badge-new-from), var(--badge-new-via), var(--badge-new-to))',
    shadow: 'color-mix(in srgb, var(--badge-new) 50%, transparent)',
  },
};

export default function Badge3D({ text, variant, scale = 1, vertical = false }: Badge3DProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<number>(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Throttled mouse move handler (max 60fps)
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!badgeRef.current) return;

    const now = Date.now();
    const throttleMs = 16; // ~60fps

    // Skip if last update was too recent
    if (now - lastUpdateRef.current < throttleMs) return;
    lastUpdateRef.current = now;

    const badge = badgeRef.current;
    const rect = badge.getBoundingClientRect();

    // Calculate mouse position relative to badge center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation (max ±15 degrees)
    const rotateX = -(y / rect.height) * 15;
    const rotateY = (x / rect.width) * 15;

    setRotation({ x: rotateX, y: rotateY });

    // Calculate glare position (0-100%)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;

    setGlarePosition({ x: glareX, y: glareY });
  }, []);

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="group inline-block"
      style={{
        perspective: '1000px',
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      <div
        ref={badgeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          relative ${vertical ? 'py-6 px-3' : 'px-6 py-3'} rounded-xl
          shadow-lg
          cursor-default select-none
          transition-all duration-200 ease-out
          group-hover:scale-105
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
            translateZ(20px)
          `,
          transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-out',
          writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: vertical ? 'upright' : 'mixed',
          background: styles.background,
          boxShadow: `0 8px 24px ${styles.shadow}`,
        }}
      >
        {/* Shine/Glare overlay */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          style={{
            background: `radial-gradient(
              circle at ${glarePosition.x}% ${glarePosition.y}%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.1) 30%,
              transparent 60%
            )`,
            opacity: 0.6,
            transition: 'background 0.1s ease-out',
          }}
        />

        {/* Text content */}
        <span
          className="relative z-10 font-bold text-base text-white drop-shadow-md tracking-wide"
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {text}
        </span>

        {/* 3D depth effect - bottom layer */}
        <div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            transform: 'translateZ(-10px)',
            zIndex: -1,
            background: styles.background,
          }}
        />

        {/* Edge highlight */}
        <div
          className="absolute inset-0 rounded-lg border border-white/30"
          style={{
            transform: 'translateZ(1px)',
          }}
        />
      </div>
    </div>
  );
}
