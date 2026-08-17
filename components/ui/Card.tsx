import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  hoverEffect = true,
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white border border-brand-border rounded-3xl ${paddingStyles[padding]} ${
        hoverEffect ? 'hover-lift' : 'shadow-sm'
      } transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
