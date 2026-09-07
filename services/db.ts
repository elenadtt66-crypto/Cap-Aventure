import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  runTransaction,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { Vehicle, Client, Reservation, ReservationStatus } from '@/types';
import cleanVehiclesDataset from '@/data/yescapa-vehicles.json';

const initialReservations: Reservation[] = [
  {
    id: 'res-demo-01',
    vehicleId: 'cap-van-01',
    vehicleName: 'Volkswagen California Ocean T6.1',
    clientId: 'cli-01',
    clientName: 'Maxime Dupont',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    totalDays: 7,
    totalPrice: 665,
    status: 'CONFIRMEE',
    specificDetails: {
      outdoorShower: true,
      notes: 'Départ prévu à 9h'
    }
  },
  {
    id: 'res-demo-02',
    vehicleId: 'cap-profile-01',
    vehicleName: 'Challenger 260 Graphite Ultimate',
    clientId: 'cli-02',
    clientName: 'Sophie Lambert',
    startDate: '2026-09-12',
    endDate: '2026-09-19',
    totalDays: 7,
    totalPrice: 1036,
    status: 'EN_ATTENTE',
    specificDetails: {
      bikeRackCount: 2,
      notes: 'Demande de lit parapluie'
    }
  },
  {
    id: 'res-demo-03',
    vehicleId: 'cap-integral-01',
    vehicleName: 'Hymer B-Class MasterLine I 780',
    clientId: 'cli-03',
    clientName: 'Jean Valérien',
    startDate: '2026-09-20',
    endDate: '2026-09-27',
    totalDays: 7,
    totalPrice: 1540,
    status: 'EN_ATTENTE',
    specificDetails: {
      roofTent: true,
      notes: 'Voyage prévu vers les Alpes'
    }
  }
];

function getStoredReservations(): Reservation[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cap_aventure_reservations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
  }
  return initialReservations;
}

function saveStoredReservations(list: Reservation[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cap_aventure_reservations', JSON.stringify(list));
  }
}

function getStoredVehicles(): Vehicle[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cap_aventure_vehicles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing stored vehicles:', e);
      }
    }
  }
  return [...(cleanVehiclesDataset as Vehicle[])];
}

function saveStoredVehicles(list: Vehicle[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cap_aventure_vehicles', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable when saving vehicles:', e);
    }
  }
}

const initialClientsList: Client[] = [
  {
    id: 'cli-01',
    firstName: 'Maxime',
    lastName: 'Dupont',
    email: 'maxime.dupont@email.com',
    phone: '06 12 34 56 78',
    drivingLicenseNumber: '12AB34567'
  },
  {
    id: 'cli-02',
    firstName: 'Sophie',
    lastName: 'Lambert',
    email: 'sophie.lambert@email.com',
    phone: '06 98 76 54 32',
    drivingLicenseNumber: '98CD76543'
  },
  {
    id: 'cli-03',
    firstName: 'Jean',
    lastName: 'Valérien',
    email: 'jean.valerien@email.com',
    phone: '07 89 01 23 45',
    drivingLicenseNumber: '45EF89012'
  }
];

function getStoredClients(): Client[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cap_aventure_clients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
  }
  return initialClientsList;
}

function saveStoredClients(list: Client[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cap_aventure_clients', JSON.stringify(list));
    } catch (e) {}
  }
}

let inMemoryVehicles: Vehicle[] = getStoredVehicles();
let inMemoryReservations: Reservation[] = getStoredReservations();
let inMemoryClients: Client[] = getStoredClients();

export const MOCK_VEHICLES: Vehicle[] = inMemoryVehicles;

// ==========================================
// SERVICES VÉHICULES
// ==========================================

