'use client';

import { useMemo } from 'react';
import { use3DTilt } from '@/hooks/use3DTilt';

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

// Base reference dimensions at scale=1 (matches card BASE_WIDTH=600).
// All badge dimensions scale proportionally from these values.
const BASE = {
  paddingX: 16,     // px horizontal padding at scale 1
  paddingY: 8,      // px vertical padding at scale 1
  fontSize: 14,     // px font size at scale 1
  borderRadius: 10, // px border radius at scale 1
  shadowBlur: 16,   // px shadow blur at scale 1
  shadowY: 6,       // px shadow Y offset at scale 1
  translateZ: 16,   // px 3D lift at scale 1
  depthZ: 8,        // px 3D depth layer at scale 1
};

export default function Badge3D({ text, variant, scale = 1, vertical = false }: Badge3DProps) {
  const { rotation, glarePosition, handleMouseMove, handleMouseLeave } = use3DTilt({
    maxDegrees: 15,
    throttleMs: 16,
  });

  // Compute all scaled dimensions once
  const dims = useMemo(() => ({
    px: Math.max(6, Math.round(BASE.paddingX * scale)),
    py: Math.max(3, Math.round(BASE.paddingY * scale)),
    fontSize: Math.max(8, Math.round(BASE.fontSize * scale)),
    borderRadius: Math.max(4, Math.round(BASE.borderRadius * scale)),
    shadowBlur: Math.max(4, Math.round(BASE.shadowBlur * scale)),
    shadowY: Math.max(2, Math.round(BASE.shadowY * scale)),
    translateZ: Math.max(6, Math.round(BASE.translateZ * scale)),
    depthZ: Math.max(4, Math.round(BASE.depthZ * scale)),
  }), [scale]);

  const styles = variantStyles[variant];

  return (
    <div
      className="group inline-block"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative shadow-lg cursor-default select-none transition-all duration-200 ease-out group-hover:scale-105"
        style={{
          padding: vertical
            ? `${dims.px}px ${dims.py}px`
            : `${dims.py}px ${dims.px}px`,
          borderRadius: `${dims.borderRadius}px`,
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
            translateZ(${dims.translateZ}px)
          `,
          transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-out',
          writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: vertical ? 'upright' : 'mixed',
          background: styles.background,
          boxShadow: `0 ${dims.shadowY}px ${dims.shadowBlur}px ${styles.shadow}`,
        }}
      >
        {/* Shine/Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            borderRadius: `${dims.borderRadius}px`,
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
          className="relative z-10 font-bold text-white drop-shadow-md tracking-wide whitespace-nowrap"
          style={{
            fontSize: `${dims.fontSize}px`,
            lineHeight: 1.3,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {text}
        </span>

        {/* 3D depth effect - bottom layer */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            borderRadius: `${dims.borderRadius}px`,
            transform: `translateZ(-${dims.depthZ}px)`,
            zIndex: -1,
            background: styles.background,
          }}
        />

        {/* Edge highlight */}
        <div
          className="absolute inset-0 border border-white/30"
          style={{
            borderRadius: `${dims.borderRadius}px`,
            transform: 'translateZ(1px)',
          }}
        />
      </div>
    </div>
  );
}
