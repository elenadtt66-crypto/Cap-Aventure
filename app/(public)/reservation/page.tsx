'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getVehicles, createReservation } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';
import VanForm from '@/components/forms/VanForm';
import ProfileForm from '@/components/forms/ProfileForm';
import IntegralForm from '@/components/forms/IntegralForm';
import FourgonForm from '@/components/forms/FourgonForm';
import DatePicker from '@/components/ui/DatePicker';
import SelectMenu, { SelectMenuOption } from '@/components/ui/SelectMenu';

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
  const [selectedVehicleId, setSelectedVehicleId] = useState(searchParams.get('vehicleId') || searchParams.get('vehicle') || '');
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
        const param = searchParams.get('vehicle') || searchParams.get('vehicleId');
        if (param && list.length > 0) {
          const matched = list.find(v => v.id === param || v.slug === param);
          if (matched) {
            setSelectedVehicleId(matched.id);
          }
        } else if (!selectedVehicleId && list.length > 0) {
          setSelectedVehicleId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  // Options pour le select custom
  const vehicleOptions: SelectMenuOption[] = useMemo(() => {
    return vehicles.map(v => ({
      value: v.id,
      label: `${v.name} (${v.pricePerDay}€/j)`
    }));
  }, [vehicles]);

  // Détecter le véhicule actuellement sélectionné
  const currentVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null;
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

  // Décomposition des prix
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
    if (!clientData.firstName || !clientData.lastName || !clientData.email || !clientData.phone || !clientData.drivingLicenseNumber) {
      setError('Veuillez remplir tous les champs obligatoires du conducteur.');
      return;
    }

    setSubmitting(true);

    try {
      await createReservation({
        vehicleId: currentVehicle!.id,
        vehicleName: currentVehicle!.name,
        clientName: `${clientData.firstName} ${clientData.lastName}`,
        startDate,
        endDate,
        totalDays,
        totalPrice: priceBreakdown.total,
        status: 'EN_ATTENTE',
        specificDetails: specificData,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshIcon className="w-10 h-10 text-brand-accent animate-spin mx-auto" />
          <p className="text-brand-text font-bold text-sm">Chargement de votre demande de réservation...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-bg py-20 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-brand-border text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckIcon className="w-10 h-10" />
          </div>

          <span className="inline-block px-4 py-1.5 bg-brand-gold-light text-brand-navy text-xs font-extrabold rounded-full tracking-wider uppercase">
            Demande transmise avec succès
          </span>

          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Félicitations {clientData.firstName} !
          </h1>

          <p className="text-sm text-brand-muted leading-relaxed">
            Votre demande de réservation pour le véhicule <strong className="text-brand-text font-bold">{currentVehicle?.name}</strong> du <span className="text-brand-text font-bold">{new Date(startDate).toLocaleDateString('fr-FR')}</span> au <span className="text-brand-text font-bold">{new Date(endDate).toLocaleDateString('fr-FR')}</span> ({totalDays} jours) a été transmise au propriétaire.
          </p>

          <div className="p-4 bg-brand-beige rounded-2xl text-left border border-brand-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-muted">Montant estimé TTC :</span>
              <span className="font-bold text-brand-accent font-mono text-sm">{priceBreakdown.total} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Statut du dossier :</span>
              <span className="font-bold text-[#CA8A04] flex items-center">
                ● En attente de validation
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/vehicules')}
              className="px-6 py-3.5 bg-white border border-brand-border rounded-xl text-xs font-extrabold text-brand-text hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Explorer d'autres véhicules
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3.5 bg-brand-accent text-white rounded-xl text-xs font-extrabold hover:bg-brand-accent-hover transition-colors cursor-pointer"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-brand-muted">
            <CompassIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Cap Aventure</span>
            <span>/</span>
            <span>Réservation</span>
            <span>/</span>
            <span className="text-brand-text font-bold">{currentVehicle?.name || 'Sélection'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Finalisez votre demande de location
          </h1>
          <p className="text-sm text-brand-muted">
            Remplissez les informations relatives à votre séjour pour réserver auprès du propriétaire en toute sérénité.
          </p>
        </div>

        {/* Layout Split: Form (2 cols) vs Recap (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Left Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-brand-border p-6 md:p-8 rounded-3xl shadow-sm space-y-8">
            {error && (
              <div className="p-4 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Step 1: Vehicle & Dates Selection */}
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-brand-text border-b border-brand-border pb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-extrabold flex items-center justify-center mr-2">1</span>
                Choix du véhicule & des dates
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Véhicule sélectionné *
                  </label>
                  <SelectMenu
                    options={vehicleOptions}
                    value={selectedVehicleId}
                    onChange={(val) => setSelectedVehicleId(val)}
                    className="w-full"
                    placeholder="Sélectionnez un véhicule"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    id="startDate"
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
                    id="endDate"
                    label="Date de retour"
                    required
                    value={endDate}
                    onChange={(val) => setEndDate(val)}
                    minDate={startDate || new Date().toISOString().split('T')[0]}
                  />
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
                      placeholder="Ex: Maxime"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Nom *
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
                      placeholder="Ex: Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Email *
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
                      placeholder="maxime.dupont@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Téléphone *
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
                      placeholder="+33 6 12 34 56 78"
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

            {/* Submit Button */}
            <div className="pt-6 border-t border-brand-border">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-brand-accent text-white hover:bg-brand-accent-hover font-extrabold rounded-2xl shadow-lg shadow-brand-accent/20 hover-lift text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <RefreshIcon className="w-5 h-5 animate-spin" />
                    <span>Transmission de votre demande en cours...</span>
                  </>
                ) : (
                  <>
                    <LockIcon className="w-4 h-4" />
                    <span>Confirmer ma demande de réservation ({priceBreakdown.total} €)</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-brand-muted text-center mt-3">
                Paiement sécurisé. Aucun prélèvement avant acceptation formelle du propriétaire.
              </p>
            </div>
          </form>

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
                        <span className="text-brand-muted">Assurance tous risques (10%)</span>
                        <span className="font-semibold text-brand-text font-mono">{priceBreakdown.insurance}€</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-brand-border font-extrabold text-sm text-brand-navy">
                        <span>Total estimé TTC</span>
                        <span className="font-mono text-brand-accent">{priceBreakdown.total}€</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-brand-gold-light/40 border border-brand-accent/20 rounded-xl space-y-2 text-[11px]">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold">
                    <ShieldIcon className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Assurance multirisque incluse</span>
                  </div>
                  <p className="text-brand-muted leading-tight text-[10px]">
                    Assistance 24/7, franchise réduite et conducteur additionnel offert.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-muted">Aucun véhicule sélectionné.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg py-24 flex items-center justify-center">
        <RefreshIcon className="w-8 h-8 text-brand-accent animate-spin" />
      </div>
    }>
      <ReservationContent />
    </Suspense>
  );
}
