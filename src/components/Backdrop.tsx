'use client';

interface BackdropProps {
  onClick?: () => void;
  /** CSS z-index value. BottomSheet: 60, MobileDrawer: 80. Default: 60 */
  zIndex?: number;
  /** Extra Tailwind classes to override defaults (e.g. "bg-black/50" for MobileDrawer) */
  className?: string;
}

/**
 * Fixed full-screen backdrop overlay.
 * Used by BottomSheet and MobileDrawer (standalone backdrop pattern).
 *
 * ProductModal and FilterModal use a different wrapper+backdrop pattern
 * and do not use this component.
 */
export function Backdrop({ onClick, zIndex = 60, className = '' }: BackdropProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 ${className}`}
      style={{ zIndex }}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
