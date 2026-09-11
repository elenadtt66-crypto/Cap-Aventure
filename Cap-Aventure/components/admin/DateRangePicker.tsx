'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react';

interface DateRange {
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null;   // YYYY-MM-DD
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  label?: string;
}

const WEEKDAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function compareDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function buildCalendarDays(year: number, month: number) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: (string | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) {
    days.push(toDateStr(year, month, d));
  }
  return days;
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = 'Sélectionner une période',
  label,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

  // Pending selection (before Apply)
  const [pending, setPending] = useState<DateRange>({ startDate: null, endDate: null });

  const today = new Date();
  const [navYear, setNavYear] = useState(today.getFullYear());
  const [navMonth, setNavMonth] = useState(today.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync pending with incoming value when opening
  const handleOpen = () => {
    setPending({ startDate: value.startDate, endDate: value.endDate });
    setSelecting('start');
    setHoverDate(null);
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelecting(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDayClick = (dateStr: string) => {
    if (selecting === 'start') {
      setPending({ startDate: dateStr, endDate: null });
      setSelecting('end');
    } else {
      // If clicked before start, swap
      if (pending.startDate && compareDates(dateStr, pending.startDate) < 0) {
        setPending({ startDate: dateStr, endDate: pending.startDate });
      } else {
        setPending(prev => ({ ...prev, endDate: dateStr }));
      }
      setSelecting(null);
    }
  };

  const handleApply = () => {
    onChange(pending);
    setOpen(false);
    setSelecting(null);
  };

  const handleCancel = () => {
    setPending({ startDate: value.startDate, endDate: value.endDate });
    setOpen(false);
    setSelecting(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: null, endDate: null });
    setPending({ startDate: null, endDate: null });
  };

  const prevMonth = () => {
    if (navMonth === 0) { setNavMonth(11); setNavYear(y => y - 1); }
    else setNavMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (navMonth === 11) { setNavMonth(0); setNavYear(y => y + 1); }
    else setNavMonth(m => m + 1);
  };

  const days = buildCalendarDays(navYear, navMonth);

  const getDayState = (dateStr: string): 'start' | 'end' | 'in-range' | 'hover-range' | 'today' | 'none' => {
    const { startDate, endDate } = pending;
    if (startDate === dateStr) return 'start';
    if (endDate === dateStr) return 'end';
    if (startDate && endDate) {
      const lo = startDate < endDate ? startDate : endDate;
      const hi = startDate < endDate ? endDate : startDate;
      if (dateStr > lo && dateStr < hi) return 'in-range';
    }
    // Hover preview
    if (selecting === 'end' && startDate && hoverDate) {
      const lo = startDate < hoverDate ? startDate : hoverDate;
      const hi = startDate < hoverDate ? hoverDate : startDate;
      if (dateStr > lo && dateStr < hi) return 'hover-range';
    }
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    if (dateStr === todayStr) return 'today';
    return 'none';
  };

  const displayText = () => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} – ${formatDate(value.endDate)}`;
    }
    if (value.startDate) return `Depuis le ${formatDate(value.startDate)}`;
    return placeholder;
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center space-x-2.5 px-4 py-3 bg-white border rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
          open
            ? 'border-brand-accent ring-2 ring-brand-accent/20 shadow-sm'
            : 'border-brand-border hover:border-brand-accent/50 hover:shadow-sm'
        }`}
      >
        {/* Calendar icon — styled comme un composant calendar */}
        <span className={`flex-shrink-0 transition-colors duration-150 ${open ? 'text-brand-accent' : 'text-brand-muted group-hover:text-brand-accent'}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M1 7h16" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="4" y="1" width="1.5" height="4" rx="0.75" fill="currentColor"/>
            <rect x="12.5" y="1" width="1.5" height="4" rx="0.75" fill="currentColor"/>
            <circle cx="5.5" cy="11" r="1" fill="currentColor"/>
            <circle cx="9" cy="11" r="1" fill="currentColor"/>
            <circle cx="12.5" cy="11" r="1" fill="currentColor"/>
            <circle cx="5.5" cy="14.5" r="1" fill="currentColor"/>
            <circle cx="9" cy="14.5" r="1" fill="currentColor"/>
          </svg>
        </span>

        <span className={`flex-1 text-left truncate ${value.startDate ? 'text-brand-text' : 'text-brand-muted'}`}>
          {displayText()}
        </span>

        {/* Clear button */}
        {(value.startDate || value.endDate) && (
          <span
            role="button"
            onClick={handleClear}
            className="flex-shrink-0 p-0.5 rounded-full hover:bg-brand-hover text-brand-muted hover:text-brand-error transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Dropdown picker */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden animate-scale-up w-80">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-brand-hover text-brand-text transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-brand-text">
              {MONTH_NAMES_FR[navMonth]} {navYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-brand-hover text-brand-text transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Instruction */}
          <div className="px-5 pb-2">
            <p className="text-[10px] text-brand-muted font-semibold">
              {selecting === 'start' ? '📅 Cliquez sur la date de début' : selecting === 'end' ? '📅 Cliquez sur la date de fin' : '✓ Plage sélectionnée'}
            </p>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-3 pb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-extrabold text-brand-muted uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
            {days.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} />;
              }

              const state = getDayState(dateStr);
              const dayNum = parseInt(dateStr.split('-')[2]);

              const isStart = state === 'start';
              const isEnd = state === 'end';
              const isInRange = state === 'in-range';
              const isHoverRange = state === 'hover-range';
              const isToday = state === 'today';

              return (
                <div
                  key={dateStr}
                  className={`relative flex items-center justify-center ${isInRange || isHoverRange ? 'bg-brand-accent/10' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => handleDayClick(dateStr)}
                    onMouseEnter={() => selecting === 'end' && setHoverDate(dateStr)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`
                      w-9 h-9 text-sm font-semibold rounded-full transition-all duration-100 cursor-pointer relative z-10
                      ${isStart || isEnd
                        ? 'bg-brand-accent text-white font-extrabold shadow-sm hover:bg-brand-accent-hover'
                        : isInRange
                        ? 'text-brand-accent font-bold hover:bg-brand-accent/20'
                        : isHoverRange
                        ? 'text-brand-accent/80 hover:bg-brand-accent/15'
                        : isToday
                        ? 'ring-2 ring-brand-accent/40 text-brand-accent font-bold hover:bg-brand-accent/10'
                        : 'text-brand-text hover:bg-brand-hover'
                      }
                    `}
                  >
                    {dayNum}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer — Cancel / Apply */}
          <div className="flex items-center justify-end space-x-3 px-5 py-3 border-t border-brand-border bg-brand-beige/60">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-bold text-brand-text bg-white border border-brand-border rounded-xl hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!pending.startDate}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
