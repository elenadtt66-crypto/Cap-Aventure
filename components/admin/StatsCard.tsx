import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  loading: boolean;
  colorClass: string;
}

export default function StatsCard({ title, value, icon: Icon, loading, colorClass }: StatsCardProps) {
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
    
    const duration = 1000; // 1 seconde
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

  if (loading) {
    return (
      <div className="bg-white border border-brand-border p-6 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-2/3">
            <div className="h-4 bg-brand-hover rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-brand-hover rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-brand-hover rounded-xl animate-pulse"></div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-border p-6 rounded-2xl hover-lift relative overflow-hidden transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold text-brand-text mt-2 font-mono">
            {displayValue}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
