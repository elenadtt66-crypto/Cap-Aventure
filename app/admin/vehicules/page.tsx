'use client';

import React, { useEffect, useState } from 'react';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Upload,
  RefreshCw,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // Formulaire d'ajout / modification states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'van_amenege' as VehicleType,
    description: '',
    pricePerDay: 120,
    seats: 4,
    beds: 4,
    featuresInput: '',
    imagesInput: '',
    available: true,
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Générer automatiquement le slug à partir du nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleEditClick = (veh: Vehicle) => {
    setEditingId(veh.id);
    setFormData({
      name: veh.name,
      slug: veh.slug,
      type: veh.type,
      description: veh.description,
      pricePerDay: veh.pricePerDay,
      seats: veh.seats,
      beds: veh.beds,
      featuresInput: veh.features.join(', '),
      imagesInput: veh.images.join(', '),
      available: veh.available,
    });
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      type: 'van_amenege',
      description: '',
      pricePerDay: 120,
      seats: 4,
      beds: 4,
      featuresInput: 'Cuisine, Réfrigérateur, Toit Relevable, Chauffage',
      imagesInput: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      available: true,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.name || !formData.slug) {
      setFormError('Le nom et le slug sont obligatoires.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const existingVeh = vehicles.find(v => v.id === editingId);
        const updatePayload: Partial<Vehicle> = {
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          description: formData.description,
          pricePerDay: formData.pricePerDay,
          seats: formData.seats,
          beds: formData.beds,
          features: formData.featuresInput.split(',').map(s => s.trim()).filter(Boolean),
          images: formData.imagesInput.split(',').map(s => s.trim()).filter(Boolean),
          available: formData.available,
          location: existingVeh?.location || 'Bordeaux',
          owner: existingVeh?.owner || {
            name: 'Agence',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            responseTime: 'En moins d\'une heure',
            responseRate: 100
          },
          techSpecs: existingVeh?.techSpecs || {
            fuel: 'Diesel',
            transmission: 'Manuelle',
            consumption: '8L/100km',
            enginePower: '130 ch'
          },
          rating: existingVeh?.rating || 5.0,
          reviewCount: existingVeh?.reviewCount || 0,
          reviews: existingVeh?.reviews || [],
        };
        await updateVehicle(editingId, updatePayload);
      } else {
        const newPayload: Omit<Vehicle, 'id'> = {
          name: formData.name,
          slug: formData.slug,
          type: formData.type,
          description: formData.description,
          pricePerDay: formData.pricePerDay,
          seats: formData.seats,
          beds: formData.beds,
          features: formData.featuresInput.split(',').map(s => s.trim()).filter(Boolean),
          images: formData.imagesInput.split(',').map(s => s.trim()).filter(Boolean),
          available: formData.available,
          location: 'Bordeaux',
          owner: {
            name: 'Agence',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            responseTime: 'En moins d\'une heure',
            responseRate: 100
          },
          techSpecs: {
            fuel: 'Diesel',
            transmission: 'Manuelle',
            consumption: '8L/100km',
            enginePower: '130 ch'
          },
          rating: 5.0,
          reviewCount: 0,
          reviews: [],
        };
        await addVehicle(newPayload);
      }
      setIsFormOpen(false);
      loadVehicles();
    } catch (err) {
      console.error(err);
      setFormError('Erreur lors de l\'enregistrement. Veuillez vérifier la console.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
    try {
      await deleteVehicle(id);
      loadVehicles();
    } catch (err) {
      console.error(err);
      alert('Impossible de supprimer le véhicule.');
    }
  };

  // Filtrage
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'ALL' || v.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const vehicleTypeLabels: Record<string, string> = {
    van_amenege: 'Van Aménagé',
    camping_car_profile: 'Camping-car Profilé',
    camping_car_integral: 'Camping-car Intégral',
    fourgon_amenege: 'Fourgon Aménagé'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Gestion de la flotte
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Ajoutez, modifiez ou retirez des véhicules de votre catalogue.
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-sm font-bold shadow-md btn-transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau véhicule</span>
        </button>
      </div>

      {/* Formulaire Modal / Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-brand-border pb-4">
              <h2 className="text-xl font-extrabold text-brand-text">
                {editingId ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-brand-muted hover:text-brand-text cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formName" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Nom du véhicule *
                  </label>
                  <input
                    id="formName"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
                    placeholder="Ex: Volkswagen California"
                  />
                </div>

                <div>
                  <label htmlFor="formSlug" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Slug d'URL (Généré) *
                  </label>
                  <input
                    id="formSlug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm font-mono text-brand-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formType" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Type de véhicule *
                  </label>
                  <select
                    id="formType"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as VehicleType }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
                  >
                    <option value="van_amenege">Van Aménagé</option>
                    <option value="camping_car_profile">Camping-car Profilé</option>
                    <option value="camping_car_integral">Camping-car Intégral</option>
                    <option value="fourgon_amenege">Fourgon Aménagé</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="formPrice" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Prix par jour (€) *
                  </label>
                  <input
                    id="formPrice"
                    type="number"
                    required
                    min="50"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formSeats" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Places Route (Ceinture) *
                  </label>
                  <input
                    id="formSeats"
                    type="number"
                    required
                    min="1"
                    value={formData.seats}
                    onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="formBeds" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Places Couchages *
                  </label>
                  <input
                    id="formBeds"
                    type="number"
                    required
                    min="1"
                    value={formData.beds}
                    onChange={(e) => setFormData(prev => ({ ...prev, beds: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="formDesc" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                  Description détaillée *
                </label>
                <textarea
                  id="formDesc"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm leading-relaxed"
                  placeholder="Présentez le véhicule en détail (gabarit, confort intérieur, etc.)."
                />
              </div>

              <div>
                <label htmlFor="formFeats" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                  Équipements et options (séparés par des virgules)
                </label>
                <input
                  id="formFeats"
                  type="text"
                  value={formData.featuresInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuresInput: e.target.value }))}
                  className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
                  placeholder="Cuisine, Douche extérieure, Chauffage, Panneau Solaire"
                />
              </div>

              <div>
                <label htmlFor="formImgs" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                  URLs des images (séparées par des virgules)
                </label>
                <input
                  id="formImgs"
                  type="text"
                  value={formData.imagesInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, imagesInput: e.target.value }))}
                  className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm font-mono text-xs"
                  placeholder="https://image1.jpg, https://image2.jpg"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-brand-beige rounded-xl border border-brand-border">
                <input
                  id="formAvail"
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-5 h-5 text-brand-accent border-brand-border rounded focus:ring-brand-accent focus:ring-2 cursor-pointer"
                />
                <label htmlFor="formAvail" className="text-xs font-bold text-brand-text cursor-pointer select-none">
                  Véhicule actif et disponible à la location
                </label>
              </div>

              <div className="flex justify-end space-x-4 border-t border-brand-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-brand-border text-brand-text hover:bg-brand-hover rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-md btn-transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="van_amenege">Vans Aménagés</option>
            <option value="camping_car_profile">Camping-cars Profilés</option>
            <option value="camping_car_integral">Camping-cars Intégraux</option>
            <option value="fourgon_amenege">Fourgons Aménagés</option>
          </select>
        </div>
      </div>

      {/* Fleet list grid */}
      {loading ? (
        <div className="text-center py-12 text-brand-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-accent" />
          <p>Chargement des véhicules...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-brand-muted">
          <p className="text-sm">Aucun véhicule ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVehicles.map((veh) => (
            <div key={veh.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative h-44 overflow-hidden bg-brand-hover">
                <img 
                  src={veh.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                  alt={veh.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-brand-accent border border-brand-border/40">
                  {vehicleTypeLabels[veh.type]}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-brand-text text-sm leading-snug">{veh.name}</h3>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[10px] text-brand-muted">Tarif :</span>
                    <span className="text-sm font-extrabold text-brand-text font-mono">{veh.pricePerDay}€/j</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-brand-muted">Capacités :</span>
                    <span className="text-xs text-brand-text font-medium">{veh.seats} route / {veh.beds} couchages</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-brand-muted">Statut :</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      veh.available ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'
                    }`}>
                      {veh.available ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-3 border-t border-brand-border">
                  <button
                    onClick={() => handleEditClick(veh)}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 border border-brand-border text-brand-text hover:bg-brand-hover rounded-xl text-xs font-semibold btn-transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(veh.id)}
                    className="flex items-center justify-center p-2 border border-brand-error/20 hover:border-brand-error/45 text-brand-error bg-brand-error/5 hover:bg-brand-error/15 rounded-xl cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
