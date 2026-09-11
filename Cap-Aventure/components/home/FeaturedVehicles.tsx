'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { getVehicles } from '@/services/db';
import { Vehicle } from '@/types';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tabs = [
    { id: 'ALL', label: 'Tous les modèles' },
    { id: 'van_amenege', label: '🚐 Vans' },
    { id: 'fourgon_amenege', label: '🚐 Fourgons' },
    { id: 'camping_car_profile', label: '🚍 Profilés' },
    { id: 'camping_car_integral', label: '🏰 Intégraux' },
  ];

  const filtered = selectedType === 'ALL' 
    ? vehicles.slice(0, 6) 
    : vehicles.filter(v => v.type === selectedType).slice(0, 6);

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'van_amenege': return { label: 'Van Aménagé', variant: 'gold' as const };
      case 'fourgon_amenege': return { label: 'Fourgon Aménagé', variant: 'warning' as const };
      case 'camping_car_profile': return { label: 'Camping-car Profilé', variant: 'navy' as const };
      case 'camping_car_integral': return { label: 'Grand Intégral', variant: 'success' as const };
      default: return { label: 'Véhicule', variant: 'neutral' as const };
    }
  };

  return (
    <section className="py-20 px-6 bg-brand-hover/50 border-y border-brand-border">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="navy">Sélection Coup de Cœur</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
              Véhicules vérifiés & disponibles
            </h2>
            <p className="text-sm text-brand-muted max-w-xl">
              Chaque véhicule fait l'objet d'un contrôle rigoureux avant chaque départ : propreté, sécurité mécanique et inventaire complet.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-brand-border shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-brand-text/70 hover:text-brand-text hover:bg-brand-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((veh) => {
              const cat = getCategoryLabel(veh.type);
              return (
                <div
                  key={veh.id}
                  className="group bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm hover-lift flex flex-col justify-between transition-all duration-300"
                >
                  {/* Photo & Highlights */}
                  <div className="relative h-56 overflow-hidden bg-brand-hover">
                    <img
                      src={veh.images[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'}
                      alt={veh.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <Badge variant={cat.variant} size="sm">
                        {cat.label}
                      </Badge>
                    </div>

                    <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-extrabold text-brand-navy border border-brand-border/40 font-mono shadow-sm">
                      {veh.pricePerDay} € <span className="text-[10px] font-normal text-brand-muted">/j</span>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 bg-brand-navy/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-white flex items-center space-x-1.5 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
                      <span>{veh.rating.toFixed(2)}</span>
                      <span className="text-white/60">({veh.reviewCount} avis)</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-brand-text group-hover:text-brand-accent transition-colors leading-snug line-clamp-1">
                        {veh.name}
                      </h3>

                      <div className="flex items-center text-xs text-brand-muted space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                        <span className="truncate">{veh.location}</span>
                      </div>

                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed pt-1">
                        {veh.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-brand-text">
                        <div className="flex items-center space-x-2 p-2 bg-brand-beige rounded-xl">
                          <Users className="w-3.5 h-3.5 text-brand-muted" />
                          <span className="font-semibold text-[11px]">{veh.seats} places route</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-brand-beige rounded-xl">
                          <Bed className="w-3.5 h-3.5 text-brand-muted" />
                          <span className="font-semibold text-[11px]">{veh.beds} couchages</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-brand-border">
                      <Link
                        href={`/vehicules?type=${veh.type}`}
                        className="flex-1 text-center py-2.5 px-4 bg-brand-beige hover:bg-brand-border text-brand-text rounded-xl text-xs font-bold transition-colors"
                      >
                        Détails
                      </Link>
                      <Link
                        href={`/reservation?vehicle=${veh.slug || veh.id}`}
                        className="flex-1 text-center py-2.5 px-4 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm btn-transition"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global CTA */}
        <div className="text-center pt-6">
          <Link href="/vehicules">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Voir l'ensemble de la flotte ({vehicles.length} véhicules)
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
