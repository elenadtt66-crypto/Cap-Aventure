'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  CreditCard,
  History
} from 'lucide-react';
import { getClients, getReservations } from '@/services/db';
import { Client, Reservation } from '@/types';

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const cData = await getClients();
      const rData = await getReservations();
      
      // Si la collection de clients Firestore est vide, on peut déduire les clients des réservations
      if (cData.length === 0 && rData.length > 0) {
        const uniqueClientsMap = new Map<string, Client>();
        rData.forEach(r => {
          if (!uniqueClientsMap.has(r.clientId)) {
            uniqueClientsMap.set(r.clientId, {
              id: r.clientId,
              lastName: r.clientName.split(' ')[1] || '',
              firstName: r.clientName.split(' ')[0] || '',
              email: `${r.clientName.toLowerCase().replace(/[^a-z]+/g, '')}@mail-deduit.com`,
              phone: '+33 6 00 00 00 00',
              drivingLicenseNumber: r.id, // ID en guise de permis simulé
            });
          }
        });
        setClients(Array.from(uniqueClientsMap.values()));
      } else {
        setClients(cData);
      }
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
      if (!stats[r.clientId]) {
        stats[r.clientId] = { count: 0, totalSpend: 0 };
      }
      stats[r.clientId].count += 1;
      if (r.status === 'CONFIRMEE' || r.status === 'TERMINEE') {
        stats[r.clientId].totalSpend += r.totalPrice;
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Annuaire des clients
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Visualisez les fiches de vos clients et leur historique de réservation.
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

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
          />
        </div>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="text-center py-12 text-brand-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
          <p>Chargement des fiches clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-brand-muted">
          <p className="text-sm">Aucun client enregistré.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-hover border-b border-brand-border text-brand-muted text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Coordonnées</th>
                  <th className="py-4 px-6">Permis de Conduire</th>
                  <th className="py-4 px-6 text-center">Réservations</th>
                  <th className="py-4 px-6 text-right">Dépenses confirmées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {filteredClients.map((c) => {
                  const stats = clientStats[c.id] || { count: 0, totalSpend: 0 };
                  return (
                    <tr key={c.id} className="hover:bg-brand-hover/30 transition-all duration-150">
                      <td className="py-4 px-6 font-bold text-brand-text">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="py-4 px-6 text-xs space-y-1 text-brand-text">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-brand-accent" />
                          <span>{c.email}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-brand-accent" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 text-xs text-brand-text">
                          <CreditCard className="w-4 h-4 text-brand-accent" />
                          <span className="font-mono font-bold">{c.drivingLicenseNumber || 'Non renseigné'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-brand-hover border border-brand-border rounded-xl text-xs font-bold text-brand-text">
                          <History className="w-3.5 h-3.5 text-brand-muted" />
                          <span className="font-mono">{stats.count}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-extrabold text-brand-accent">
                        {stats.totalSpend}€
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
