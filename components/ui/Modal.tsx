'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl'
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto bg-brand-navy/60 backdrop-blur-md transition-all duration-300 overscroll-contain"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl my-auto animate-scale-up text-brand-text max-h-[94vh] sm:max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-brand-border pb-3.5 sm:pb-4 mb-4 sm:mb-5 gap-3">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-lg sm:text-2xl font-extrabold text-brand-text tracking-tight truncate sm:whitespace-normal">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-hover active:bg-brand-border transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-0.5 sm:pr-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
