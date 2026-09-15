import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'navy' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'gold',
  size = 'md',
  icon,
  children,
  className = ''
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1 font-bold",
    md: "text-xs px-3 py-1 gap-1.5 font-semibold",
  };

  const variantStyles = {
    gold: "bg-brand-gold-light text-brand-accent border border-brand-accent/20",
    navy: "bg-brand-navy/10 text-brand-navy border border-brand-navy/15",
    success: "bg-brand-success/10 text-brand-success border border-brand-success/20",
    warning: "bg-brand-warning/10 text-brand-warning border border-brand-warning/20",
    error: "bg-brand-error/10 text-brand-error border border-brand-error/20",
    neutral: "bg-white/80 text-brand-muted border border-brand-border backdrop-blur-sm",
  };

  return (
    <span className={`inline-flex items-center rounded-full tracking-wide uppercase select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
