'use client';

import React, { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  loading: boolean;
  colorClass: string;
  prefix?: string;
  suffix?: string;
  trend?: number; // % de variation (ex: +12 = +12%, -5 = -5%)
  trendLabel?: string;
  formatValue?: (v: number) => string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  loading,
  colorClass,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  formatValue,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;

    // Animation de compteur de 0 à la valeur cible
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1200;
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, loading]);

  const formattedDisplay = formatValue
    ? formatValue(displayValue)
    : displayValue.toLocaleString('fr-FR');

  const trendIsPositive = trend !== undefined && trend > 0;
  const trendIsNeutral = trend === undefined || trend === 0;

  if (loading) {
    return (
      <div className="bg-white border border-brand-border p-5 sm:p-6 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-2/3">
            <div className="h-3 bg-brand-hover rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-brand-hover rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-brand-hover rounded w-1/3 animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-brand-hover rounded-xl animate-pulse flex-shrink-0" />
        </div>
        {/* Shimmer */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-border p-5 sm:p-6 rounded-2xl hover-lift relative overflow-hidden transition-all duration-200 group">
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at top right, rgba(201,160,53,0.04) 0%, transparent 70%)' }} />

      <div className="flex justify-between items-start relative">
        <div className="space-y-1 min-w-0 flex-1 pr-3">
          <span className="text-[10px] sm:text-xs font-extrabold text-brand-muted uppercase tracking-widest block truncate">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-text mt-1 font-mono tracking-tight">
            {prefix}{formattedDisplay}{suffix}
          </h3>

          {/* Trend indicator */}
          {trend !== undefined && (
            <div className={`inline-flex items-center space-x-1 text-[10px] font-bold mt-1 ${
              trendIsPositive ? 'text-brand-success' :
              trendIsNeutral ? 'text-brand-muted' :
              'text-brand-error'
            }`}>
              {trendIsPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : trendIsNeutral ? (
                <Minus className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {trend > 0 ? '+' : ''}{trend}% {trendLabel || 'vs mois précédent'}
              </span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass} transition-transform duration-200 group-hover:scale-110`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}
