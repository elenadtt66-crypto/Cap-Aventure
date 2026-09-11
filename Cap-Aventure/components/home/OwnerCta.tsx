'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Banknote, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function OwnerCta() {
  const [vehicleType, setVehicleType] = useState('van');
  const [weeks, setWeeks] = useState(4);

  const rates: Record<string, number> = {
    van: 650,        // 650€ / semaine
    fourgon: 850,    // 850€ / semaine
    profile: 1050,   // 1050€ / semaine
    integral: 1450,  // 1450€ / semaine
  };

  const estimatedEarnings = (rates[vehicleType] || 650) * weeks;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="bg-brand-navy rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border border-brand-accent/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="gold">Espace Propriétaires</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Rentabilisez votre véhicule lorsque vous ne l'utilisez pas
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Un van ou un camping-car reste immobilisé en moyenne 80% de l’année. Louez-le en toute sérénité à des profils vérifiés grâce à notre assurance tous risques dédiée.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/proprietaire">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Déposer une annonce gratuite
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column : Interactive Calculator */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-xl space-y-6">
            <div className="flex items-center space-x-2 text-brand-gold-light text-xs font-extrabold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-brand-accent" />
              <span>Simulateur de revenus annuels</span>
            </div>

            {/* Type selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/80">
                Type de véhicule :
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
              >
                <option value="van" className="text-brand-text">🚐 Van Aménagé</option>
                <option value="fourgon" className="text-brand-text">🚐 Fourgon Aménagé</option>
                <option value="profile" className="text-brand-text">🚍 Camping-car Profilé</option>
                <option value="integral" className="text-brand-text">🏰 Grand Intégral</option>
              </select>
            </div>

            {/* Slider Weeks */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/80">
                <span>Semaines louées par an :</span>
                <span className="text-brand-gold-light font-mono text-sm">{weeks} semaines</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
                className="w-full accent-brand-accent cursor-pointer"
              />
            </div>

            {/* Estimation Result */}
            <div className="p-4 bg-white/15 rounded-2xl border border-white/15 text-center space-y-1">
              <span className="text-[11px] text-white/70 block uppercase tracking-wider font-semibold">
                Gain brut potentiel estimé
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-brand-gold-light">
                {estimatedEarnings.toLocaleString('fr-FR')} € <span className="text-xs font-normal text-white/70">/ an</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
