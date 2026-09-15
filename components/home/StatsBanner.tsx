'use client';

import React from 'react';
import { Award, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';
import Counter from '@/components/ui/Counter';

export default function StatsBanner() {
  const stats = [
    {
      icon: <Compass className="w-7 h-7 text-brand-accent" />,
      end: 1450,
      suffix: '+',
      label: 'Roadtrips réalisés',
      sub: 'En France & en Europe'
    },
    {
      icon: <Award className="w-7 h-7 text-brand-accent" />,
      end: 99.4,
      decimals: 1,
      suffix: '%',
      label: 'Voyageurs satisfaits',
      sub: 'Note moyenne de 4.9/5'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-brand-accent" />,
      end: 100,
      suffix: '%',
      label: 'Assurance tous risques',
      sub: 'Assistance 24h/24 incluse'
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-brand-accent" />,
      end: 24,
      suffix: 'h/7',
      label: 'Support dédié',
      sub: 'Accompagnement personnalisé'
    }
  ];

  return (
    <section className="py-16 px-6 bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((item, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover-lift"
          >
            <div className="p-3 bg-white/10 rounded-2xl mb-4">
              {item.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-gold-light tracking-tight mb-1">
              <Counter
                end={item.end}
                decimals={item.decimals || 0}
                suffix={item.suffix}
              />
            </div>
            <p className="text-sm font-bold text-white mb-0.5">
              {item.label}
            </p>
            <span className="text-xs text-white/60">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
