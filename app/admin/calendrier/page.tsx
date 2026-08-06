'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  RefreshCw,
  Info
} from 'lucide-react';
import { getReservations, getVehicles } from '@/services/db';
import { Reservation, Vehicle } from '@/types';
import DateRangePicker from '@/components/admin/DateRangePicker';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function AdminCalendar() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Date de navigation calendrier — mois affiché
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filtre par plage de dates
  const [filterRange, setFilterRange] = useState<DateRange>({ startDate: null, endDate: null });

  const loadData = async () => {
    setLoading(true);
    try {
      const rData = await getReservations();
      const vData = await getVehicles();
      setReservations(rData);
      setVehicles(vData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Nom du mois en français
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // Calcul du calendrier
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const days: ({ dayNumber: number; dateString: string } | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({ dayNumber: d, dateString: toDateStr(year, month, d) });
    }
    return days;
  }, [year, month]);

  // Trouver les réservations actives pour un jour donné
  const getReservationsForDay = (dateStr: string) => {
    return reservations.filter((r) => {
      if (r.status === 'ANNULEE') return false;
      // Filtre par plage sélectionnée
      if (filterRange.startDate && filterRange.endDate) {
        const resStart = r.startDate;
        const resEnd = r.endDate;
        // Chevauchement : réservation doit intersecter la plage filtrée
        if (resEnd < filterRange.startDate || resStart > filterRange.endDate) return false;
      }
      const start = new Date(r.startDate).getTime();
      const end = new Date(r.endDate).getTime();
      const current = new Date(dateStr).getTime();
      return current >= start && current <= end;
    });
  };

  // Vérifier si une cellule jour est dans la plage filtrée
  const isInFilterRange = (dateStr: string): boolean => {
    if (!filterRange.startDate || !filterRange.endDate) return false;
    return dateStr >= filterRange.startDate && dateStr <= filterRange.endDate;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const vehicleTypeColor: Record<string, string> = {
    van_amenege: '#EA580C',
    camping_car_profile: '#16A34A',
    camping_car_integral: '#2563EB',
    fourgon_amenege: '#8B5CF6',
  };

  // Stats rapides
  const activeReservations = reservations.filter(r => r.status !== 'ANNULEE');
  const pendingCount = reservations.filter(r => r.status === 'EN_ATTENTE').length;
  const confirmedCount = reservations.filter(r => r.status === 'CONFIRMEE').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Planning des locations
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Visualisez les dates d'occupation de vos camping-cars et vans.
          </p>
        </div>

        {/* Quick stats strip */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-text shadow-sm">
            <span className="text-brand-muted font-semibold">En attente </span>
            <span className="font-mono text-[#CA8A04] ml-1">{pendingCount}</span>
          </div>
          <div className="px-4 py-2 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-text shadow-sm">
            <span className="text-brand-muted font-semibold">Confirmées </span>
            <span className="font-mono text-[#16A34A] ml-1">{confirmedCount}</span>
          </div>
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Toolbar — Date Range Filter + Nav mois */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-brand-border p-4 rounded-2xl shadow-sm">
        {/* DateRangePicker */}
        <div className="w-full md:w-80">
          <DateRangePicker
            value={filterRange}
            onChange={(range) => setFilterRange(range)}
            placeholder="Filtrer par période..."
            label="Filtrer les réservations"
          />
        </div>

        {/* Navigation mois */}
        <div className="flex items-center space-x-2 bg-brand-beige border border-brand-border p-1.5 rounded-xl">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white rounded-lg transition-all duration-200 cursor-pointer text-brand-text shadow-sm hover:shadow"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-sm font-extrabold text-brand-text px-3 min-w-36 text-center capitalize">
            {monthName}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white rounded-lg transition-all duration-200 cursor-pointer text-brand-text shadow-sm hover:shadow"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-brand-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
          <p>Chargement du planning...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Legend sidebar */}
          <div className="bg-white border border-brand-border p-6 rounded-2xl space-y-6 shadow-sm">
            <h3 className="font-extrabold text-brand-text text-sm border-b border-brand-border pb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-brand-accent" />
              <span>Légende véhicules</span>
            </h3>

            {vehicles.length === 0 ? (
              <p className="text-xs text-brand-muted italic">Aucun véhicule enregistré.</p>
            ) : (
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <div key={v.id} className="flex items-center space-x-3 text-xs group">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: vehicleTypeColor[v.type] || '#8B5CF6' }}
                    />
                    <span className="font-semibold text-brand-text truncate">{v.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Statut legend */}
            <div className="border-t border-brand-border pt-4 space-y-2.5">
              <p className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Statuts</p>
              {[
                { label: 'En attente', color: 'bg-[#CA8A04]' },
                { label: 'Confirmée', color: 'bg-[#16A34A]' },
                { label: 'Terminée', color: 'bg-brand-muted' },
              ].map(s => (
                <div key={s.label} className="flex items-center space-x-2.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-brand-text font-medium">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Filtre actif info */}
            {(filterRange.startDate || filterRange.endDate) && (
              <div className="border-t border-brand-border pt-4">
                <p className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider mb-2">Filtre actif</p>
                <div className="p-2.5 bg-brand-accent/8 border border-brand-accent/20 rounded-xl text-[10px] text-brand-accent font-bold">
                  {filterRange.startDate && new Date(filterRange.startDate).toLocaleDateString('fr-FR')}
                  {filterRange.endDate && ` → ${new Date(filterRange.endDate).toLocaleDateString('fr-FR')}`}
                </div>
              </div>
            )}
          </div>

          {/* Calendar grid */}
          <div className="lg:col-span-3 bg-white border border-brand-border p-6 rounded-3xl shadow-sm space-y-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekdays.map((day) => (
                <div key={day} className="text-[10px] font-extrabold uppercase text-brand-muted tracking-widest py-2">
                  {day}
                </div>
              ))}

              {/* Days grid */}
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-20 rounded-xl" />;
                }

                const dayRes = getReservationsForDay(day.dateString);
                const isFiltered = isInFilterRange(day.dateString);
                const todayStr = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                const isToday = day.dateString === todayStr;

                return (
                  <div
                    key={day.dateString}
                    className={`
                      h-20 border rounded-xl p-2 flex flex-col justify-between transition-all duration-150 overflow-hidden group
                      ${isToday
                        ? 'border-brand-accent/50 bg-brand-accent/5'
                        : isFiltered
                        ? 'border-brand-accent/25 bg-brand-accent/4'
                        : 'border-brand-border/60 bg-brand-beige/20 hover:border-brand-accent/30 hover:bg-brand-hover/40'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold transition-colors ${
                        isToday ? 'text-brand-accent' : 'text-brand-text group-hover:text-brand-accent'
                      }`}>
                        {day.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[8px] font-extrabold text-brand-accent uppercase tracking-wider">Auj.</span>
                      )}
                    </div>

                    {/* Reservation pills */}
                    <div className="space-y-0.5 overflow-hidden">
                      {dayRes.slice(0, 2).map((r) => {
                        const targetVeh = vehicles.find(v => v.id === r.vehicleId);
                        const color = vehicleTypeColor[targetVeh?.type || ''] || '#8B5CF6';
                        return (
                          <div
                            key={r.id}
                            className="px-1.5 py-0.5 rounded text-[7px] font-bold text-white truncate leading-tight"
                            style={{ backgroundColor: color }}
                            title={`${r.clientName} — ${r.vehicleName}`}
                          >
                            {r.clientName.split(' ')[0]}
                          </div>
                        );
                      })}
                      {dayRes.length > 2 && (
                        <div className="text-[7px] font-bold text-brand-muted pl-1">
                          +{dayRes.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
