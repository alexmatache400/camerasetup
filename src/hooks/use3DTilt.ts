'use client';

import { useState, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

interface Use3DTiltOptions {
  /** Maximum rotation in degrees. Badge3D uses 15, Button3D uses 12. Default: 15 */
  maxDegrees?: number;
  /** Throttle interval in ms. Use 16 for ~60fps throttle, 0 for no throttle. Default: 16 */
  throttleMs?: number;
  /** When true, mouse move has no effect (for disabled buttons). Default: false */
  disabled?: boolean;
}

interface Use3DTiltResult {
  rotation: { x: number; y: number };
  glarePosition: { x: number; y: number };
  handleMouseMove: (e: MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
}

/**
 * Provides 3D tilt + glare effect state driven by mouse position.
 * Used by Badge3D (maxDegrees: 15, throttleMs: 16) and
 * Button3D (maxDegrees: 12, throttleMs: 0, disabled from prop).
 */
export function use3DTilt({
  maxDegrees = 15,
  throttleMs = 16,
  disabled = false,
}: Use3DTiltOptions = {}): Use3DTiltResult {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const lastUpdateRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (disabled) return;

      if (throttleMs > 0) {
        const now = Date.now();
        if (now - lastUpdateRef.current < throttleMs) return;
        lastUpdateRef.current = now;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      setRotation({
        x: -(y / rect.height) * maxDegrees,
        y: (x / rect.width) * maxDegrees,
      });

      setGlarePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [maxDegrees, throttleMs, disabled]
  );

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  return { rotation, glarePosition, handleMouseMove, handleMouseLeave };
}
