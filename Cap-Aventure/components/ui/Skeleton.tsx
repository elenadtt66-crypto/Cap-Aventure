import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text' | 'card';
  height?: string | number;
  width?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  height,
  width
}: SkeletonProps) {
  const variantStyles = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-3/4",
    card: "rounded-3xl h-80 w-full",
  };

  const style: React.CSSProperties = {};
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-brand-border/60 ${variantStyles[variant]} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
    </div>
  );
}
