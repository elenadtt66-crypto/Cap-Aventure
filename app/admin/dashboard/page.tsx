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
  ArrowRight
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Indicateurs clés d'activité de l'agence Cap Aventure.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-children">
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
          title="Chiffre d'Affaires (€)" 
          value={estimatedCA} 
          icon={BadgeEuro} 
          loading={loading}
          colorClass="bg-[#2563EB]/10 text-[#2563EB]"
        />
      </div>

      {/* Recent reservations & Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Activity list (2 cols wide) */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-brand-text">Dernières demandes de réservation</h2>
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
                <div key={r.id} className="py-4 flex justify-between items-center hover:bg-brand-hover/40 px-2 rounded-xl transition-all duration-200">
                  <div className="space-y-1">
                    <p className="font-bold text-brand-text text-sm">
                      {r.clientName}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {r.vehicleName} • Du {new Date(r.startDate).toLocaleDateString('fr-FR')} au {new Date(r.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
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
    </div>
  );
}
