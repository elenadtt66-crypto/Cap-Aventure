const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/yescapa-vehicles.json');

const typeImagesMap = {
  van_amenege: [
    '/images/vehicles/van_1.png',
    '/images/vehicles/van_2.png',
    '/images/vehicles/van_3.png',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ],
  fourgon_amenege: [
    '/images/vehicles/fourgon_1.png',
    '/images/vehicles/fourgon_2.png',
    '/images/vehicles/fourgon_3.png',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ],
  camping_car_profile: [
    '/images/vehicles/profile_1.png',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ],
  camping_car_integral: [
    '/images/vehicles/integral_1.png',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ],
  capucine: [
    '/images/vehicles/capucine_1.png',
    '/images/vehicles/living_interior.png',
    '/images/vehicles/bed_interior.png',
    '/images/vehicles/kitchen_interior.png'
  ]
};

function cleanVehicleImages() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    console.log('Fichier non trouvé.');
    return;
  }

  const vehicles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  let updatedCount = 0;

  for (const vehicle of vehicles) {
    const fallbacks = typeImagesMap[vehicle.type] || typeImagesMap.van_amenege;

    // Filtrer les images cassées ou paysages sans rapport (ex: nuit étoilée, cascade)
    let validImages = (vehicle.images || []).filter(img => 
      img && 
      !img.includes('photo-1470071131384') && 
      !img.includes('photo-1513311068348') &&
      !img.includes('photo-1433086966358') &&
      !img.includes('photo-1517824806704')
    );

    // S'assurer que le premier élément est une vraie image de véhicule
    if (validImages.length === 0 || !validImages[0]) {
      validImages = [fallbacks[0]];
    }

    // Compléter avec des photos d'intérieur (Salon, Couchage, Cuisine) pour que chaque véhicule ait 4 photos HD distinctes
    const interiorPool = [
      fallbacks[0],
      fallbacks[1] || '/images/vehicles/living_interior.png',
      fallbacks[2] || '/images/vehicles/bed_interior.png',
      '/images/vehicles/kitchen_interior.png'
    ];

    for (const imgCandidate of interiorPool) {
      if (validImages.length >= 4) break;
      if (!validImages.includes(imgCandidate)) {
        validImages.push(imgCandidate);
      }
    }

    vehicle.images = validImages;
    updatedCount++;
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vehicles, null, 2), 'utf-8');
  console.log(`✨ Nettoyage terminé ! ${updatedCount} véhicules mis à jour avec des galeries de photos HD cohérentes et complètes.`);
}

cleanVehicleImages();