export async function getVehicles(): Promise<Vehicle[]> {
  const baseVehicles = [...(cleanVehiclesDataset as Vehicle[])];
  let supabaseVehicles: Vehicle[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && Array.isArray(data)) {
        supabaseVehicles = data.map((v: any) => ({
          id: v.id,
          slug: v.slug || '',
          name: v.name || '',
          type: v.type || 'van_amenege',
          description: v.description || '',
          pricePerDay: v.price_per_day ?? v.pricePerDay ?? 0,
          seats: v.seats || 2,
          beds: v.beds || 2,
          features: v.features || [],
          images: v.images || [],
          available: v.available !== false,
          location: v.location || 'Bordeaux',
          owner: v.owner || {
            name: 'Cap Aventure Agence',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            responseTime: 'En moins d\'une heure',
            responseRate: 100
          },
          techSpecs: v.tech_specs ?? v.techSpecs ?? {
            fuel: 'Diesel',
            transmission: 'Manuelle',
            consumption: '8L/100km',
            enginePower: '130 ch'
          },
          rating: v.rating || 5.0,
          reviewCount: v.review_count ?? v.reviewCount ?? 0,
          reviews: v.reviews || [],
        }));
      }
    } catch (sbErr) {
      console.warn('Supabase fetch vehicles error:', sbErr);
    }
  }

  // Fusionner les véhicules de base, locaux et Supabase (Supabase ayant la priorité)
  const localVehicles = getStoredVehicles();
  const allMap = new Map<string, Vehicle>();

  // 1. Ajouter d'abord le catalogue de base et le stockage local
  baseVehicles.forEach(v => allMap.set(v.id, v));
  localVehicles.forEach(v => allMap.set(v.id, v));

  // 2. Ajouter/Surmonter avec les véhicules Supabase synchronisés
  supabaseVehicles.forEach(v => allMap.set(v.id, v));

  return Array.from(allMap.values());
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const cleanSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  const allVehicles = await getVehicles();

  const found = allVehicles.find(
    v => v.slug.toLowerCase() === cleanSlug || 
         v.id.toLowerCase() === cleanSlug ||
         v.slug.toLowerCase().includes(cleanSlug) ||
         cleanSlug.includes(v.slug.toLowerCase())
  );

  return found || null;
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<string> {
  const generatedId = `cap-${Date.now()}`;
  const newVehicle: Vehicle = {
    ...vehicle,
    id: generatedId,
  };

  // 1. Enregistrement local en mémoire et cache
  const currentVehicles = getStoredVehicles();
  inMemoryVehicles = [newVehicle, ...currentVehicles];
  saveStoredVehicles(inMemoryVehicles);

  // 2. Synchronisation Supabase (SEULEMENT avec les colonnes existantes dans PostgreSQL)
  if (supabase) {
    try {
      const payload = {
        id: generatedId,
        slug: vehicle.slug || '',
        name: vehicle.name || '',
        type: vehicle.type || 'van_amenege',
        description: vehicle.description || '',
        price_per_day: Number(vehicle.pricePerDay) || 0,
        seats: Number(vehicle.seats) || 2,
        beds: Number(vehicle.beds) || 2,
        features: Array.isArray(vehicle.features) ? vehicle.features : [],
        images: Array.isArray(vehicle.images) ? vehicle.images : [],
        available: vehicle.available !== false,
        location: vehicle.location || 'Bordeaux',
        owner: vehicle.owner || {
          name: 'Cap Aventure Agence',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          responseTime: 'En moins d\'une heure',
          responseRate: 100
        },
        tech_specs: vehicle.techSpecs || {
          fuel: 'Diesel',
          transmission: 'Manuelle',
          consumption: '8L/100km',
          enginePower: '130 ch'
        },
        rating: Number(vehicle.rating) || 5.0,
        review_count: Number(vehicle.reviewCount) || 0,
        reviews: Array.isArray(vehicle.reviews) ? vehicle.reviews : [],
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase addVehicle error:', error);
        throw new Error(error.message || 'Erreur lors de l\'enregistrement dans Supabase');
      }

      if (data && data.length > 0) {
        return data[0].id;
      }
    } catch (err: any) {
      console.error('Supabase addVehicle exception:', err);
      throw err;
    }
  }

  return generatedId;
}

export async function updateVehicle(id: string, updatedFields: Partial<Vehicle>): Promise<void> {
  const currentVehicles = getStoredVehicles();
  inMemoryVehicles = currentVehicles.map(v => {
    if (v.id === id) {
      return { ...v, ...updatedFields };
    }
    return v;
  });
  saveStoredVehicles(inMemoryVehicles);

  if (supabase) {
    try {
      const payload: Record<string, any> = {};
      if (updatedFields.name !== undefined) payload.name = updatedFields.name;
      if (updatedFields.slug !== undefined) payload.slug = updatedFields.slug;
      if (updatedFields.type !== undefined) payload.type = updatedFields.type;
      if (updatedFields.description !== undefined) payload.description = updatedFields.description;
      if (updatedFields.pricePerDay !== undefined) payload.price_per_day = Number(updatedFields.pricePerDay);
      if (updatedFields.seats !== undefined) payload.seats = Number(updatedFields.seats);
      if (updatedFields.beds !== undefined) payload.beds = Number(updatedFields.beds);
      if (updatedFields.features !== undefined) payload.features = updatedFields.features;
      if (updatedFields.images !== undefined) payload.images = updatedFields.images;
      if (updatedFields.available !== undefined) payload.available = updatedFields.available;
      if (updatedFields.location !== undefined) payload.location = updatedFields.location;
      if (updatedFields.owner !== undefined) payload.owner = updatedFields.owner;
      if (updatedFields.techSpecs !== undefined) payload.tech_specs = updatedFields.techSpecs;
      if (updatedFields.rating !== undefined) payload.rating = updatedFields.rating;
      if (updatedFields.reviewCount !== undefined) payload.review_count = updatedFields.reviewCount;
      if (updatedFields.reviews !== undefined) payload.reviews = updatedFields.reviews;

      const { error } = await supabase
        .from('vehicles')
        .update(payload)
        .eq('id', id);

      if (error) {
        console.error('Supabase updateVehicle error:', error);
      }
    } catch (err) {
      console.error('Supabase updateVehicle exception:', err);
    }
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  const currentVehicles = getStoredVehicles();
  inMemoryVehicles = currentVehicles.filter(v => v.id !== id);
  saveStoredVehicles(inMemoryVehicles);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase deleteVehicle error:', error);
      }
    } catch (err) {
      console.error('Supabase deleteVehicle exception:', err);
    }
  }
}

