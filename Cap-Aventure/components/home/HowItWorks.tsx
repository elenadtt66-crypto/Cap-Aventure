'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, Key, Car, Banknote, CalendarCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');

  const renterSteps = [
    {
      step: '01',
      icon: <Search className="w-6 h-6 text-brand-accent" />,
      title: 'Trouvez le véhicule idéal',
      desc: 'Parcourez notre catalogue filtrable selon votre destination, vos dates, le type de véhicule et vos options de couchage.'
    },
    {
      step: '02',
      icon: <ShieldCheck className="w-6 h-6 text-brand-accent" />,
      title: 'Réservez en toute sécurité',
      desc: 'Paiement sécurisé en ligne, validation instantanée et assurance tous risques multirisque incluse dans votre tarif.'
    },
    {
      step: '03',
      icon: <Key className="w-6 h-6 text-brand-accent" />,
      title: 'Prenez les clés & partez',
      desc: 'État des lieux numérique rapide avec le propriétaire ou notre agence, remise des clés et départ immédiat pour l’aventure.'
    }
  ];

  const ownerSteps = [
    {
      step: '01',
      icon: <Car className="w-6 h-6 text-brand-accent" />,
      title: 'Déposez votre annonce',
      desc: 'En 5 minutes, publiez les photos et caractéristiques de votre van ou camping-car. Vous fixez librement vos tarifs et vos disponibilités.'
    },
    {
      step: '02',
      icon: <CalendarCheck className="w-6 h-6 text-brand-accent" />,
      title: 'Acceptez les demandes',
      desc: 'Consultez les profils vérifiés des locataires (permis de conduire certifié, pièce d’identité) et acceptez les demandes qui vous conviennent.'
    },
    {
      step: '03',
      icon: <Banknote className="w-6 h-6 text-brand-accent" />,
      title: 'Rentabilisez votre véhicule',
      desc: 'Recevez vos revenus directement par virement bancaire 48h après le départ, avec une couverture d’assurance complète pendant la location.'
    }
  ];

  const steps = activeTab === 'renter' ? renterSteps : ownerSteps;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <Badge variant="gold">Simple, Transparent & Garanti</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
          Comment fonctionne Cap Aventure ?
        </h2>
        <p className="text-sm sm:text-base text-brand-muted">
          Que vous partiez sur les routes ou que vous souhaitiez rentabiliser votre véhicule, notre processus est 100% encadré.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 bg-brand-beige border border-brand-border rounded-2xl shadow-inner mt-4">
          <button
            onClick={() => setActiveTab('renter')}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'renter'
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-brand-text/70 hover:text-brand-text'
            }`}
          >
            Je souhaite louer un véhicule
          </button>
          <button
            onClick={() => setActiveTab('owner')}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'owner'
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-brand-text/70 hover:text-brand-text'
            }`}
          >
            Je suis propriétaire
          </button>
        </div>
      </div>

      {/* 3-Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm hover-lift flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-6 right-6 text-4xl font-black font-mono text-brand-border/80 group-hover:text-brand-accent/20 transition-colors">
              {item.step}
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-brand-gold-light text-brand-accent rounded-2xl w-fit">
                {item.icon}
              </div>
              <h3 className="text-lg font-extrabold text-brand-text tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center pt-12">
        {activeTab === 'renter' ? (
          <Link href="/vehicules">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Trouver un van ou camping-car
            </Button>
          </Link>
        ) : (
          <Link href="/proprietaire">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Estimer mes revenus de propriétaire
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
