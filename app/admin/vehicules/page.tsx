'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  MapPin,
  Users,
  Bed
} from 'lucide-react';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/services/db';
import { Vehicle, VehicleType } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ImageUploader from '@/components/admin/ImageUploader';
import SelectMenu, { SelectMenuOption } from '@/components/ui/SelectMenu';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // Formulaire d'ajout / modification states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Suppression personnalisée (remplace le confirm de Chrome)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filterCategoryOptions: SelectMenuOption[] = [
    { value: 'ALL', label: 'Toutes les catégories' },
    { value: 'van_amenege', label: '🚐 Vans Aménagés' },
    { value: 'fourgon_amenege', label: '🚐 Fourgons Aménagés' },
    { value: 'camping_car_profile', label: '🚍 Camping-cars Profilés' },
    { value: 'camping_car_integral', label: '🏰 Camping-cars Intégraux' },
  ];

  const formCategoryOptions: SelectMenuOption[] = [
    { value: 'van_amenege', label: '🚐 Van Aménagé (75€ - 115€)' },
    { value: 'fourgon_amenege', label: '🚐 Fourgon Aménagé (105€ - 140€)' },
    { value: 'camping_car_profile', label: '🚍 Camping-car Profilé (135€ - 170€)' },
    { value: 'camping_car_integral', label: '🏰 Camping-car Intégral (175€ - 245€)' },
  ];

  const transmissionOptions: SelectMenuOption[] = [
    { value: 'Automatique', label: '⚡ Automatique' },
    { value: 'Manuelle', label: '🕹️ Manuelle' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'van_amenege' as VehicleType,
    location: 'Bordeaux (33000)',
    description: '',
    pricePerDay: 95,
    seats: 4,
    beds: 4,
    fuel: 'Diesel' as 'Diesel' | 'Essence' | 'Hybride' | 'Électrique',
    transmission: 'Automatique' as 'Manuelle' | 'Automatique',
    consumption: '7.5L/100km',
    enginePower: '150 ch',
    featuresInput: '',
    images: [] as string[],
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
      location: veh.location || 'Bordeaux (33000)',
      description: veh.description,
      pricePerDay: veh.pricePerDay,
      seats: veh.seats,
      beds: veh.beds,
      fuel: (veh.techSpecs?.fuel as any) || 'Diesel',
      transmission: (veh.techSpecs?.transmission as any) || 'Automatique',
      consumption: veh.techSpecs?.consumption || '7.5L/100km',
      enginePower: veh.techSpecs?.enginePower || '150 ch',
      featuresInput: veh.features ? veh.features.join(', ') : '',
      images: veh.images && veh.images.length > 0 ? veh.images : ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80'],
      available: veh.available !== false,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      type: 'van_amenege',
      location: 'Bordeaux (33000)',
      description: '',
      pricePerDay: 95,
      seats: 4,
      beds: 4,
      fuel: 'Diesel',
      transmission: 'Automatique',
      consumption: '7.5L/100km',
      enginePower: '150 ch',
      featuresInput: 'Cuisine équipée, Toit relevable, Chauffage stationnaire, Douchette extérieure, Frigo 42L',
      images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80'],
      available: true,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    let finalSlug = (formData.slug || '').trim();
    if (!finalSlug && formData.name) {
      finalSlug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (!formData.name || !finalSlug) {
      setFormError('Le nom du véhicule est obligatoire.');
      setSubmitting(false);
      return;
    }

    if (formData.images.length === 0) {
      setFormError('Veuillez ajouter au moins une photo pour ce véhicule.');
      setSubmitting(false);
      return;
    }

    try {
      const featuresArray = formData.featuresInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (editingId) {
        const existingVeh = vehicles.find(v => v.id === editingId);
        const updatePayload: Partial<Vehicle> = {
          name: formData.name,
          slug: finalSlug,
          type: formData.type,
          location: formData.location,
          description: formData.description,
          pricePerDay: Number(formData.pricePerDay),
          seats: Number(formData.seats),
          beds: Number(formData.beds),
          features: featuresArray.length > 0 ? featuresArray : ['Équipements de série'],
          images: formData.images,
          available: formData.available,
          techSpecs: {
            fuel: formData.fuel,
            transmission: formData.transmission,
            consumption: formData.consumption,
            enginePower: formData.enginePower
          },
          owner: existingVeh?.owner || {
            name: 'Cap Aventure Agence',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            responseTime: 'En moins d\'une heure',
            responseRate: 100
          },
          rating: existingVeh?.rating || 5.0,
          reviewCount: existingVeh?.reviewCount || 0,
          reviews: existingVeh?.reviews || [],
        };
        await updateVehicle(editingId, updatePayload);
      } else {
        const newPayload: Omit<Vehicle, 'id'> = {
          name: formData.name,
          slug: finalSlug,
          type: formData.type,
          location: formData.location,
          description: formData.description,
          pricePerDay: Number(formData.pricePerDay),
          seats: Number(formData.seats),
          beds: Number(formData.beds),
          features: featuresArray.length > 0 ? featuresArray : ['Équipements de série'],
          images: formData.images,
          available: formData.available,
          techSpecs: {
            fuel: formData.fuel,
            transmission: formData.transmission,
            consumption: formData.consumption,
            enginePower: formData.enginePower
          },
          owner: {
            name: 'Cap Aventure Agence',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            responseTime: 'En moins d\'une heure',
            responseRate: 100
          },
          rating: 5.0,
          reviewCount: 0,
          reviews: [],
        };
        await addVehicle(newPayload);
      }
      setIsFormOpen(false);
      // Libérer la mémoire (les images en base64) pour éviter les crashs sur mobile
      setFormData(prev => ({
        ...prev,
        name: '',
        slug: '',
        description: '',
        featuresInput: '',
        images: [],
      }));
      await loadVehicles();
    } catch (err) {
      console.error(err);
      setFormError('Erreur lors de l\'enregistrement. Veuillez vérifier les champs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (veh: Vehicle) => {
    setVehicleToDelete(veh);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    setDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
      await loadVehicles();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const vehicleTypeLabels: Record<string, { label: string; variant: 'gold' | 'navy' | 'success' | 'warning' }> = {
    van_amenege: { label: 'Van Aménagé', variant: 'gold' },
    fourgon_amenege: { label: 'Fourgon Aménagé', variant: 'warning' },
    camping_car_profile: { label: 'Camping-car Profilé', variant: 'navy' },
    camping_car_integral: { label: 'Grand Intégral', variant: 'success' },
    caravane: { label: 'Caravane', variant: 'gold' }
  };

  // Filtrage
  const filteredVehicles = vehicles.filter((v) => {
    const searchLow = (searchTerm || '').toLowerCase();
    const matchesSearch = (v.name || '').toLowerCase().includes(searchLow) || 
                          (v.description || '').toLowerCase().includes(searchLow) ||
                          (v.location || '').toLowerCase().includes(searchLow);
    const matchesType = selectedTypeFilter === 'ALL' || v.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Gestion de la flotte
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Ajoutez, modifiez ou retirez des véhicules de votre catalogue ({filteredVehicles.length} véhicules actifs).
          </p>
        </div>
        <Button
          onClick={handleAddNewClick}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Nouveau véhicule
        </Button>
      </div>

      {/* Modal de Confirmation de Suppression Personnalisée */}
      <ConfirmDialog
        isOpen={Boolean(vehicleToDelete)}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Supprimer ce véhicule ?"
        message={
          <span>
            Êtes-vous sûr de vouloir retirer définitivement{' '}
            <strong className="text-brand-text font-bold">"{vehicleToDelete?.name}"</strong>{' '}
            de votre catalogue ? Cette action supprimera sa fiche et ses réservations associées.
          </span>
        }
        confirmText="Oui, supprimer"
        cancelText="Conserver le véhicule"
      />

      {/* Modal d'édition / création via React Portal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
        description="Renseignez les détails techniques, le tarif par jour et les photos."
        maxWidth="3xl"
      >
        {formError && (
          <div className="mb-5 p-3.5 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-2xl text-xs font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Uploader d'images interactif */}
          <div className="p-4 sm:p-5 bg-brand-beige/60 border border-brand-border rounded-3xl">
            <ImageUploader
              images={formData.images}
              onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
            />
          </div>

          {/* Identité & Catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="formName" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Nom du modèle & finition *
              </label>
              <input
                id="formName"
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm font-semibold text-brand-text"
                placeholder="Ex: Volkswagen California Ocean T6.1"
              />
            </div>

            <div>
              <label htmlFor="formSlug" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Identifiant URL (Slug) *
              </label>
              <input
                id="formSlug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-mono text-brand-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Catégorie de véhicule *
              </label>
              <SelectMenu
                options={formCategoryOptions}
                value={formData.type}
                onChange={(val) => setFormData(prev => ({ ...prev, type: val as VehicleType }))}
                className="w-full"
                size="md"
              />
            </div>

            <div>
              <label htmlFor="formLocation" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Ville de départ *
              </label>
              <input
                id="formLocation"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-semibold text-brand-text"
                placeholder="Ex: Bordeaux (33000)"
              />
            </div>

            <div>
              <label htmlFor="formPrice" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Prix par jour (€) *
              </label>
              <input
                id="formPrice"
                type="number"
                required
                min="40"
                max="500"
                value={formData.pricePerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-mono font-bold text-brand-accent"
              />
            </div>
          </div>

          {/* Capacités & Motorisation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="formSeats" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Places Route
              </label>
              <input
                id="formSeats"
                type="number"
                required
                min="1"
                max="8"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-mono text-center font-bold"
              />
            </div>

            <div>
              <label htmlFor="formBeds" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Couchages
              </label>
              <input
                id="formBeds"
                type="number"
                required
                min="1"
                max="8"
                value={formData.beds}
                onChange={(e) => setFormData(prev => ({ ...prev, beds: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-mono text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Transmission
              </label>
              <SelectMenu
                options={transmissionOptions}
                value={formData.transmission}
                onChange={(val) => setFormData(prev => ({ ...prev, transmission: val as any }))}
                className="w-full"
                size="md"
              />
            </div>

            <div>
              <label htmlFor="formPower" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                Puissance moteur
              </label>
              <input
                id="formPower"
                type="text"
                value={formData.enginePower}
                onChange={(e) => setFormData(prev => ({ ...prev, enginePower: e.target.value }))}
                className="w-full px-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-semibold text-center"
                placeholder="Ex: 150 ch"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="formDesc" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
              Description détaillée *
            </label>
            <textarea
              id="formDesc"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs leading-relaxed"
              placeholder="Présentez les points forts du véhicule (agencement, équipements, maniabilité)..."
            />
          </div>

          {/* Équipements */}
          <div>
            <label htmlFor="formFeats" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
              Équipements & Points forts (séparés par des virgules)
            </label>
            <input
              id="formFeats"
              type="text"
              value={formData.featuresInput}
              onChange={(e) => setFormData(prev => ({ ...prev, featuresInput: e.target.value }))}
              className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs"
              placeholder="Toit relevable, Panneau solaire 140W, Douche séparée, Chauffage stationnaire"
            />
          </div>

          {/* Disponibilité */}
          <div className="flex items-center space-x-3 p-4 bg-brand-beige rounded-2xl border border-brand-border">
            <input
              id="formAvail"
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
              className="w-5 h-5 text-brand-accent border-brand-border rounded-lg focus:ring-brand-accent focus:ring-2 cursor-pointer accent-brand-accent"
            />
            <label htmlFor="formAvail" className="text-xs font-bold text-brand-text cursor-pointer select-none">
              Véhicule actif et immédiatement disponible à la réservation
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center space-x-3 pt-4 border-t border-brand-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              {editingId ? 'Mettre à jour' : 'Enregistrer le véhicule'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-5 rounded-3xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par modèle, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <SelectMenu
            options={filterCategoryOptions}
            value={selectedTypeFilter}
            onChange={(val) => setSelectedTypeFilter(val)}
            size="md"
          />
        </div>
      </div>

      {/* Fleet list grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-3xl p-12 text-center text-brand-muted">
          <p className="text-sm font-semibold">Aucun véhicule ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((veh) => {
            const badgeInfo = vehicleTypeLabels[veh.type] || { label: veh.type, variant: 'neutral' as const };
            return (
              <div 
                key={veh.id} 
                className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm hover-lift flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="relative h-48 overflow-hidden bg-brand-hover">
                  <img 
                    src={veh.images?.[0] || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'} 
                    alt={veh.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <Badge variant={badgeInfo.variant} size="sm">
                      {badgeInfo.label}
                    </Badge>
                  </div>
                  <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-extrabold text-brand-navy border border-brand-border/40 font-mono shadow-sm">
                    {veh.pricePerDay} € <span className="text-[10px] font-normal text-brand-muted">/j</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-brand-text text-sm leading-snug line-clamp-1">
                      {veh.name}
                    </h3>
                    
                    <div className="flex items-center text-xs text-brand-muted space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                      <span className="truncate">{veh.location || 'Bordeaux'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-brand-text">
                      <div className="flex items-center space-x-1.5 p-2 bg-brand-beige rounded-xl">
                        <Users className="w-3.5 h-3.5 text-brand-muted" />
                        <span className="font-semibold">{veh.seats} places</span>
                      </div>
                      <div className="flex items-center space-x-1.5 p-2 bg-brand-beige rounded-xl">
                        <Bed className="w-3.5 h-3.5 text-brand-muted" />
                        <span className="font-semibold">{veh.beds} couchages</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[11px] text-brand-muted font-medium">Statut flotte :</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        veh.available ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'
                      }`}>
                        {veh.available ? '● Actif' : '○ Masqué'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-3 border-t border-brand-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(veh)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-accent" />}
                      className="flex-1"
                    >
                      Modifier
                    </Button>
                    <button
                      onClick={() => handleOpenDeleteModal(veh)}
                      className="p-2 border border-brand-error/20 hover:border-brand-error text-brand-error bg-brand-error/5 hover:bg-brand-error hover:text-white rounded-xl transition-all duration-200 cursor-pointer"
                      title="Supprimer le véhicule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
