'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Compass, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Calendar,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Star,
  MessageSquare,
  Fuel,
  Cpu,
  Gauge,
  Workflow
} from 'lucide-react';
import { getVehicleBySlug } from '@/services/db';
import { Vehicle } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function VehicleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Widget réservation local states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    async function loadVehicle() {
      try {
        const data = await getVehicleBySlug(slug);
        setVehicle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();
  }, [slug]);

  // Calcul de la décomposition des prix
  const totalDays = React.useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff <= 0) return 0;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }, [startDate, endDate]);

  const priceBreakdown = React.useMemo(() => {
    if (!vehicle || totalDays <= 0) return { owner: 0, service: 0, insurance: 0, total: 0 };
    
    const grossTotal = totalDays * vehicle.pricePerDay;
    
    // Décomposition de type Yescapa :
    // - 75% rémunération propriétaire
    // - 15% frais de service plateforme
    // - 10% frais d'assurance tous risques
    const owner = Math.round(grossTotal * 0.75);
    const service = Math.round(grossTotal * 0.15);
    const insurance = Math.round(grossTotal * 0.10);
    const total = owner + service + insurance;
    
    return { owner, service, insurance, total };
  }, [vehicle, totalDays]);

  const handleBookingRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError('');

    if (!startDate || !endDate) {
      setDateError('Veuillez sélectionner vos dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setDateError('La date de retour doit être après le départ.');
      return;
    }

    router.push(
      `/reservation?vehicleId=${vehicle?.id}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-brand-muted">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
        <p>Chargement des détails du véhicule...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-error/10 text-brand-error rounded-full flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text">Véhicule introuvable</h2>
        <p className="text-brand-muted">
          Le véhicule que vous recherchez n'existe pas ou a été retiré de notre flotte.
        </p>
        <Link
          href="/vehicules"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold shadow-md hover:bg-brand-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  const vehicleTypeLabels: Record<string, string> = {
    van_amenege: 'Van Aménagé',
    camping_car_profile: 'Camping-car Profilé',
    camping_car_integral: 'Camping-car Intégral',
    fourgon_amenege: 'Fourgon Aménagé'
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
      {/* 1. Header Navigation & Title */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <Link 
            href="/vehicules"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-muted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>Tous les véhicules</span>
          </Link>
          <div className="text-xs text-brand-muted font-medium flex items-center space-x-2">
            <span>Catalogue</span>
            <ChevronRight className="w-3 h-3" />
            <span>{vehicleTypeLabels[vehicle.type]}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-text font-bold">{vehicle.name}</span>
          </div>
        </div>

        {/* Title, rating & location */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">{vehicle.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-brand-text">
            <span className="flex items-center text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full">
              {vehicleTypeLabels[vehicle.type]}
            </span>
            <span className="flex items-center text-brand-text">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B] mr-1" />
              {vehicle.rating}
              <span className="text-brand-muted font-semibold ml-1">({vehicle.reviewCount} avis)</span>
            </span>
            <span className="text-brand-muted flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-brand-accent" />
              Départ de {vehicle.location}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Airbnb/Yescapa style Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[400px] rounded-3xl overflow-hidden shadow-sm border border-brand-border group">
        {/* Large left photo */}
        <div className="md:col-span-2 relative h-full bg-brand-hover overflow-hidden">
          <img 
            src={vehicle.images[0]} 
            alt={vehicle.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </div>
        
        {/* Right side 3-image grid */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-3 h-full">
          {/* Top Left */}
          <div className="relative bg-brand-hover overflow-hidden">
            <img 
              src={vehicle.images[1] || vehicle.images[0]} 
              alt="Intérieur Salon"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          </div>
          {/* Top Right */}
          <div className="relative bg-brand-hover overflow-hidden">
            <img 
              src={vehicle.images[2] || vehicle.images[0]} 
              alt="Espace Nuit"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          </div>
          {/* Bottom Left (spans 2 cols to fill) */}
          <div className="relative bg-brand-hover overflow-hidden col-span-2">
            <img 
              src={vehicle.images[3] || vehicle.images[0]} 
              alt="Espace Cuisine"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors cursor-pointer flex items-end justify-end p-4">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-brand-text shadow-sm hover:scale-[1.02] transition-transform">
                Voir toutes les photos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main layout: Info column (2/3) & Booking column (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-6">
        
        {/* Info Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Owner details card */}
          <div className="flex items-center justify-between p-6 bg-white border border-brand-border rounded-2xl shadow-sm">
            <div className="flex items-center space-x-4">
              <img 
                src={vehicle.owner.avatar} 
                alt={vehicle.owner.name} 
                className="w-14 h-14 rounded-full object-cover border border-brand-border"
              />
              <div>
                <h3 className="font-extrabold text-brand-text text-sm">Proposé par {vehicle.owner.name}</h3>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Taux de réponse : <strong className="text-brand-accent">{vehicle.owner.responseRate}%</strong> • Répond {vehicle.owner.responseTime.toLowerCase()}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => alert(`Contacter ${vehicle.owner.name} : service de messagerie temporairement indisponible (démo).`)}
              className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer"
            >
              Envoyer un message
            </button>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-3 gap-4 bg-white border border-brand-border p-5 rounded-2xl shadow-sm text-center">
            <div className="space-y-1">
              <Users className="w-5 h-5 mx-auto text-brand-accent" />
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Places Route</p>
              <p className="text-sm font-extrabold text-brand-text font-mono">{vehicle.seats}</p>
            </div>
            <div className="space-y-1 border-x border-brand-border">
              <Compass className="w-5 h-5 mx-auto text-brand-accent" />
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Couchages</p>
              <p className="text-sm font-extrabold text-brand-text font-mono">{vehicle.beds}</p>
            </div>
            <div className="space-y-1">
              <Layers className="w-5 h-5 mx-auto text-brand-accent" />
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Gabarit</p>
              <p className="text-sm font-extrabold text-brand-text">
                {vehicle.type === 'van_amenege' ? 'Compact (< 2m)' : 'Grand gabarit'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-brand-text">Le mot de {vehicle.owner.name}</h2>
            <p className="text-sm text-brand-muted leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Technical porteur specs */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h2 className="text-xl font-extrabold text-brand-text">Fiche technique du porteur</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-brand-beige border border-brand-border rounded-xl flex items-center space-x-3 text-xs">
                <Fuel className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-brand-muted uppercase block font-bold">Carburant</span>
                  <span className="font-bold text-brand-text">{vehicle.techSpecs.fuel}</span>
                </div>
              </div>

              <div className="p-4 bg-brand-beige border border-brand-border rounded-xl flex items-center space-x-3 text-xs">
                <Workflow className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-brand-muted uppercase block font-bold">Boîte</span>
                  <span className="font-bold text-brand-text">{vehicle.techSpecs.transmission}</span>
                </div>
              </div>

              <div className="p-4 bg-brand-beige border border-brand-border rounded-xl flex items-center space-x-3 text-xs">
                <Gauge className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-brand-muted uppercase block font-bold">Consommation</span>
                  <span className="font-bold text-brand-text">{vehicle.techSpecs.consumption}</span>
                </div>
              </div>

              <div className="p-4 bg-brand-beige border border-brand-border rounded-xl flex items-center space-x-3 text-xs">
                <Cpu className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-brand-muted uppercase block font-bold">Puissance</span>
                  <span className="font-bold text-brand-text">{vehicle.techSpecs.enginePower}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment list */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h2 className="text-xl font-extrabold text-brand-text">Équipements et fonctionnalités</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vehicle.features.map((feat) => (
                <div 
                  key={feat}
                  className="flex items-center space-x-2.5 p-3.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-text"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews listing section */}
          <div className="space-y-6 pt-6 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-brand-text flex items-center">
                <MessageSquare className="w-5 h-5 text-brand-accent mr-2" />
                Avis voyageurs
              </h2>
              <span className="text-xs font-bold text-brand-muted">
                {vehicle.rating} / 5 ({vehicle.reviewCount} avis)
              </span>
            </div>

            {vehicle.reviews.length === 0 ? (
              <p className="text-xs text-brand-muted italic">Aucun commentaire de voyageur pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicle.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white border border-brand-border rounded-2xl space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-extrabold text-brand-text text-xs">{rev.author}</p>
                        <p className="text-[9px] text-brand-muted font-semibold">{new Date(rev.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex text-[#F59E0B]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking details widget */}
        <aside className="bg-white border border-brand-border p-6 rounded-3xl shadow-lg space-y-6 sticky top-28">
          <div>
            <div className="flex justify-between items-baseline">
              <span className="text-brand-muted text-xs font-extrabold uppercase tracking-wider">Tarif journalier</span>
              <div>
                <span className="text-3xl font-extrabold text-brand-text font-mono">{vehicle.pricePerDay}€</span>
                <span className="text-xs text-brand-muted"> / j</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleBookingRedirect} className="space-y-4 border-t border-brand-border pt-6">
            {dateError && (
              <div className="p-3 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-xl text-xs font-semibold">
                {dateError}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Date de départ
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Date de retour
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  required
                  min={startDate || new Date().toISOString().split('T')[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                />
              </div>
            </div>

            {/* Price breakdown details (Style Yescapa) */}
            {totalDays > 0 && (
              <div className="bg-brand-hover p-4 rounded-xl text-xs space-y-2 border border-brand-border animate-fade-in">
                <div className="flex justify-between font-semibold text-brand-muted text-[10px] uppercase tracking-wider pb-1.5 border-b border-brand-border/60">
                  <span>Détail du calcul ({totalDays} jours)</span>
                </div>
                
                <div className="flex justify-between pt-1">
                  <span className="text-brand-muted">Part Propriétaire (75%)</span>
                  <span className="font-bold text-brand-text font-mono">{priceBreakdown.owner}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Frais de service (15%)</span>
                  <span className="font-bold text-brand-text font-mono">{priceBreakdown.service}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Assurance & Assistance (10%)</span>
                  <span className="font-bold text-brand-text font-mono">{priceBreakdown.insurance}€</span>
                </div>
                
                <div className="flex justify-between border-t border-brand-border pt-2 text-sm font-extrabold">
                  <span className="text-brand-text">Total voyage</span>
                  <span className="text-brand-accent font-mono">{priceBreakdown.total}€</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded-xl font-bold shadow-md btn-transition cursor-pointer"
            >
              <span>Demande de réservation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guarantee info */}
          <div className="border-t border-brand-border pt-4 text-[10px] text-brand-muted leading-relaxed flex gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
            <span>
              <strong>Réservation sécurisée.</strong> Zéro débit avant la validation et signature numérique du propriétaire.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
