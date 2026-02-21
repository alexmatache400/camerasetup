'use client';

import { useState } from 'react';
import { getCategoryIcon } from './CategoryIcons';
import type { Category } from '@/lib/supabase/queries';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategorySelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto px-4 py-6" style={{ scrollbarWidth: 'none' }}>
      <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
        Categories
      </h2>

      <div className="flex flex-col gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const isHovered = hoveredCategory === category.name;

          return (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name)}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`
                relative w-full h-20 rounded-xl
                flex flex-col items-center justify-center gap-1
                transition-all duration-300 ease-out
                ${isSelected ? 'scale-105' : 'text-text-primary hover:scale-102'}
              `}
              style={{
                color: isSelected ? 'var(--text-primary)' : undefined,
                background: isSelected ? 'var(--accent)' : 'color-mix(in srgb, var(--surface) 90%, transparent)',
                border: isSelected ? '1px solid var(--accent)' : `1px solid ${isHovered && !isSelected ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: isSelected
                  ? '0 8px 24px color-mix(in srgb, var(--accent) 40%, transparent)'
                  : isHovered
                    ? '0 4px 16px var(--shadow)'
                    : '0 2px 8px var(--shadow)',
                transform: isHovered && !isSelected ? 'scale(1.02)' : isSelected ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {/* Glow effect for hovered items */}
              {!isSelected && isHovered && (
                <div
                  className="absolute inset-0 rounded-xl transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)',
                    opacity: 0.6
                  }}
                />
              )}

              {/* Icon: SVG if available, emoji fallback */}
              {(() => {
                const Icon = getCategoryIcon(category.name);
                return Icon ? (
                  <Icon className="w-7 h-7" aria-label={category.name} />
                ) : (
                  <span className="text-3xl" role="img" aria-label={category.name}>
                    {category.emoji}
                  </span>
                );
              })()}

              {/* Category Name */}
              <span className={`
                text-xs font-medium text-center px-2 leading-tight
                ${isSelected ? 'font-semibold' : ''}
              `}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

