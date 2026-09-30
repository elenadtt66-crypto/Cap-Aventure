'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 cursor-pointer select-none relative active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5 rounded-2xl shadow-lg",
  };

  const variantStyles = {
    primary: "bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md hover:shadow-brand-accent/25 hover:scale-[1.02]",
    secondary: "bg-brand-navy hover:bg-brand-navy-hover text-white shadow-md hover:scale-[1.02]",
    outline: "border border-brand-border bg-white text-brand-text hover:bg-brand-hover hover:border-brand-accent/40 hover:scale-[1.02]",
    ghost: "text-brand-text/80 hover:text-brand-accent hover:bg-brand-hover",
    danger: "bg-brand-error/10 hover:bg-brand-error text-brand-error hover:text-white border border-brand-error/20",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
