'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  RefreshCw,
  Info,
  MapPin,
  Star,
  Users,
  Compass,
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
import { getVehicles, MOCK_VEHICLES } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';
import CustomSelect from '@/components/ui/CustomSelect';

function VehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // États des filtres
  const [filterType, setFilterType] = useState(searchParams.get('type') || '');
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || '');
  const [filterSeats, setFilterSeats] = useState(searchParams.get('seats') || '');
  const [filterBeds, setFilterBeds] = useState('');
  const [maxPrice, setMaxPrice] = useState('300');
  const [sortBy, setSortBy] = useState('price-asc');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setVehicles(MOCK_VEHICLES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Mettre à jour les filtres si les paramètres d'URL changent
  useEffect(() => {
    const urlType = searchParams.get('type');
    const urlSeats = searchParams.get('seats');
    const urlLocation = searchParams.get('location');
    if (urlType !== null) setFilterType(urlType);
    if (urlSeats !== null) setFilterSeats(urlSeats);
    if (urlLocation !== null) setFilterLocation(urlLocation);
  }, [searchParams]);

  // Filtrer et trier les véhicules en mémoire
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (filterType) {
      result = result.filter(v => v.type === filterType);
    }
    if (filterLocation) {
      result = result.filter(v => v.location.toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterSeats) {
      result = result.filter(v => v.seats >= parseInt(filterSeats));
    }
    if (filterBeds) {
      result = result.filter(v => v.beds >= parseInt(filterBeds));
    }
    if (maxPrice) {
      result = result.filter(v => v.pricePerDay <= parseInt(maxPrice));
    }

    // Tri
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'seats-desc') {
      result.sort((a, b) => b.seats - a.seats);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [vehicles, filterType, filterLocation, filterSeats, filterBeds, maxPrice, sortBy]);

  const resetFilters = () => {
    setFilterType('');
    setFilterLocation('');
    setFilterSeats('');
    setFilterBeds('');
    setMaxPrice('300');
    setSortBy('price-asc');
    router.push('/vehicules');
  };

  const vehicleTypeLabels: Record<string, string> = {
    van_amenege: 'Van Aménagé',
    camping_car_profile: 'Camping-car Profilé',
    camping_car_integral: 'Camping-car Intégral',
    fourgon_amenege: 'Fourgon Aménagé'
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Notre Flotte</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight mt-2">
          Louez votre compagnon de route
        </h1>
        <p className="text-sm md:text-base text-brand-muted max-w-2xl mt-2">
          Découvrez les véhicules de loisirs disponibles autour de vous, assurés tous risques pour votre voyage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="bg-white border border-brand-border p-6 rounded-2xl space-y-6 sticky top-28 shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h3 className="font-extrabold text-brand-text flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span>Filtres</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-brand-muted hover:text-brand-error transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>

          {/* Ville de départ */}
          <CustomSelect
            label="Ville de départ"
            value={filterLocation}
            onChange={(v) => setFilterLocation(v)}
            options={[
              { value: '', label: 'Toutes les villes' },
              { value: 'Bordeaux', label: 'Bordeaux', icon: '🇫🇷' },
              { value: 'Paris', label: 'Paris', icon: '🇫🇷' },
              { value: 'Lyon', label: 'Lyon', icon: '🇫🇷' },
              { value: 'Toulouse', label: 'Toulouse', icon: '🇫🇷' },
            ]}
          />

          {/* Catégorie */}
          <CustomSelect
            label="Catégorie de véhicule"
            value={filterType}
            onChange={(v) => setFilterType(v)}
            options={[
              { value: '', label: 'Tous les modèles' },
              { value: 'van_amenege', label: 'Van Aménagé', icon: '🚐' },
              { value: 'camping_car_profile', label: 'Camping-car Profilé', icon: '🚌' },
              { value: 'camping_car_integral', label: 'Camping-car Intégral', icon: '🚘' },
              { value: 'fourgon_amenege', label: 'Fourgon Aménagé', icon: '📦' },
            ]}
          />

          {/* Places route */}
          <CustomSelect
            label="Places Route (min.)"
            value={filterSeats}
            onChange={(v) => setFilterSeats(v)}
            options={[
              { value: '', label: 'Indifférent' },
              { value: '2', label: '2 places route', icon: '👥' },
              { value: '4', label: '4 places route', icon: '👨‍👩‍👧' },
              { value: '5', label: '5 places route', icon: '👨‍👩‍👧‍👦' },
            ]}
          />

          {/* Couchages */}
          <CustomSelect
            label="Couchages (min.)"
            value={filterBeds}
            onChange={(v) => setFilterBeds(v)}
            options={[
              { value: '', label: 'Indifférent' },
              { value: '2', label: '2 couchages', icon: '🛏️' },
              { value: '4', label: '4 couchages', icon: '🛏️' },
              { value: '5', label: '5 couchages', icon: '🛏️' },
            ]}
          />

          {/* Prix max par jour */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-extrabold uppercase text-brand-text tracking-wider">
                Budget Max / jour
              </label>
              <span className="text-sm font-extrabold text-brand-accent font-mono">{maxPrice}€</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-muted">
              <span>100€</span>
              <span>200€</span>
              <span>300€</span>
            </div>
          </div>
        </aside>

        {/* Vehicles Grid list */}
        <section className="lg:col-span-3 space-y-6">
          {/* Top Sort bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-brand-border p-4 rounded-xl shadow-sm text-sm">
            <div className="text-brand-muted text-xs font-semibold">
              <span className="font-extrabold text-brand-text font-mono text-sm">{filteredVehicles.length}</span> véhicule(s) trouvé(s)
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-xs text-brand-muted font-semibold">
                <ArrowUpDown className="w-4 h-4 mr-1.5" />
                Trier par
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-brand-beige border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent text-xs font-semibold"
              >
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
                <option value="rating-desc">Mieux notés</option>
                <option value="seats-desc">Places : max</option>
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-brand-border rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-52 bg-brand-border/40 rounded-xl"></div>
                  <div className="h-6 bg-brand-border/40 rounded w-3/4"></div>
                  <div className="h-4 bg-brand-border/40 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white border border-brand-border rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-muted">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text">Aucun véhicule ne correspond</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Modifiez vos filtres ou réinitialisez la recherche pour découvrir notre flotte de camping-cars.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-semibold shadow-sm transition-colors duration-200"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVehicles.map((veh) => (
                <div 
                  key={veh.id}
                  className="group flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden hover-lift shadow-sm transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden bg-brand-hover">
                    <img 
                      src={veh.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                      alt={veh.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badge catégorie */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-accent border border-brand-border/50">
                      {vehicleTypeLabels[veh.type]}
                    </div>

                    {/* Propriétaire avatar */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-1 rounded-full border border-brand-border/40">
                      <img 
                        src={veh.owner.avatar} 
                        alt={veh.owner.name} 
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-[9px] font-bold text-brand-text pr-2">{veh.owner.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-muted font-bold flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-brand-accent" />
                          {veh.location}
                        </span>
                        
                        {/* Notes */}
                        <div className="flex items-center text-xs font-bold text-brand-text">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] mr-1" />
                          <span>{veh.rating}</span>
                          <span className="text-brand-muted font-normal ml-1">({veh.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-brand-text">{veh.name}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {veh.description}
                      </p>
                    </div>

                    {/* Caractéristiques rapides */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-brand-border text-xs text-brand-text">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-brand-accent" />
                        <span>{veh.seats} Places Route</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-brand-accent" />
                        <span>{veh.beds} Couchages</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-2xl font-extrabold text-brand-text font-mono">{veh.pricePerDay}€</span>
                        <span className="text-xs text-brand-muted"> / jour</span>
                      </div>
                      <Link
                        href={`/vehicule/${veh.slug}`}
                        className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm btn-transition"
                      >
                        Détails & Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-12 w-full text-center py-24 text-brand-muted">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
        <p>Chargement du catalogue...</p>
      </div>
    }>
      <VehiclesContent />
    </Suspense>
  );
}
