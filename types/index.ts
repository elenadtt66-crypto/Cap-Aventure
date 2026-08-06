export type VehicleType = 'van_amenege' | 'camping_car_profile' | 'camping_car_integral' | 'fourgon_amenege';

export interface Owner {
  name: string;
  avatar: string;
  responseTime: string;
  responseRate: number;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface TechSpecs {
  fuel: 'Diesel' | 'Essence' | 'Hybride' | 'Électrique';
  transmission: 'Manuelle' | 'Automatique';
  consumption: string;
  enginePower: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  type: VehicleType;
  description: string;
  pricePerDay: number;
  seats: number;
  beds: number;
  features: string[];
  images: string[];
  available: boolean;
  location: string; // Ville de départ (ex: Bordeaux, Paris, etc.)
  owner: Owner;
  techSpecs: TechSpecs;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  createdAt?: any; // Firestore Timestamp
}

export interface Client {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  drivingLicenseNumber: string;
  createdAt?: any; // Firestore Timestamp
}

export type ReservationStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE';

export interface Reservation {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt?: any; // Firestore Timestamp
  specificDetails: {
    // Options Van
    outdoorShower?: boolean;
    portableToilet?: boolean;
    roofTent?: boolean;
    
    // Options Profilé
    bedLayout?: 'JUMEAUX' | 'CENTRAL';
    bikeRackCount?: number;
    
    // Options Intégral
    hasLargeVehicleExperience?: boolean;
    luxuryLinenPack?: boolean;
    finalCleaningService?: boolean;
    
    // Options Fourgon
    sportsEquipmentStorage?: boolean;
    sportsEquipmentType?: string;
    allowPets?: boolean;
    
    // Autres remarques
    notes?: string;
  };
}
