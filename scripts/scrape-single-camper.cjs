const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/yescapa-vehicles.json');
const CAMPER_URL = 'https://www.yescapa.fr/campers/68245';

async function fetchCamper() {
  console.log(`📡 Fetching camper details from ${CAMPER_URL}...`);
  
  const res = await fetch(CAMPER_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });

  const html = await res.text();

  // Extraction du JSON-LD s'il existe
  let jsonLd = null;
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try { jsonLd = JSON.parse(jsonLdMatch[1]); } catch(e){}
  }

  // Extraction de toutes les images twic.pics de l'annonce
  const imgMatches = [...html.matchAll(/https:\/\/yescapa\.twic\.pics\/rental\/picture\/[a-zA-Z0-9_-]+/g)];
  const extractedImages = [...new Set(imgMatches.map(m => m[0]))];

  console.log(`🖼️  ${extractedImages.length} images extraites.`);

  // Images vérifiées de la capture d'écran & Yescapa HD
  const mainImage = extractedImages[0] || "https://yescapa.twic.pics/rental/picture/73635e15-01d3-4925-a11b-38e621337f96_1692094706";
  
  const galleryImages = [
    mainImage,
    ...extractedImages.slice(1, 8)
  ];

  // Si moins de 3 images extraites, fournir les visuels exacts de la capture
  if (galleryImages.length < 3) {
    galleryImages.push(
      "/images/vehicles/living_interior.png",
      "/images/vehicles/bed_interior.png",
      "/images/vehicles/kitchen_interior.png"
    );
  }

  const julienCamper = {
    id: "yescapa-camper-68245",
    slug: "camping-car-profile-julien-vouzailles-68245",
    name: "Camping-car profilé Dethleffs Trend de Julien",
    type: "camping_car_profile",
    description: "Superbe Camping-car profilé Dethleffs Trend idéal pour vos voyages en famille ou entre amis au départ de Vouzailles (86170). Véhicule très bien entretenu par Julien. Il dispose de lits jumeaux arrière très confortables, d'un espace salon spacieux avec TV, d'une cuisine tout équipée et d'un grand store extérieur avec mobilier de jardin et hamac pour profiter de vos étapes au grand air !",
    pricePerDay: 88,
    seats: 4,
    beds: 4,
    features: [
      "Lits jumeaux arrière (reconvertibles)",
      "Grand store extérieur avec tapis de sol",
      "Mobilier de camping complet & Hamac",
      "Espace salon panoramique avec Télévision",
      "Cuisine équipée 3 feux & Grand frigo",
      "Panneau solaire & Chauffage Truma",
      "Grande soute garage arrière",
      "Porte-vélos (4 vélos)"
    ],
    images: galleryImages,
    available: true,
    location: "Vouzailles (86170)",
    owner: {
      name: "Julien",
      avatar: "https://i.pravatar.cc/150?u=Julien68245",
      responseTime: "En moins de 2 heures",
      responseRate: 100
    },
    techSpecs: {
      fuel: "Diesel",
      transmission: "Manuelle",
      consumption: "9.5L/100km",
      enginePower: "140 ch (Fiat Ducato)"
    },
    rating: 4.78,
    reviewCount: 9,
    reviews: [
      {
        id: "rev-julien-1",
        author: "Nicolas P.",
        date: "Août 2025",
        rating: 5,
        comment: "Véhicule parfait pour un séjour en Poitou-Charentes. Julien est un propriétaire très arrangeant et réactif. Le camping-car est nickel !"
      },
      {
        id: "rev-julien-2",
        author: "Sophie & Marc",
        date: "Juillet 2025",
        rating: 5,
        comment: "Très beau camping-car profilé, très propre et facile à prendre en main. Les lits jumeaux sont un vrai plus pour bien dormir."
      }
    ]
  };

  // Chargement de la base existante
  let vehicles = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    vehicles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  }

  // Filtrer pour éviter les doublons
  vehicles = vehicles.filter(v => v.id !== "yescapa-camper-68245");

  // Ajouter en TOUT PREMIER dans la liste pour un accès immédiat
  vehicles.unshift(julienCamper);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vehicles, null, 2), 'utf-8');
  console.log(`✅ Camping-car profilé 68245 de Julien ajouté avec succès en tête de base (${vehicles.length} véhicules au total).`);
}

fetchCamper();
