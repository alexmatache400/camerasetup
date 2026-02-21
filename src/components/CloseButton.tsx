'use client';

import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  /**
   * sm  → p-1.5, w-4 h-4  (FilterModal)
   * md  → p-2, w-5 h-5, min 44×44px touch target (BottomSheet, MobileDrawer) — default
   * lg  → p-2, w-6 h-6  (ProductModal)
   */
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function CloseButton({ onClick, size = 'md', ariaLabel = 'Close' }: CloseButtonProps) {
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconClass = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const touchTarget = size === 'md' ? 'min-w-[44px] min-h-[44px]' : '';

  return (
    <button
      onClick={onClick}
      className={`${padding} ${touchTarget} rounded-full transition-colors text-text-secondary hover:text-accent flex items-center justify-center`}
      style={{ background: 'var(--hover-overlay)' }}
      aria-label={ariaLabel}
    >
      <X className={iconClass} />
    </button>
  );
}
