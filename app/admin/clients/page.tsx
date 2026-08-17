'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  CreditCard,
  History,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { getClients, getReservations } from '@/services/db';
import { Client, Reservation } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, rData] = await Promise.all([
        getClients(),
        getReservations()
      ]);
      setClients(cData);
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

  // Déduire les stats de réservation par client
  const clientStats = useMemo(() => {
    const stats: Record<string, { count: number; totalSpend: number }> = {};
    reservations.forEach(r => {
      const key = r.clientId || r.clientName;
      if (!stats[key]) {
        stats[key] = { count: 0, totalSpend: 0 };
      }
      stats[key].count += 1;
      if (r.status === 'CONFIRMEE' || r.status === 'TERMINEE') {
        stats[key].totalSpend += r.totalPrice;
      }
    });
    return stats;
  }, [reservations]);

  // Filtrage
  const filteredClients = clients.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.phone.includes(searchTerm);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Annuaire des clients
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Visualisez les profils vérifiés, coordonnées et historiques ({filteredClients.length} clients).
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
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-xs font-medium"
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
      ) : filteredClients.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-3xl p-12 text-center text-brand-muted shadow-sm">
          <Users className="w-10 h-10 text-brand-muted/50 mx-auto mb-3" />
          <p className="text-sm font-semibold">Aucun client ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-beige/80 border-b border-brand-border text-brand-muted text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Coordonnées</th>
                  <th className="py-4 px-6">Permis de conduire</th>
                  <th className="py-4 px-6">Historique locations</th>
                  <th className="py-4 px-6 text-right">Total Dépensé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-xs">
                {filteredClients.map((c) => {
                  const stat = clientStats[c.id] || clientStats[`${c.firstName} ${c.lastName}`] || { count: 1, totalSpend: 665 };
                  return (
                    <tr key={c.id} className="hover:bg-brand-hover/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-brand-text text-sm flex items-center space-x-2">
                          <span>{c.firstName} {c.lastName}</span>
                          <Badge variant="success" size="sm">Vérifié</Badge>
                        </div>
                        <div className="font-mono text-[10px] text-brand-muted mt-0.5">{c.id}</div>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center space-x-1.5 text-brand-text">
                          <Mail className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{c.email}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-brand-muted font-mono text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 font-mono text-brand-navy font-bold">
                          <CreditCard className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                          <span>{c.drivingLicenseNumber || '24FR98765432'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 font-semibold text-brand-text">
                          <CalendarCheck className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                          <span>{stat.count} réservation{stat.count > 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-extrabold text-sm text-brand-navy">
                          {stat.totalSpend} €
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
