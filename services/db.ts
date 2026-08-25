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

let inMemoryVehicles: Vehicle[] = getStoredVehicles();
let inMemoryReservations: Reservation[] = getStoredReservations();

let inMemoryClients: Client[] = [
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

export const MOCK_VEHICLES: Vehicle[] = inMemoryVehicles;

// ==========================================
// SERVICES VÉHICULES
// ==========================================

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    if (!db || db.app?.options?.projectId === 'mock-project-id' || !db.app?.options?.projectId) {
      return getStoredVehicles();
    }
    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Vehicle[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        slug: data.slug || '',
        name: data.name || '',
        type: data.type || 'van_amenege',
        description: data.description || '',
        pricePerDay: data.pricePerDay || 0,
        seats: data.seats || 2,
        beds: data.beds || 2,
        features: data.features || [],
        images: data.images || [],
        available: data.available !== false,
        location: data.location || 'Bordeaux',
        owner: data.owner || {
          name: 'Propriétaire',
          avatar: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=150&q=80',
          responseTime: 'En moins d\'une heure',
          responseRate: 100
        },
        techSpecs: data.techSpecs || {
          fuel: 'Diesel',
          transmission: 'Manuelle',
          consumption: '8L/100km',
          enginePower: '130 ch'
        },
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        reviews: data.reviews || [],
      });
    });
    
    if (list.length === 0) {
      return getStoredVehicles();
    }
    return list;
  } catch (error) {
    return getStoredVehicles();
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const cleanSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  const storedVehicles = getStoredVehicles();

  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      try {
        const q = query(collection(db, 'vehicles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          return {
            id: docSnap.id,
            slug: data.slug || '',
            name: data.name || '',
            type: data.type || 'van_amenege',
            description: data.description || '',
            pricePerDay: data.pricePerDay || 0,
            seats: data.seats || 2,
            beds: data.beds || 2,
            features: data.features || [],
            images: data.images || [],
            available: data.available !== false,
            location: data.location || 'Bordeaux',
            owner: data.owner || {
              name: 'Cap Aventure Agence',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              responseTime: 'En moins d\'une heure',
              responseRate: 100
            },
            techSpecs: data.techSpecs || {
              fuel: 'Diesel',
              transmission: 'Manuelle',
              consumption: '8L/100km',
              enginePower: '130 ch'
            },
            rating: data.rating || 5.0,
            reviewCount: data.reviewCount || 0,
            reviews: data.reviews || [],
          };
        }
      } catch (firestoreErr) {
        // Fallback local
      }
    }

    // Recherche robuste dans le jeu de données dédupliqué
    const found = storedVehicles.find(
      v => v.slug.toLowerCase() === cleanSlug || 
           v.id.toLowerCase() === cleanSlug ||
           v.slug.toLowerCase().includes(cleanSlug) ||
           cleanSlug.includes(v.slug.toLowerCase())
    );

    return found || null;
  } catch (error) {
    const found = storedVehicles.find(
      v => v.slug.toLowerCase() === cleanSlug || 
           v.id.toLowerCase() === cleanSlug
    );
    return found || null;
  }
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<string> {
  const generatedId = `cap-${Date.now()}`;
  const newVehicle: Vehicle = {
    ...vehicle,
    id: generatedId,
  };

  // Enregistrement local persistent
  const currentVehicles = getStoredVehicles();
  inMemoryVehicles = [newVehicle, ...currentVehicles];
  saveStoredVehicles(inMemoryVehicles);

  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      const docRef = await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }
  } catch (err) {
    console.warn('Fallback: saved in localStorage');
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

  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      const docRef = doc(db, 'vehicles', id);
      await updateDoc(docRef, updatedFields);
    }
  } catch (err) {
    console.warn('Fallback: updated in localStorage');
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  const currentVehicles = getStoredVehicles();
  inMemoryVehicles = currentVehicles.filter(v => v.id !== id);
  saveStoredVehicles(inMemoryVehicles);

  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      const docRef = doc(db, 'vehicles', id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn('Fallback: deleted from localStorage');
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

  inMemoryClients.unshift(newClient);
  inMemoryReservations.unshift(newReservation);
  saveStoredReservations(inMemoryReservations);

  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      const reservationId = await runTransaction(db, async (transaction) => {
        const clientsRef = collection(db, 'clients');
        const q = query(clientsRef, where('email', '==', clientInput.email));
        const clientQuerySnap = await getDocs(q);
        
        let cid = '';
        if (!clientQuerySnap.empty) {
          cid = clientQuerySnap.docs[0].id;
          const clientDocRef = doc(db, 'clients', cid);
          transaction.update(clientDocRef, {
            lastName: clientInput.lastName,
            firstName: clientInput.firstName,
            phone: clientInput.phone,
            drivingLicenseNumber: clientInput.drivingLicenseNumber,
          });
        } else {
          const newClientDocRef = doc(collection(db, 'clients'));
          cid = newClientDocRef.id;
          transaction.set(newClientDocRef, {
            ...clientInput,
            createdAt: Timestamp.now(),
          });
        }

        const newResDocRef = doc(collection(db, 'reservations'));
        transaction.set(newResDocRef, {
          ...reservationInput,
          clientId: cid,
          clientName: `${clientInput.firstName} ${clientInput.lastName}`,
          createdAt: Timestamp.now(),
        });

        return newResDocRef.id;
      });

      return reservationId;
    }
  } catch (error) {
    console.warn('Fallback: reservation saved in memory');
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
          vehicleId: r.vehicle_id || r.vehicleId || '',
          vehicleName: r.vehicle_name || r.vehicleName || '',
          clientId: r.client_id || r.clientId || '',
          clientName: r.client_name || r.clientName || '',
          startDate: r.start_date || r.startDate || '',
          endDate: r.end_date || r.endDate || '',
          totalDays: r.total_days || r.totalDays || 0,
          totalPrice: r.total_price || r.totalPrice || 0,
          status: r.status || 'EN_ATTENTE',
          specificDetails: r.specific_details || r.specificDetails || {},
        }));
      }
    } catch (sbErr) {
      console.warn('Supabase fetch fallback to local storage');
    }
  }

  try {
    if (!db || db.app?.options?.projectId === 'mock-project-id' || !db.app?.options?.projectId) {
      return [...inMemoryReservations];
    }
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Reservation[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        vehicleId: data.vehicleId || '',
        vehicleName: data.vehicleName || '',
        clientId: data.clientId || '',
        clientName: data.clientName || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        totalDays: data.totalDays || 0,
        totalPrice: data.totalPrice || 0,
        status: data.status || 'EN_ATTENTE',
        specificDetails: data.specificDetails || {},
      });
    });
    return list.length > 0 ? list : [...inMemoryReservations];
  } catch (error) {
    return [...inMemoryReservations];
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  inMemoryReservations = getStoredReservations();
  inMemoryReservations = inMemoryReservations.map(r => r.id === id ? { ...r, status } : r);
  saveStoredReservations(inMemoryReservations);
  try {
    if (db && db.app?.options?.projectId && db.app.options.projectId !== 'mock-project-id') {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { status });
    }
  } catch (err) {
    // Memory fallback
  }
}

export async function updateLatestReservationStatus(status: ReservationStatus): Promise<void> {
  inMemoryReservations = getStoredReservations();
  if (inMemoryReservations.length > 0) {
    inMemoryReservations[0].status = status;
    saveStoredReservations(inMemoryReservations);
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    if (!db || db.app?.options?.projectId === 'mock-project-id' || !db.app?.options?.projectId) {
      return [...inMemoryClients];
    }
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Client[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        lastName: data.lastName || '',
        firstName: data.firstName || '',
        email: data.email || '',
        phone: data.phone || '',
        drivingLicenseNumber: data.drivingLicenseNumber || '',
      });
    });
    return list.length > 0 ? list : [...inMemoryClients];
  } catch (error) {
    return [...inMemoryClients];
  }
}
