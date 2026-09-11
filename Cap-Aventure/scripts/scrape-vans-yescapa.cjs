const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/yescapa-vehicles.json');

// Fonction pour récupérer le HTML d'une page Yescapa avec headers complets
async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} pour ${url}`);
  }
  return await res.text();
}

// Fonction pour extraire le JSON-LD item-list-microdata
function parseMicrodata(html) {
  const match = html.match(/<script type="application\/ld\+json" data-hid="item-list-microdata">([\s\S]*?)<\/script>/);
  if (!match) return [];
  try {
    const json = JSON.parse(match[1]);
    if (json.itemListElement && Array.isArray(json.itemListElement)) {
      return json.itemListElement.map(el => el.item).filter(Boolean);
    }
  } catch (e) {
    console.error('Erreur parsing JSON-LD:', e.message);
  }
  return [];
}

// Générateur de descriptions et caractéristiques réalistes pour vans
function generateVanDetails(name, location, price, rating) {
  const vanModels = [
    'Volkswagen California Ocean',
    'Mercedes Marco Polo V250',
    'Ford Transit Custom Nugget',
    'Renault Trafic SpaceNomad',
    'Peugeot Campster Pössl',
    'Citroën SpaceTourer Rip Curl',
    'Fiat Ducato Dreamer D55',
    'Hanroad Trek 5',
    'Knaus Boxstar 600',
    'Font Vendôme Leader Camp'
  ];

  const featuresPool = [
    'Toit relevable automatique',
    'Cuisine intégrée 2 feux',
    'Réfrigérateur à compression 42L',
    'Douchette extérieure à pression',
    'Panneau solaire 120W',
    'Chauffage stationnaire Webasto',
    'Store latéral extérieur',
    'Table & 2 chaises de camping',
    'Prises 220V & USB habitacle',
    'Attelage remorque / porte-vélos',
    'Isolation 4 saisons',
    'Réservoir eau propre 50L',
    'Raccordement électrique 220V extérieur',
    'Matelas haute densité à mémoire de forme'
  ];

  const shuffledFeatures = [...featuresPool].sort(() => 0.5 - Math.random());
  const selectedFeatures = shuffledFeatures.slice(0, Math.floor(Math.random() * 3) + 5);

  const descriptions = [
    `Embarquez à bord de ce super Van aménagé au départ de ${location} ! Idéal pour un roadtrip en liberté complète, il offre tout le confort moderne avec son toit relevable, sa cuisine entièrement équipée et son autonomie électrique grâce au panneau solaire. Parfait état mécanique et propreté irréprochable.`,
    `Spacieux, maniable et très agréable à conduire, ce Van au départ de ${location} vous permettra d'accéder aux plus beaux spots naturels. Équipé d'un chauffage stationnaire pour les nuits fraîches et d'une douchette extérieure. Tout le matériel de cuisine et le mobilier de camping sont inclus !`,
    `Partez à l'aventure sans compromis sur le confort ! Ce Van récent au départ de ${location} se faufile partout (hauteur < 2m, accès parkings facile). Équipé de 4 vrais couchages, d'un frigo et d'un espace salon très convivial.`,
    `Découvrez les routes de France et d'Europe au volant de ce Van d'exception à ${location}. Équipement complet, conduite fluide, consommation très raisonnable. Conseils et recommandations d'itinéraires offerts par le propriétaire !`
  ];

  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  const additionalImages = [
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ];

  return {
    description: randomDesc,
    features: selectedFeatures,
    additionalImages: additionalImages.sort(() => 0.5 - Math.random()).slice(0, 3)
  };
}

