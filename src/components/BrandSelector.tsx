'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, memo } from 'react';
import BottomSheet from './BottomSheet';

export type Brand = string;

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrand: Brand;
  onBrandSelect: (brand: Brand) => void;
}

function BrandSelector({ brands, selectedBrand, onBrandSelect }: BrandSelectorProps) {
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

  return (
    <>
      <div
        className="fixed z-50 top-20 left-2 max-md:w-[calc(50%-0.75rem)] md:top-28 md:left-4 md:max-w-xs"
        ref={dropdownRef}
      >
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all text-text-primary hover:shadow-xl max-w-xs max-md:w-full max-md:justify-between min-h-[44px]"
          style={{
            background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-sm font-medium truncate">
            Brand: {selectedBrand}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-text-secondary transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Desktop Dropdown Menu */}
        {isOpen && (
          <div className="hidden md:block absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  onBrandSelect(brand);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm transition-colors min-h-[44px]"
                style={{
                  background: selectedBrand === brand
                    ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))'
                    : 'transparent',
                  color: selectedBrand === brand
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  fontWeight: selectedBrand === brand ? 500 : 400
                }}
                onMouseEnter={(e) => {
                  if (selectedBrand !== brand) {
                    e.currentTarget.style.background = 'var(--hover-overlay)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedBrand !== brand) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {brand}
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
          title="Select Brand"
        >
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  onBrandSelect(brand);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left rounded-lg transition-all min-h-[44px]"
                style={{
                  background: selectedBrand === brand
                    ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
                    : 'transparent',
                  color: selectedBrand === brand
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  fontWeight: selectedBrand === brand ? 600 : 400,
                  border: selectedBrand === brand
                    ? '2px solid var(--accent)'
                    : '1px solid var(--border)'
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </>
  );
}

export default memo(BrandSelector);
