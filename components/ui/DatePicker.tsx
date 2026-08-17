'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Check
} from 'lucide-react';

interface DatePickerProps {
  id?: string;
  value: string; // Format 'YYYY-MM-DD'
  onChange: (value: string) => void;
  minDate?: string; // Format 'YYYY-MM-DD'
  maxDate?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_SHORT_FR = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

export default function DatePicker({
  id,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Sélectionner une date',
  label,
  required = false,
  className = ''
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialiser le mois affiché sur la date sélectionnée ou aujourd'hui
  const initialDate = useMemo(() => {
    if (value) {
      const parts = value.split('-').map(Number);
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    if (minDate) {
      const parts = minDate.split('-').map(Number);
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  }, [value, minDate]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Mettre à jour la vue si la valeur externe change
  useEffect(() => {
    if (value) {
      const parts = value.split('-').map(Number);
      if (parts.length === 3) {
        setViewYear(parts[0]);
        setViewMonth(parts[1] - 1);
      }
    }
  }, [value]);

  // Fermer au clic en dehors
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Navigation mois
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Formatage YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const y = year.toString();
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Affichage lisible en français
  const formattedDisplay = useMemo(() => {
    if (!value) return '';
    const parts = value.split('-').map(Number);
    if (parts.length !== 3) return value;
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [value]);

  // Calcul des jours de la grille
  const daysInGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    // 0 = Dimanche, on veut 0 = Lundi
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{ day: number; isCurrentMonth: boolean; dateStr: string; disabled: boolean; isToday: boolean; isSelected: boolean }> = [];

    // Jours du mois précédent
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = formatDateString(prevYear, prevMonth, d);
      days.push({
        day: d,
        isCurrentMonth: false,
        dateStr,
        disabled: true,
        isToday: false,
        isSelected: false
      });
    }

    // Jours du mois en cours
    const todayStr = new Date().toISOString().split('T')[0];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateString(viewYear, viewMonth, d);
      const isPastMin = minDate ? dateStr < minDate : false;
      const isFutureMax = maxDate ? dateStr > maxDate : false;
      days.push({
        day: d,
        isCurrentMonth: true,
        dateStr,
        disabled: isPastMin || isFutureMax,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value
      });
    }

    // Compléter avec le mois suivant pour faire des semaines complètes (multiple de 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = formatDateString(nextYear, nextMonth, d);
      days.push({
        day: d,
        isCurrentMonth: false,
        dateStr,
        disabled: true,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  }, [viewYear, viewMonth, minDate, maxDate, value]);

  const handleSelectDate = (dateStr: string, disabled: boolean) => {
    if (disabled) return;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Raccourcis rapides
  const handleQuickSelect = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    const dateStr = target.toISOString().split('T')[0];
    if (minDate && dateStr < minDate) return;
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
          {label} {required && '*'}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 bg-brand-beige border rounded-2xl
          text-xs font-semibold transition-all duration-200 cursor-pointer text-left select-none
          ${isOpen 
            ? 'border-brand-accent ring-2 ring-brand-accent/20 bg-white shadow-md' 
            : 'border-brand-border hover:border-brand-accent/40 shadow-2xs hover:bg-brand-hover'
          }
        `}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <CalendarIcon className={`w-4 h-4 flex-shrink-0 transition-colors ${isOpen || value ? 'text-brand-accent' : 'text-brand-muted'}`} />
          <span className={`truncate capitalize ${value ? 'text-brand-text font-bold' : 'text-brand-muted'}`}>
            {formattedDisplay || placeholder}
          </span>
        </div>

        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="p-1 hover:bg-brand-border/60 rounded-full text-brand-muted hover:text-brand-text transition-colors"
            title="Effacer la date"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Custom Calendar Dropdown Popup */}
      {isOpen && (
        <div
          className="
            absolute z-50 top-full mt-2 left-0 sm:right-auto min-w-[300px] sm:w-[320px]
            bg-white/98 backdrop-blur-md border border-brand-border
            rounded-3xl shadow-2xl p-4 space-y-4 animate-scale-up
          "
        >
          {/* Header navigation du mois */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-brand-hover rounded-xl text-brand-text transition-colors cursor-pointer"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-extrabold text-brand-text tracking-wide capitalize">
              {MONTHS_FR[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-brand-hover rounded-xl text-brand-text transition-colors cursor-pointer"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* En-têtes jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_SHORT_FR.map((d, i) => (
              <span key={i} className="text-[10px] font-extrabold uppercase text-brand-muted/80 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {daysInGrid.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div key={index} className="h-8 flex items-center justify-center text-[11px] text-brand-muted/30">
                    {item.day}
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleSelectDate(item.dateStr, item.disabled)}
                  className={`
                    h-8 w-8 mx-auto flex items-center justify-center text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer
                    ${item.isSelected
                      ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/30 scale-105'
                      : item.disabled
                        ? 'text-brand-muted/30 cursor-not-allowed bg-transparent'
                        : item.isToday
                          ? 'border border-brand-accent text-brand-accent hover:bg-brand-accent/10'
                          : 'text-brand-text hover:bg-brand-gold-light hover:text-brand-navy'
                    }
                  `}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Raccourcis rapides */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-border text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickSelect(0)}
              className="font-bold text-brand-accent hover:underline cursor-pointer"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(7)}
              className="font-semibold text-brand-muted hover:text-brand-text cursor-pointer"
            >
              +1 semaine
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(14)}
              className="font-semibold text-brand-muted hover:text-brand-text cursor-pointer"
            >
              +2 semaines
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
