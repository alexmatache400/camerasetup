'use client';

import { useEffect } from 'react';

/**
 * Handles shared modal/overlay behavior:
 * - Closes on Escape key press
 * - Prevents body scroll while open
 *
 * Used by: BottomSheet, MobileDrawer, ProductModal
 * NOT used by FilterModal (which has extra wheel/touchmove blocking)
 */
export function useModalBehavior(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
}
