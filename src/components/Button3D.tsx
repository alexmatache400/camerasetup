'use client';

import { useRef, useState, MouseEvent } from 'react';

interface Button3DProps {
  text: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  scale?: number;
}

export default function Button3D({ text, onClick, href, disabled = false, scale = 1 }: Button3DProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();

    // Calculate mouse position relative to button center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation (max ±12 degrees for buttons)
    const rotateX = -(y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;

    setRotation({ x: rotateX, y: rotateY });

    // Calculate glare position (0-100%)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;

    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

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
    relative px-6 py-3 rounded-xl whitespace-nowrap
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
        className="absolute inset-0 rounded-xl opacity-50 blur-sm"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
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
    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
    boxShadow: disabled
      ? 'none'
      : `0 8px 24px color-mix(in srgb, var(--accent) 50%, transparent)`,
  };

  if (href && !disabled) {
    return (
      <div className="group inline-block" style={containerStyle}>
        <a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
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
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
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
