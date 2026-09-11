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
  Activity
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { getVehicles, getReservations } from '@/services/db';
import { Vehicle, Reservation } from '@/types';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  EN_ATTENTE:  { label: 'En attente',  bg: 'bg-[#CA8A04]/10', text: 'text-[#CA8A04]', icon: AlertCircle },
  CONFIRMEE:   { label: 'Confirmée',   bg: 'bg-[#16A34A]/10', text: 'text-[#16A34A]', icon: CheckCircle2 },
  ANNULEE:     { label: 'Annulée',     bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', icon: XCircle },
  TERMINEE:    { label: 'Terminée',    bg: 'bg-brand-muted/15', text: 'text-brand-muted', icon: CheckCircle2 },
};

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefreshSpin = false) => {
    if (showRefreshSpin) setRefreshing(true);
    else setLoading(true);
    try {
      const vData = await getVehicles();
      const rData = await getReservations();
      setVehicles(vData);
      setReservations(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          formatValue={(v) => v.toLocaleString('fr-FR')}
        />
      </div>

      {/* ——— Main Content: Reservations + Analytics ——— */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Dernières réservations (2/3) */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-brand-text">Dernières réservations</h2>
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
                    className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-brand-hover/40 px-2 -mx-2 rounded-xl transition-all duration-150 cursor-default"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${cfg.bg}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${cfg.text}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-brand-text text-sm truncate">{r.clientName}</p>
                        <p className="text-[11px] text-brand-muted truncate">
                          {r.vehicleName} · {new Date(r.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → {new Date(r.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 pl-9 sm:pl-0 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-extrabold text-brand-text font-mono whitespace-nowrap">
                        {r.totalPrice.toLocaleString('fr-FR')} €
                      </span>
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
    </div>
  );
}
