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
  ChevronLeft,
  Info,
  CheckCircle2,
  RefreshCw,
  Star,
  MessageSquare,
  Fuel,
  Cpu,
  Gauge,
  Workflow,
  X,
  Maximize2,
  Camera
} from 'lucide-react';
import { getVehicleBySlug } from '@/services/db';
import { Vehicle } from '@/types';
import DatePicker from '@/components/ui/DatePicker';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function VehicleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  // Galerie complète filtrée et enrichie
  const galleryImages = React.useMemo(() => {
    if (!vehicle) return [];
    
    const typeFallbacks: Record<string, string[]> = {
      van_amenege: ['/images/vehicles/van_1.png', '/images/vehicles/van_2.png', '/images/vehicles/van_3.png'],
      fourgon_amenege: ['/images/vehicles/fourgon_1.png', '/images/vehicles/fourgon_2.png', '/images/vehicles/fourgon_3.png'],
      camping_car_profile: ['/images/vehicles/profile_1.png', '/images/vehicles/living_interior.png', '/images/vehicles/bed_interior.png'],
      camping_car_integral: ['/images/vehicles/integral_1.png', '/images/vehicles/living_interior.png', '/images/vehicles/bed_interior.png'],
      capucine: ['/images/vehicles/capucine_1.png', '/images/vehicles/living_interior.png', '/images/vehicles/bed_interior.png'],
      caravane: ['/images/vehicles/adria_1.jpg', '/images/vehicles/adria_2.jpg', '/images/vehicles/adria_3.jpg']
    };

    const genericInteriors = [
      '/images/vehicles/living_interior.png',
      '/images/vehicles/bed_interior.png',
      '/images/vehicles/kitchen_interior.png'
    ];

    let imgs = (vehicle.images || []).filter(
      img => img && !img.includes('photo-1470071131384') && !img.includes('photo-1513311068348')
    );
    
    if (imgs.length === 0) {
      imgs = typeFallbacks[vehicle.type] || typeFallbacks.van_amenege;
    }

    const pool = [...(typeFallbacks[vehicle.type] || []), ...genericInteriors];
    for (const fallback of pool) {
      if (imgs.length >= 4) break;
      if (!imgs.includes(fallback)) {
        imgs.push(fallback);
      }
    }

    return imgs;
  }, [vehicle]);

  // Navigation au clavier dans la modale
  useEffect(() => {
    if (!isGalleryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryImages.length]);

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
    fourgon_amenege: 'Fourgon Aménagé',
    caravane: 'Caravane'
  };

  const imageCaptions = ['Vue extérieure', 'Espace Salon', 'Espace Nuit', 'Cuisine & Équipements'];

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

      {/* 2. Enhanced Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] rounded-3xl overflow-hidden shadow-md border border-brand-border bg-white relative group">
        {/* Large left photo */}
        <div 
          onClick={() => { setActiveImageIndex(0); setIsGalleryOpen(true); }}
          className="md:col-span-2 relative h-full bg-brand-navy/5 overflow-hidden cursor-pointer group/img"
        >
          <img 
            src={galleryImages[0]} 
            alt={vehicle.name}
            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-brand-navy/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-brand-gold" />
            <span>Vue principale</span>
          </div>
        </div>
        
        {/* Right side 3-image grid */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-3 h-full">
          {/* Top Left */}
          <div 
            onClick={() => { setActiveImageIndex(1); setIsGalleryOpen(true); }}
            className="relative bg-brand-navy/5 overflow-hidden cursor-pointer group/img"
          >
            <img 
              src={galleryImages[1] || galleryImages[0]} 
              alt="Salon"
              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-3 left-3 bg-brand-navy/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
              {imageCaptions[1]}
            </span>
          </div>
          {/* Top Right */}
          <div 
            onClick={() => { setActiveImageIndex(2); setIsGalleryOpen(true); }}
            className="relative bg-brand-hover overflow-hidden cursor-pointer group/img"
          >
            <img 
              src={galleryImages[2] || galleryImages[0]} 
              alt="Couchage"
              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-3 left-3 bg-brand-navy/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
              {imageCaptions[2]}
            </span>
          </div>
          {/* Bottom Left (spans 2 cols to fill) */}
          <div 
            onClick={() => { setActiveImageIndex(3); setIsGalleryOpen(true); }}
            className="relative bg-brand-hover overflow-hidden col-span-2 cursor-pointer group/img"
          >
            <img 
              src={galleryImages[3] || galleryImages[0]} 
              alt="Cuisine"
              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent flex items-end justify-between p-4">
              <span className="text-white text-xs font-semibold drop-shadow">
                {imageCaptions[3]}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(0); setIsGalleryOpen(true); }}
                className="px-4 py-2 bg-white/95 backdrop-blur-md text-brand-navy rounded-xl text-xs font-extrabold shadow-lg hover:bg-brand-gold hover:text-brand-navy transition-all flex items-center space-x-2 btn-transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Voir les {galleryImages.length} photos HD</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL FULLSCREEN */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-lg font-bold text-white">{vehicle.name}</h2>
              <p className="text-xs text-white/70">Photo {activeImageIndex + 1} sur {galleryImages.length} — {imageCaptions[activeImageIndex] || 'Intérieur'}</p>
            </div>
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main HD Image Display */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full">
            {/* Prev Button */}
            <button 
              onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-2 md:left-6 z-10 p-3 bg-black/40 hover:bg-brand-gold hover:text-brand-navy rounded-full text-white backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="w-full h-full max-h-[70vh] flex items-center justify-center p-2">
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={`${vehicle.name} photo ${activeImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scale-up"
              />
            </div>

            {/* Next Button */}
            <button 
              onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryImages.length)}
              className="absolute right-2 md:right-6 z-10 p-3 bg-black/40 hover:bg-brand-gold hover:text-brand-navy rounded-full text-white backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Bar */}
          <div className="flex justify-center space-x-3 overflow-x-auto py-2 max-w-4xl mx-auto w-full">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx ? 'border-brand-gold scale-105 ring-2 ring-brand-gold/50' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}


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

            <div className="space-y-4">
              <DatePicker
                label="Date de départ"
                required
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  if (endDate && val > endDate) {
                    setEndDate(val);
                  }
                }}
                minDate={new Date().toISOString().split('T')[0]}
              />

              <DatePicker
                label="Date de retour"
                required
                value={endDate}
                onChange={(val) => setEndDate(val)}
                minDate={startDate || new Date().toISOString().split('T')[0]}
              />
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
