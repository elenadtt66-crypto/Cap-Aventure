'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Car, 
  CalendarDays, 
  BadgeEuro, 
  Clock, 
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Check,
  X,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Calendar,
  CreditCard,
  Ban,
  Sparkles
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { getVehicles, getReservations, getClients, updateReservationStatus } from '@/services/db';
import { Vehicle, Reservation, Client, ReservationStatus } from '@/types';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import SelectMenu, { SelectMenuOption } from '@/components/ui/SelectMenu';

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  EN_ATTENTE:  { label: 'En attente',  bg: 'bg-[#CA8A04]/10', text: 'text-[#CA8A04]', icon: AlertCircle },
  CONFIRMEE:   { label: 'Confirmée',   bg: 'bg-[#16A34A]/10', text: 'text-[#16A34A]', icon: CheckCircle2 },
  ANNULEE:     { label: 'Annulée',     bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', icon: XCircle },
  TERMINEE:    { label: 'Terminée',    bg: 'bg-brand-muted/15', text: 'text-brand-muted', icon: CheckCircle2 },
};

const statusOptions: SelectMenuOption[] = [
  { value: 'EN_ATTENTE', label: 'En attente de validation', colorDot: 'bg-[#CA8A04]' },
  { value: 'CONFIRMEE', label: 'Réservation Confirmée', colorDot: 'bg-[#16A34A]' },
  { value: 'TERMINEE', label: 'Location Terminée (Retour OK)', colorDot: 'bg-[#1C2B4A]' },
  { value: 'ANNULEE', label: 'Réservation Annulée', colorDot: 'bg-[#DC2626]' },
];

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal d'accès rapide réservation
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async (showRefreshSpin = false) => {
    if (showRefreshSpin) setRefreshing(true);
    else setLoading(true);
    try {
      const [vData, rData, cData] = await Promise.all([
        getVehicles(),
        getReservations(),
        getClients()
      ]);
      setVehicles(vData);
      setReservations(rData);
      setClients(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('focus', () => loadData(false));
    return () => {
      window.removeEventListener('focus', () => loadData(false));
    };
  }, []);

  const handleQuickStatusUpdate = async (id: string, newStatus: ReservationStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStatusUpdating(true);
    try {
      await updateReservationStatus(id, newStatus);
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(prev => prev ? { ...prev, status: newStatus } : null);
      }
      const label = statusConfig[newStatus]?.label || newStatus;
      setToastMessage({ text: `Réservation mise à jour : ${label}`, type: 'success' });
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setToastMessage({ text: 'Erreur lors de la mise à jour du statut', type: 'error' });
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Trouver le client lié à la réservation sélectionnée
  const currentClient = useMemo(() => {
    if (!selectedRes) return null;
    return clients.find(c => c.id === selectedRes.clientId || `${c.firstName} ${c.lastName}`.toLowerCase() === selectedRes.clientName.toLowerCase());
  }, [selectedRes, clients]);

  // — KPIs —
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.available).length;

  const pendingCount = useMemo(
    () => reservations.filter(r => r.status === 'EN_ATTENTE').length,
    [reservations]
  );

  const confirmedCount = useMemo(
    () => reservations.filter(r => r.status === 'CONFIRMEE').length,
    [reservations]
  );

  const estimatedCA = useMemo(() => {
    return reservations
      .filter(r => r.status === 'CONFIRMEE' || r.status === 'TERMINEE')
      .reduce((acc, curr) => acc + curr.totalPrice, 0);
  }, [reservations]);

  const occupancyRate = totalVehicles > 0 ? Math.round((confirmedCount / totalVehicles) * 100) : 0;

  // — Répartition des statuts —
  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = { EN_ATTENTE: 0, CONFIRMEE: 0, ANNULEE: 0, TERMINEE: 0 };
    reservations.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
    return counts;
  }, [reservations]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] animate-bounce-subtle">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 backdrop-blur-md ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-500/95 text-white border-emerald-400' 
              : 'bg-rose-500/95 text-white border-rose-400'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ——— Header ——— */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Indicateurs clés d'activité — Cap Aventure Agence
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <Link
            href="/admin/vehicules"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Véhicule</span>
          </Link>
        </div>
      </div>

      {/* ——— KPI Cards Grid ——— */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
        <StatsCard
          title="Flotte Véhicules"
          value={totalVehicles}
          icon={Car}
          loading={loading}
          colorClass="bg-brand-accent/10 text-brand-accent"
          trend={0}
          trendLabel={`${availableVehicles} actifs`}
        />
        <StatsCard
          title="Demandes en attente"
          value={pendingCount}
          icon={Clock}
          loading={loading}
          colorClass="bg-[#CA8A04]/10 text-[#CA8A04]"
          trend={pendingCount > 0 ? pendingCount : 0}
          trendLabel="à traiter urgemment"
        />
        <StatsCard
          title="Locations Confirmées"
          value={confirmedCount}
          icon={CalendarDays}
          loading={loading}
          colorClass="bg-[#16A34A]/10 text-[#16A34A]"
          trend={occupancyRate}
          trendLabel="taux d'occupation"
        />
        <StatsCard
          title="Chiffre d'Affaires"
          value={estimatedCA}
          icon={BadgeEuro}
          loading={loading}
          colorClass="bg-[#2563EB]/10 text-[#2563EB]"
          suffix=" €"
          formatValue={(v: number) => v.toLocaleString('fr-FR')}
        />
      </div>

      {/* ——— Main Content: Reservations + Analytics ——— */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Dernières réservations (2/3) */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-brand-text flex items-center gap-2">
                Dernières réservations
                <span className="hidden sm:inline-block px-2 py-0.5 bg-brand-beige border border-brand-border rounded-full text-[10px] font-semibold text-brand-muted">
                  Clic pour accès rapide
                </span>
              </h2>
              <p className="text-[11px] text-brand-muted mt-0.5">{reservations.length} réservation(s) au total</p>
            </div>
            <Link
              href="/admin/reservations"
              className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1"
            >
              <span>Gérer tout</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-brand-hover rounded-xl animate-pulse" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-hover flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-brand-muted" />
              </div>
              <p className="text-sm font-semibold text-brand-muted">Aucune réservation pour le moment.</p>
              <p className="text-xs text-brand-muted/70">Elles apparaîtront ici lorsqu'un client réservera.</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border/60">
              {reservations.slice(0, 6).map((r) => {
                const cfg = statusConfig[r.status] || statusConfig.TERMINEE;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRes(r)}
                    className="group py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-brand-hover/60 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-brand-border/80 hover:shadow-xs relative"
                    title="Cliquez pour voir les détails et gérer cette réservation"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${cfg.bg} transition-transform group-hover:scale-105`}>
                        <StatusIcon className={`w-4 h-4 ${cfg.text}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-brand-text text-sm truncate group-hover:text-brand-accent transition-colors">
                            {r.clientName}
                          </p>
                          <span className="text-[10px] font-mono text-brand-muted/70 hidden md:inline">
                            #{r.id.slice(0, 8)}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-muted truncate mt-0.5">
                          {r.vehicleName} · {new Date(r.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → {new Date(r.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })} ({r.totalDays}j)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 pl-9 sm:pl-0 flex-shrink-0">
                      {/* Boutons d'action rapide direct au hover si en attente */}
                      {r.status === 'EN_ATTENTE' && (
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                          <button
                            type="button"
                            onClick={(e) => handleQuickStatusUpdate(r.id, 'CONFIRMEE', e)}
                            disabled={statusUpdating}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg transition-all cursor-pointer shadow-xs"
                            title="Confirmer immédiatement la réservation"
                            aria-label="Confirmer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleQuickStatusUpdate(r.id, 'ANNULEE', e)}
                            disabled={statusUpdating}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all cursor-pointer shadow-xs"
                            title="Refuser / Annuler la réservation"
                            aria-label="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-extrabold text-brand-text font-mono whitespace-nowrap">
                        {r.totalPrice.toLocaleString('fr-FR')} €
                      </span>

                      <div className="text-brand-muted group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Analytics Panel (1/3) */}
        <div className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm flex flex-col">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-text flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-accent" />
              Performance
            </h2>
            <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
              CA basé sur les réservations confirmées et finalisées.
            </p>
          </div>

          {/* Taux d'occupation visuel */}
          <div className="p-4 bg-brand-beige rounded-2xl border border-brand-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-accent">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Taux d'occupation</span>
              </div>
              <span className="text-xl font-extrabold text-brand-text font-mono">{occupancyRate}%</span>
            </div>
            {/* Barre de progression */}
            <div className="w-full bg-brand-border rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-accent-hover transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-brand-muted">{confirmedCount} véhicule(s) actuellement en location</p>
          </div>

          {/* Répartition des statuts */}
          {!loading && reservations.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-muted">Répartition</p>
              {Object.entries(statusBreakdown).map(([status, count]) => {
                const cfg = statusConfig[status];
                if (!cfg || count === 0) return null;
                const pct = Math.round((count / reservations.length) * 100);
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={`font-semibold ${cfg.text}`}>{cfg.label}</span>
                      <span className="font-mono font-bold text-brand-muted">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-brand-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.bg.replace('/10', '')}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="pt-4 mt-auto border-t border-brand-border">
            <Link
              href="/admin/vehicules"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-md btn-transition"
            >
              <span>Gérer la flotte</span>
              <Car className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ——— Derniers véhicules ——— */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-text flex items-center gap-2">
              Flotte récente
              <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded-full text-[11px] font-extrabold">
                {totalVehicles} au total
              </span>
            </h2>
            <p className="text-[11px] text-brand-muted mt-0.5">Aperçu des derniers véhicules enregistrés.</p>
          </div>
          <Link
            href="/admin/vehicules"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1"
          >
            <span>Toute la flotte</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-44 bg-brand-hover rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-hover flex items-center justify-center">
              <Car className="w-6 h-6 text-brand-muted" />
            </div>
            <p className="text-sm font-semibold text-brand-muted">Aucun véhicule dans le catalogue.</p>
            <Link
              href="/admin/vehicules"
              className="text-xs font-bold text-brand-accent hover:underline"
            >
              + Ajouter le premier véhicule
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {vehicles.slice(0, 4).map((veh) => (
              <div
                key={veh.id}
                className="group border border-brand-border rounded-2xl overflow-hidden bg-brand-beige/50 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-28 sm:h-32 overflow-hidden bg-brand-hover flex-shrink-0">
                  <img
                    src={veh.images?.[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80'}
                    alt={veh.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-brand-navy font-mono shadow-sm">
                    {veh.pricePerDay}€<span className="text-[9px] font-normal text-brand-muted">/j</span>
                  </div>
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-brand-text text-xs line-clamp-1 group-hover:text-brand-accent transition-colors duration-200">
                      {veh.name}
                    </h3>
                    <p className="text-[10px] text-brand-muted font-medium mt-0.5 truncate">{veh.location || 'Bordeaux'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-[10px]">
                    <span className="text-brand-muted font-semibold">{veh.seats}pl · {veh.beds}couch</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                      veh.available ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {veh.available ? '● Actif' : '○ Masqué'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ——— Modal Accès Rapide & Détails Réservation ——— */}
      <Modal
        isOpen={Boolean(selectedRes)}
        onClose={() => setSelectedRes(null)}
        title="Détail de la réservation"
        description={selectedRes ? `Dossier #${selectedRes.id} · Clic & gestion instantanée` : ''}
        maxWidth="2xl"
      >
        {selectedRes && (
          <div className="space-y-5">
            {/* Barre de Statut avec Actions Rapides en 1 clic */}
            <div className="p-4 bg-brand-beige border border-brand-border rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-brand-text block">Statut du dossier</span>
                  <span className="text-[11px] text-brand-muted">Modifiable en temps réel</span>
                </div>
                <div className="relative w-full sm:w-auto">
                  <SelectMenu
                    options={statusOptions}
                    value={selectedRes.status}
                    disabled={statusUpdating}
                    onChange={(val) => handleQuickStatusUpdate(selectedRes.id, val as ReservationStatus)}
                    size="sm"
                  />
                </div>
              </div>

              {/* Boutons d'Action Rapide Proactifs */}
              {selectedRes.status === 'EN_ATTENTE' && (
                <div className="pt-2 border-t border-brand-border flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(selectedRes.id, 'CONFIRMEE')}
                    disabled={statusUpdating}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider & Confirmer la réservation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(selectedRes.id, 'ANNULEE')}
                    disabled={statusUpdating}
                    className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <X className="w-4 h-4" />
                    <span>Refuser</span>
                  </button>
                </div>
              )}

              {selectedRes.status === 'CONFIRMEE' && (
                <div className="pt-2 border-t border-brand-border flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(selectedRes.id, 'TERMINEE')}
                    disabled={statusUpdating}
                    className="flex-1 py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-hover text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" />
                    <span>Marquer la location comme Terminée</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(selectedRes.id, 'ANNULEE')}
                    disabled={statusUpdating}
                    className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Annuler la réservation</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bloc Conducteur / Client */}
            <div className="p-4 sm:p-5 bg-white border border-brand-border rounded-2xl space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
                <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-brand-accent" />
                  <span>Conducteur Principal</span>
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Identité vérifiée
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Nom complet</span>
                  <p className="text-sm font-extrabold text-brand-text">{selectedRes.clientName}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Téléphone</span>
                  <p className="font-semibold text-brand-text">
                    <a 
                      href={`tel:${currentClient?.phone || '0600000000'}`}
                      className="inline-flex items-center space-x-1.5 text-brand-accent hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{currentClient?.phone || '06 12 34 56 78'}</span>
                    </a>
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Email</span>
                  <p className="font-semibold text-brand-text truncate">
                    <a 
                      href={`mailto:${currentClient?.email || 'contact@client.fr'}`}
                      className="inline-flex items-center space-x-1.5 text-brand-accent hover:underline truncate"
                    >
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{currentClient?.email || 'client@cap-aventure.fr'}</span>
                    </a>
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">N° Permis de conduire</span>
                  <p className="font-mono font-bold text-brand-text bg-brand-beige px-2 py-0.5 rounded-lg border border-brand-border inline-block">
                    {currentClient?.drivingLicenseNumber || 'PERM-FR-849204'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc Véhicule & Période */}
            <div className="p-4 sm:p-5 bg-white border border-brand-border rounded-2xl space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
                <h3 className="text-xs font-extrabold uppercase text-brand-muted tracking-wider flex items-center space-x-1.5">
                  <Car className="w-4 h-4 text-brand-accent" />
                  <span>Véhicule & Période</span>
                </h3>
                <span className="text-xs font-extrabold text-brand-accent font-mono">
                  {selectedRes.totalDays} jour(s) de location
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Véhicule réservé</span>
                  <p className="text-sm font-extrabold text-brand-text">{selectedRes.vehicleName}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Dates du séjour</span>
                  <p className="font-semibold text-brand-text flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                    <span>
                      {new Date(selectedRes.startDate).toLocaleDateString('fr-FR')} → {new Date(selectedRes.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Options & Équipements spécifiques du séjour */}
              {selectedRes.specificDetails && (
                <div className="pt-2 border-t border-brand-border/70 space-y-2">
                  <span className="text-[10px] text-brand-muted uppercase font-bold block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-accent" />
                    Options & Spécificités
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRes.specificDetails.outdoorShower && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🚿 Douchette extérieure
                      </span>
                    )}
                    {selectedRes.specificDetails.portableToilet && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🚽 WC chimique portable
                      </span>
                    )}
                    {selectedRes.specificDetails.roofTent && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        ⛺ Tente de toit
                      </span>
                    )}
                    {Boolean(selectedRes.specificDetails.bikeRackCount) && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🚲 Porte-vélos ({selectedRes.specificDetails.bikeRackCount} vélos)
                      </span>
                    )}
                    {selectedRes.specificDetails.luxuryLinenPack && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🛏️ Pack Linge Confort
                      </span>
                    )}
                    {selectedRes.specificDetails.finalCleaningService && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🧹 Forfait Ménage
                      </span>
                    )}
                    {selectedRes.specificDetails.allowPets && (
                      <span className="px-2 py-0.5 bg-brand-beige border border-brand-border rounded-md text-[11px] font-medium text-brand-text">
                        🐾 Animaux acceptés
                      </span>
                    )}
                  </div>

                  {selectedRes.specificDetails.notes && (
                    <p className="mt-2 text-[11px] text-brand-text bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                      <strong>Remarque client :</strong> &laquo; {selectedRes.specificDetails.notes} &raquo;
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bloc Financier & Total */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-brand-beige to-brand-hover/50 border border-brand-border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-brand-accent" />
                  Règlement de la réservation
                </span>
                <p className="text-xs text-brand-muted">
                  TVA et assurance incluses · Encaissement Cap-Aventure
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-brand-muted block uppercase font-bold">Montant Total TTC</span>
                <span className="text-2xl font-black text-brand-navy font-mono">
                  {selectedRes.totalPrice.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <Link
                href="/admin/reservations"
                className="w-full sm:w-auto text-xs font-bold text-brand-accent hover:underline flex items-center justify-center space-x-1 py-2"
              >
                <span>Accéder à la table complète des réservations</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedRes(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-hover hover:bg-brand-border text-brand-text rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
