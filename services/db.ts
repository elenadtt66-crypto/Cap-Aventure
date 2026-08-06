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
import { Vehicle, Client, Reservation, ReservationStatus } from '@/types';
import yescapaData from '@/data/yescapa-vehicles.json';

// ==========================================
// SERVICES VÉHICILES
// ==========================================

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    if (db.app.options.projectId === 'mock-project-id') {
      return [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
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
          avatar: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
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
      return [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
    }
    return list;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    if (db.app.options.projectId === 'mock-project-id') {
      const allMocks = [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
      return allMocks.find(v => v.slug === slug) || null;
    }
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
          name: 'Propriétaire',
          avatar: 'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
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
    
    const allMocks = [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
    const mockFound = allMocks.find(v => v.slug === slug);
    return mockFound || null;
  } catch (error) {
    console.error('Error fetching vehicle by slug:', error);
    const allMocks = [...MOCK_VEHICLES, ...(yescapaData as Vehicle[])];
    const mockFound = allMocks.find(v => v.slug === slug);
    return mockFound || null;
  }
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'vehicles'), {
    ...vehicle,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<void> {
  const docRef = doc(db, 'vehicles', id);
  await updateDoc(docRef, vehicle);
}

export async function deleteVehicle(id: string): Promise<void> {
  const docRef = doc(db, 'vehicles', id);
  await deleteDoc(docRef);
}

// ==========================================
// SERVICES RÉSERVATIONS & CLIENTS
// ==========================================

export async function createReservation(
  reservationInput: Omit<Reservation, 'id' | 'clientId' | 'clientName'>,
  clientInput: Omit<Client, 'id'>
): Promise<string> {
  try {
    const reservationId = await runTransaction(db, async (transaction) => {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('email', '==', clientInput.email));
      const clientQuerySnap = await getDocs(q);
      
      let clientId = '';
      if (!clientQuerySnap.empty) {
        clientId = clientQuerySnap.docs[0].id;
        const clientDocRef = doc(db, 'clients', clientId);
        transaction.update(clientDocRef, {
          lastName: clientInput.lastName,
          firstName: clientInput.firstName,
          phone: clientInput.phone,
          drivingLicenseNumber: clientInput.drivingLicenseNumber,
        });
      } else {
        const newClientDocRef = doc(collection(db, 'clients'));
        clientId = newClientDocRef.id;
        transaction.set(newClientDocRef, {
          ...clientInput,
          createdAt: Timestamp.now(),
        });
      }

      const newResDocRef = doc(collection(db, 'reservations'));
      transaction.set(newResDocRef, {
        ...reservationInput,
        clientId,
        clientName: `${clientInput.firstName} ${clientInput.lastName}`,
        createdAt: Timestamp.now(),
      });

      return newResDocRef.id;
    });

    return reservationId;
  } catch (error) {
    console.error('Error in createReservation transaction:', error);
    throw error;
  }
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    if (db.app.options.projectId === 'mock-project-id') return [];
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
    return list;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  const docRef = doc(db, 'reservations', id);
  await updateDoc(docRef, { status });
}

export async function getClients(): Promise<Client[]> {
  try {
    if (db.app.options.projectId === 'mock-project-id') return [];
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
    return list;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

// ==========================================
// DONNÉES DE DÉMO (MOCK STYLE YESCAPA)
// ==========================================

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'van-1',
    slug: 'volkswagen-california-coast-t6',
    name: 'Volkswagen California Coast T6.1',
    type: 'van_amenege',
    description: 'Le compagnon d\'aventure historique et moderne à la fois. Prise en main facile, gabarit compact (hauteur < 2m pour les parkings et barrières de plages). Cuisine intégrée avec feux de cuisson, évier et réfrigérateur, toit relevable électrique avec couchage à lattes de pin et couchages confortables pour 4 personnes. Parfait pour les escapades sauvages en amoureux ou en petite famille.',
    pricePerDay: 120,
    seats: 4,
    beds: 4,
    features: ['Cuisine intégrée', 'Réfrigérateur 42L', 'Toit Relevable Électrique', 'Chauffage stationnaire diesel', 'Douchette extérieure', 'Régulateur de vitesse', 'Apple CarPlay', 'Table de camping extérieure'],
    images: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Bordeaux',
    owner: {
      name: 'Marc',
      avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      responseTime: 'En moins d\'une heure',
      responseRate: 98
    },
    techSpecs: { fuel: 'Diesel', transmission: 'Manuelle', consumption: '7.5L/100km', enginePower: '150 ch' },
    rating: 4.9, reviewCount: 14,
    reviews: [
      { id: 'rev-1', author: 'Sophie L.', date: '2026-05-15', rating: 5, comment: 'Superbe expérience ! Le van de Marc était d\'une propreté irréprochable et hyper maniable.' },
      { id: 'rev-2', author: 'Thomas B.', date: '2026-06-02', rating: 4.8, comment: 'Très bon séjour à bord de ce California. Tout l\'équipement nécessaire est présent.' }
    ]
  },
  {
    id: 'cc-profile-1',
    slug: 'challenger-260-graphite',
    name: 'Challenger 260 Graphite Edition',
    type: 'camping_car_profile',
    description: 'Le profilé de luxe compact par excellence. Offre un espace de vie gigantesque avec son salon face-face (Smart Lounge) et son grand lit de pavillon escamotable électriquement (160x200cm). Une salle d\'eau moderne transversale arrière complète avec une immense penderie et un accès direct au garage à vélos chauffé.',
    pricePerDay: 150,
    seats: 4,
    beds: 4,
    features: ['Cuisine Équipée 3 feux', 'Grand Réfrigérateur 167L', 'Douche Séparée', 'Lit Pavillon Électrique', 'Porte-Vélos x3', 'Store extérieur', 'Chauffage sur carburant'],
    images: [
      'https://images.unsplash.com/photo-1470071131384-001b85755b36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Paris',
    owner: { name: 'Estelle', avatar: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En 2 heures', responseRate: 95 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '9.2L/100km', enginePower: '170 ch' },
    rating: 4.8, reviewCount: 9,
    reviews: [{ id: 'rev-3', author: 'Julien M.', date: '2026-04-20', rating: 5, comment: 'Camping-car d\'un confort exceptionnel. Le salon est gigantesque !' }]
  },
  {
    id: 'cc-integral-1',
    slug: 'hymer-b-class-780',
    name: 'Hymer B-Class MasterLine I 780',
    type: 'camping_car_integral',
    description: 'L\'expérience ultime du voyage en hôtel 5 étoiles roulant. Volume intérieur exceptionnel, pare-brise panoramique pour une visibilité totale de la route. Isolation thermique et acoustique suprême d\'Hymer. Finitions haut de gamme en cuir et bois précieux, grand lit central arrière et lit pavillon cabine.',
    pricePerDay: 220,
    seats: 4,
    beds: 5,
    features: ['Chauffage Central Alde', 'Double Plancher isolé', 'Four à Gaz intégré', 'Douche Indépendante Deluxe', 'Caméra de Recul 360°', 'Panneaux solaires 200W', 'Climatisation cellule', 'TV 32 pouces'],
    images: [
      'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Lyon',
    owner: { name: 'Jean-Pierre', avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En moins de 12 heures', responseRate: 90 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '11.5L/100km', enginePower: '180 ch' },
    rating: 5.0, reviewCount: 5,
    reviews: [{ id: 'rev-4', author: 'Guillaume P.', date: '2026-05-30', rating: 5, comment: 'Le grand luxe ! Ce Hymer est un véritable palace roulant.' }]
  },
  {
    id: 'fourgon-1',
    slug: 'adria-twin-sports-600',
    name: 'Adria Twin Sports 600 SPB',
    type: 'fourgon_amenege',
    description: 'L\'équilibre parfait entre le confort d\'un camping-car et la maniabilité d\'un van. Son toit relevable exclusif offre une chambre supplémentaire suspendue dans les arbres. Grand lit transversal arrière repliable pour libérer une soute immense pour vos vélos ou vos planches de surf.',
    pricePerDay: 135,
    seats: 4,
    beds: 4,
    features: ['Cabinet de Toilette Duplex', 'Toit Relevable avec couchage', 'Soute Sportive Modulaire', 'Panneau Solaire 120W', 'Porte-Vélos pivotant', 'Store extérieur', 'GPS spécial camping-car'],
    images: [
      'https://images.unsplash.com/photo-1470071131384-001b85755b36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Toulouse',
    owner: { name: 'Adrien', avatar: 'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En 1 heure', responseRate: 100 },
    techSpecs: { fuel: 'Diesel', transmission: 'Manuelle', consumption: '8.4L/100km', enginePower: '140 ch' },
    rating: 4.7, reviewCount: 11,
    reviews: [{ id: 'rev-5', author: 'Lucie D.', date: '2026-06-10', rating: 4.5, comment: 'Parfait pour notre séjour de surf dans les Landes. La soute est très grande.' }]
  },
  {
    id: 'van-2',
    slug: 'ford-transit-nugget',
    name: 'Ford Transit Custom Nugget Plus',
    type: 'van_amenege',
    description: 'Un van aménagé ultra complet avec WC intégrés (rare pour cette taille). Son agencement unique sépare l\'espace salon/conduite de la zone cuisine/sanitaire à l\'arrière. Très agréable à conduire, il passe sous les barres des 2m10 et permet un stationnement aisé en ville.',
    pricePerDay: 115,
    seats: 5,
    beds: 4,
    features: ['WC fixes avec lavabo', 'Cuisine en L arrière', 'Toit relevable', 'Douchette extérieure', 'Chauffage stationnaire', 'Boîte automatique', 'Radars AV/AR'],
    images: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Marseille',
    owner: { name: 'Chloé', avatar: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En 3 heures', responseRate: 92 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '8.0L/100km', enginePower: '185 ch' },
    rating: 4.6, reviewCount: 8,
    reviews: [{ id: 'rev-6', author: 'Antoine R.', date: '2026-07-01', rating: 5, comment: 'Super van, le WC intégré est un vrai plus !' }]
  },
  {
    id: 'fourgon-2',
    slug: 'possl-summit-640',
    name: 'Pössl Summit 640 Prime',
    type: 'fourgon_amenege',
    description: 'Le roi des fourgons avec lits jumeaux ! Profitez du confort de lits séparés de grande dimension transformables en lit king-size. La particularité du "Prime" est son Skyroof ouvrant panoramique à l\'avant, inondant le salon de lumière. Idéal pour un couple qui recherche espace et luminosité.',
    pricePerDay: 140,
    seats: 4,
    beds: 3,
    features: ['Lits Jumeaux arrières', 'Skyroof Panoramique', 'Salle de bain pivotante', 'Réfrigérateur à compression', 'Batterie Lithium', 'Attelage', 'Stores occultants cabine'],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071131384-001b85755b36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Nantes',
    owner: { name: 'Bernard', avatar: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En moins d\'une heure', responseRate: 100 },
    techSpecs: { fuel: 'Diesel', transmission: 'Manuelle', consumption: '9.0L/100km', enginePower: '160 ch' },
    rating: 4.9, reviewCount: 22,
    reviews: [{ id: 'rev-7', author: 'Martine V.', date: '2026-06-25', rating: 5, comment: 'Bernard est très soigneux et son fourgon est dans un état irréprochable. Le skyroof change tout.' }]
  },
  {
    id: 'cc-capucine-1',
    slug: 'benimar-sport-340',
    name: 'Benimar Sport 340 Up',
    type: 'capucine',
    description: 'Le camping-car familial par excellence avec ses 5 places carte grise et couchages sans aucune manipulation ! Un grand lit capucine au-dessus de la cabine, des lits superposés à l\'arrière pour les enfants, et un salon spacieux. Tout est inclus et prêt à partir (vaisselle, cales, tuyau, rallonge).',
    pricePerDay: 130,
    seats: 5,
    beds: 5,
    features: ['Lits Superposés', 'Grand Lit Capucine', 'Soute modulable', 'Grand Réfrigérateur/Congélateur', 'Store Extérieur', 'Panneau Solaire', 'Porte-vélos x4'],
    images: [
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Rennes',
    owner: { name: 'Famille Dupont', avatar: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En 4 heures', responseRate: 88 },
    techSpecs: { fuel: 'Diesel', transmission: 'Manuelle', consumption: '10.5L/100km', enginePower: '130 ch' },
    rating: 4.5, reviewCount: 15,
    reviews: [{ id: 'rev-8', author: 'Pauline C.', date: '2026-05-10', rating: 4, comment: 'Véhicule très pratique pour notre famille de 5, les enfants ont adoré les lits superposés.' }]
  },
  {
    id: 'van-3',
    slug: 'mercedes-marco-polo',
    name: 'Mercedes Marco Polo AMG Line',
    type: 'van_amenege',
    description: 'Le luxe absolu en format van. Finitions intérieures premium inspirées des yachts, sièges en cuir véritable, ambiance lumineuse réglable, suspension pneumatique pour un confort de route inégalé. Toit relevable électriquement, système multimédia MBUX. L\'élégance et l\'aventure réunies.',
    pricePerDay: 160,
    seats: 4,
    beds: 4,
    features: ['Finition AMG Line', 'Intérieur Cuir', 'Système Son Burmester', 'Suspension Airmatic', 'Caméras 360', 'Cuisine Premium', 'Chauffage stationnaire'],
    images: [
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Nice',
    owner: { name: 'Alexandre', avatar: 'https://images.unsplash.com/photo-1470071131384-001b85755b36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En moins d\'une heure', responseRate: 100 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '7.8L/100km', enginePower: '239 ch' },
    rating: 5.0, reviewCount: 6,
    reviews: [{ id: 'rev-9', author: 'Stéphane G.', date: '2026-06-15', rating: 5, comment: 'Un van hors norme. Le moteur V300d est puissant et silencieux, l\'intérieur est magique. Alexandre est très arrangeant.' }]
  },
  {
    id: 'cc-profile-2',
    slug: 'pilote-galaxy-g740',
    name: 'Pilote Galaxy G740 Evidence',
    type: 'camping_car_integral',
    description: 'Intégral français haut de gamme aux espaces généreux. Salon face à face avec grande table centrale, cuisine en L sur-équipée. Sa chambre arrière offre un lit central majestueux (150cm de large) réglable en hauteur, avec salle d\'eau à double séparationnement. Tout le confort comme à la maison.',
    pricePerDay: 180,
    seats: 4,
    beds: 4,
    features: ['Lit Central King Size', 'Douche Indépendante', 'TV connectée 24"', 'Antenne Satellite', 'Store et panneau solaire', 'Tiroir extérieur', 'Onduleur 2000W'],
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Strasbourg',
    owner: { name: 'Sylvie', avatar: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En 2 heures', responseRate: 94 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '10.2L/100km', enginePower: '160 ch' },
    rating: 4.8, reviewCount: 18,
    reviews: [{ id: 'rev-10', author: 'Laurent K.', date: '2026-05-02', rating: 5, comment: 'Le véhicule idéal pour notre escapade en Forêt Noire. Le confort thermique est excellent même par temps froid.' }]
  },
  {
    id: 'fourgon-3',
    slug: 'volkswagen-grand-california',
    name: 'Volkswagen Grand California 600',
    type: 'fourgon_amenege',
    description: 'Le grand frère du California basé sur le Crafter. Il inclut une véritable salle d\'eau tout-en-un (douche, lavabo, WC) et un lit transversal arrière ultra confortable grâce à ses extensions latérales de carrosserie. Finitions claires, style marin et toit panoramique sublime.',
    pricePerDay: 155,
    seats: 4,
    beds: 2,
    features: ['Salle d\'eau complète', 'Lit transversal spacieux', 'Chauffage Gaz/Électricité', 'Panneau de contrôle tactile', 'Éclairage d\'ambiance LED', 'Mobilier blanc brillant', 'Table + chaises intégrées aux portes'],
    images: [
      'https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    available: true,
    location: 'Biarritz',
    owner: { name: 'Maxime', avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', responseTime: 'En moins de 30 minutes', responseRate: 100 },
    techSpecs: { fuel: 'Diesel', transmission: 'Automatique', consumption: '9.5L/100km', enginePower: '177 ch' },
    rating: 4.9, reviewCount: 12,
    reviews: [{ id: 'rev-11', author: 'Emma L.', date: '2026-07-05', rating: 5, comment: 'L\'expérience California avec la salle d\'eau en plus ! Conduite très sûre et confortable malgré sa grande taille.' }]
  }
];
