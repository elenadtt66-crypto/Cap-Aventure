'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Users,
  Flame,
  Award,
  HeartHandshake,
  CheckCircle2,
  Check
} from 'lucide-react';
import { getVehicles, MOCK_VEHICLES } from '@/services/db';
import { Vehicle } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // États de recherche de type Yescapa
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Comment ça marche - tab state
  const [howItWorksTab, setHowItWorksTab] = useState<'renter' | 'owner'>('renter');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVehicles();
        setVehicles(data.slice(0, 3)); // 3 vedettes
      } catch (err) {
        console.error(err);
        setVehicles(MOCK_VEHICLES.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let queryStr = '?';
    if (searchLocation) queryStr += `location=${encodeURIComponent(searchLocation)}&`;
    if (startDate) queryStr += `startDate=${startDate}&`;
    if (endDate) queryStr += `endDate=${endDate}&`;
    router.push(`/vehicules${queryStr.slice(0, -1)}`);
  };

  const categories = [
    {
      type: 'van_amenege',
      name: 'camping-car',
      subtitle: 'Agile et aventureux',
      desc: "Petit, facile à manœuvrer et plein de charme, le camping-car est idéal pour les voyageurs en quête d'aventures spontanées en pleine nature ou en ville.",
      cta: 'Louez un camping-car',
      bgColor: 'bg-pink-100/60',
      illustration: 'poptop'
    },
    {
      type: 'camping_car_integral',
      name: 'grand camping-car',
      subtitle: 'Spacieux et polyvalent',
      desc: "Idéal pour les couples ou les courts séjours en famille, ce grand camping-car offre un espace pratique et la liberté d'explorer facilement tous les endroits.",
      cta: 'Louez un grand camping-car',
      bgColor: 'bg-blue-100/60',
      illustration: 'grand'
    },
    {
      type: 'fourgon_amenege',
      name: 'camping-car discret',
      subtitle: 'Élégant et bien équipé',
      desc: "Compact mais entièrement équipé, le design élégant et discret de ce camping-car permet d'économiser du carburant, de s'adapter aux rues de la ville et de vous garantir des aventures sans tracas.",
      cta: 'Louez un camping-car discret',
      bgColor: 'bg-yellow-100/60',
      illustration: 'discreet'
    },
    {
      type: 'camping_car_profile',
      name: 'camping-car profilé',
      subtitle: 'Spacieux et idéal pour voyager',
      desc: "Idéal pour les familles ou les groupes plus importants, ce camping-car profilé est spacieux et confortable, faisant des voyages en voiture un véritable plaisir pour les adultes comme pour les enfants.",
      cta: 'Louez un camping-car profilé',
      bgColor: 'bg-pink-100/60',
      illustration: 'profile'
    }
  ];

  return (
    <main className="flex-1 flex flex-col">
      {/* 1. Hero Section avec barre de recherche en pilule Yescapa */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-text/95 via-brand-text/65 to-brand-text/30" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 text-brand-secondary text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Louez votre liberté en toute confiance</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Location de vans et <br className="hidden md:inline" />
            <span className="text-brand-accent">camping-cars premium</span>
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto font-medium">
            Explorez les routes d'Europe avec la plus grande flotte de véhicules tout équipés.
          </p>

          {/* Barre de recherche style Yescapa (pill form) */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur border border-brand-border/30 p-2 rounded-2xl md:rounded-full shadow-2xl text-brand-text max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-left"
          >
            {/* Localisation */}
            <div className="px-5 py-2.5 border-b md:border-b-0 md:border-r border-brand-border/60">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-brand-accent" />
                Départ
              </label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none focus:ring-0 border-none p-0 cursor-pointer"
              >
                <option value="">Où voulez-vous partir ?</option>
                <option value="Bordeaux">Bordeaux (Aquitaine)</option>
                <option value="Paris">Paris (Île-de-France)</option>
                <option value="Lyon">Lyon (Rhône-Alpes)</option>
                <option value="Toulouse">Toulouse (Midi-Pyrénées)</option>
              </select>
            </div>

            {/* Date début */}
            <div className="px-5 py-2.5 border-b md:border-b-0 md:border-r border-brand-border/60">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-brand-accent" />
                Début location
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none border-none p-0 cursor-pointer"
              />
            </div>

            {/* Date fin */}
            <div className="px-5 py-2.5">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-brand-accent" />
                Fin location
              </label>
              <input
                type="date"
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-brand-text focus:outline-none border-none p-0 cursor-pointer"
              />
            </div>

            {/* Bouton recherche */}
            <div className="p-1.5">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl md:rounded-full font-bold shadow-md btn-transition cursor-pointer"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Cartes Promo & Avis (Yescapa Style) */}
      <section className="py-16 bg-[#FAFBF9] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte 1 */}
          <Link 
            href="/vehicules"
            className="bg-white border border-brand-border rounded-[2rem] overflow-hidden hover-lift shadow-sm flex flex-col justify-between h-full group cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Offres exceptionnelles" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-white fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-brand-text leading-tight group-hover:text-brand-accent transition-colors duration-250">
                  Des offres exceptionnelles toute l'année
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Le camping-car est le meilleur moyen de voyager{' '}
                  <span className="font-bold bg-[#FEF08A] px-1.5 py-0.5 rounded text-brand-text">
                    sans se ruiner !
                  </span>
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center space-x-1 px-6 py-3 bg-[#FEFCF3] group-hover:bg-[#FEF8E8] text-[#C9A035] rounded-full text-xs font-bold transition-all duration-200">
                  <span>Toutes les meilleures offres</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Carte 2 */}
          <Link 
            href="/avis"
            className="bg-white border border-brand-border rounded-[2rem] overflow-hidden hover-lift shadow-sm flex flex-col justify-between h-full group cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Avis Cap Aventure" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-white fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-brand-text leading-tight group-hover:text-brand-accent transition-colors duration-250">
                  Avis sur Cap Aventure, une histoire sans fin
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                    <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                  </div>
                  <span className="text-base font-extrabold text-brand-text">4,9/5</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-brand-muted">
                    Voici comment nos utilisateurs évaluent Cap Aventure !
                  </p>
                  <p className="text-[10px] text-brand-muted/70">
                    Note de 4,9 sur 5 basée sur 387 831 avis
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center space-x-1 px-6 py-3 bg-[#EFF6FF] group-hover:bg-[#DBEAFE] text-[#2563EB] rounded-full text-xs font-bold transition-all duration-200">
                  <span>Consulter tous les avis</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Carte 3 */}
          <Link 
            href="/proprietaire"
            className="bg-brand-accent border border-brand-accent/50 rounded-[2rem] overflow-hidden hover-lift shadow-lg flex flex-col justify-between h-full text-white group cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-brand-hover">
              <img 
                src="https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Propriétaire Cap Aventure" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <svg 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 left-0 w-full h-8 text-brand-accent fill-current translate-y-[1px]"
              >
                <path d="M0 12 C 30 0, 70 0, 100 12 Z" />
              </svg>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  Êtes-vous propriétaire ?
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  Louez votre véhicule et tirez-en le meilleur parti en toute confiance.
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center space-x-1 px-6 py-3 bg-[#C9A035] group-hover:bg-[#A8832A] text-white rounded-full text-xs font-bold transition-all duration-200 shadow-md">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Catégories Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="space-y-3 flex flex-col items-center">
            <span className="text-[#C9A035] font-extrabold text-xs uppercase tracking-widest block text-center">
              CHOISISSEZ LE BON VÉHICULE
            </span>
            <div className="h-1.5 w-16 bg-[#C9A035] rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
            Vous recherchez un camping-car ou un fourgon aménagé ?
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto">
            Les meilleurs road trips commencent par les bonnes questions. Pour la location d'un camping-car ou d'un fourgon aménagé, chaque projet de voyage a son véhicule. Nous vous aiderons à choisir celui qui vous convient le mieux, pour que votre voyage commence du bon pied.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.type}
              className="group flex flex-col bg-white border border-brand-border rounded-[2rem] p-6 justify-between h-full hover-lift shadow-sm transition-all duration-300"
            >
              {/* Image / Illustration Container */}
              <div className="relative h-44 flex items-center justify-center overflow-visible mb-6">
                {/* Background Decor Card */}
                <div className={`w-28 h-28 ${cat.bgColor} rounded-[2rem] absolute transition-transform duration-300 group-hover:scale-105`} />
                
                {/* Inline SVG Illustrations */}
                {cat.illustration === 'poptop' && (
                  <svg viewBox="0 0 240 140" className="w-52 h-32 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:scale-105">
                    <defs>
                      <linearGradient id="bodyGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" />
                        <stop offset="100%" stopColor="#0D9488" />
                      </linearGradient>
                      <linearGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7DD3FC" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                      <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                      <linearGradient id="canvasGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#F472B6" />
                        <stop offset="100%" stopColor="#FEF8E8" />
                      </linearGradient>
                    </defs>
                    <path d="M 52 46 L 148 20 L 140 46 Z" fill="url(#canvasGrad)" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="140" y1="22" x2="132" y2="46" stroke="#C9A035" strokeWidth="1.5" opacity="0.6" />
                    <line x1="96" y1="33" x2="90" y2="46" stroke="#C9A035" strokeWidth="1.5" opacity="0.6" />
                    <path d="M 48 46 L 154 18 L 152 23 L 50 46 Z" fill="url(#roofGrad)" stroke="#1E293B" strokeWidth="1.5" />
                    <line x1="50" y1="46" x2="162" y2="46" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 36 94 L 36 50 C 36 48, 38 46, 42 46 L 180 46 C 190 46, 196 52, 198 62 L 202 84 C 203 88, 201 94, 195 94 Z" fill="url(#bodyGrad1)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 36 76 L 36 94 L 195 94 C 197 94, 198 92, 199 90 L 201 80 L 190 76 Z" fill="#F8FAFC" opacity="0.9" stroke="#1E293B" strokeWidth="2" />
                    <rect x="198" y="68" width="4" height="12" rx="1" fill="#1E293B" />
                    <path d="M 197 62 L 202 62 L 201 68 L 196 68 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M 186 94 L 204 94 C 206 94, 208 96, 206 98 L 202 102 L 186 102 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 32 94 L 40 94 L 40 102 L 34 102 C 32 102, 31 100, 32 98 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <rect x="48" y="52" width="40" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <rect x="96" y="52" width="42" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 146 52 L 180 52 C 185 52, 188 56, 189 60 L 191 70 L 146 70 Z" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="56" y1="55" x2="68" y2="67" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="104" y1="55" x2="116" y2="67" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="154" y1="55" x2="166" y2="67" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <path d="M 92 46 L 92 94" stroke="#1E293B" strokeWidth="1.5" opacity="0.5" />
                    <path d="M 142 46 L 142 94" stroke="#1E293B" strokeWidth="1.5" opacity="0.5" />
                    <rect x="146" y="74" width="8" height="3" rx="1" fill="#334155" stroke="#1E293B" strokeWidth="1" />
                    <circle cx="70" cy="94" r="18" fill="#1E293B" />
                    <circle cx="70" cy="94" r="12" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="70" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="18" fill="#1E293B" />
                    <circle cx="158" cy="94" r="12" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'grand' && (
                  <svg viewBox="0 0 240 140" className="w-52 h-32 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:scale-105">
                    <defs>
                      <linearGradient id="bodyGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="stripeGrad2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <path d="M 22 60 L 36 60 M 22 74 L 36 74 M 24 54 L 24 80" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 18 56 Q 18 50, 24 50 Q 30 50, 30 56 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="24" cy="60" r="4" stroke="#1E293B" strokeWidth="1.5" fill="#E2E8F0" />
                    <circle cx="24" cy="74" r="4" stroke="#1E293B" strokeWidth="1.5" fill="#E2E8F0" />
                    <path d="M 36 94 L 36 44 C 36 42, 38 40, 42 40 L 182 40 C 190 40, 196 46, 198 56 L 202 84 C 203 88, 201 94, 195 94 Z" fill="url(#bodyGrad2)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 42 40 C 42 34, 48 30, 56 30 L 168 30 C 174 30, 178 34, 178 40 Z" fill="url(#bodyGrad2)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="56" y1="36" x2="164" y2="36" stroke="#334155" strokeWidth="1.5" />
                    <path d="M 36 78 Q 80 66, 120 78 T 198 72 L 199 78 Q 140 84, 36 84 Z" fill="url(#stripeGrad2)" stroke="#1E293B" strokeWidth="1.5" opacity="0.85" />
                    <path d="M 197 62 L 202 62 L 201 68 L 196 68 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M 186 94 L 204 94 C 206 94, 208 96, 206 98 L 202 102 L 186 102 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 32 94 L 40 94 L 40 102 L 34 102 C 32 102, 31 100, 32 98 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <rect x="48" y="46" width="54" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <rect x="110" y="46" width="38" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 156 46 L 182 46 C 187 46, 190 50, 191 54 L 193 64 L 156 64 Z" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="56" y1="49" x2="72" y2="61" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="116" y1="49" x2="128" y2="61" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="162" y1="49" x2="174" y2="61" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <circle cx="70" cy="94" r="18" fill="#1E293B" />
                    <circle cx="70" cy="94" r="12" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="70" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="18" fill="#1E293B" />
                    <circle cx="158" cy="94" r="12" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'discreet' && (
                  <svg viewBox="0 0 240 140" className="w-52 h-32 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:scale-105">
                    <defs>
                      <linearGradient id="bodyGrad3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </linearGradient>
                      <linearGradient id="stripeGrad3" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <rect x="74" y="27" width="28" height="6" rx="2" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
                    <rect x="112" y="29" width="34" height="4" rx="1" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M 36 94 L 36 40 C 36 38, 38 36, 42 36 L 180 36 C 188 36, 194 41, 196 50 L 202 84 C 203 88, 201 94, 195 94 Z" fill="url(#bodyGrad3)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 42 36 L 176 36 L 174 32 C 174 32, 172 30, 166 30 L 52 30 C 46 30, 42 32, 42 32 Z" fill="url(#bodyGrad3)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 36 78 Q 70 70, 110 82 T 184 76 L 184 80 Q 140 86, 36 84 Z" fill="url(#stripeGrad3)" opacity="0.8" stroke="#1E293B" strokeWidth="1" />
                    <path d="M 197 62 L 202 62 L 201 68 L 196 68 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M 36 84 L 52 84 C 58 84, 62 82, 64 78 L 74 78 C 76 82, 80 84, 86 84 L 142 84 C 148 84, 152 82, 154 78 L 164 78 C 166 82, 170 84, 176 84 L 196 84 C 198 84, 200 86, 201 88 L 202 94 L 36 94 Z" fill="#334155" opacity="0.2" />
                    <path d="M 186 94 L 204 94 C 206 94, 208 96, 206 98 L 202 102 L 186 102 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 32 94 L 40 94 L 40 102 L 34 102 C 32 102, 31 100, 32 98 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <rect x="48" y="44" width="46" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <rect x="102" y="44" width="42" height="18" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 152 44 L 180 44 C 184 44, 187 48, 188 52 L 190 62 L 152 62 Z" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="56" y1="47" x2="72" y2="59" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="110" y1="47" x2="122" y2="59" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <circle cx="70" cy="94" r="18" fill="#1E293B" />
                    <circle cx="70" cy="94" r="12" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="70" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="18" fill="#1E293B" />
                    <circle cx="158" cy="94" r="12" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="158" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
                {cat.illustration === 'profile' && (
                  <svg viewBox="0 0 240 140" className="w-52 h-32 z-10 drop-shadow-md select-none pointer-events-none transition-transform duration-300 group-hover:scale-105">
                    <defs>
                      <linearGradient id="bodyGrad4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#F1F5F9" />
                      </linearGradient>
                      <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </linearGradient>
                      <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                    </defs>
                    <path d="M 76 36 C 76 36, 82 28, 96 28 L 164 28 C 172 28, 180 34, 184 42 L 194 66 L 160 66 Z" fill="url(#cabGrad)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="96" y1="34" x2="164" y2="34" stroke="#CBD5E1" strokeWidth="1.5" />
                    <path d="M 32 94 L 32 36 C 32 34, 34 32, 38 32 L 164 32 L 164 94 Z" fill="url(#bodyGrad4)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 164 94 L 164 56 L 184 56 C 188 56, 192 60, 194 66 L 199 82 C 201 86, 199 94, 193 94 Z" fill="url(#cabGrad)" stroke="#1E293B" strokeWidth="2" />
                    <rect x="44" y="42" width="56" height="20" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <rect x="110" y="42" width="44" height="20" rx="4" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <path d="M 168 58 L 184 58 C 187 58, 189 60, 190 63 L 192 72 L 168 72 Z" fill="url(#windowGrad)" stroke="#1E293B" strokeWidth="2" />
                    <line x1="52" y1="45" x2="68" y2="57" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line x1="118" y1="45" x2="130" y2="57" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <path d="M 34 78 Q 80 62, 120 78 T 164 72 L 164 78 Q 120 84, 34 84 Z" fill="url(#waveGrad)" stroke="#1E293B" strokeWidth="1.2" opacity="0.9" />
                    <circle cx="68" cy="94" r="18" fill="#1E293B" />
                    <circle cx="68" cy="94" r="12" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="68" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="152" cy="94" r="18" fill="#1E293B" />
                    <circle cx="152" cy="94" r="12" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="152" cy="94" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                  </svg>
                )}
              </div>

              {/* Text Area */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-extrabold text-brand-text text-lg group-hover:text-brand-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-brand-accent font-bold tracking-wide uppercase">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                  <Link 
                    href={`/vehicules?type=${cat.type}`}
                    className="text-xs font-extrabold text-[#C9A035] hover:text-[#A8832A] hover:underline transition-colors duration-200"
                  >
                    {cat.cta}
                  </Link>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A035] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Destinations Section (France & Belgique) */}
      <section className="py-24 bg-white border-b border-brand-border px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="space-y-2">
              <span className="text-[#C9A035] font-extrabold text-xs uppercase tracking-widest block">
                Nos destinations
              </span>
              <div className="h-1 w-12 bg-[#C9A035] rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight">
              En camping-car, tout est possible
            </h2>
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-2xl">
              Prendre la route n'a jamais été aussi simple. Louez un camping-car en France ou en Belgique, et évadez-vous vers les plus beaux paysages d'Europe. Pour quelques jours ou plusieurs semaines, à vous de choisir.
            </p>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[160px]">
            {/* Card 1: Bruges */}
            <button 
              onClick={() => router.push('/vehicules?location=Bruges')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Bruges"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇧🇪
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">Belgique</p>
                  <p className="text-sm font-extrabold">Bruges</p>
                </div>
              </div>
            </button>

            {/* Card 2: Mont Blanc */}
            <button 
              onClick={() => router.push('/vehicules?location=Chamonix')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Mont Blanc"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇫🇷
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">France</p>
                  <p className="text-sm font-extrabold">Mont Blanc</p>
                </div>
              </div>
            </button>

            {/* Card 3: Dinant (Tall Portrait) */}
            <button 
              onClick={() => router.push('/vehicules?location=Dinant')}
              className="md:col-span-1 md:row-span-2 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1470071131384-001b85755b36?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80" 
                alt="Dinant"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <span className="absolute top-4 right-4 bg-[#C9A035] text-white px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">Nouveau</span>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇧🇪
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">Belgique</p>
                  <p className="text-sm font-extrabold">Dinant</p>
                </div>
              </div>
            </button>

            {/* Card 4: Châteaux de la Loire */}
            <button 
              onClick={() => router.push('/vehicules?location=Loire')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Loire"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇫🇷
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">France</p>
                  <p className="text-sm font-extrabold">Val de Loire</p>
                </div>
              </div>
            </button>

            {/* Card 5: Gorges du Verdon (Wide Landscape) */}
            <button 
              onClick={() => router.push('/vehicules?location=Verdon')}
              className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1506744626753-edaeb5d8c57a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" 
                alt="Verdon"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇫🇷
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">France</p>
                  <p className="text-sm font-extrabold">Gorges du Verdon</p>
                </div>
              </div>
            </button>

            {/* Card 6: Étretat */}
            <button 
              onClick={() => router.push('/vehicules?location=Etretat')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Étretat"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇫🇷
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">France</p>
                  <p className="text-sm font-extrabold">Étretat</p>
                </div>
              </div>
            </button>

            {/* Card 7: Les Ardennes */}
            <button 
              onClick={() => router.push('/vehicules?location=Ardennes')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Ardennes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇧🇪
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">Belgique</p>
                  <p className="text-sm font-extrabold">Les Ardennes</p>
                </div>
              </div>
            </button>

            {/* Card 8: Bruxelles */}
            <button 
              onClick={() => router.push('/vehicules?location=Bruxelles')}
              className="md:col-span-1 md:row-span-1 group relative rounded-3xl overflow-hidden border border-brand-border hover-lift shadow-sm cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1421091255823-f4530d1720d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Bruxelles"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  🇧🇪
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold font-mono text-[#FEF08A]">Belgique</p>
                  <p className="text-sm font-extrabold">Bruxelles</p>
                </div>
              </div>
            </button>
          </div>

          {/* Quick selection pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-brand-border/60">
            {['Paris', 'Bruxelles', 'Bordeaux', 'Bruges', 'Lyon', 'Gand', 'Marseille', 'Anvers', 'Nice', 'Namur', 'Nantes', 'Liège'].map((city) => {
              const isBelgian = ['Bruxelles', 'Bruges', 'Gand', 'Anvers', 'Namur', 'Liège'].includes(city);
              return (
                <button
                  key={city}
                  onClick={() => router.push(`/vehicules?location=${city}`)}
                  className="px-5 py-2.5 bg-brand-beige hover:bg-brand-accent hover:text-white rounded-full border border-brand-border/60 text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  {isBelgian ? '🇧🇪' : '🇫🇷'} {city}
                </button>
              );
            })}
          </div>

          {/* Centered CTA Button */}
          <div className="flex justify-center pt-8">
            <Link 
              href="/vehicules"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-full text-sm font-extrabold shadow-lg hover-lift transition-all duration-200"
            >
              <span>Louer un camping-car</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Véhicules Vedettes / Featured Section */}
      <section className="bg-white border-y border-brand-border py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Les Incontournables</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
                Véhicules disponibles à la location
              </h2>
            </div>
            <Link 
              href="/vehicules"
              className="inline-flex items-center space-x-2 text-sm font-bold text-brand-accent hover:underline"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-brand-beige border border-brand-border rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-48 bg-brand-border/40 rounded-xl"></div>
                  <div className="h-6 bg-brand-border/40 rounded w-3/4"></div>
                  <div className="h-4 bg-brand-border/40 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              vehicles.map((veh) => (
                <div 
                  key={veh.id}
                  className="group flex flex-col bg-brand-beige border border-brand-border rounded-2xl overflow-hidden hover-lift shadow-sm"
                >
                  <div className="relative h-56 overflow-hidden bg-brand-hover">
                    <img 
                      src={veh.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                      alt={veh.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badge catégorie */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-accent border border-brand-border/50">
                      {veh.type === 'van_amenege' ? 'Van' :
                       veh.type === 'camping_car_profile' ? 'CC Profilé' :
                       veh.type === 'camping_car_integral' ? 'CC Intégral' : 'Fourgon'}
                    </div>

                    {/* Propriétaire avatar style Yescapa */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full border border-brand-border/40">
                      <img 
                        src={veh.owner.avatar} 
                        alt={veh.owner.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-bold text-brand-text pr-2">Hôte: {veh.owner.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-muted font-bold flex items-center">
                          📍 {veh.location}
                        </span>
                        {/* Notes style Yescapa */}
                        <div className="flex items-center text-xs font-bold text-brand-text">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] mr-1" />
                          <span>{veh.rating}</span>
                          <span className="text-brand-muted font-normal ml-1">({veh.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-brand-text">{veh.name}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {veh.description}
                      </p>
                    </div>

                    {/* Caractéristiques rapides */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-border text-xs text-brand-text">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-brand-accent" />
                        <span>{veh.seats} Places Route</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-brand-accent" />
                        <span>{veh.beds} Couchages</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-2xl font-extrabold text-brand-text font-mono">{veh.pricePerDay}€</span>
                        <span className="text-xs text-brand-muted"> / jour</span>
                      </div>
                      <Link
                        href={`/vehicule/${veh.slug}`}
                        className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm btn-transition"
                      >
                        Détails & Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Section Avis & Communauté (Yescapa Style) */}
      <section className="py-24 px-6 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Staggered Masonry Collage */}
          <div className="grid grid-cols-3 gap-4">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80" 
                  alt="Andréi"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Andréi</p>
                  <p className="text-white/70 font-semibold font-mono">Février 2026</p>
                </div>
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" 
                  alt="Ruslan"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Ruslan</p>
                  <p className="text-white/70 font-semibold font-mono">Octobre 2025</p>
                </div>
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" 
                  alt="Tracy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Tracy</p>
                  <p className="text-white/70 font-semibold font-mono">Octobre 2025</p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="relative h-56 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" 
                  alt="Vyacheslav"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Vyacheslav</p>
                  <p className="text-white/70 font-semibold font-mono">Août 2025</p>
                </div>
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" 
                  alt="Krisztina"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Krisztina</p>
                  <p className="text-white/70 font-semibold font-mono">Décembre 2024</p>
                </div>
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" 
                  alt="Parastu"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Parastu</p>
                  <p className="text-white/70 font-semibold font-mono">Septembre 2025</p>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80" 
                  alt="Tanya"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Tanya</p>
                  <p className="text-white/70 font-semibold font-mono">Juillet 2024</p>
                </div>
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" 
                  alt="Johannes"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">Johannes</p>
                  <p className="text-white/70 font-semibold font-mono">Avril 2024</p>
                </div>
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden border border-brand-border/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" 
                  alt="David"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white text-[10px] leading-tight">
                  <p className="font-extrabold">David</p>
                  <p className="text-white/70 font-semibold font-mono">Avril 2024</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Text & CTAs */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[#C9A035] font-extrabold text-xs uppercase tracking-widest block">
                  Rencontrez la communauté
                </span>
                <div className="h-1 w-12 bg-[#C9A035] rounded-full"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight leading-tight">
                Avis sur Cap Aventure, une histoire sans fin
              </h2>
              
              {/* Ratings */}
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex text-[#F59E0B]">
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                </div>
              </div>
              <p className="text-sm font-extrabold text-brand-text">
                Service noté 4,9 /5 sur la base de 387 831 avis d'utilisateurs
              </p>
              
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                Nos utilisateurs nous attribuent 5 étoiles ! Découvrez les avis authentiques de voyageurs et de propriétaires sur notre plateforme de location de camping-cars, trouvez le camping-car idéal pour votre aventure ou louez vous-même.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/avis"
                className="px-6 py-3.5 bg-[#FEF8E8] hover:bg-[#FEF0C7] text-[#C9A035] rounded-full text-xs font-bold transition-all duration-200 text-center cursor-pointer"
              >
                Lire les avis sur Cap Aventure
              </Link>
              <Link 
                href="/communaute/photos"
                className="px-6 py-3.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] rounded-full text-xs font-bold transition-all duration-200 text-center cursor-pointer"
              >
                Découvrez les photos de notre communauté
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Comment ça marche Section (Dynamic tab) */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Fonctionnement</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
            Comment fonctionne Cap Aventure ?
          </h2>
          <div className="flex justify-center mt-6">
            <div className="bg-brand-beige border border-brand-border p-1 rounded-full inline-flex">
              <button
                onClick={() => setHowItWorksTab('renter')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  howItWorksTab === 'renter' 
                    ? 'bg-brand-accent text-white shadow-md' 
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Je souhaite louer
              </button>
              <button
                onClick={() => setHowItWorksTab('owner')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  howItWorksTab === 'owner' 
                    ? 'bg-brand-accent text-white shadow-md' 
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Je souhaite proposer mon véhicule
              </button>
            </div>
          </div>
        </div>

        {howItWorksTab === 'renter' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              { num: '1', title: 'Choisissez votre véhicule', desc: 'Faites votre recherche parmi des centaines de camping-cars et vans selon vos critères.' },
              { num: '2', title: 'Faites votre demande', desc: 'Sélectionnez vos dates, contactez le propriétaire et validez votre demande.' },
              { num: '3', title: 'Prenez la route', desc: 'Réalisez l\'état des lieux depuis l\'application et partez en vacances l\'esprit tranquille.' }
            ].map((step) => (
              <div key={step.num} className="bg-white border border-brand-border p-8 rounded-3xl space-y-4 text-center shadow-sm relative overflow-hidden">
                <span className="absolute top-4 left-4 text-6xl font-black text-brand-accent/5 font-mono select-none">{step.num}</span>
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto text-lg font-bold">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-brand-text text-base pt-2">{step.title}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              { num: '1', title: 'Publiez votre annonce', desc: 'Enregistrez votre véhicule gratuitement, téléversez vos photos et définissez vos tarifs.' },
              { num: '2', title: 'Validez les demandes', desc: 'Échangez avec les locataires et choisissez librement à qui vous louez votre véhicule.' },
              { num: '3', title: 'Encaissez vos revenus', desc: 'Recevez votre rémunération de manière sécurisée. Nous fournissons l\'assurance multirisque.' }
            ].map((step) => (
              <div key={step.num} className="bg-white border border-brand-border p-8 rounded-3xl space-y-4 text-center shadow-sm relative overflow-hidden">
                <span className="absolute top-4 left-4 text-6xl font-black text-brand-accent/5 font-mono select-none">{step.num}</span>
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto text-lg font-bold">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-brand-text text-base pt-2">{step.title}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Bannière Propriétaire (Teal Owner Banner) */}
      <section className="bg-[#084255] text-white py-16 px-8 border-b border-[#05303e] w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-between">
          
          {/* Left Column: Heading & CTAs */}
          <div className="space-y-8 lg:max-w-xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
              Vous êtes propriétaire d'un camping-car ? <br />
              <span className="text-[#38BDF8]">Louez-le et gagnez jusqu'à 10 000 € par an.</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/proprietaire"
                className="px-6 py-3.5 bg-[#C9A035] hover:bg-[#A8832A] text-white rounded-full text-xs font-bold transition-all duration-200 shadow-lg cursor-pointer"
              >
                Créez votre annonce
              </Link>
              <Link 
                href="/proprietaire"
                className="px-6 py-3.5 bg-[#0C5A71] hover:bg-[#094759] border border-white/10 text-white rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:max-w-2xl w-full">
            
            {/* Step 1 */}
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#38BDF8] font-mono block">01</span>
              <h4 className="font-bold text-sm text-white">Créez votre annonce</h4>
              <p className="text-[11px] text-[#E0F2FE] leading-relaxed font-medium">
                Vous avez un contrôle total sur votre calendrier de réservation et vos tarifs de location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#38BDF8] font-mono block">02</span>
              <h4 className="font-bold text-sm text-white">Recevoir des demandes</h4>
              <p className="text-[11px] text-[#E0F2FE] leading-relaxed font-medium">
                Gérez facilement vos demandes de réservation via votre tableau de bord.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <span className="text-2xl font-black text-[#38BDF8] font-mono block">03</span>
              <h4 className="font-bold text-sm text-white">Commencez à gagner</h4>
              <p className="text-[11px] text-[#E0F2FE] leading-relaxed font-medium">
                Recevez vos gains via notre système de paiement sécurisé par un tiers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Liens de Destination & Catégories (SEO Pills Section) */}
      <section className="py-24 px-6 bg-white border-b border-brand-border w-full">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Subsection 1: Destinations */}
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-brand-text tracking-tight">
              Location de camping-cars en Europe et dans le monde entier
            </h3>
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-5xl">
              Votre prochain road trip vous attend. Dans votre pays ou à l'étranger, louez un camping-car et explorez les routes mythiques et celles encore hors des sentiers battus, en toute liberté au volant. Garez-vous le long de plages tranquilles, réveillez-vous face à la montagne et découvrez des endroits magnifiques que seule la route peut révéler.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                "Espagne", "Belgique", "Royaume-Uni", "Grèce", "Croatie", "France", 
                "USA", "Suisse", "Islande", "Autriche", "Pays-Bas", "Slovénie", 
                "Italie", "Norvège", "Suède", "Allemagne", "Portugal", "Irlande"
              ].map((dest) => (
                <Link
                  key={dest}
                  href={`/vehicules?location=${encodeURIComponent(dest)}`}
                  className="px-4 py-2 bg-brand-beige border border-brand-border/60 hover:border-[#C9A035] hover:text-[#C9A035] text-brand-text rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  {dest}
                </Link>
              ))}
            </div>
          </div>

          {/* Subsection 2: Types & Categories */}
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-brand-text tracking-tight">
              Louez un camping-car auprès d'un particulier.
            </h3>
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-5xl">
              Cap Aventure propose des véhicules de toutes tailles et de tous types à la location au Royaume-Uni et en Europe. Que vous voyagiez en famille, entre amis, en couple, seul ou avec votre animal de compagnie, vous trouverez sur notre plateforme le camping-car idéal.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                { label: "camping-car", type: "camping_car_profile" },
                { label: "grand camping-car", type: "camping_car_integral" },
                { label: "camping-car discret", type: "van_amenege" },
                { label: "camping-car profilé", type: "camping_car_profile" },
                { label: "Camping-car de classe A", type: "camping_car_integral" },
                { label: "Caravane", type: "fourgon_amenege" },
                { label: "Camping-cars adaptés aux familles", type: "camping_car_profile" },
                { label: "camping-cars acceptant les animaux domestiques", type: "fourgon_amenege" },
                { label: "Voyage surf en camping-car", type: "van_amenege" },
                { label: "camping-cars abordables", type: "fourgon_amenege" },
                { label: "Nous aimons la Californie", type: "van_amenege" }
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/vehicules?type=${cat.type}`}
                  className="px-4 py-2 bg-brand-beige border border-brand-border/60 hover:border-[#C9A035] hover:text-[#C9A035] text-brand-text rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 9. Pourquoi louer chez nous (Value Prop) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-brand-border">
        <div className="space-y-6">
          <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Notre Promesse</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-tight">
            Préparez votre roadtrip en toute sérénité
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            Louer un camping-car ou un van chez Cap Aventure, c'est s'assurer d'un service irréprochable et d'équipements de première classe. Toutes nos réservations incluent automatiquement :
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: ShieldCheck, title: 'Assurance tous risques incluse', desc: 'Voyagez protégé. Assistance dépannage 24/7 sur toutes les routes européennes.' },
              { icon: Award, title: 'Véhicules récents et entretenus', desc: 'Toute notre flotte a moins de 2 ans et fait l\'objet de contrôles techniques réguliers.' },
              { icon: HeartHandshake, title: 'Service tout inclus d\'office', desc: 'Cuisine complète équipée, raccordements, cales de mise à niveau et tuyaux fournis gratuitement.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-text text-sm">{item.title}</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-brand-border">
          <img 
            src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" 
            alt="Camping sauvage premium" 
            className="w-full h-full object-cover"
          />
          {/* Overlay de citation premium */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-border/40 text-brand-text space-y-2">
            <div className="flex text-[#F59E0B]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs font-semibold italic text-brand-text/90 leading-relaxed">
              "Une expérience inoubliable ! Le van était impeccable, très propre et la communication avec l'équipe de Cap Aventure a été parfaite du début à la fin. Nous reviendrons l'année prochaine !"
            </p>
            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">
              — Sophie & Marc, roadtrip de 2 semaines en Bretagne
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
