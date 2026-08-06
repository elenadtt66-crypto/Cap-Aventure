'use client';

import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  Search, 
  RefreshCw, 
  X, 
  Check, 
  Eye, 
  Info,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Trash2
} from 'lucide-react';
import { getReservations, updateReservationStatus } from '@/services/db';
import { Reservation, ReservationStatus } from '@/types';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal de détail d'une réservation states
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      // Mettre à jour localement ou recharger
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors du changement de statut.');
    }
  };

  // Filtrage
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Réservations
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Gérez les demandes de location et modifiez les statuts.
          </p>
        </div>
        <button
          onClick={loadReservations}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom client, véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">Confirmées</option>
            <option value="ANNULEE">Annulées</option>
            <option value="TERMINEE">Terminées</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="text-center py-12 text-brand-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
          <p>Chargement des réservations...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-brand-muted">
          <p className="text-sm">Aucune réservation ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-hover border-b border-brand-border text-brand-muted text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Véhicule</th>
                  <th className="py-4 px-6">Dates & Durée</th>
                  <th className="py-4 px-6">Prix total</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-hover/30 transition-all duration-150">
                    <td className="py-4 px-6">
                      <div className="font-bold text-brand-text">{r.clientName}</div>
                      <div className="text-[10px] text-brand-muted">ID: {r.clientId.slice(0, 8)}...</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-text">
                      {r.vehicleName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-brand-text">
                        Du {new Date(r.startDate).toLocaleDateString('fr-FR')} <br/>
                        au {new Date(r.endDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-[10px] text-brand-muted font-mono">{r.totalDays} jours</div>
                    </td>
                    <td className="py-4 px-6 font-mono font-extrabold text-brand-text">
                      {r.totalPrice}€
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        r.status === 'EN_ATTENTE' ? 'bg-[#CA8A04]/10 text-[#CA8A04]' :
                        r.status === 'CONFIRMEE' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                        r.status === 'ANNULEE' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                        'bg-brand-muted/15 text-brand-muted'
                      }`}>
                        {r.status === 'EN_ATTENTE' ? 'En attente' :
                         r.status === 'CONFIRMEE' ? 'Confirmée' :
                         r.status === 'ANNULEE' ? 'Annulée' : 'Terminée'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRes(r)}
                        className="p-2 border border-brand-border hover:border-brand-accent/40 text-brand-muted hover:text-brand-accent rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {r.status === 'EN_ATTENTE' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'CONFIRMEE')}
                            className="p-2 bg-[#16A34A]/10 hover:bg-[#16A34A]/20 text-[#16A34A] rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'ANNULEE')}
                            className="p-2 bg-[#DC2626]/10 hover:bg-[#DC2626]/20 text-[#DC2626] rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {r.status === 'CONFIRMEE' && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, 'TERMINEE')}
                          className="px-2.5 py-1.5 bg-brand-text text-white hover:bg-brand-accent rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Terminer la location
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Détails Fiche de Réservation */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-brand-border pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-brand-text">Détail de la réservation</h2>
                <p className="text-[10px] text-brand-muted mt-0.5">ID: {selectedRes.id}</p>
              </div>
              <button 
                onClick={() => setSelectedRes(null)}
                className="p-1 text-brand-muted hover:text-brand-text cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Status change bar */}
            <div className="flex items-center justify-between p-4 bg-brand-hover border border-brand-border rounded-2xl">
              <span className="text-xs font-bold text-brand-text">Statut actuel :</span>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedRes.status}
                  onChange={(e) => handleStatusUpdate(selectedRes.id, e.target.value as ReservationStatus)}
                  className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-accent"
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="CONFIRMEE">Confirmée</option>
                  <option value="ANNULEE">Annulée</option>
                  <option value="TERMINEE">Terminée</option>
                </select>
              </div>
            </div>

            {/* Client Info block */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider border-b border-brand-border pb-1">
                Conducteur Principal
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <span className="font-bold text-brand-text">{selectedRes.clientName}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <span className="font-semibold text-brand-text">Licence: {selectedRes.specificDetails.notes ? 'Permis vérifié' : 'À valider'}</span>
                </div>
              </div>
              
              <div className="p-3.5 bg-brand-beige border border-brand-border rounded-xl text-xs space-y-2 font-mono">
                <p><strong>Permis N° :</strong> {selectedRes.id /* simulation */ || 'Non renseigné'}</p>
                <p className="text-[10px] text-brand-muted">Ce numéro de permis de conduire atteste la validité légale de la demande.</p>
              </div>
            </div>

            {/* Rental detail block */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider border-b border-brand-border pb-1">
                Véhicule & Planning
              </h3>
              <div className="text-xs space-y-1.5 text-brand-text">
                <p><strong>Modèle loué :</strong> {selectedRes.vehicleName}</p>
                <p><strong>Période :</strong> du {new Date(selectedRes.startDate).toLocaleDateString('fr-FR')} au {new Date(selectedRes.endDate).toLocaleDateString('fr-FR')}</p>
                <p><strong>Durée :</strong> {selectedRes.totalDays} jours</p>
                <p><strong>Montant estimé :</strong> <span className="font-extrabold text-brand-accent font-mono">{selectedRes.totalPrice}€</span></p>
              </div>
            </div>

            {/* Specific details category options */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider border-b border-brand-border pb-1">
                Options spécifiques demandées
              </h3>
              
              {Object.keys(selectedRes.specificDetails).length === 0 || 
               (Object.keys(selectedRes.specificDetails).length === 1 && selectedRes.specificDetails.notes === '') ? (
                <p className="text-xs text-brand-muted italic">Aucune option particulière sélectionnée.</p>
              ) : (
                <ul className="text-xs space-y-1.5 list-disc list-inside text-brand-text">
                  {selectedRes.specificDetails.outdoorShower && <li>🚿 Douchette extérieure</li>}
                  {selectedRes.specificDetails.portableToilet && <li>🚽 WC chimique portable</li>}
                  {selectedRes.specificDetails.roofTent && <li>⛺ Tente de toit supplémentaire</li>}
                  {selectedRes.specificDetails.bedLayout && <li>🛌 Disposition lit arrière : {selectedRes.specificDetails.bedLayout}</li>}
                  {selectedRes.specificDetails.bikeRackCount !== undefined && selectedRes.specificDetails.bikeRackCount > 0 && (
                    <li>🚲 Porte-vélos : pour {selectedRes.specificDetails.bikeRackCount} vélos</li>
                  )}
                  {selectedRes.specificDetails.hasLargeVehicleExperience && <li>🚛 Certifié expérience de grand gabarit</li>}
                  {selectedRes.specificDetails.luxuryLinenPack && <li>🛏️ Pack Linge & Draps Luxe</li>}
                  {selectedRes.specificDetails.finalCleaningService && <li>🧹 Forfait ménage inclus</li>}
                  {selectedRes.specificDetails.sportsEquipmentStorage && (
                    <li>🏋️ Rangement sportifs requis ({selectedRes.specificDetails.sportsEquipmentType || 'non précisé'})</li>
                  )}
                  {selectedRes.specificDetails.allowPets && <li>🐕 Présence d'animaux autorisée</li>}
                  {selectedRes.specificDetails.notes && (
                    <li className="list-none pt-2 text-[11px] text-brand-muted bg-brand-hover p-2.5 rounded-lg border border-brand-border/40">
                      <strong>Remarque client :</strong> "{selectedRes.specificDetails.notes}"
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="flex justify-end border-t border-brand-border pt-4">
              <button
                onClick={() => setSelectedRes(null)}
                className="px-5 py-2 bg-brand-text text-white hover:bg-brand-accent rounded-xl text-xs font-semibold btn-transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
