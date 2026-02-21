'use client';

import { MouseEvent } from 'react';
import { use3DTilt } from '@/hooks/use3DTilt';
import { isSafeUrl } from '@/utils/url';

interface Button3DProps {
  text: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  scale?: number;
}

export default function Button3D({ text, onClick, href, disabled = false, scale = 1 }: Button3DProps) {
  const { rotation, glarePosition, handleMouseMove, handleMouseLeave } = use3DTilt({
    maxDegrees: 12,
    throttleMs: 0,
    disabled,
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const baseClasses = `
    relative px-6 py-3 rounded-xl whitespace-nowrap bg-accent-gradient
    transition-all duration-200 ease-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
  `;

  const content = (
    <>
      {/* Shine/Glare overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
        style={{
          background: `radial-gradient(
            circle at ${glarePosition.x}% ${glarePosition.y}%,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 30%,
            transparent 60%
          )`,
          opacity: disabled ? 0 : 0.6,
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
        className="absolute inset-0 rounded-xl opacity-50 blur-sm bg-accent-gradient"
        style={{
          transform: 'translateZ(-10px)',
          zIndex: -1,
        }}
      />

      {/* Edge highlight */}
      <div
        className="absolute inset-0 rounded-xl border border-white/30"
        style={{
          transform: 'translateZ(1px)',
        }}
      />
    </>
  );

  const containerStyle = {
    perspective: '1000px',
    transform: `scale(${scale})`,
    transformOrigin: 'center',
  };

  const transformStyle = {
    transformStyle: 'preserve-3d' as const,
    transform: disabled
      ? 'translateZ(0px)'
      : `
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        translateZ(20px)
      `,
    transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-out',
    boxShadow: disabled
      ? 'none'
      : `0 8px 24px color-mix(in srgb, var(--accent) 50%, transparent)`,
  };

  if (href && isSafeUrl(href) && !disabled) {
    return (
      <div className="group inline-block" style={containerStyle}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={baseClasses}
          style={transformStyle}
        >
          {content}
        </a>
      </div>
    );
  }

  return (
    <div className="group inline-block" style={containerStyle}>
      <button
        type="button"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={baseClasses}
        style={transformStyle}
      >
        {content}
      </button>
    </div>
  );
}