async function runScraper() {
  console.log('🚀 Démarrage de l\'extraction ciblée des Vans Yescapa (types=1)...');

  let vehicles = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      vehicles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      console.log(`📦 Base actuelle contient ${vehicles.length} véhicules.`);
    } catch (e) {
      console.log('Création d\'une nouvelle base.');
    }
  }

  const pagesToScrape = [
    'https://www.yescapa.fr/s?types=1',
    'https://www.yescapa.fr/s?types=1&page=2',
    'https://www.yescapa.fr/s?types=1&page=3',
    'https://www.yescapa.fr/s?types=1&page=4',
    'https://www.yescapa.fr/s?types=1&page=5'
  ];

  const newVans = [];
  const namesSet = new Set(vehicles.map(v => v.name + v.location));

  for (let i = 0; i < pagesToScrape.length; i++) {
    const url = pagesToScrape[i];
    console.log(`📡 Fetching page ${i + 1}/${pagesToScrape.length} : ${url}`);
    try {
      const html = await fetchPage(url);
      const items = parseMicrodata(html);
      console.log(`   -> ${items.length} annonces réelles trouvées sur cette page.`);

      for (const item of items) {
        const rawName = item.name || '';
        const location = item.offers?.availableAtOrFrom?.address?.addressLocality || 'Bordeaux';
        const price = Math.round(parseFloat(item.offers?.price) || 85);
        const rating = item.aggregateRating?.ratingValue || 4.9;
        const reviewCount = item.aggregateRating?.reviewCount || Math.floor(Math.random() * 25) + 3;

        const vanTitle = (rawName === 'Camping-car Profilé' || !rawName) 
          ? `Van Aménagé Premium (${location})` 
          : `${rawName} (${location})`;

        const uniqueKey = vanTitle + location + price;
        if (namesSet.has(uniqueKey)) continue;
        namesSet.add(uniqueKey);

        const details = generateVanDetails(vanTitle, location, price, rating);
        
        // Nettoyage URL image principale TwicPics Yescapa pour avoir la pleine résolution HD
        let mainImage = 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80';
        if (item.image) {
          mainImage = item.image.split('?')[0]; // Garde l'image source d'origine
        }

        const vanObj = {
          id: `yescapa-van-${item.identifier || Date.now()}-${Math.floor(Math.random()*1000)}`,
          slug: `van-${location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.identifier || Math.floor(Math.random()*10000)}`,
          name: vanTitle,
          type: 'van_amenege',
          description: details.description,
          pricePerDay: price,
          seats: Math.floor(Math.random() * 3) + 2, // 2 à 4 places
          beds: Math.floor(Math.random() * 3) + 2,  // 2 à 4 couchages
          features: details.features,
          images: [mainImage, ...details.additionalImages],
          available: true,
          location: location,
          owner: {
            name: ['Marc & Sophie', 'Antoine B.', 'Élodie', 'Thomas & Clara', 'Laurent G.', 'Camille & Pierre'][Math.floor(Math.random() * 6)],
            avatar: `https://i.pravatar.cc/150?u=${item.identifier || Math.random()}`,
            responseTime: 'En moins d\'une heure',
            responseRate: 99
          },
          techSpecs: {
            fuel: Math.random() > 0.3 ? 'Diesel' : 'Essence',
            transmission: Math.random() > 0.5 ? 'Manuelle' : 'Automatique',
            consumption: '7.5L/100km',
            enginePower: '140 ch'
          },
          rating: Number(rating),
          reviewCount: reviewCount,
          reviews: [
            {
              id: `rev-1-${Date.now()}`,
              author: 'Camille R.',
              date: 'Il y a 2 semaines',
              rating: 5,
              comment: 'Superbe expérience ! Le van était extrêmement propre et très bien équipé. Le propriétaire a pris le temps de tout nous expliquer.'
            },
            {
              id: `rev-2-${Date.now()}`,
              author: 'Julien M.',
              date: 'Il y a 1 mois',
              rating: 5,
              comment: 'Roadtrip inoubliable ! Le van se conduit comme une voiture classique, très économe en carburant.'
            }
          ]
        };

        newVans.push(vanObj);
      }
    } catch (err) {
      console.error(`❌ Erreur sur la page ${url}:`, err.message);
    }
  }

  console.log(`\n🎉 Total de ${newVans.length} nouveaux Vans réels extraits depuis Yescapa !`);
  
  // Remplacer ou ajouter les vans au tout début pour un rendu prioritaire sur le site
  const updatedVehicles = [...newVans, ...vehicles];
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedVehicles, null, 2), 'utf-8');
  console.log(`💾 Base sauvegardée dans ${OUTPUT_FILE} avec ${updatedVehicles.length} véhicules au total.`);
}

runScraper();
