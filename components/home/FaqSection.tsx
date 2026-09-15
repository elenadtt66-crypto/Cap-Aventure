'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quel permis de conduire faut-il pour louer un van ou un camping-car ?',
      a: 'Le simple permis B standard (voiture) est suffisant pour tous nos vans, fourgons et camping-cars jusqu’à 3,5 tonnes. Le conducteur principal doit avoir au moins 21 ans (ou 23 ans pour les intégraux) et 2 ans de permis minimum.'
    },
    {
      q: 'Comment fonctionne l’assurance multirisque pendant le séjour ?',
      a: 'Une assurance tous risques multirisque est automatiquement incluse pour chaque réservation. Elle couvre les dommages matériels, le vol, les bris de glace ainsi que l’assistance routière 24h/24 et 7j/7 partout en France et en Europe.'
    },
    {
      q: 'Combien de kilomètres sont inclus dans la location ?',
      a: 'Toutes nos locations incluent un forfait kilométrique de 200 km par jour (ex: 1 400 km pour 7 jours de location), ce qui est largement suffisant pour la majorité des roadtrips. Vous pouvez également souscrire à une option kilomètres illimités.'
    },
    {
      q: 'Peut-on voyager à l’étranger avec le véhicule ?',
      a: 'Oui, vous pouvez voyager dans plus de 30 pays d’Europe de l’Ouest et du Sud (Espagne, Portugal, Italie, Suisse, Allemagne, Belgique, Pays-Bas, etc.) sans supplément.'
    },
    {
      q: 'Comment se passe la prise en main du véhicule ?',
      a: 'Lors de la remise des clés, un état des lieux complet et une démonstration détaillée du fonctionnement (gaz, eau propre, électricité, chauffage, toit relevable) sont réalisés en environ 30 à 45 minutes.'
    }
  ];

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="gold">Foire Aux Questions</Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
          Questions fréquentes
        </h2>
        <p className="text-sm text-brand-muted">
          Tout ce que vous devez savoir avant de prendre la route.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-sm sm:text-base text-brand-text hover:text-brand-accent transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-muted flex-shrink-0 transition-transform duration-200 ml-4 ${
                    isOpen ? 'rotate-180 text-brand-accent' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-border/40 pt-4 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
