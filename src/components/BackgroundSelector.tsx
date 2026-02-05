'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import BottomSheet from './BottomSheet';

export type BackgroundMedia = 'none' | 'sparkers' | 'magical-tree' | 'rainbow-nebula';

interface BackgroundSelectorProps {
  value: BackgroundMedia;
  onChange: (value: BackgroundMedia) => void;
}

const mediaOptions = [
  { value: 'none' as BackgroundMedia, label: '--No background--' },
  { value: 'sparkers' as BackgroundMedia, label: 'Sparkers' },
  { value: 'magical-tree' as BackgroundMedia, label: 'Magical Tree' },
  { value: 'rainbow-nebula' as BackgroundMedia, label: 'Rainbow Nebula' },
];

export default function BackgroundSelector({ value, onChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobile]);

  const selectedOption = mediaOptions.find(option => option.value === value) || mediaOptions[0];

  return (
    <>
      <div
        className="fixed z-50 top-32 left-2 right-2 md:top-40 md:right-4 md:left-auto md:max-w-xs hidden md:block"
        ref={dropdownRef}
      >
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all text-text-primary hover:shadow-xl max-md:w-full max-md:justify-between min-h-[44px]"
          style={{
            background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-sm font-medium truncate">
            Background: {selectedOption.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-text-secondary transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Desktop Dropdown Menu */}
        {isOpen && (
          <div className="hidden md:block absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
            {mediaOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm transition-colors min-h-[44px]"
                style={{
                  background: value === option.value
                    ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))'
                    : 'transparent',
                  color: value === option.value
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  fontWeight: value === option.value ? 500 : 400
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = 'var(--hover-overlay)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden">
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Select Background"
        >
          <div className="flex flex-col gap-2">
            {mediaOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left rounded-lg transition-all min-h-[44px]"
                style={{
                  background: value === option.value
                    ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
                    : 'transparent',
                  color: value === option.value
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  fontWeight: value === option.value ? 600 : 400,
                  border: value === option.value
                    ? '2px solid var(--accent)'
                    : '1px solid var(--border)'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </>
  );
}
