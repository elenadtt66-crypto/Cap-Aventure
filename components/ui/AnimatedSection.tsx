'use client';

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationVariant = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up' | 'slide-up';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;        // ms
  duration?: number;     // ms
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}

const variants: Record<AnimationVariant, { from: string; to: string }> = {
  'fade-up':    { from: 'opacity-0 translate-y-10', to: 'opacity-100 translate-y-0' },
  'fade-in':    { from: 'opacity-0', to: 'opacity-100' },
  'fade-left':  { from: 'opacity-0 -translate-x-10', to: 'opacity-100 translate-x-0' },
  'fade-right': { from: 'opacity-0 translate-x-10', to: 'opacity-100 translate-x-0' },
  'scale-up':   { from: 'opacity-0 scale-95', to: 'opacity-100 scale-100' },
  'slide-up':   { from: 'opacity-0 translate-y-16', to: 'opacity-100 translate-y-0' },
};

export default function AnimatedSection({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  as: Tag = 'div',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });
  const v = variants[variant];

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${className} transition-all ${v.from} ${isVisible ? v.to : ''}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {children}
    </Tag>
  );
}
