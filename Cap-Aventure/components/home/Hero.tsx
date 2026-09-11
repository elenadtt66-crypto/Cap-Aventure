'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, MapPin, Calendar, Search, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (type) params.set('type', type);
    router.push(`/vehicules?${params.toString()}`);
  };

  const quickCities = ['Bordeaux', 'Biarritz', 'Nantes', 'Lyon', 'Marseille', 'Paris'];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center text-white overflow-hidden pt-24 pb-16">
      {/* Background Image with Cinematic Zoom & Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=2000&q=85')` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/70 to-brand-navy/35" />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
        {/* Badge réassurance */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/10 text-white text-xs font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
          <span>Location de vans & camping-cars entre passionnés</span>
        </div>

        {/* Titre Principal Hero */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
          Explorez la route en toute <br className="hidden sm:inline" />
          <span className="text-brand-accent drop-shadow-sm">liberté & sérénité</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 font-normal leading-relaxed">
          Flotte certifiée de vans aménagés, fourgons compacts et camping-cars de luxe. 
          Assurance tous risques incluse et assistance 24/7.
        </p>

        {/* Barre de Recherche Interactive */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl sm:rounded-full shadow-2xl border border-white/30 text-brand-text text-left">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            {/* Ville */}
            <div className="flex items-center space-x-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-brand-border/60">
              <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Départ
                </label>
                <input
                  type="text"
                  placeholder="Bordeaux, Lyon..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none placeholder:text-brand-muted/70"
                />
              </div>
            </div>

            {/* Date début */}
            <div className="flex items-center space-x-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-brand-border/60">
              <Calendar className="w-5 h-5 text-brand-accent flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Date de départ
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-brand-text focus:outline-none"
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center space-x-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-brand-border/60">
              <Compass className="w-5 h-5 text-brand-accent flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Catégorie
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-brand-text focus:outline-none cursor-pointer"
                >
                  <option value="">Tous les véhicules</option>
                  <option value="van_amenege">Van Aménagé</option>
                  <option value="fourgon_amenege">Fourgon Aménagé</option>
                  <option value="camping_car_profile">Camping-car Profilé</option>
                  <option value="camping_car_integral">Grand Intégral</option>
                </select>
              </div>
            </div>

            {/* CTA Bouton */}
            <div className="px-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-full"
                leftIcon={<Search className="w-4 h-4" />}
              >
                Rechercher
              </Button>
            </div>
          </form>
        </div>

        {/* Villes Rapides */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-white/80">
          <span className="font-semibold text-white/60">Départs populaires :</span>
          {quickCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => router.push(`/vehicules?location=${city}`)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-full text-white font-medium transition-all duration-200 cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
