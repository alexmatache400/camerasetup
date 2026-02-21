'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface BrandSearchInputProps {
  brands: string[];
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
  placeholder?: string;
  label?: string;
  allowAny?: boolean;
  anyBrandLabel?: string;
}

export default function BrandSearchInput({
  brands,
  selectedBrand,
  onBrandSelect,
  placeholder = "Search brands...",
  label = "Brand",
  allowAny = true,
  anyBrandLabel = "Any brand"
}: BrandSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter brands based on search query
  const filteredBrands = searchQuery
    ? brands.filter(brand =>
        brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : brands;

  // Add "Any brand" option if enabled
  const allOptions = allowAny ? [anyBrandLabel, ...filteredBrands] : filteredBrands;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < allOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < allOptions.length) {
          handleSelect(allOptions[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex]);

  const handleSelect = (brand: string) => {
    onBrandSelect(brand);
    setSearchQuery("");
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery("");
    onBrandSelect("");
    inputRef.current?.focus();
  };

  const displayValue = selectedBrand || searchQuery;

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium mb-2 text-text-primary">
          {label}
        </label>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-text-tertiary" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl transition-all duration-300 outline-none text-text-primary"
          style={{
            background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
            backdropFilter: 'blur(12px)',
            border: isOpen
              ? '2px solid var(--accent)'
              : '1px solid var(--border)',
          }}
        />

        {/* Clear Button */}
        {displayValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            type="button"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && allOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 rounded-xl shadow-xl overflow-hidden border border-border"
          style={{
            background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
            backdropFilter: 'blur(16px)',
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {allOptions.map((brand, index) => {
            const isAnyBrand = allowAny && index === 0;
            const isFocused = index === focusedIndex;
            const isSelected = brand === selectedBrand;

            return (
              <button
                key={brand}
                onClick={() => handleSelect(brand)}
                onMouseEnter={() => setFocusedIndex(index)}
                type="button"
                className="w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3"
                style={{
                  background: isFocused || isSelected
                    ? 'var(--hover-overlay)'
                    : 'transparent',
                  color: isAnyBrand
                    ? 'var(--accent)'
                    : 'var(--text-primary)',
                  fontWeight: isAnyBrand || isSelected ? '600' : '400',
                }}
              >
                {isSelected && (
                  <span className="text-sm">✓</span>
                )}
                <span>{brand}</span>
              </button>
            );
          })}

          {/* No results message */}
          {allOptions.length === 0 && (
            <div className="px-4 py-6 text-center text-text-tertiary">
              No brands found
            </div>
          )}
        </div>
      )}

      {/* Selected brand display */}
      {selectedBrand && !isOpen && (
        <div className="mt-2 text-sm text-text-secondary">
          Selected: <span className="font-semibold">{selectedBrand}</span>
        </div>
      )}
    </div>
  );
}
