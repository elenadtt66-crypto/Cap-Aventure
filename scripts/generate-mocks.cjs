const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'van_amenege',
  'fourgon_amenege',
  'camping_car_profile',
  'camping_car_integral',
  'capucine'
];

const VEHICLES_PER_CATEGORY = 150;

// Données de base pour la génération
const LOCATIONS = ['Paris', 'Bordeaux', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Lille', 'Rennes', 'Reims', 'Toulon', 'Saint-Étienne', 'Le Havre', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'];

const FIRST_NAMES = ['Jean', 'Pierre', 'Michel', 'Alain', 'Nicolas', 'Christophe', 'Bernard', 'Christian', 'Daniel', 'Thierry', 'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Martine', 'Françoise', 'Monique', 'Anne', 'Sandrine', 'Marc', 'Lucas', 'Thomas', 'Hugo', 'Arthur', 'Louis', 'Gabriel', 'Emma', 'Léa', 'Chloé', 'Manon', 'Camille'];

const FEATURES_POOL = {
  van_amenege: ['Toit relevable', 'Cuisine extérieure', 'Glacière à compression', 'Panneau solaire', 'Douchette', 'Auvent', 'Chauffage stationnaire'],
  fourgon_amenege: ['Salle de bain', 'Lits jumeaux', 'Grand réfrigérateur', 'Porte-vélos', 'Panneau solaire 120W', 'Store extérieur', 'Attelage'],
  camping_car_profile: ['Lit central', 'Lit pavillon', 'Douche séparée', 'Soute garage', 'TV connectée', 'Four', 'Climatisation cellule', 'Caméra de recul'],
  camping_car_integral: ['Pare-brise panoramique', 'Double plancher isolé', 'Chauffage Alde', 'Lit King Size', 'Salon XXL', 'Cuir', 'Système multimédia premium'],
  capucine: ['Lit capucine 160x200', 'Lits superposés', 'Dinette double', 'Grande capucine', 'Idéal famille nombreuse', 'Double penderie']
};

const MODELS_POOL = {
  van_amenege: ['Volkswagen California', 'Ford Transit Nugget', 'Mercedes Marco Polo', 'Renault Trafic Horizon', 'Peugeot Traveller Campster'],
  fourgon_amenege: ['Pössl Summit', 'Adria Twin', 'Campérêve Magellan', 'Chausson V594', 'Font Vendôme Leader Camp'],
  camping_car_profile: ['Challenger 260', 'Pilote P746', 'Bürstner Nexxo', 'Rapido 696', 'McLouis Mc4'],
  camping_car_integral: ['Hymer B-Class', 'Pilote Galaxy', 'Rapido 8096', 'Carthago Chic c-line', 'Eura Mobil Integra'],
  capucine: ['Benimar Sport', 'Chausson C514', 'Roller Team Kronos', 'Sunlight A70', 'Carado A461']
};

const IMAGES_POOL = {
  van_amenege: [
    '/images/vehicles/van_1.png',
    '/images/vehicles/van_2.png',
    '/images/vehicles/van_3.png',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    'https://images.unsplash.com/photo-1533552755457-5b48b0cb13c0?w=800&q=80'
  ],
  fourgon_amenege: [
    '/images/vehicles/fourgon_1.png',
    '/images/vehicles/fourgon_2.png',
    '/images/vehicles/fourgon_3.png',
    'https://images.unsplash.com/photo-1565034633786-905101da3d54?w=800&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
  ],
  camping_car_profile: [
    '/images/vehicles/profile_1.png',
    'https://images.unsplash.com/photo-1513313778780-9ae4807465f2?w=800&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&q=80'
  ],
  camping_car_integral: [
    '/images/vehicles/integral_1.png',
    'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&q=80',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80'
  ],
  capucine: [
    '/images/vehicles/capucine_1.png',
    'https://images.unsplash.com/photo-1595166249704-51787c9339e1?w=800&q=80',
    'https://images.unsplash.com/photo-1527376916886-4f410714edbb?w=800&q=80'
  ]
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFeatures(category) {
  const pool = FEATURES_POOL[category];
  const numFeatures = getRandomInt(3, pool.length);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFeatures);
}

function generateVehicle(category, index) {
  const modelName = getRandomElement(MODELS_POOL[category]);
  const location = getRandomElement(LOCATIONS);
  const ownerName = getRandomElement(FIRST_NAMES);
  const year = getRandomInt(2015, 2024);
  const name = `${modelName} ${year}`;
  
  let priceMin = 80, priceMax = 120;
  let seatsMin = 2, seatsMax = 4;
  let bedsMin = 2, bedsMax = 4;

  if (category === 'camping_car_integral') { priceMin = 150; priceMax = 250; seatsMax = 5; bedsMax = 6; }
  else if (category === 'camping_car_profile') { priceMin = 110; priceMax = 180; seatsMax = 5; bedsMax = 5; }
  else if (category === 'fourgon_amenege') { priceMin = 90; priceMax = 150; }
  else if (category === 'capucine') { priceMin = 120; priceMax = 160; seatsMin = 5; seatsMax = 7; bedsMin = 5; bedsMax = 7; }

  const pricePerDay = getRandomInt(priceMin, priceMax);
  const seats = getRandomInt(seatsMin, seatsMax);
  const beds = getRandomInt(bedsMin, bedsMax);

  const imgs = IMAGES_POOL[category];
  const exteriorImage = getRandomElement(imgs);
  const images = [
    exteriorImage,
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ];

  return {
    id: `mock-${category}-${index}-${Date.now()}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index,
    name: name,
    type: category,
    description: `Magnifique ${modelName} de ${year}, idéal pour vos vacances au départ de ${location}. Véhicule parfaitement entretenu par ${ownerName}, prêt à partir à l'aventure ! Équipé pour un confort optimal tout au long de votre séjour. N'hésitez pas à me contacter pour plus de détails.`,
    pricePerDay: pricePerDay,
    seats: seats,
    beds: beds,
    features: getRandomFeatures(category),
    images: images,
    available: true,
    location: location,
    owner: {
      name: ownerName,
      avatar: `https://i.pravatar.cc/150?u=${ownerName}${index}`,
      responseTime: getRandomElement(['En moins d\'une heure', 'En quelques heures', 'Dans la journée']),
      responseRate: getRandomInt(85, 100)
    },
    techSpecs: {
      fuel: getRandomElement(['Diesel', 'Diesel']),
      transmission: getRandomElement(['Manuelle', 'Automatique']),
      consumption: `${getRandomInt(7, 12)}L/100km`,
      enginePower: `${getRandomInt(110, 180)} ch`
    },
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    reviewCount: getRandomInt(0, 45),
    reviews: []
  };
}

console.log('🚀 Lancement de la génération des véhicules...');
const allVehicles = [];

CATEGORIES.forEach(category => {
  console.log(`Génération de ${VEHICLES_PER_CATEGORY} véhicules pour la catégorie : ${category}`);
  for (let i = 0; i < VEHICLES_PER_CATEGORY; i++) {
    allVehicles.push(generateVehicle(category, i));
  }
});

// Mélange des véhicules
allVehicles.sort(() => 0.5 - Math.random());

const outputPath = path.join(__dirname, '../data/yescapa-vehicles.json');
fs.writeFileSync(outputPath, JSON.stringify(allVehicles, null, 2), 'utf-8');

console.log(`🎉 Génération terminée ! ${allVehicles.length} véhicules ont été sauvegardés dans ${outputPath}`);
