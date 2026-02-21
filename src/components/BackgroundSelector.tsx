'use client';

import { ImageIcon } from 'lucide-react';
import type { Background } from '@/lib/supabase/queries';

interface BackgroundSelectorProps {
  backgrounds: Background[];
  value: string;
  onChange: (value: string) => void;
}

export default function BackgroundSelector({ backgrounds, value, onChange }: BackgroundSelectorProps) {
  // Cycle: 'none' + each selectable background in DB order
  const options = ['none', ...backgrounds.map(b => b.key)];
  const currentLabel = backgrounds.find(b => b.key === value)?.label ?? 'No background';

  const handleClick = () => {
    const currentIndex = options.indexOf(value);
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex]);
  };

  const isActive = value !== 'none';

  return (
    <button
      onClick={handleClick}
      title={`Background: ${currentLabel} (click to cycle)`}
      className="fixed z-50 bottom-6 right-4 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
      style={{
        background: isActive
          ? 'color-mix(in srgb, var(--accent) 20%, var(--surface))'
          : 'color-mix(in srgb, var(--surface) 90%, transparent)',
        border: isActive
          ? '1px solid var(--accent)'
          : '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <ImageIcon
        className="w-5 h-5"
        style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
      />
    </button>
  );
}
