'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectMenuOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badgeVariant?: 'gold' | 'navy' | 'success' | 'warning' | 'error' | 'neutral';
  colorDot?: string;
}

interface SelectMenuProps {
  options: SelectMenuOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function SelectMenu({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  className = '',
  disabled = false,
  size = 'md'
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) || null;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const sizeStyles = {
    sm: "px-3.5 py-2 text-xs rounded-xl",
    md: "px-4 py-3 text-xs rounded-2xl",
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-full ${className}`} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          w-full max-w-full flex items-center justify-between gap-2.5 bg-brand-card border font-bold text-brand-text
          transition-all duration-200 cursor-pointer select-none text-left overflow-hidden
          ${sizeStyles[size]}
          ${open 
            ? 'border-brand-accent ring-2 ring-brand-accent/20 shadow-md' 
            : 'border-brand-border hover:border-brand-accent/40 shadow-2xs hover:bg-brand-hover'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-brand-beige' : ''}
        `}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {selected?.colorDot && (
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${selected.colorDot}`} />
          )}
          {selected?.icon && (
            <span className="flex-shrink-0">{selected.icon}</span>
          )}
          <span className="truncate min-w-0 flex-1">{selected ? selected.label : placeholder}</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-brand-muted transition-transform duration-200 flex-shrink-0 ${
            open ? 'rotate-180 text-brand-accent' : ''
          }`}
        />
      </button>

      {/* Custom Dropdown Panel */}
      {open && (
        <div
          className="
            absolute z-50 top-full mt-1.5 min-w-[220px] w-full left-0
            bg-brand-card/98 backdrop-blur-md border border-brand-border
            rounded-2xl shadow-xl p-1.5 space-y-1 animate-scale-up max-h-64 overflow-y-auto
          "
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-150 text-left cursor-pointer
                  ${isSelected
                    ? 'bg-brand-accent/10 text-brand-accent font-extrabold'
                    : 'text-brand-text hover:bg-brand-hover'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  {option.colorDot && (
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${option.colorDot}`} />
                  )}
                  {option.icon && (
                    <span className="flex-shrink-0">{option.icon}</span>
                  )}
                  <span className="truncate min-w-0 flex-1">{option.label}</span>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
