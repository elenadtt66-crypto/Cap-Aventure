'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Layers,
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  RefreshCw,
  Star,
  Fuel,
  Gauge,
  Workflow,
  X,
  Maximize2,
  Camera,
  Zap,
  Clock,
  Bed,
  MessageSquare
} from 'lucide-react';
import { getVehicleBySlug } from '@/services/db';
import { Vehicle } from '@/types';
import DatePicker from '@/components/ui/DatePicker';
import Badge from '@/components/ui/Badge';

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
        console.error('Erreur chargement véhicule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();
  }, [slug]);

  // Calcul du nombre de jours
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
    const serviceFee = Math.round(baseTotal * 0.08);
    const total = baseTotal + packLingePrice + cleaningPrice + serviceFee;
    return { baseTotal, packLingePrice, cleaningPrice, serviceFee, total };
  }, [vehicle, totalDays, packLinge, forfaitNettoyage]);

  // Handler pour la réservation
  const handleProceedToReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    if (!startDate || !endDate || totalDays <= 0) {
      alert('Veuillez sélectionner des dates de séjour valides.');
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

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      van_amenege: 'Van Aménagé',
      fourgon_amenege: 'Fourgon Aménagé',
      camping_car_profile: 'Camping-Car Profilé',
      camping_car_integral: 'Grand Intégral',
    };
    return map[type] || 'Véhicule';
  };

  const getTypeVariant = (type: string): 'gold' | 'navy' | 'success' | 'warning' => {
    const map: Record<string, 'gold' | 'navy' | 'success' | 'warning'> = {
      van_amenege: 'gold',
      fourgon_amenege: 'warning',
      camping_car_profile: 'navy',
      camping_car_integral: 'success',
    };
    return map[type] || 'gold';
  };

  // ——— Loading State ———
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-beige pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-10 h-10 text-brand-accent animate-spin" />
          <p className="text-brand-muted text-sm font-medium">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  // ——— Not Found State ———
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-brand-beige pt-28 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-brand-hover border border-brand-border flex items-center justify-center mx-auto mb-6">
            <Gauge className="w-10 h-10 text-brand-muted" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-text mb-2">Véhicule introuvable</h1>
          <p className="text-brand-muted mb-8 leading-relaxed">
            Le van ou camping-car que vous recherchez n'existe pas ou a été retiré de la location.
          </p>
          <Link
            href="/vehicules"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl transition-all shadow-md btn-transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux véhicules</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ——— Breadcrumb & Back Button ——— */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-brand-border/50 mb-6">
          <div className="flex items-center space-x-2 text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-accent transition-colors font-medium">Accueil</Link>
            <ChevronRight className="w-4 h-4 text-brand-border" />
            <Link href="/vehicules" className="hover:text-brand-accent transition-colors font-medium">Véhicules</Link>
            <ChevronRight className="w-4 h-4 text-brand-border" />
            <span className="text-brand-text font-semibold truncate max-w-[180px] sm:max-w-xs">{vehicle.name}</span>
          </div>
          <Link
            href="/vehicules"
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-text bg-white hover:bg-brand-hover border border-brand-border px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-accent" />
            <span>Tous les véhicules</span>
          </Link>
        </div>

        {/* ——— Header : Titre, Badge, Note ——— */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant={getTypeVariant(vehicle.type)} size="sm">
              {getTypeLabel(vehicle.type)}
            </Badge>
            <div className="flex items-center space-x-1 text-sm font-bold text-brand-text bg-brand-gold-light border border-brand-accent/20 px-2.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
              <span>{vehicle.rating}</span>
              <span className="text-brand-muted font-normal text-xs">({vehicle.reviewCount} avis)</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-brand-muted">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span className="font-medium">{vehicle.location}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text tracking-tight leading-tight">
            {vehicle.name}
          </h1>
        </div>

        {/* ——— Galerie Photos ——— */}
        <div className="relative mb-10 rounded-3xl overflow-hidden border border-brand-border shadow-sm bg-brand-hover">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 p-1.5">
            {/* Photo principale */}
            <div
              className="md:col-span-2 relative aspect-[4/3] sm:aspect-[16/10] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => { setActiveImageIndex(0); setIsGalleryOpen(true); }}
            >
              <img
                src={vehicle.images[0]}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Agrandir</span>
                </span>
              </div>
            </div>

            {/* Grille secondaire */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-1.5 h-[420px]">
              {vehicle.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => { setActiveImageIndex(idx + 1); setIsGalleryOpen(true); }}
                >
                  <img
                    src={img}
                    alt={`${vehicle.name} vue ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Bouton "Voir toutes les photos" */}
          <button
            onClick={() => { setActiveImageIndex(0); setIsGalleryOpen(true); }}
            className="absolute bottom-4 right-4 inline-flex items-center space-x-2 bg-white/95 hover:bg-white text-brand-text font-bold px-3 py-2 rounded-xl border border-brand-border/40 backdrop-blur-md shadow-md text-xs transition-all hover:scale-105"
          >
            <Camera className="w-3.5 h-3.5 text-brand-accent" />
            <span>Photos ({vehicle.images.length})</span>
          </button>
        </div>

        {/* ——— Layout 2 Colonnes ——— */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          
          {/* ——— Colonne Gauche : Détails (2/3) ——— */}
          <div className="lg:col-span-2 space-y-8">

            {/* Spécifications clés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-white border border-brand-border rounded-3xl shadow-sm">
              {[
                { icon: Users, label: 'Capacité', value: `${vehicle.seats} places`, color: 'text-brand-accent bg-brand-accent/10' },
                { icon: Bed, label: 'Couchages', value: `${vehicle.beds} lits`, color: 'text-brand-accent bg-brand-accent/10' },
                { icon: Fuel, label: 'Carburant', value: vehicle.techSpecs.fuel, color: 'text-[#16A34A] bg-[#16A34A]/10' },
                { icon: Workflow, label: 'Boîte', value: vehicle.techSpecs.transmission, color: 'text-[#2563EB] bg-[#2563EB]/10' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center space-x-3 p-2">
                  <div className={`p-2.5 rounded-2xl flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-xs sm:text-sm font-extrabold text-brand-text truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text flex items-center space-x-2">
                <Info className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <span>À propos de ce véhicule</span>
              </h2>
              <p className="text-brand-muted leading-relaxed text-sm sm:text-base">
                {vehicle.description}
              </p>
            </div>

            {/* Fiche technique */}
            <div className="p-5 sm:p-6 bg-white border border-brand-border rounded-3xl shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-brand-text flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-brand-accent" />
                <span>Fiche technique & Performances</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                <div className="sm:pr-6 space-y-3">
                  {[
                    { label: 'Motorisation', value: vehicle.techSpecs.enginePower },
                    { label: 'Consommation', value: vehicle.techSpecs.consumption },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-brand-border/50 last:border-0 text-sm">
                      <span className="text-brand-muted font-medium">{label}</span>
                      <span className="font-extrabold text-brand-text font-mono">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="sm:pl-6 space-y-3 pt-3 sm:pt-0">
                  {[
                    { label: 'Transmission', value: vehicle.techSpecs.transmission },
                    { label: 'Énergie', value: vehicle.techSpecs.fuel },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-brand-border/50 last:border-0 text-sm">
                      <span className="text-brand-muted font-medium">{label}</span>
                      <span className="font-extrabold text-brand-text font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Équipements inclus */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text">
                Équipements & Options Incluses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3.5 bg-white border border-brand-border hover:border-brand-accent/40 rounded-2xl text-sm font-medium text-brand-text transition-colors duration-200 group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0 group-hover:text-brand-accent transition-colors" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Propriétaire */}
            <div className="p-5 sm:p-6 bg-white border border-brand-border rounded-3xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={vehicle.owner.avatar}
                    alt={vehicle.owner.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-accent/30 shadow-sm"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-brand-text">
                      {vehicle.owner.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Taux de réponse :{' '}
                      <span className="text-brand-success font-extrabold">{vehicle.owner.responseRate}%</span>
                      {' '}· {vehicle.owner.responseTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-brand-success bg-brand-success/10 border border-brand-success/20 px-4 py-2 rounded-xl whitespace-nowrap">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Propriétaire Vérifié</span>
                </div>
              </div>
            </div>

            {/* Avis clients */}
            {vehicle.reviews && vehicle.reviews.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-brand-accent" />
                  <span>Avis des locataires</span>
                </h2>
                <div className="space-y-3">
                  {vehicle.reviews.slice(0, 4).map((review) => (
                    <div key={review.id} className="p-4 sm:p-5 bg-white border border-brand-border rounded-2xl space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-hover text-white flex items-center justify-center text-xs font-extrabold">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-brand-text">{review.author}</p>
                            <p className="text-[10px] text-brand-muted font-medium">{new Date(review.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-brand-accent text-brand-accent' : 'text-brand-border'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-brand-muted leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ——— Colonne Droite : Widget Réservation Sticky (1/3) ——— */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-brand-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">

              {/* Prix par jour */}
              <div className="flex items-baseline justify-between border-b border-brand-border pb-4">
                <div>
                  <span className="text-3xl font-extrabold text-brand-navy font-mono">{vehicle.pricePerDay} €</span>
                  <span className="text-brand-muted text-sm font-medium"> / jour</span>
                </div>
                <span className="text-[10px] font-extrabold text-brand-success bg-brand-success/10 border border-brand-success/20 px-2.5 py-1 rounded-full">
                  Assurance incluse
                </span>
              </div>

              {/* Formulaire dates */}
              <form onSubmit={handleProceedToReservation} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-brand-muted uppercase tracking-widest block">
                    Dates de séjour
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
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

                {/* Durée calculée */}
                {totalDays > 0 && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-brand-gold-light border border-brand-accent/20 rounded-xl text-xs font-bold text-brand-accent">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{totalDays} jour{totalDays > 1 ? 's' : ''} de location sélectionné{totalDays > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Options additionnelles */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-brand-muted uppercase tracking-widest block">
                    Options supplémentaires
                  </label>

                  <label className="flex items-center justify-between p-3 bg-brand-beige border border-brand-border hover:border-brand-accent/40 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={packLinge}
                        onChange={(e) => setPackLinge(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-accent accent-brand-accent focus:ring-brand-accent/20 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-brand-text group-hover:text-brand-accent transition-colors">Pack Linge Luxueux</span>
                    </div>
                    <span className="text-xs font-extrabold text-brand-accent">+45 €</span>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-brand-beige border border-brand-border hover:border-brand-accent/40 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={forfaitNettoyage}
                        onChange={(e) => setForfaitNettoyage(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-accent accent-brand-accent focus:ring-brand-accent/20 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-brand-text group-hover:text-brand-accent transition-colors">Forfait Ménage Fin de Séjour</span>
                    </div>
                    <span className="text-xs font-extrabold text-brand-accent">+60 €</span>
                  </label>
                </div>

                {/* Résumé tarifaire */}
                {totalDays > 0 && (
                  <div className="p-4 bg-brand-beige border border-brand-border rounded-2xl space-y-2 text-sm">
                    <div className="flex justify-between text-brand-muted text-xs">
                      <span>{vehicle.pricePerDay} € × {totalDays} jour{totalDays > 1 ? 's' : ''}</span>
                      <span className="font-semibold">{priceBreakdown.baseTotal} €</span>
                    </div>
                    {packLinge && (
                      <div className="flex justify-between text-brand-muted text-xs">
                        <span>Pack Linge Luxueux</span>
                        <span className="font-semibold">+45 €</span>
                      </div>
                    )}
                    {forfaitNettoyage && (
                      <div className="flex justify-between text-brand-muted text-xs">
                        <span>Forfait Ménage</span>
                        <span className="font-semibold">+60 €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-brand-muted text-xs">
                      <span>Assurance & Service (8%)</span>
                      <span className="font-semibold">+{priceBreakdown.serviceFee} €</span>
                    </div>
                    <div className="pt-2 border-t border-brand-border flex justify-between font-extrabold text-base text-brand-text">
                      <span>Total TTC</span>
                      <span className="text-brand-accent text-lg font-mono">{priceBreakdown.total} €</span>
                    </div>
                  </div>
                )}

                {/* Bouton Réserver */}
                <button
                  type="submit"
                  className="w-full py-4 bg-brand-accent hover:bg-brand-accent-hover text-white font-extrabold rounded-2xl transition-all shadow-md shadow-brand-accent/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2.5 text-sm"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Réserver maintenant</span>
                </button>
              </form>

              {/* Garanties */}
              <div className="space-y-2 pt-2 border-t border-brand-border text-xs text-brand-muted">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-brand-success flex-shrink-0" />
                  <span>Annulation gratuite jusqu'à 30 jours avant le départ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
                  <span>Paiement sécurisé avec attestation instantanée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Lightbox Galerie ——— */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-5 right-5 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center animate-scale-up">
            <img
              src={vehicle.images[activeImageIndex]}
              alt={vehicle.name}
              className="max-h-[75vh] w-auto max-w-full rounded-3xl object-contain shadow-2xl"
            />

            {/* Navigation */}
            <div className="flex items-center justify-between w-full mt-6 px-4">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))}
                className="p-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-semibold hidden sm:inline">Précédente</span>
              </button>

              <div className="flex items-center space-x-1.5">
                {vehicle.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      i === activeImageIndex ? 'bg-brand-accent w-5' : 'bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))}
                className="p-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span className="text-sm font-semibold hidden sm:inline">Suivante</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Compteur */}
            <p className="text-white/60 text-sm font-medium mt-3">
              Photo {activeImageIndex + 1} / {vehicle.images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
