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
  Bed,
  Compass,
  ArrowUpDown,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { getVehicles } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';
import CustomSelect from '@/components/ui/CustomSelect';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

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
      result = result.filter(v => 
        v.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
        filterLocation.toLowerCase().includes(v.location.toLowerCase())
      );
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

  const getCategoryInfo = (type: string) => {
    switch (type) {
      case 'van_amenege': return { label: 'Van Aménagé', variant: 'gold' as const };
      case 'fourgon_amenege': return { label: 'Fourgon Aménagé', variant: 'warning' as const };
      case 'camping_car_profile': return { label: 'Camping-car Profilé', variant: 'navy' as const };
      case 'camping_car_integral': return { label: 'Grand Intégral', variant: 'success' as const };
      default: return { label: 'Véhicule', variant: 'neutral' as const };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-10 grain-bg">
      {/* Page Header */}
      <div className="space-y-3">
        <Badge variant="gold">Flotte Premium Vérifiée</Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight">
          Louez votre van ou camping-car
        </h1>
        <p className="text-sm md:text-base text-brand-muted max-w-2xl">
          Découvrez notre catalogue de {vehicles.length} modèles uniques, préparés et assurés tous risques pour votre roadtrip.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="bg-white border border-brand-border p-6 rounded-3xl space-y-6 sticky top-28 shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h3 className="font-extrabold text-brand-text flex items-center space-x-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
              <span>Filtres de recherche</span>
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
              { value: 'Biarritz', label: 'Biarritz', icon: '🇫🇷' },
              { value: 'Paris', label: 'Paris / Île-de-France', icon: '🇫🇷' },
              { value: 'Lyon', label: 'Lyon', icon: '🇫🇷' },
              { value: 'Marseille', label: 'Marseille / Provence', icon: '🇫🇷' },
              { value: 'Nantes', label: 'Nantes', icon: '🇫🇷' },
              { value: 'Toulouse', label: 'Toulouse', icon: '🇫🇷' },
              { value: 'Nice', label: 'Nice / Côte d\'Azur', icon: '🇫🇷' },
              { value: 'Annecy', label: 'Annecy / Alpes', icon: '🇫🇷' },
              { value: 'Strasbourg', label: 'Strasbourg', icon: '🇫🇷' },
              { value: 'Rennes', label: 'Rennes / Bretagne', icon: '🇫🇷' },
            ]}
          />

          {/* Catégorie */}
          <CustomSelect
            label="Catégorie de véhicule"
            value={filterType}
            onChange={(v) => setFilterType(v)}
            options={[
              { value: '', label: 'Tous les modèles' },
              { value: 'van_amenege', label: '🚐 Vans Aménagés (75€ - 115€)' },
              { value: 'fourgon_amenege', label: '🚐 Fourgons Aménagés (105€ - 140€)' },
              { value: 'camping_car_profile', label: '🚍 Profilés (135€ - 170€)' },
              { value: 'camping_car_integral', label: '🏰 Intégraux (175€ - 245€)' },
            ]}
          />

          {/* Places route */}
          <CustomSelect
            label="Places Route (min.)"
            value={filterSeats}
            onChange={(v) => setFilterSeats(v)}
            options={[
              { value: '', label: 'Indifférent' },
              { value: '2', label: '2 places route et +' },
              { value: '4', label: '4 places route et +' },
              { value: '5', label: '5 places route et +' },
            ]}
          />

          {/* Couchages */}
          <CustomSelect
            label="Couchages (min.)"
            value={filterBeds}
            onChange={(v) => setFilterBeds(v)}
            options={[
              { value: '', label: 'Indifférent' },
              { value: '2', label: '2 couchages et +' },
              { value: '3', label: '3 couchages et +' },
              { value: '4', label: '4 couchages et +' },
              { value: '5', label: '5 couchages et +' },
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
              min="70"
              max="300"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-muted font-mono">
              <span>70€</span>
              <span>180€</span>
              <span>300€</span>
            </div>
          </div>
        </aside>

        {/* Vehicles Grid list */}
        <section className="lg:col-span-3 space-y-6">
          {/* Top Sort bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-brand-border p-4 sm:p-5 rounded-2xl shadow-sm text-sm">
            <div className="text-brand-muted text-xs font-semibold">
              <span className="font-extrabold text-brand-text font-mono text-sm">{filteredVehicles.length}</span> véhicule(s) disponible(s)
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-xs text-brand-muted font-semibold">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-brand-accent" />
                Trier par :
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-1.5 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-accent text-xs font-bold text-brand-text cursor-pointer"
              >
                <option value="price-asc">Prix le plus bas d'abord</option>
                <option value="price-desc">Prix le plus haut d'abord</option>
                <option value="rating-desc">Meilleures notes (5★)</option>
                <option value="seats-desc">Nombre de places max</option>
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white border border-brand-border rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-brand-hover rounded-2xl flex items-center justify-center mx-auto text-brand-muted">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-text">Aucun véhicule ne correspond</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Modifiez vos filtres ou réinitialisez la recherche pour découvrir notre flotte de camping-cars et vans.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={resetFilters}
              >
                Réinitialiser la recherche
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVehicles.map((veh) => {
                const cat = getCategoryInfo(veh.type);
                return (
                  <div 
                    key={veh.id}
                    className="group flex flex-col bg-white border border-brand-border rounded-3xl overflow-hidden hover-lift shadow-sm transition-all duration-300 justify-between"
                  >
                    <div className="relative h-56 overflow-hidden bg-brand-hover">
                      <img 
                        src={veh.images[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'} 
                        alt={veh.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-3.5 left-3.5">
                        <Badge variant={cat.variant} size="sm">
                          {cat.label}
                        </Badge>
                      </div>

                      {/* Propriétaire avatar */}
                      <div className="absolute bottom-3.5 right-3.5 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-brand-border/40 shadow-sm">
                        <img 
                          src={veh.owner.avatar} 
                          alt={veh.owner.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-[10px] font-bold text-brand-text">{veh.owner.name}</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-brand-muted font-bold flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-accent" />
                            {veh.location}
                          </span>
                          
                          {/* Notes */}
                          <div className="flex items-center text-xs font-bold text-brand-text bg-brand-beige px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent mr-1" />
                            <span>{veh.rating.toFixed(2)}</span>
                            <span className="text-brand-muted font-normal ml-1">({veh.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-base font-extrabold text-brand-text group-hover:text-brand-accent transition-colors leading-snug">
                          {veh.name}
                        </h3>
                        <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                          {veh.description}
                        </p>
                      </div>

                      {/* Caractéristiques rapides */}
                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-brand-border text-xs text-brand-text">
                        <div className="flex items-center space-x-2 p-2 bg-brand-beige rounded-xl">
                          <Users className="w-3.5 h-3.5 text-brand-muted" />
                          <span className="font-semibold text-[11px]">{veh.seats} Places</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-brand-beige rounded-xl">
                          <Bed className="w-3.5 h-3.5 text-brand-muted" />
                          <span className="font-semibold text-[11px]">{veh.beds} Couchages</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-2xl font-extrabold text-brand-navy font-mono">{veh.pricePerDay}€</span>
                          <span className="text-xs text-brand-muted"> / jour</span>
                        </div>
                        <Link
                          href={`/reservation?vehicle=${veh.slug || veh.id}`}
                          className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm btn-transition"
                        >
                          Réserver
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
