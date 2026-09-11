// Composant Logo Cap Aventure — SVG vectoriel fidèle au branding fourni
// Couleurs : Navy #1C2B4A | Or #C9A035
// Formats responsifs : horizontal (desktop), compact (sidebar/mobile)

import React from 'react';

interface CapAventureLogoProps {
  variant?: 'horizontal' | 'compact' | 'icon-only';
  className?: string;
  /** Forcer une couleur de texte (pour fond sombre) */
  invertText?: boolean;
}

export default function CapAventureLogo({
  variant = 'horizontal',
  className = '',
  invertText = false,
}: CapAventureLogoProps) {
  const navy = '#1C2B4A';
  const gold = '#C9A035';

  // Icône SVG — le badge rond avec montagnes + soleil + véhicules
  const Icon = ({ size = 56 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      {/* Cercle extérieur */}
      <circle cx="60" cy="54" r="46" className="stroke-brand-text fill-brand-card" strokeWidth="3" />

      {/* Soleil / Demi-lune or */}
      <circle cx="60" cy="26" r="9" fill={gold} opacity="0.9" />
      <rect x="51" y="26" width="18" height="10" className="fill-brand-card" />

      {/* Montagnes — 3 pics */}
      <path d="M22 72 L38 44 L48 60 Z" className="fill-brand-text opacity-85" />
      <path d="M38 72 L60 30 L82 72 Z" className="fill-brand-text" />
      <path d="M72 72 L82 52 L98 72 Z" className="fill-brand-text opacity-75" />
      {/* Cache bas montagne */}
      <rect x="8" y="66" width="104" height="12" className="fill-brand-card" />

      {/* Route / sol courbé */}
      <ellipse cx="60" cy="78" rx="50" ry="6" fill={navy} opacity="0.12" />
      <path d="M10 76 Q60 82 110 76" stroke={navy} strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Camping-car (gauche) */}
      <g transform="translate(15, 58)">
        {/* Corps principal */}
        <rect x="0" y="4" width="34" height="16" rx="2" fill={navy} />
        {/* Cabine */}
        <rect x="26" y="0" width="12" height="20" rx="2" fill={navy} />
        {/* Fenêtres */}
        <rect x="4" y="7" width="8" height="6" rx="1" fill="white" opacity="0.6" />
        <rect x="14" y="7" width="8" height="6" rx="1" fill="white" opacity="0.6" />
        <rect x="28" y="3" width="8" height="7" rx="1" fill="white" opacity="0.6" />
        {/* Roues */}
        <circle cx="10" cy="22" r="4" fill="#2d3e5f" />
        <circle cx="10" cy="22" r="2" fill="white" />
        <circle cx="30" cy="22" r="4" fill="#2d3e5f" />
        <circle cx="30" cy="22" r="2" fill="white" />
      </g>

      {/* Van (droite, plus petit) */}
      <g transform="translate(68, 62)">
        {/* Corps */}
        <rect x="0" y="2" width="26" height="14" rx="2" fill={navy} opacity="0.85" />
        {/* Pare-brise */}
        <path d="M19 2 L26 8 L26 2 Z" fill={navy} opacity="0.6" />
        {/* Fenêtres */}
        <rect x="3" y="5" width="7" height="5" rx="1" fill="white" opacity="0.5" />
        <rect x="12" y="5" width="5" height="5" rx="1" fill="white" opacity="0.5" />
        {/* Roues */}
        <circle cx="7" cy="17" r="3.5" fill="#2d3e5f" />
        <circle cx="7" cy="17" r="1.8" fill="white" />
        <circle cx="21" cy="17" r="3.5" fill="#2d3e5f" />
        <circle cx="21" cy="17" r="1.8" fill="white" />
      </g>
    </svg>
  );

  // ——— FORMAT HORIZONTAL (Navbar desktop) ———
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <Icon size={52} />
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-extrabold tracking-tighter text-2xl text-brand-text"
            >
              CAP
            </span>
            <span
              className="font-extrabold tracking-tighter text-2xl ml-1.5 text-brand-accent"
            >
              AVENTURE
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-brand-muted">
              — Location de Camping-cars & Vans —
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ——— FORMAT COMPACT (Sidebar admin / navbar mobile) ———
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <Icon size={38} />
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span
              className="font-extrabold tracking-tight text-sm text-brand-text"
            >
              CAP
            </span>
            <span
              className="font-extrabold tracking-tight text-sm ml-1 text-brand-accent"
            >
              AVENTURE
            </span>
          </div>
          <span className="text-[8px] font-semibold tracking-wider uppercase mt-0.5 text-brand-muted">
            Location de Camping-cars & Vans
          </span>
        </div>
      </div>
    );
  }

  // ——— FORMAT ICÔNE SEULE (favicon-like, très compact) ———
  return (
    <div className={`select-none ${className}`}>
      <Icon size={40} />
    </div>
  );
}
