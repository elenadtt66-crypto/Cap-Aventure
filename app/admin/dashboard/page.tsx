'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Car, 
  CalendarDays, 
  BadgeEuro, 
  Clock, 
  RefreshCw,
  TrendingUp,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { getVehicles, getReservations } from '@/services/db';
import { Vehicle, Reservation } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const vData = await getVehicles();
      const rData = await getReservations();
      setVehicles(vData);
      setReservations(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculs KPIs
  const totalVehicles = vehicles.length;
  const pendingReservationsCount = useMemo(() => {
    return reservations.filter(r => r.status === 'EN_ATTENTE').length;
  }, [reservations]);

  const activeReservationsCount = useMemo(() => {
    return reservations.filter(r => r.status === 'CONFIRMEE').length;
  }, [reservations]);

  const estimatedCA = useMemo(() => {
    // Somme des CA des réservations confirmées ou terminées
    return reservations
      .filter(r => r.status === 'CONFIRMEE' || r.status === 'TERMINEE')
      .reduce((acc, curr) => acc + curr.totalPrice, 0);
  }, [reservations]);

  return (
    <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0ms' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Indicateurs clés d'activité de l'agence Cap Aventure.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={loadData}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <Link
            href="/admin/vehicules"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Véhicule</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children">
        <StatsCard 
          title="Flotte Véhicules" 
          value={totalVehicles} 
          icon={Car} 
          loading={loading}
          colorClass="bg-brand-accent/10 text-brand-accent"
        />
        <StatsCard 
          title="Demandes en attente" 
          value={pendingReservationsCount} 
          icon={Clock} 
          loading={loading}
          colorClass="bg-[#CA8A04]/10 text-[#CA8A04]"
        />
        <StatsCard 
          title="Locations Confirmées" 
          value={activeReservationsCount} 
          icon={CalendarDays} 
          loading={loading}
          colorClass="bg-[#16A34A]/10 text-[#16A34A]"
        />
        <StatsCard 
          title="Chiffre d'Affaires" 
          value={estimatedCA} 
          icon={BadgeEuro} 
          loading={loading}
          colorClass="bg-[#2563EB]/10 text-[#2563EB]"
        />
      </div>

      {/* Recent reservations & Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Latest Activity list (2 cols wide) */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-bold text-brand-text">Dernières demandes de réservation</h2>
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
              <div className="h-12 bg-brand-hover rounded-xl animate-pulse"></div>
              <div className="h-12 bg-brand-hover rounded-xl animate-pulse"></div>
              <div className="h-12 bg-brand-hover rounded-xl animate-pulse"></div>
            </div>
          ) : reservations.length === 0 ? (
            <p className="text-xs text-brand-muted py-8 text-center bg-brand-beige/20 rounded-xl border border-dashed border-brand-border">Aucune réservation pour le moment.</p>
          ) : (
            <div className="divide-y divide-brand-border">
              {reservations.slice(0, 5).map((r) => (
                <div key={r.id} className="py-3.5 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 hover:bg-brand-hover/40 px-2 rounded-xl transition-all duration-200">
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-brand-text text-sm truncate">
                      {r.clientName}
                    </p>
                    <p className="text-xs text-brand-muted truncate">
                      {r.vehicleName} • Du {new Date(r.startDate).toLocaleDateString('fr-FR')} au {new Date(r.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-brand-border/40">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      r.status === 'EN_ATTENTE' ? 'bg-[#CA8A04]/10 text-[#CA8A04]' :
                      r.status === 'CONFIRMEE' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                      r.status === 'ANNULEE' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                      'bg-brand-muted/15 text-brand-muted'
                    }`}>
                      {r.status === 'EN_ATTENTE' ? 'En attente' :
                       r.status === 'CONFIRMEE' ? 'Confirmée' :
                       r.status === 'ANNULEE' ? 'Annulée' : 'Terminée'}
                    </span>
                    <span className="text-xs font-bold text-brand-text font-mono">
                      {r.totalPrice}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick analytics card (1 col wide) */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-brand-text">Performance Agence</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Le chiffre d'affaires est estimé sur la base des réservations confirmées et déjà réglées/finalisées.
            </p>
            <div className="p-4 bg-brand-hover border border-brand-border rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-brand-accent">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Taux d'occupation</span>
              </div>
              <p className="text-2xl font-extrabold text-brand-text font-mono">
                {totalVehicles > 0 
                  ? Math.round((activeReservationsCount / totalVehicles) * 100) 
                  : 0}%
              </p>
              <p className="text-[10px] text-brand-muted">Proportion de véhicules loués ce mois-ci.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-border text-center">
            <Link
              href="/admin/vehicules"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-md btn-transition"
            >
              <span>Ajouter un véhicule</span>
              <Car className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Vehicles Section */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <span>Derniers véhicules ajoutés</span>
              <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded-full text-[11px] font-extrabold">
                {totalVehicles} au total
              </span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Aperçu des derniers véhicules enregistrés dans votre flotte.
            </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-44 bg-brand-hover rounded-2xl animate-pulse"></div>
            <div className="h-44 bg-brand-hover rounded-2xl animate-pulse"></div>
            <div className="h-44 bg-brand-hover rounded-2xl animate-pulse"></div>
            <div className="h-44 bg-brand-hover rounded-2xl animate-pulse"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <p className="text-xs text-brand-muted py-8 text-center bg-brand-beige/20 rounded-xl border border-dashed border-brand-border">
            Aucun véhicule enregistré dans le catalogue.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vehicles.slice(0, 4).map((veh) => (
              <div 
                key={veh.id}
                className="group border border-brand-border rounded-2xl overflow-hidden bg-brand-beige/30 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-32 overflow-hidden bg-brand-hover">
                  <img 
                    src={veh.images?.[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80'} 
                    alt={veh.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-brand-navy font-mono shadow-sm">
                    {veh.pricePerDay}€ <span className="text-[9px] font-normal text-brand-muted">/j</span>
                  </div>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-brand-text text-xs line-clamp-1 group-hover:text-brand-accent transition-colors">
                      {veh.name}
                    </h3>
                    <p className="text-[11px] text-brand-muted font-medium mt-0.5">
                      {veh.location || 'Bordeaux'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-[10px]">
                    <span className="text-brand-muted font-semibold">
                      {veh.seats} pl. • {veh.beds} couch.
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      veh.available ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {veh.available ? 'Actif' : 'Masqué'}
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
