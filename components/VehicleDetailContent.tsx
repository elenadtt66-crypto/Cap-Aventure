'use client';

import React, { useEffect, useState } from 'react';
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

interface Props {
  slug: string;
}

export default function VehicleDetailClient({ slug }: Props) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Widget réservation local states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Options & packs additionnels
  const [packLinge, setPackLinge] = useState(false);
  const [forfaitNettoyage, setForfaitNettoyage] = useState(false);

  useEffect(() => {
    async function loadVehicle() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getVehicleBySlug(slug);
        setVehicle(found || null);
      } catch (err) {
        console.error("Erreur chargement véhicule:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();
  }, [slug]);

  // Calcul du nombre de jours entre startDate et endDate
  const totalDays = React.useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Calcul des détails tarifaires
  const priceBreakdown = React.useMemo(() => {
    if (!vehicle || totalDays <= 0) {
      return { baseTotal: 0, packLingePrice: 0, cleaningPrice: 0, serviceFee: 0, total: 0 };
    }

    const baseTotal = totalDays * vehicle.pricePerDay;
    const packLingePrice = packLinge ? 45 : 0;
    const cleaningPrice = forfaitNettoyage ? 60 : 0;
    const serviceFee = Math.round(baseTotal * 0.08); // 8% de frais d'assurance & service

    const total = baseTotal + packLingePrice + cleaningPrice + serviceFee;

    return {
      baseTotal,
      packLingePrice,
      cleaningPrice,
      serviceFee,
      total,
    };
  }, [vehicle, totalDays, packLinge, forfaitNettoyage]);

  // Handler pour soumettre vers la page de réservation
  const handleProceedToReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    if (!startDate || !endDate || totalDays <= 0) {
      alert("Veuillez sélectionner des dates de séjour valides.");
      return;
    }

    const queryParams = new URLSearchParams({
      vehicleId: vehicle.id,
      startDate,
      endDate,
      packLinge: packLinge ? 'true' : 'false',
      forfaitNettoyage: forfaitNettoyage ? 'true' : 'false',
    });

    router.push(`/reservation?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Chargement des détails du véhicule...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-xl">
          <Compass className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Véhicule introuvable</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Le van ou camping-car que vous recherchez n'existe pas ou a été retiré de la location.
          </p>
          <Link
            href="/vehicules"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux véhicules</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Fil d'Ariane & Bouton Retour */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link href="/vehicules" className="hover:text-emerald-400 transition-colors">Véhicules</Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-200 truncate max-w-[200px] sm:max-w-xs">{vehicle.name}</span>
          </div>

          <Link
            href="/vehicules"
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Tous les véhicules</span>
          </Link>
        </div>

        {/* Header Titre & Badge */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider rounded-full">
              {vehicle.type === 'van_amenege' ? 'Van Aménagé' : vehicle.type === 'fourgon_amenege' ? 'Fourgon Aménagé' : 'Camping-Car'}
            </span>
            <div className="flex items-center space-x-1 text-amber-400 text-sm font-medium bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{vehicle.rating}</span>
              <span className="text-slate-400 text-xs">({vehicle.reviewCount} avis)</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-emerald-400 ml-2" />
              <span>{vehicle.location}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">{vehicle.name}</h1>
        </div>

        {/* Galerie Photos (Grid + Lightbox Trigger) */}
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
            {/* Photo Principale Grand Format */}
            <div 
              className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[440px] rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => { setActiveImageIndex(0); setIsGalleryOpen(true); }}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-medium flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>Agrandir la photo</span>
                </span>
              </div>
            </div>

            {/* Photos Secondaires (Grille 2x2) */}
            <div className="md:col-span-2 grid grid-cols-2 gap-2 h-[440px]">
              {vehicle.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-full rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => { setActiveImageIndex(idx + 1); setIsGalleryOpen(true); }}
                >
                  <img
                    src={img}
                    alt={`${vehicle.name} vue ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Voir Toutes les Photos */}
          <button
            onClick={() => { setActiveImageIndex(0); setIsGalleryOpen(true); }}
            className="absolute bottom-6 right-6 inline-flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-900 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-xl transition-all hover:scale-105"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Voir toutes les photos ({vehicle.images.length})</span>
          </button>
        </div>

        {/* Layout 2 Colonnes (Contenu Principal & Widget de Réservation Sticky) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Colonne Gauche : Détails & Équipements (2 Cols) */}
          <div className="lg:col-span-2 space-y-10">

            {/* Badges Caractéristiques Clés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Capacité</p>
                  <p className="text-sm font-bold text-white">{vehicle.seats} places</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Couchages</p>
                  <p className="text-sm font-bold text-white">{vehicle.beds} lits</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <Fuel className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Carburant</p>
                  <p className="text-sm font-bold text-white">{vehicle.techSpecs.fuel}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <Workflow className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Boîte</p>
                  <p className="text-sm font-bold text-white">{vehicle.techSpecs.transmission}</p>
                </div>
              </div>
            </div>

            {/* Description du Véhicule */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-emerald-400" />
                <span>À propos de ce véhicule</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-base font-normal">
                {vehicle.description}
              </p>
            </div>

            {/* Spécifications Techniques Avancées */}
            <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800/60 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-emerald-400" />
                <span>Fiche technique & Performances</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/60 text-sm">
                  <span className="text-slate-400">Motorisation</span>
                  <span className="font-semibold text-slate-200">{vehicle.techSpecs.enginePower}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/60 text-sm">
                  <span className="text-slate-400">Consommation moyenne</span>
                  <span className="font-semibold text-slate-200">{vehicle.techSpecs.consumption}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/60 text-sm">
                  <span className="text-slate-400">Type de transmission</span>
                  <span className="font-semibold text-slate-200">{vehicle.techSpecs.transmission}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/60 text-sm">
                  <span className="text-slate-400">Énergie</span>
                  <span className="font-semibold text-slate-200">{vehicle.techSpecs.fuel}</span>
                </div>
              </div>
            </div>

            {/* Liste des Équipements Inclus */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Équipements & Options Incluses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-3 p-3.5 bg-slate-900/60 border border-slate-800/70 rounded-2xl text-slate-200 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Propriétaire du Véhicule */}
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={vehicle.owner.avatar}
                  alt={vehicle.owner.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Propriétaire : {vehicle.owner.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Taux de réponse : <span className="text-emerald-400 font-semibold">{vehicle.owner.responseRate}%</span> • {vehicle.owner.responseTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
                <span>Propriétaire Vérifié Cap Aventure</span>
              </div>
            </div>

          </div>

          {/* Colonne Droite : Widget de Réservation (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* En-tête Prix par jour */}
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-3xl font-black text-white">{vehicle.pricePerDay} €</span>
                  <span className="text-slate-400 text-sm font-medium"> / jour</span>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  Assurance tous risques incluse
                </span>
              </div>

              {/* Formulaire Sélection de Dates */}
              <form onSubmit={handleProceedToReservation} className="space-y-4">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Dates de séjour
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <DatePicker
                      label="Départ"
                      value={startDate}
                      onChange={setStartDate}
                      minDate={new Date().toISOString().split('T')[0]}
                    />

                    <DatePicker
                      label="Retour"
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Options Additionnelles */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Packs additionnels facultatifs
                  </label>

                  {/* Pack Linge */}
                  <label className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={packLinge}
                        onChange={(e) => setPackLinge(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20 bg-slate-900 border-slate-700"
                      />
                      <span className="text-sm font-medium text-slate-300">Pack Linge Luxueux (+45€)</span>
                    </div>
                  </label>

                  {/* Forfait Nettoyage */}
                  <label className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={forfaitNettoyage}
                        onChange={(e) => setForfaitNettoyage(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20 bg-slate-900 border-slate-700"
                      />
                      <span className="text-sm font-medium text-slate-300">Forfait Ménage Fin de Séjour (+60€)</span>
                    </div>
                  </label>
                </div>

                {/* Résumé du Calcul de Prix en Temps Réel */}
                {totalDays > 0 && (
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>{vehicle.pricePerDay} € x {totalDays} jours</span>
                      <span>{priceBreakdown.baseTotal} €</span>
                    </div>

                    {packLinge && (
                      <div className="flex justify-between text-slate-400">
                        <span>Pack Linge Luxueux</span>
                        <span>+45 €</span>
                      </div>
                    )}

                    {forfaitNettoyage && (
                      <div className="flex justify-between text-slate-400">
                        <span>Forfait Ménage Fin</span>
                        <span>+60 €</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400">
                      <span>Assurance & Service Cap Aventure</span>
                      <span>+{priceBreakdown.serviceFee} €</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-base text-white">
                      <span>Total TTC</span>
                      <span className="text-emerald-400 text-lg">{priceBreakdown.total} €</span>
                    </div>
                  </div>
                )}

                {/* Bouton Action Réserver */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center space-x-2 text-base"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Réserver maintenant</span>
                </button>
              </form>

              {/* Garanties */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Annulation gratuite jusqu'à 30 jours avant le départ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Paiement sécurisé Stripe avec attestation instantanée</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Modal d'Agrandissement Galerie Photos */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 p-3 text-slate-400 hover:text-white bg-slate-900/80 rounded-full border border-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <img
              src={vehicle.images[activeImageIndex]}
              alt={vehicle.name}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
            />

            {/* Commandes Précédent / Suivant */}
            <div className="flex items-center justify-between w-full mt-6 px-4">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))}
                className="p-3 text-white bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors flex items-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Précédente</span>
              </button>

              <span className="text-slate-400 text-sm font-medium">
                Photo {activeImageIndex + 1} sur {vehicle.images.length}
              </span>

              <button
                onClick={() => setActiveImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))}
                className="p-3 text-white bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors flex items-center space-x-2"
              >
                <span className="text-sm font-medium">Suivante</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
