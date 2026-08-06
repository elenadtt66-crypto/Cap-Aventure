'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getVehicles, createReservation } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';
import VanForm from '@/components/forms/VanForm';
import ProfileForm from '@/components/forms/ProfileForm';
import IntegralForm from '@/components/forms/IntegralForm';
import FourgonForm from '@/components/forms/FourgonForm';


import { 
  Calendar,
  User as UserIcon, 
  Mail as MailIcon, 
  Phone as PhoneIcon, 
  ShieldCheck as ShieldIcon, 
  CheckCircle2 as CheckIcon, 
  Info as InfoIcon, 
  CreditCard as CardIcon, 
  RefreshCw as RefreshIcon, 
  Compass as CompassIcon,
  Lock as LockIcon,
  HeartHandshake as TrustIcon
} from 'lucide-react';

function ReservationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Liste complète des véhicules pour sélection manuelle si besoin
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Données de réservation principales
  const [selectedVehicleId, setSelectedVehicleId] = useState(searchParams.get('vehicleId') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // Informations client
  const [clientData, setClientData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    drivingLicenseNumber: '',
  });

  // Données d'options spécifiques par catégorie
  const [specificData, setSpecificData] = useState<any>({});

  // États UI
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const list = await getVehicles();
        setVehicles(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Détecter le véhicule actuellement sélectionné
  const currentVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Réinitialiser les options si le véhicule change
  useEffect(() => {
    setSpecificData({});
  }, [selectedVehicleId]);

  // Calcul du nombre de jours de location
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 3600 * 24));
  }, [startDate, endDate]);

  // Décomposition des prix (Style Yescapa)
  const priceBreakdown = useMemo(() => {
    if (!currentVehicle || totalDays <= 0) return { owner: 0, service: 0, insurance: 0, total: 0 };
    
    const grossTotal = totalDays * currentVehicle.pricePerDay;
    const owner = Math.round(grossTotal * 0.75);
    const service = Math.round(grossTotal * 0.15);
    const insurance = Math.round(grossTotal * 0.10);
    const total = owner + service + insurance;
    
    return { owner, service, insurance, total };
  }, [currentVehicle, totalDays]);

  const handleSpecificChange = (key: string, value: any) => {
    setSpecificData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedVehicleId) {
      setError('Veuillez sélectionner un véhicule.');
      return;
    }
    if (!startDate || !endDate || totalDays <= 0) {
      setError('Veuillez spécifier des dates de réservation valides.');
      return;
    }
    if (currentVehicle?.type === 'camping_car_integral' && !specificData.hasLargeVehicleExperience) {
      setError('Vous devez certifier détenir l\'expérience requise pour la conduite du camping-car intégral.');
      return;
    }

    setSubmitting(true);

    try {
      const reservationData = {
        vehicleId: selectedVehicleId,
        vehicleName: currentVehicle?.name || 'Véhicule',
        startDate,
        endDate,
        totalDays,
        totalPrice: priceBreakdown.total,
        status: 'EN_ATTENTE' as const,
        specificDetails: specificData,
      };

      await createReservation(reservationData, clientData);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-brand-muted">
        <RefreshIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
        <p>Chargement du formulaire de réservation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full space-y-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Demande de Location</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight">
          Réservez votre évasion
        </h1>
        <p className="text-sm text-brand-muted">
          Remplissez vos informations en quelques minutes. L'administrateur de l'agence confirmera vos dates par email.
        </p>
      </div>

      {success ? (
        <div className="bg-white border border-brand-border p-12 rounded-3xl shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-scale-up">
          <div className="w-20 h-20 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
            <CheckIcon className="w-12 h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text">Demande de Réservation Envoyée !</h2>
          <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
            Votre demande a bien été enregistrée avec le statut <strong className="text-brand-accent">EN ATTENTE</strong>. Le propriétaire ainsi que l'administrateur vont vérifier la disponibilité du véhicule et valideront votre demande sous 24 heures.
          </p>
          <div className="pt-6">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl font-bold shadow-md btn-transition cursor-pointer"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Booking Form (2 cols) */}
          <div className="lg:col-span-2 space-y-8 bg-white border border-brand-border p-6 md:p-8 rounded-3xl shadow-sm">
            {error && (
              <div className="p-4 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Step 1: Vehicle & Dates Selection */}
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-brand-text border-b border-brand-border pb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-extrabold flex items-center justify-center mr-2">1</span>
                Choix du véhicule & des dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="vehicle" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Véhicule *
                  </label>
                  <select
                    id="vehicle"
                    required
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                  >
                    <option value="">Sélectionnez un véhicule</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.pricePerDay}€/j)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Date de départ *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      id="startDate"
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
                  <label htmlFor="endDate" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Date de retour *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      id="endDate"
                      type="date"
                      required
                      min={startDate || new Date().toISOString().split('T')[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Client Information */}
            <div className="space-y-6 pt-2">
              <h3 className="text-base font-extrabold text-brand-text border-b border-brand-border pb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-extrabold flex items-center justify-center mr-2">2</span>
                Informations du conducteur principal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={clientData.firstName}
                      onChange={(e) => setClientData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Ex: Jean"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Nom de famille *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={clientData.lastName}
                      onChange={(e) => setClientData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Ex: Dupuy"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Adresse email *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <MailIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={clientData.email}
                      onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Ex: jean.dupuy@mail.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Numéro de Téléphone *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <PhoneIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={clientData.phone}
                      onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Ex: +33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="license" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Numéro de Permis de Conduire *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                      <CardIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="license"
                      type="text"
                      required
                      value={clientData.drivingLicenseNumber}
                      onChange={(e) => setClientData(prev => ({ ...prev, drivingLicenseNumber: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Ex: 14AA99999 (Permis B obligatoire)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Specific Options according to Vehicle Category */}
            {currentVehicle && (
              <div className="space-y-6 pt-2 border-t border-brand-border mt-8">
                <h3 className="text-base font-extrabold text-brand-text border-b border-brand-border pb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-extrabold flex items-center justify-center mr-2">3</span>
                  Options spécifiques du véhicule
                </h3>

                {currentVehicle.type === 'van_amenege' && (
                  <VanForm data={specificData} onChange={handleSpecificChange} />
                )}

                {currentVehicle.type === 'camping_car_profile' && (
                  <ProfileForm data={specificData} onChange={handleSpecificChange} />
                )}

                {currentVehicle.type === 'camping_car_integral' && (
                  <IntegralForm data={specificData} onChange={handleSpecificChange} />
                )}

                {currentVehicle.type === 'fourgon_amenege' && (
                  <FourgonForm data={specificData} onChange={handleSpecificChange} />
                )}
              </div>
            )}
          </div>

          {/* Right Side: Price Calculator & Summary (1 col) */}
          <aside className="bg-white border border-brand-border p-6 rounded-3xl shadow-md space-y-6 sticky top-28">
            <h3 className="font-extrabold text-brand-text border-b border-brand-border pb-3">Récapitulatif</h3>
            
            {currentVehicle ? (
              <div className="space-y-5">
                <div className="relative h-36 rounded-xl overflow-hidden bg-brand-hover border border-brand-border">
                  <img 
                    src={currentVehicle.images[0]} 
                    alt={currentVehicle.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="font-extrabold text-brand-text text-sm leading-snug">{currentVehicle.name}</h4>
                  <span className="inline-block text-[9px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-extrabold mt-1">
                    {currentVehicle.type === 'van_amenege' ? 'Van' :
                     currentVehicle.type === 'camping_car_profile' ? 'Profilé' :
                     currentVehicle.type === 'camping_car_integral' ? 'Intégral' : 'Fourgon'}
                  </span>
                </div>

                <div className="divide-y divide-brand-border text-xs space-y-3 pt-2">
                  {startDate && endDate && (
                    <div className="pt-3 flex justify-between">
                      <span className="text-brand-muted">Dates</span>
                      <span className="font-semibold text-brand-text text-right">
                        Du {new Date(startDate).toLocaleDateString('fr-FR')} <br/>
                        au {new Date(endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {totalDays > 0 && (
                    <div className="pt-3 flex justify-between">
                      <span className="text-brand-muted">Durée de location</span>
                      <span className="font-bold text-brand-text font-mono">{totalDays} jours</span>
                    </div>
                  )}
                  
                  {/* Price breakdown detail layout */}
                  {totalDays > 0 && (
                    <div className="pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Rémunération propriétaire</span>
                        <span className="font-semibold text-brand-text font-mono">{priceBreakdown.owner}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Frais de service (15%)</span>
                        <span className="font-semibold text-brand-text font-mono">{priceBreakdown.service}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Assurance & Assistance (10%)</span>
                        <span className="font-semibold text-brand-text font-mono">{priceBreakdown.insurance}€</span>
                      </div>
                    </div>
                  )}

                  {priceBreakdown.total > 0 && (
                    <div className="pt-3 flex justify-between border-t border-brand-border text-sm font-extrabold">
                      <span className="text-brand-text">Montant total</span>
                      <span className="text-brand-accent font-mono">{priceBreakdown.total}€</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded-xl font-bold shadow-md btn-transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Enregistrement...</span>
                  ) : (
                    <>
                      <span>Confirmer la réservation</span>
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="pt-4 border-t border-brand-border space-y-2.5">
                  <div className="flex items-center text-[10px] text-brand-text font-semibold space-x-2">
                    <LockIcon className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Paiement sécurisé crypté SSL</span>
                  </div>
                  <div className="flex items-center text-[10px] text-brand-text font-semibold space-x-2">
                    <TrustIcon className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Contrat de location & Assurance inclus</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-brand-muted flex flex-col items-center justify-center">
                <CompassIcon className="w-8 h-8 mb-2 animate-bounce" />
                <p className="text-xs">Veuillez sélectionner un véhicule à gauche pour afficher le récapitulatif.</p>
              </div>
            )}
          </aside>
        </form>
      )}
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-12 w-full text-center py-24 text-brand-muted">
        <RefreshIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
        <p>Chargement du module de réservation...</p>
      </div>
    }>
      <ReservationContent />
    </Suspense>
  );
}