// ==========================================
// SERVICES RÉSERVATIONS & CLIENTS
// ==========================================

export async function createReservation(
  reservationInput: Omit<Reservation, 'id' | 'clientId' | 'clientName'>,
  clientInput: Omit<Client, 'id'>
): Promise<string> {
  const resId = `res-${Date.now()}`;
  const clientId = `cli-${Date.now()}`;

  const newClient: Client = {
    ...clientInput,
    id: clientId,
  };
  const newReservation: Reservation = {
    ...reservationInput,
    id: resId,
    clientId,
    clientName: `${clientInput.firstName} ${clientInput.lastName}`,
    status: reservationInput.status || 'EN_ATTENTE'
  };

  const currentClients = getStoredClients();
  const existingIdx = currentClients.findIndex(c => c.email.toLowerCase() === clientInput.email.toLowerCase());
  if (existingIdx >= 0) {
    currentClients[existingIdx] = { ...currentClients[existingIdx], ...clientInput };
  } else {
    currentClients.unshift(newClient);
  }
  inMemoryClients = currentClients;
  saveStoredClients(inMemoryClients);

  inMemoryReservations.unshift(newReservation);
  saveStoredReservations(inMemoryReservations);

  // Synchronisation Supabase directe
  if (supabase) {
    try {
      // 1. Enregistrer ou mettre à jour le client dans Supabase
      let finalClientId = clientId;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', clientInput.email)
        .maybeSingle();

      if (existingClient && existingClient.id) {
        finalClientId = existingClient.id;
        await supabase
          .from('clients')
          .update({
            first_name: clientInput.firstName,
            last_name: clientInput.lastName,
            phone: clientInput.phone,
            driving_license_number: clientInput.drivingLicenseNumber,
          })
          .eq('id', finalClientId);
      } else {
        await supabase
          .from('clients')
          .insert([{
            id: finalClientId,
            first_name: clientInput.firstName,
            last_name: clientInput.lastName,
            email: clientInput.email,
            phone: clientInput.phone,
            driving_license_number: clientInput.drivingLicenseNumber,
            created_at: new Date().toISOString()
          }]);
      }

      // 2. Enregistrer la réservation dans Supabase
      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .insert([{
          id: resId,
          vehicle_id: reservationInput.vehicleId,
          vehicle_name: reservationInput.vehicleName,
          client_id: finalClientId,
          client_name: `${clientInput.firstName} ${clientInput.lastName}`,
          start_date: reservationInput.startDate,
          end_date: reservationInput.endDate,
          total_days: Number(reservationInput.totalDays),
          total_price: Number(reservationInput.totalPrice),
          status: reservationInput.status || 'EN_ATTENTE',
          specific_details: reservationInput.specificDetails || {},
          created_at: new Date().toISOString()
        }])
        .select();

      if (resError) {
        console.error('Supabase createReservation error:', resError);
      } else if (resData && resData.length > 0) {
        return resData[0].id;
      }
    } catch (err) {
      console.error('Supabase reservation sync error:', err);
    }
  }

  return resId;
}

export async function getReservations(): Promise<Reservation[]> {
  inMemoryReservations = getStoredReservations();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          vehicleId: r.vehicle_id || '',
          vehicleName: r.vehicle_name || '',
          clientId: r.client_id || '',
          clientName: r.client_name || '',
          startDate: r.start_date || '',
          endDate: r.end_date || '',
          totalDays: Number(r.total_days) || 0,
          totalPrice: Number(r.total_price) || 0,
          status: (r.status as ReservationStatus) || 'EN_ATTENTE',
          specificDetails: r.specific_details || {},
        }));
      }
    } catch (sbErr) {
      console.warn('Supabase fetch reservations error:', sbErr);
    }
  }

  return [...inMemoryReservations];
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  inMemoryReservations = getStoredReservations();
  inMemoryReservations = inMemoryReservations.map(r => r.id === id ? { ...r, status } : r);
  saveStoredReservations(inMemoryReservations);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Supabase updateReservationStatus error:', error);
      }
    } catch (err) {
      console.error('Supabase updateReservationStatus error:', err);
    }
  }
}

export async function updateLatestReservationStatus(status: ReservationStatus): Promise<void> {
  inMemoryReservations = getStoredReservations();
  if (inMemoryReservations.length > 0) {
    const latestId = inMemoryReservations[0].id;
    inMemoryReservations[0].status = status;
    saveStoredReservations(inMemoryReservations);
    await updateReservationStatus(latestId, status);
  }
}

export async function getClients(): Promise<Client[]> {
  const storedClients = getStoredClients();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          firstName: c.first_name || '',
          lastName: c.last_name || '',
          email: c.email || '',
          phone: c.phone || '',
          drivingLicenseNumber: c.driving_license_number || '',
        }));
      }
    } catch (err) {
      console.warn('Supabase getClients error:', err);
    }
  }

  return storedClients;
}
