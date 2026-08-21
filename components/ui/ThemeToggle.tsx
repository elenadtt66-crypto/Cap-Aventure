'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon';
}

export default function ThemeToggle({ className = '', variant = 'icon' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('cap_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('cap_theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center border border-brand-border bg-brand-hover/40 text-brand-muted ${className}`}
      >
        <span className="w-4 h-4" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border border-brand-border bg-brand-card hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer ${className}`}
        aria-label={`Activer le mode ${isDark ? 'clair' : 'sombre'}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-brand-accent animate-scale-up" />
          ) : (
            <Sun className="w-4 h-4 text-brand-accent animate-scale-up" />
          )}
          <span>Mode {isDark ? 'Sombre' : 'Clair'}</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider text-brand-muted font-mono bg-brand-hover px-2 py-0.5 rounded-md border border-brand-border">
          {isDark ? 'Nuit' : 'Jour'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center border border-brand-border bg-brand-card hover:bg-brand-hover text-brand-text transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer group ${className}`}
      aria-label={`Activer le mode ${isDark ? 'clair' : 'sombre'}`}
      title={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-brand-accent animate-scale-up" />
        ) : (
          <Sun className="w-4 h-4 text-brand-accent animate-scale-up" />
        )}
      </div>
    </button>
  );
}
