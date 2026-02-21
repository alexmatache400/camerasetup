'use client';

import { ReactNode } from 'react';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { Backdrop } from './Backdrop';
import { CloseButton } from './CloseButton';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  useModalBehavior(isOpen, onClose);

  return (
    <>
      {isOpen && <Backdrop onClick={onClose} zIndex={80} className="bg-black/50" />}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-[90] w-[280px] shadow-2xl border border-border
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          background: 'var(--surface)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b border-border"
        >
          <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
          <CloseButton onClick={onClose} size="md" ariaLabel="Close menu" />
        </div>

        {/* Content */}
        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-72px)]">
          {children}
        </div>
      </div>
    </>
  );
}
