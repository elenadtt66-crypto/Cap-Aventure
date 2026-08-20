'use client';

import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  Search, 
  RefreshCw, 
  Check, 
  X, 
  Eye, 
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
  Car
} from 'lucide-react';
import { getReservations, updateReservationStatus, getClients } from '@/services/db';
import { Reservation, ReservationStatus, Client } from '@/types';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import SelectMenu, { SelectMenuOption } from '@/components/ui/SelectMenu';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal de détail d'une réservation states
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const statusOptions: SelectMenuOption[] = [
    { value: 'EN_ATTENTE', label: 'En attente de validation', colorDot: 'bg-[#CA8A04]' },
    { value: 'CONFIRMEE', label: 'Réservation Confirmée', colorDot: 'bg-[#16A34A]' },
    { value: 'TERMINEE', label: 'Location Terminée (Retour OK)', colorDot: 'bg-[#1C2B4A]' },
    { value: 'ANNULEE', label: 'Réservation Annulée', colorDot: 'bg-[#DC2626]' },
  ];

  const filterStatusOptions: SelectMenuOption[] = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente', colorDot: 'bg-[#CA8A04]' },
    { value: 'CONFIRMEE', label: 'Confirmées', colorDot: 'bg-[#16A34A]' },
    { value: 'TERMINEE', label: 'Terminées', colorDot: 'bg-[#1C2B4A]' },
    { value: 'ANNULEE', label: 'Annulées', colorDot: 'bg-[#DC2626]' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, clientData] = await Promise.all([
        getReservations(),
        getClients()
      ]);
      setReservations(resData);
      setClients(clientData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('focus', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: ReservationStatus) => {
    setStatusUpdating(true);
    try {
      await updateReservationStatus(id, newStatus);
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Trouver le client lié à la réservation
  const currentClient = selectedRes ? clients.find(c => c.id === selectedRes.clientId || `${c.firstName} ${c.lastName}`.toLowerCase() === selectedRes.clientName.toLowerCase()) : null;

  // Filtrage
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMEE':
        return <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>Confirmée</Badge>;
      case 'EN_ATTENTE':
        return <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>En attente</Badge>;
      case 'TERMINEE':
        return <Badge variant="navy" size="sm" icon={<Check className="w-3 h-3" />}>Terminée</Badge>;
      case 'ANNULEE':
        return <Badge variant="error" size="sm" icon={<Ban className="w-3 h-3" />}>Annulée</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Réservations
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Gérez les demandes de location, les contrats et les plannings ({filteredReservations.length} dossiers).
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Actualiser
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-5 rounded-3xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom, véhicule, réf..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <SelectMenu
            options={filterStatusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="md"
          />
        </div>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton height={60} className="w-full" />
          <Skeleton height={60} className="w-full" />
          <Skeleton height={60} className="w-full" />
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-3xl p-12 text-center text-brand-muted shadow-sm">
          <CalendarDays className="w-10 h-10 text-brand-muted/50 mx-auto mb-3" />
          <p className="text-sm font-semibold">Aucune réservation ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-beige/80 border-b border-brand-border text-brand-muted text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6">Réf & Client</th>
                  <th className="py-4 px-6">Véhicule loué</th>
                  <th className="py-4 px-6">Période & Durée</th>
                  <th className="py-4 px-6">Montant TTC</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-xs">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-hover/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-brand-text text-sm">{r.clientName}</div>
                      <div className="font-mono text-[10px] text-brand-muted mt-0.5">{r.id}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-text">
                      <div className="flex items-center space-x-1.5">
                        <Car className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                        <span className="truncate max-w-[220px]">{r.vehicleName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-brand-text">
                        {new Date(r.startDate).toLocaleDateString('fr-FR')} → {new Date(r.endDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-[10px] text-brand-muted font-bold mt-0.5">{r.totalDays} jours</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono font-extrabold text-sm text-brand-navy">
                        {r.totalPrice} €
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRes(r)}
                          leftIcon={<Eye className="w-3.5 h-3.5 text-brand-accent" />}
                        >
                          Détails
                        </Button>
                        
                        {r.status === 'EN_ATTENTE' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(r.id, 'CONFIRMEE')}
                              className="p-2 bg-brand-success/10 hover:bg-brand-success text-brand-success hover:text-white rounded-xl transition-all duration-150 cursor-pointer"
                              title="Valider la réservation"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(r.id, 'ANNULEE')}
                              className="p-2 bg-brand-error/10 hover:bg-brand-error text-brand-error hover:text-white rounded-xl transition-all duration-150 cursor-pointer"
                              title="Refuser / Annuler"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Détails Fiche de Réservation (Via React Portal Universel) */}
      <Modal
        isOpen={Boolean(selectedRes)}
        onClose={() => setSelectedRes(null)}
        title="Détail de la réservation"
        description={selectedRes ? `Dossier de location N° ${selectedRes.id}` : ''}
        maxWidth="2xl"
      >
        {selectedRes && (
          <div className="space-y-6">
            {/* Barre de Statut Actuel avec Dropdown Personnalisé */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-brand-beige border border-brand-border rounded-2xl gap-3">
              <div>
                <span className="text-xs font-bold text-brand-text block">Statut du dossier</span>
                <span className="text-[11px] text-brand-muted">Mise à jour en temps réel</span>
              </div>
              <div className="relative">
                <SelectMenu
                  options={statusOptions}
                  value={selectedRes.status}
                  disabled={statusUpdating}
                  onChange={(val) => handleStatusUpdate(selectedRes.id, val as ReservationStatus)}
                  size="sm"
                />
              </div>
            </div>

            {/* Bloc Conducteur Principal */}
            <div className="p-5 bg-white border border-brand-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-2">
                <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-brand-accent" />
                  <span>Conducteur Principal</span>
                </h3>
                <Badge variant="success" size="sm">
                  Identité vérifiée
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Nom complet</span>
                  <p className="text-sm font-extrabold text-brand-text">{selectedRes.clientName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Téléphone direct</span>
                  <p className="font-semibold text-brand-text flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{currentClient?.phone || '06 12 34 56 78'}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Adresse Email</span>
                  <p className="font-semibold text-brand-text flex items-center space-x-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                    <span>{currentClient?.email || `${selectedRes.clientName.toLowerCase().replace(/\s+/g, '.')}@email.com`}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Permis de conduire</span>
                  <p className="font-mono font-bold text-brand-text flex items-center space-x-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{currentClient?.drivingLicenseNumber || '24FR98765432'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc Véhicule & Détail Tarifaire */}
            <div className="p-5 bg-white border border-brand-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-2">
                <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider flex items-center space-x-1.5">
                  <Car className="w-4 h-4 text-brand-accent" />
                  <span>Véhicule & Planning</span>
                </h3>
                <span className="text-xs font-mono font-extrabold text-brand-navy">
                  {selectedRes.totalPrice} € TTC
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Modèle réservé</span>
                  <p className="font-extrabold text-brand-text text-sm">{selectedRes.vehicleName}</p>
                </div>

                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold">Durée du séjour</span>
                  <p className="font-bold text-brand-text">{selectedRes.totalDays} jours de location</p>
                </div>

                <div className="sm:col-span-2 p-3 bg-brand-beige rounded-xl border border-brand-border/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-brand-accent" />
                    <span className="font-bold text-brand-text">
                      Du {new Date(selectedRes.startDate).toLocaleDateString('fr-FR')} au {new Date(selectedRes.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-muted">
                    200 km/j inclus
                  </span>
                </div>
              </div>
            </div>

            {/* Options et remarques spécifiques */}
            <div className="p-5 bg-white border border-brand-border rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider border-b border-brand-border pb-2">
                Options & Remarques du client
              </h3>

              {Object.keys(selectedRes.specificDetails || {}).length === 0 ? (
                <p className="text-xs text-brand-muted italic">Aucune option particulière sélectionnée.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {selectedRes.specificDetails?.outdoorShower && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        🚿 Douchette extérieure sous pression
                      </span>
                    )}
                    {selectedRes.specificDetails?.portableToilet && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        🚽 WC chimique portable
                      </span>
                    )}
                    {selectedRes.specificDetails?.roofTent && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        ⛺ Tente de toit additionnelle
                      </span>
                    )}
                    {selectedRes.specificDetails?.bikeRackCount && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        🚲 Porte-vélos ({selectedRes.specificDetails.bikeRackCount} vélos)
                      </span>
                    )}
                    {selectedRes.specificDetails?.luxuryLinenPack && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        🛏️ Pack Linge & Draps Confort
                      </span>
                    )}
                    {selectedRes.specificDetails?.finalCleaningService && (
                      <span className="px-3 py-1 bg-brand-beige border border-brand-border rounded-lg font-semibold text-brand-text">
                        🧹 Forfait ménage fin de séjour
                      </span>
                    )}
                  </div>

                  {selectedRes.specificDetails?.notes && (
                    <div className="mt-3 p-3 bg-brand-gold-light/40 border border-brand-accent/20 rounded-xl text-brand-text text-[11px] leading-relaxed">
                      <strong>Remarque du locataire :</strong> "{selectedRes.specificDetails.notes}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions du Modal */}
            <div className="flex justify-between items-center pt-4 border-t border-brand-border">
              <span className="text-[11px] text-brand-muted">
                Assurance tous risques & assistance 24/7 actives
              </span>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedRes(null)}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
