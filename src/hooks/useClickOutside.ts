'use client';

import { useEffect, RefObject } from 'react';

/**
 * Calls callback when a mousedown event occurs outside ALL provided refs.
 * Accepts an array of refs so elements like separate input + dropdown can
 * both be treated as "inside".
 *
 * @param refs     Array of refs whose contents are treated as "inside"
 * @param callback Called when a click lands outside all refs
 * @param enabled  When false, the listener is not registered (default: true)
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  callback: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const isInside = refs.some(
        (ref) => ref.current && ref.current.contains(e.target as Node)
      );
      if (!isInside) callback();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [refs, callback, enabled]);
}
