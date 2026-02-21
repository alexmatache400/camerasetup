'use client';

import { useState, useEffect, useRef } from 'react';
import { X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { CloseButton } from './CloseButton';

export const PRICE_RANGES = [
  { label: '€0 – €200', min: 0, max: 200 },
  { label: '€200 – €500', min: 200, max: 500 },
  { label: '€500 – €1,000', min: 500, max: 1000 },
  { label: '€1,000 – €1,500', min: 1000, max: 1500 },
  { label: '€1,500 – €2,000', min: 1500, max: 2000 },
  { label: '€2,000+', min: 2000, max: Infinity },
] as const;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: string[];
  types: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  selectedPriceRanges: string[];
  onApply: (brands: string[], types: string[], priceRanges: string[]) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  brands,
  types,
  selectedBrands,
  selectedTypes,
  selectedPriceRanges,
  onApply,
}: FilterModalProps) {
  const [draftBrands, setDraftBrands] = useState<string[]>([]);
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [draftPriceRanges, setDraftPriceRanges] = useState<string[]>([]);
  const prevOpenRef = useRef(false);

  // Sync draft values only on open transition (false → true).
  // This avoids overwriting draft state while the modal is already open.
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      setDraftBrands([...selectedBrands]);
      setDraftTypes([...selectedTypes]);
      setDraftPriceRanges([...selectedPriceRanges]);
    }
  }, [isOpen, selectedBrands, selectedTypes, selectedPriceRanges]);

  // Prevent page scroll AND carousel wheel events from firing behind the modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const blockScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      // Capture phase: intercepts wheel/touch before carousel listeners see them
      document.addEventListener('wheel', blockScroll, { passive: false, capture: true });
      document.addEventListener('touchmove', blockScroll, { passive: false, capture: true });
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('wheel', blockScroll, { capture: true });
        document.removeEventListener('touchmove', blockScroll, { capture: true });
      };
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(draftBrands, draftTypes, draftPriceRanges);
  };

  const handleReset = () => {
    setDraftBrands([]);
    setDraftTypes([]);
    setDraftPriceRanges([]);
  };

  const hasChanges = draftBrands.length > 0 || draftTypes.length > 0 || draftPriceRanges.length > 0;

  const priceRangeLabels = PRICE_RANGES.map(r => r.label);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'var(--overlay)' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-border"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px var(--shadow-strong)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-border"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">Filters</h2>
          </div>
          <CloseButton onClick={onClose} size="sm" ariaLabel="Close filters" />
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Brand */}
          <FilterSection label="Brand">
            <MultiSelectDropdown
              placeholder="All brands"
              options={brands}
              selected={draftBrands}
              onChange={setDraftBrands}
            />
          </FilterSection>

          {/* Type */}
          <FilterSection label="Type">
            <MultiSelectDropdown
              placeholder="All types"
              options={types}
              selected={draftTypes}
              onChange={setDraftTypes}
            />
          </FilterSection>

          {/* Price Range */}
          <FilterSection label="Price Range">
            <MultiSelectDropdown
              placeholder="All prices"
              options={priceRangeLabels}
              selected={draftPriceRanges}
              onChange={setDraftPriceRanges}
            />
          </FilterSection>
        </div>

        {/* Footer — uses onMouseDown so that clicking Apply/Reset while a
             dropdown is still open works: the dropdown's outside-click handler
             also listens on mousedown, causing a re-render that shifts layout
             before the click event fires. onMouseDown ensures we capture the
             intent at the same phase. */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border"
        >
          <button
            onMouseDown={handleReset}
            disabled={!hasChanges}
            className="text-sm font-medium transition-colors disabled:opacity-30 text-text-secondary"
          >
            Reset
          </button>
          <button
            onMouseDown={handleApply}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--accent)' }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent">
        {label}
      </span>
      {children}
    </div>
  );
}

interface MultiSelectDropdownProps {
  placeholder: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function MultiSelectDropdown({ placeholder, options, selected, onChange }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(o => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const label = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
        style={{
          background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
          border: open
            ? '1px solid color-mix(in srgb, var(--accent) 60%, transparent)'
            : '1px solid var(--border)',
          color: selected.length > 0 ? 'var(--accent)' : 'var(--text-secondary)',
        }}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className="w-4 h-4 shrink-0 ml-2 transition-transform text-text-secondary"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Options list — shown when open */}
      {open && (
        <div
          className="rounded-lg overflow-hidden flex flex-col border border-border"
          style={{
            background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="flex items-center justify-between px-3 py-2 text-sm text-left transition-colors"
                style={{
                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                  background: isSelected
                    ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-overlay)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2 text-accent" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected chips — shown when closed and something is selected */}
      {!open && selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((opt) => (
            <span
              key={opt}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                color: 'var(--accent)',
              }}
            >
              {opt}
              <button
                type="button"
                onClick={() => toggle(opt)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${opt}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
