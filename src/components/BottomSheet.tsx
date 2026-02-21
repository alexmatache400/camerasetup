'use client';

import { ReactNode } from 'react';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { Backdrop } from './Backdrop';
import { CloseButton } from './CloseButton';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={onClose} />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto border border-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        style={{
          background: 'var(--surface)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-4 py-4 border-b border-border"
          style={{
            background: 'var(--surface)',
          }}
        >
          <h3 id="bottom-sheet-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <CloseButton onClick={onClose} size="md" />
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
