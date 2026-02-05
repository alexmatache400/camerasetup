'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Close on ESC key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when bottom sheet is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-4 py-4 border-b"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <h3 id="bottom-sheet-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors text-text-secondary hover:text-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ background: 'var(--hover-overlay)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
