'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Shield, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function CategorySection() {
  const categories = [
    {
      type: 'van_amenege',
      name: 'Vans Aménagés',
      subtitle: 'Agile, compact & passe-partout',
      priceRange: 'Dès 75€ / jour',
      desc: 'Hauteur < 2m pour les parkings et plages. Idéal pour les couples et baroudeurs en quête de spontanéité.',
      features: ['Toit relevable', 'Cuisine intégrée', 'Gabarit compact < 2m'],
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
      badge: 'Bestseller Évasion',
      badgeVariant: 'gold' as const,
    },
    {
      type: 'fourgon_amenege',
      name: 'Fourgons Aménagés',
      subtitle: 'Confort sanitaire & discrétion',
      priceRange: 'Dès 105€ / jour',
      desc: 'Le compromis parfait : vraie douche et WC intérieurs, soute sportive pour vélos et isolation 4 saisons.',
      features: ['Vraie douche & WC', 'Grande soute garage', 'Isolation 4 saisons'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      badge: 'Confort & Sport',
      badgeVariant: 'warning' as const,
    },
    {
      type: 'camping_car_profile',
      name: 'Camping-cars Profilés',
      subtitle: 'Espace & grand confort familial',
      priceRange: 'Dès 135€ / jour',
      desc: 'Idéal pour les familles : salon face-face XXL, grand lit pavillon électrique, cuisine de chef et dressing.',
      features: ['Salon XXL SmartLounge', 'Lit central ou pavillon', 'Grand réfrigérateur 167L'],
      image: 'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?auto=format&fit=crop&w=800&q=80',
      badge: 'Idéal Familles',
      badgeVariant: 'navy' as const,
    },
    {
      type: 'camping_car_integral',
      name: 'Grands Intégraux',
      subtitle: 'Palace roulant & prestige',
      priceRange: 'Dès 175€ / jour',
      desc: 'L’expérience 5 étoiles sur la route : pare-brise panoramique, chauffage central Alde et finitions de luxe.',
      features: ['Chauffage central Alde', 'Vision panoramique', 'Châssis double plancher'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      badge: 'Prestige 5 Étoiles',
      badgeVariant: 'success' as const,
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <Badge variant="gold">Une flotte adaptée à chaque projet</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
          Choisissez votre style de voyage
        </h2>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
          Chaque catégorie de véhicule propose un niveau d'équipement et un tarif adapté pour vous offrir le meilleur rapport confort/liberté.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={`/vehicules?type=${cat.type}`}
            className="group bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm hover-lift flex flex-col justify-between transition-all duration-300"
          >
            {/* Image & Badge */}
            <div className="relative h-52 overflow-hidden bg-brand-hover">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute top-3.5 left-3.5">
                <Badge variant={cat.badgeVariant} size="sm">
                  {cat.badge}
                </Badge>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-end text-white">
                <div>
                  <span className="text-xs font-semibold text-white/80 block">Tarif estimé</span>
                  <span className="text-base font-extrabold font-mono text-brand-gold-light">
                    {cat.priceRange}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-brand-text group-hover:text-brand-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs font-bold text-brand-accent">
                  {cat.subtitle}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {cat.desc}
                </p>

                <div className="pt-3 space-y-1.5 border-t border-brand-border/60">
                  {cat.features.map((feat) => (
                    <div key={feat} className="flex items-center space-x-2 text-[11px] text-brand-text">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-success flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-text group-hover:text-brand-accent">
                <span>Découvrir les modèles</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
